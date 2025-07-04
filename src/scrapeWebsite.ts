import puppeteer from 'puppeteer';

export async function scrapeWebsite(url: string): Promise<string[]> {
  const browser = await puppeteer.launch({
    headless: true // ← "new" ではなく true に変更（型エラー回避）
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // XPath セレクタが必要な場合、型定義で any を使って無理やり通す
  const xpathElements = await (page as any).$x('//div[@class="example"]');

  // ページ遷移の待機などに waitForTimeout を使用したい場合も any で逃げる
  await (page as any).waitForTimeout(2000);

  const results: string[] =
