import { apiGet } from "./client";

export async function getYouTubeUpdates(pageToken, signal) {
  const query = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : "";
  const response = await apiGet(`/api/social-live-feeds/get-all${query}`, signal);
  if (!Array.isArray(response.data?.items)) throw new Error("Invalid updates response");
  return {
    items: response.data.items.filter((item) => item?.id?.videoId && item?.snippet).map((item) => ({
      id: item.id.videoId,
      type: "YouTube",
      title: item.snippet.title || "Untitled video",
      text: item.snippet.description || "",
      image: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${encodeURIComponent(item.id.videoId)}`,
    })),
    nextPageToken: response.data.nextPageToken || null,
  };
}

export function formatUpdateDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}
