/**
 * Fetch a destination photo from Unsplash.
 * Requires UNSPLASH_ACCESS_KEY in .env.local
 * Get a free key at https://unsplash.com/developers
 */
export async function fetchDestinationImage(
  destination: string,
  country: string
): Promise<{ url: string; blurHash?: string; authorName?: string; authorLink?: string } | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  try {
    const query = encodeURIComponent(`${destination} ${country} landscape travel`);
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${key}`,
      { next: { revalidate: 86400 } } // cache per destination for 24 h
    );
    if (!res.ok) return null;

    const data = await res.json();
    return {
      url: data.urls?.regular ?? null,
      blurHash: data.blur_hash ?? undefined,
      authorName: data.user?.name ?? undefined,
      authorLink: data.user?.links?.html ?? undefined,
    };
  } catch {
    return null;
  }
}
