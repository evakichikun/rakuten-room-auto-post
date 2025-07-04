export async function scrapeWebsite(
  url: string,
  catchcopy: string,
  itemName: string
): Promise<boolean> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // 仮に catchcopy や itemName をページ上に探すなど
  const pageContent = await page.content();
  const found = pageContent.includes(catchcopy) || pageContent.includes(itemName);

  await browser.close();
  return found;
}
