import { load } from "cheerio";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return Response.json(
        { error: `Failed to fetch: ${res.status}` },
        { status: 502 },
      );
    }

    const html = await res.text();
    const $ = load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "";
    const image =
      $('meta[property="og:image"]').attr("content") || "";
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";
    const price =
      $('meta[property="product:price:amount"]').attr("content") || "";

    return Response.json({ title, image, description, price });
  } catch {
    return Response.json(
      { error: "상품 정보를 가져올 수 없습니다. 직접 입력해 주세요." },
      { status: 500 },
    );
  }
}
