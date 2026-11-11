import { load } from "cheerio";

const STATUS_MESSAGES: Record<number, string> = {
  403: "이 쇼핑몰은 자동 불러오기를 차단했어요. 상품명과 가격을 직접 입력해 주세요.",
  429: "요청이 너무 많아 차단됐어요. 잠시 후 다시 시도하거나 직접 입력해 주세요.",
};

async function tryFetch(url: string) {
  return fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "ko-KR,ko;q=0.9",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(10000),
  });
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    let res = await tryFetch(url);

    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000));
      res = await tryFetch(url);
    }

    if (!res.ok) {
      const msg =
        STATUS_MESSAGES[res.status] ||
        `상품 정보를 가져올 수 없어요 (${res.status}). 직접 입력해 주세요.`;
      return Response.json({ error: msg }, { status: 502 });
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
      $('meta[property="product:price:amount"]').attr("content") ||
      $('meta[property="og:price:amount"]').attr("content") ||
      "";

    return Response.json({ title, image, description, price });
  } catch {
    return Response.json(
      { error: "상품 정보를 가져올 수 없습니다. 직접 입력해 주세요." },
      { status: 500 },
    );
  }
}
