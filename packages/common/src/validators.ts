export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function isValidPublicKey(key: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(key);
}

export function calculateUptimePercent(ticks: { status: string }[]): number {
  if (ticks.length === 0) return 0;
  const good = ticks.filter((t) => t.status === "Good").length;
  return (good / ticks.length) * 100;
}

export function formatTimeAgo(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export async function getLocationFromIP(ip: string): Promise<string> {
  try {
    if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.")) {
      return "Local / Dev Instance";
    }

    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,country`,
    );
    const data = (await response.json()) as {
      status: string;
      city: string;
      country: string;
    };

    if (data.status === "success") {
      return `${data.city}, ${data.country}`;
    }
    return "Unknown Location";
  } catch (err) {
    console.error("GeoIP lookup failed:", err);
    return "Unknown Location";
  }
}
