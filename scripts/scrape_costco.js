const playwright = require("playwright");

/**
 * 1. get category urls
 * 2. get page count (then make page urls)
 * 3. get product info from pages
 * 4. product info: title, price, details, image
 */

const getCategoryUrls = async () => {
  const url = "https://www.costco.com/grocery-household.html";
  const browser = await playwright["firefox"].launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url);

  const allCategoryUrls = await page.$$eval(
    ".row.gutter .eco-ftr .external",
    (elements) => elements.map((el) => el.href)
  );
  const mainCategoryUrls = allCategoryUrls.slice(3);

  await browser.close();
  return mainCategoryUrls;
};

const getPageCount = async (categoryUrl) => {
  const browser = await playwright["firefox"].launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${categoryUrl}?currentPage=120`);

  const pageNumbers = await page.$$eval("div.paging li.page", (elements) =>
    elements.map((el) => el.querySelector('span[aria-hidden="true"]').innerText)
  );
  const lastPageNumber = pageNumbers[pageNumbers.length - 1];

  await browser.close();
  return lastPageNumber;
};

(async () => {
  const mainCategoryUrls = await getCategoryUrls();

  if (!mainCategoryUrls.length || mainCategoryUrls.length === 0) {
    console.log("No category urls found");
    return;
  }

  const pages = await getPageCount(mainCategoryUrls[0]);
  console.log(pages);
})();

const getProductInfo = async (categoryUrl) => {
  const browser = await playwright["firefox"].launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${categoryUrl}?currentPage=120`);

  const pageNumbers = await page.$$eval("div.paging li.page", (elements) =>
    elements.map((el) => el.querySelector('span[aria-hidden="true"]').innerText)
  );
  const lastPageNumber = pageNumbers[pageNumbers.length - 1];

  await browser.close();
  return lastPageNumber;
};

// (async () => {
//   console.log("starting script");
//   const browser = await playwright["firefox"].launch();
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   const mainUrl = "https://www.costco.com/grocery-household.html";

//   console.log("Getting category urls");
//   await page.goto(mainUrl);

//   const allCategoryUrls = await page.$$eval(
//     ".row.gutter .eco-ftr .external",
//     (elements) => elements.map((el) => el.href)
//   );
//   const mainCategoryUrls = allCategoryUrls.slice(3);
//   console.log(mainCategoryUrls);

//   // for each category url, get page count
//   const pageCounts = await Promise.all(
//     mainCategoryUrls.map((url) => getPageCount(browser, url))
//   );
//   // based on the page counts, make an array of all page urls
//   const pageUrls = mainCategoryUrls.map((url, i) => {
//     const pageCount = pageCounts[i];
//     return Array.from(
//       { length: pageCount },
//       (_, i) => `${url}?currentPage=${i + 1}`
//     );
//   });
//   console.log(pageUrls);

//   await browser.close();
// })();
