type ExecutionDetail = {
  type?: unknown;
  output?: Record<string, unknown>;
};

const AUDIO_ELEMENT_PATTERN = /<audio\b[^>]*(?:\/>|>[\s\S]*?<\/audio\s*>)/gi;
const QUOTED_AUDIO_SRC_PATTERN = /\bsrc\s*=\s*(["'])(.*?)\1/i;
const UNQUOTED_AUDIO_SRC_PATTERN = /\bsrc\s*=\s*([^\s"'=<>`]+)/i;
const IMAGE_ELEMENT_PATTERN = /<img\b[^>]*(?:\/>|>)/gi;
const MARKDOWN_IMAGE_PATTERN = /!\[[^\]]*]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/gi;
const BARE_IMAGE_URL_PATTERN = /https?:\/\/[^\s"'<>\\)]+\.(?:png|jpe?g|gif|webp|bmp|svg)(?:[?#][^\s"'<>\\)]*)?/gi;
const VIDEO_ELEMENT_PATTERN = /<video\b[^>]*(?:\/>|>[\s\S]*?<\/video\s*>)/gi;

function decodeHtmlAttribute(value: string) {
  const namedEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    quot: '"',
  };
  return value
    .replace(/&(#(?:x[\da-f]+|\d+)|amp|apos|gt|lt|quot);/gi, (entity, code: string) => {
      if (code.startsWith('#')) {
        const hexadecimal = code[1]?.toLowerCase() === 'x';
        const codePoint = Number.parseInt(code.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
        return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
      }
      return namedEntities[code.toLowerCase()] ?? entity;
    })
    .trim();
}

function normalizeAudioUrl(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const url = decodeHtmlAttribute(value);
  if (!url) return undefined;
  if (/^(?:https?:)?\/\//i.test(url) || /^(?:\/|\.\.?\/)/.test(url) || /^blob:/i.test(url) || /^data:audio\//i.test(url)) {
    return url;
  }
  return undefined;
}

function normalizeImageUrl(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const url = decodeHtmlAttribute(value);
  if (!url) return undefined;
  // ./、../ 点相对链接在 SPA 聊天页无法解析，不作为可展示图片。
  if (/^(?:https?:)?\/\//i.test(url) || url.startsWith('/') || /^blob:/i.test(url) || /^data:image\//i.test(url)) {
    return url;
  }
  return undefined;
}

function normalizeVideoUrl(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const url = decodeHtmlAttribute(value);
  if (!url) return undefined;
  if (/^(?:https?:)?\/\//i.test(url) || /^(?:\/|\.\.?\/)/.test(url) || /^blob:/i.test(url) || /^data:video\//i.test(url)) {
    return url;
  }
  return undefined;
}

function findAudioUrlInMarkup(content: string) {
  for (const match of content.matchAll(AUDIO_ELEMENT_PATTERN)) {
    const markup = match[0];
    const source = markup.match(QUOTED_AUDIO_SRC_PATTERN)?.[2] ?? markup.match(UNQUOTED_AUDIO_SRC_PATTERN)?.[1];
    const audioUrl = normalizeAudioUrl(source);
    if (audioUrl) return audioUrl;
  }
  return undefined;
}

export function findTextToSpeechAudioUrl(executionDetails?: Record<string, unknown>) {
  if (!executionDetails) return undefined;
  for (const value of Object.values(executionDetails)) {
    if (!value || typeof value !== 'object') continue;
    const detail = value as ExecutionDetail;
    if (detail.type !== 'text-to-speech-node') continue;
    const audioUrl = normalizeAudioUrl(detail.output?.audio_url);
    if (audioUrl) return audioUrl;
  }
  return undefined;
}

function collectImageUrls(content: string, executionDetails?: Record<string, unknown>) {
  const urls: string[] = [];
  const add = (value: unknown) => {
    const url = normalizeImageUrl(value);
    if (url && !urls.includes(url)) urls.push(url);
  };

  for (const match of content.matchAll(MARKDOWN_IMAGE_PATTERN)) add(match[1]);
  for (const match of content.matchAll(IMAGE_ELEMENT_PATTERN)) {
    const markup = match[0];
    add(markup.match(QUOTED_AUDIO_SRC_PATTERN)?.[2] ?? markup.match(UNQUOTED_AUDIO_SRC_PATTERN)?.[1]);
  }
  for (const match of content.matchAll(BARE_IMAGE_URL_PATTERN)) add(match[0]);

  if (executionDetails) {
    for (const value of Object.values(executionDetails)) {
      if (!value || typeof value !== 'object') continue;
      const detail = value as ExecutionDetail;
      if (detail.type !== 'image-generate-node') continue;
      const imageUrls = detail.output?.image_urls;
      if (Array.isArray(imageUrls)) imageUrls.forEach(add);
      const images = detail.output?.image;
      if (Array.isArray(images)) {
        images.forEach((image) => {
          if (image && typeof image === 'object') add((image as Record<string, unknown>).url);
        });
      }
    }
  }
  return urls;
}

function collectVideoUrls(content: string, executionDetails?: Record<string, unknown>) {
  const urls: string[] = [];
  const add = (value: unknown) => {
    const url = normalizeVideoUrl(value);
    if (url && !urls.includes(url)) urls.push(url);
  };

  for (const match of content.matchAll(VIDEO_ELEMENT_PATTERN)) {
    const markup = match[0];
    add(markup.match(QUOTED_AUDIO_SRC_PATTERN)?.[2] ?? markup.match(UNQUOTED_AUDIO_SRC_PATTERN)?.[1]);
  }

  if (executionDetails) {
    for (const value of Object.values(executionDetails)) {
      if (!value || typeof value !== 'object') continue;
      const detail = value as ExecutionDetail;
      if (detail.type !== 'text-to-video-node' && detail.type !== 'image-to-video-node') continue;
      add(detail.output?.video_url);
      const videoUrls = detail.output?.video_urls;
      if (Array.isArray(videoUrls)) videoUrls.forEach(add);
      const videos = detail.output?.video;
      if (Array.isArray(videos)) {
        videos.forEach((video) => {
          if (video && typeof video === 'object') add((video as Record<string, unknown>).url);
        });
      }
    }
  }
  return urls;
}

export function resolveChatMessageContent(content?: string, executionDetails?: Record<string, unknown>, explicitAudioUrl?: string) {
  const rawContent = typeof content === 'string' ? content : '';
  const markupAudioUrl = findAudioUrlInMarkup(rawContent);
  const audioUrl = normalizeAudioUrl(explicitAudioUrl) ?? findTextToSpeechAudioUrl(executionDetails) ?? markupAudioUrl;
  const imageUrls = collectImageUrls(rawContent, executionDetails);
  const videoUrls = collectVideoUrls(rawContent, executionDetails);
  let displayContent = audioUrl ? rawContent.replace(AUDIO_ELEMENT_PATTERN, '').trim() : rawContent;
  if (imageUrls.length > 0) {
    displayContent = displayContent.replace(IMAGE_ELEMENT_PATTERN, '').replace(MARKDOWN_IMAGE_PATTERN, '').trim();
  }
  if (videoUrls.length > 0) {
    displayContent = displayContent.replace(VIDEO_ELEMENT_PATTERN, '').trim();
  }
  return {
    audioUrl,
    imageUrls,
    videoUrls,
    content: displayContent,
  };
}
