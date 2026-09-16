import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const COMPACT_TABLE_DELIMITER_PATTERN = /\|\s*\|\s*:?-+:?\s*\|/;
const COMPACT_TABLE_ROW_BOUNDARY_PATTERN = /\|\s*\|/g;

export function normalizeMarkdownTables(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => {
      if (!line.trimStart().startsWith('|') || !COMPACT_TABLE_DELIMITER_PATTERN.test(line)) return line;
      return line.replace(COMPACT_TABLE_ROW_BOUNDARY_PATTERN, '|\n|');
    })
    .join('\n');
}

export default function MarkdownMessage({ content, className }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          a: ({ children, href, title }) => (
            <a href={href} rel="noreferrer noopener" target="_blank" title={title}>
              {children}
            </a>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {normalizeMarkdownTables(content)}
      </ReactMarkdown>
    </div>
  );
}
