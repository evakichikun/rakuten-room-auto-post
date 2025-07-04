import puppeteer from 'puppeteer';

export async function scrapeWebsite(
  url: string,
  catchcopy: string,
  itemName: string
): Promise<boolean> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const content = await page.content();
  const found = content.includes(catchcopy) || content.includes(itemName);

  await browser.close();
  return found;
}
