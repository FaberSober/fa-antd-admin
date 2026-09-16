import type { TelemetryDesktopContext } from "./types";

interface NavigatorUserAgentData {
  platform?: string;
  architecture?: string;
}

function readOsVersion(userAgent: string): string | undefined {
  const patterns = [
    /Windows NT ([\d.]+)/i,
    /Mac OS X ([\d_]+)/i,
    /Android ([\d.]+)/i,
    /(?:CPU (?:iPhone )?OS|iPhone OS) ([\d_]+)/i,
  ];

  for (const pattern of patterns) {
    const match = userAgent.match(pattern);
    if (match?.[1]) return match[1].replace(/_/g, ".");
  }

  return undefined;
}

export function getDesktopTelemetryContext(): TelemetryDesktopContext {
  if (typeof navigator === "undefined") return { runtime: "desktop" };

  const userAgentData = (navigator as Navigator & { userAgentData?: NavigatorUserAgentData }).userAgentData;
  const userAgent = navigator.userAgent || "";

  return {
    runtime: "desktop",
    platform: userAgentData?.platform || navigator.platform || undefined,
    osVersion: readOsVersion(userAgent),
    arch: userAgentData?.architecture,
  };
}
