import puppeteer from 'puppeteer';

export async function scrapeWebsite(url: string): Promise<string[]> {
  const browser = await puppeteer.launch({
    headless: true // "new"ではなくtrueに修正
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // XPath取得はanyキャストで回避
  const xpathElements = await (page as any).$x('//div[@class="example"]');

  // 待機もanyキャストで回避
  await (page as any).waitForTimeout(2000);

  const results: string[] = [];
  for (const el of xpathElements) {
    const text = await page.evaluate(el => el.textContent, el);
    if (text) results.push(text.trim());
  }

  await browser.close();
  return results;
}
