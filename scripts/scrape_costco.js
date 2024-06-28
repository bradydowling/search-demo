const playwright = require("playwright");
const fs = require("fs");

/**
 * 1. get category urls
 * 2. get page count (then make page urls)
 * 3. get product info from pages
 * 4. product info: title, price, details, image
 */

const getCategoryUrls = async () => {
  console.log("Getting category urls");
  const url = "https://www.costco.com/grocery-household.html";
  const browser = await playwright["firefox"].launch({ headless: false });
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
  const browser = await playwright["firefox"].launch({ headless: false });
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

// should get the title, price, details, image for each item on the page
// selector for a product: "div.product
// selector for title: "div.product description a" (get the link and the text)
// selector for price: "div.product .price"
// selector for details: "div.product .product-features"
// selector for image: "div.product .product-image-holder img
// return type would be an object where the key is the pageUrl and the value is an array of objects with the title, price, details, and image url for each
const getProducts = async (pageUrl) => {
  const browser = await playwright["firefox"].launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(pageUrl);

  const products = await page.$$eval("div.product", (elements) =>
    elements.map((el) => {
      const titleElement = el.querySelector("div.product .description a");
      const priceElement = el.querySelector("div.product .price");
      const detailsElement = el.querySelector("div.product .product-features");
      const imageElement = el.querySelector(
        "div.product .product-img-holder img"
      );

      return {
        title: titleElement ? titleElement.innerText : null,
        price: priceElement ? priceElement.innerText : null,
        details: detailsElement ? detailsElement.innerText : null,
        image: imageElement ? imageElement.src : null,
        link: titleElement ? titleElement.href : null,
      };
    })
  );

  const pageProducts = {
    [pageUrl]: products,
  };

  await browser.close();
  return pageProducts;
};

const cachedCategoryUrls = [
  "https://www.costco.com/snacks.html",
  "https://www.costco.com/meat.html",
  "https://www.costco.com/paper-products-food-storage.html",
  "https://www.costco.com/beverages.html",
  "https://www.costco.com/candy.html",
  "https://www.costco.com/deli.html",
  "https://www.costco.com/coffee-sweeteners.html",
  "https://www.costco.com/laundry-supplies.html",
  "https://www.costco.com/prepared-food.html",
  "https://www.costco.com/health-beauty.html",
  "https://www.costco.com/kirkland-signature-groceries.html",
  "https://www.costco.com/breakfast.html",
  "https://www.costco.com/pantry.html",
  "https://www.costco.com/cakes-cookies.html",
  "https://www.costco.com/cheese.html",
  "https://www.costco.com/organic-groceries.html",
  "https://www.costco.com/household-cleaning.html",
  "https://www.costco.com/wine.html",
  "https://www.costco.com/household.html",
  "https://www.costco.com/gift-baskets.html",
  "https://www.costco.com/emergency-kits-supplies.html",
  "https://www.costco.com/floral.html",
  "https://www.costco.com/pet-supplies.html",
];

const cachedPageCounts = {
  "https://www.costco.com/snacks.html": 12,
  "https://www.costco.com/meat.html": 7,
  "https://www.costco.com/paper-products-food-storage.html": 4,
  "https://www.costco.com/beverages.html": 6,
  "https://www.costco.com/candy.html": 8,
  "https://www.costco.com/deli.html": 2,
  "https://www.costco.com/coffee-sweeteners.html": 4,
  "https://www.costco.com/laundry-supplies.html": 2,
  "https://www.costco.com/prepared-food.html": 1,
  // "https://www.costco.com/health-beauty.html": TBD (subcategories),
  "https://www.costco.com/kirkland-signature-groceries.html": 5,
  // "https://www.costco.com/breakfast.html": TBD (subcategories),
  "https://www.costco.com/pantry.html": 7,
  "https://www.costco.com/cakes-cookies.html": 2,
  "https://www.costco.com/cheese.html": 1,
  "https://www.costco.com/organic-groceries.html": 2,
  "https://www.costco.com/household-cleaning.html": 5,
  "https://www.costco.com/wine.html": 1,
  "https://www.costco.com/household.html": 3,
  "https://www.costco.com/gift-baskets.html": 4,
  "https://www.costco.com/emergency-kits-supplies.html": 3,
  "https://www.costco.com/floral.html": 3,
  "https://www.costco.com/pet-supplies.html": 7,
};

const cachedPageUrls = [
  "https://www.costco.com/snacks.html?currentPage=1",
  "https://www.costco.com/snacks.html?currentPage=2",
  "https://www.costco.com/snacks.html?currentPage=3",
  "https://www.costco.com/snacks.html?currentPage=4",
  "https://www.costco.com/snacks.html?currentPage=5",
  "https://www.costco.com/snacks.html?currentPage=6",
  "https://www.costco.com/snacks.html?currentPage=7",
  "https://www.costco.com/snacks.html?currentPage=8",
  "https://www.costco.com/snacks.html?currentPage=9",
  "https://www.costco.com/snacks.html?currentPage=10",
  "https://www.costco.com/snacks.html?currentPage=11",
  "https://www.costco.com/snacks.html?currentPage=12",
  "https://www.costco.com/meat.html?currentPage=1",
  "https://www.costco.com/meat.html?currentPage=2",
  "https://www.costco.com/meat.html?currentPage=3",
  "https://www.costco.com/meat.html?currentPage=4",
  "https://www.costco.com/meat.html?currentPage=5",
  "https://www.costco.com/meat.html?currentPage=6",
  "https://www.costco.com/meat.html?currentPage=7",
  "https://www.costco.com/paper-products-food-storage.html?currentPage=1",
  "https://www.costco.com/paper-products-food-storage.html?currentPage=2",
  "https://www.costco.com/paper-products-food-storage.html?currentPage=3",
  "https://www.costco.com/paper-products-food-storage.html?currentPage=4",
  "https://www.costco.com/beverages.html?currentPage=1",
  "https://www.costco.com/beverages.html?currentPage=2",
  "https://www.costco.com/beverages.html?currentPage=3",
  "https://www.costco.com/beverages.html?currentPage=4",
  "https://www.costco.com/beverages.html?currentPage=5",
  "https://www.costco.com/beverages.html?currentPage=6",
  "https://www.costco.com/candy.html?currentPage=1",
  "https://www.costco.com/candy.html?currentPage=2",
  "https://www.costco.com/candy.html?currentPage=3",
  "https://www.costco.com/candy.html?currentPage=4",
  "https://www.costco.com/candy.html?currentPage=5",
  "https://www.costco.com/candy.html?currentPage=6",
  "https://www.costco.com/candy.html?currentPage=7",
  "https://www.costco.com/candy.html?currentPage=8",
  "https://www.costco.com/deli.html?currentPage=1",
  "https://www.costco.com/deli.html?currentPage=2",
  "https://www.costco.com/coffee-sweeteners.html?currentPage=1",
  "https://www.costco.com/coffee-sweeteners.html?currentPage=2",
  "https://www.costco.com/coffee-sweeteners.html?currentPage=3",
  "https://www.costco.com/coffee-sweeteners.html?currentPage=4",
  "https://www.costco.com/laundry-supplies.html?currentPage=1",
  "https://www.costco.com/laundry-supplies.html?currentPage=2",
  "https://www.costco.com/prepared-food.html?currentPage=1",
  "https://www.costco.com/kirkland-signature-groceries.html?currentPage=1",
  "https://www.costco.com/kirkland-signature-groceries.html?currentPage=2",
  "https://www.costco.com/kirkland-signature-groceries.html?currentPage=3",
  "https://www.costco.com/kirkland-signature-groceries.html?currentPage=4",
  "https://www.costco.com/kirkland-signature-groceries.html?currentPage=5",
  "https://www.costco.com/pantry.html?currentPage=1",
  "https://www.costco.com/pantry.html?currentPage=2",
  "https://www.costco.com/pantry.html?currentPage=3",
  "https://www.costco.com/pantry.html?currentPage=4",
  "https://www.costco.com/pantry.html?currentPage=5",
  "https://www.costco.com/pantry.html?currentPage=6",
  "https://www.costco.com/pantry.html?currentPage=7",
  "https://www.costco.com/cakes-cookies.html?currentPage=1",
  "https://www.costco.com/cakes-cookies.html?currentPage=2",
  "https://www.costco.com/cheese.html?currentPage=1",
  "https://www.costco.com/organic-groceries.html?currentPage=1",
  "https://www.costco.com/organic-groceries.html?currentPage=2",
  "https://www.costco.com/household-cleaning.html?currentPage=1",
  "https://www.costco.com/household-cleaning.html?currentPage=2",
  "https://www.costco.com/household-cleaning.html?currentPage=3",
  "https://www.costco.com/household-cleaning.html?currentPage=4",
  "https://www.costco.com/household-cleaning.html?currentPage=5",
  "https://www.costco.com/wine.html?currentPage=1",
  "https://www.costco.com/household.html?currentPage=1",
  "https://www.costco.com/household.html?currentPage=2",
  "https://www.costco.com/household.html?currentPage=3",
  "https://www.costco.com/gift-baskets.html?currentPage=1",
  "https://www.costco.com/gift-baskets.html?currentPage=2",
  "https://www.costco.com/gift-baskets.html?currentPage=3",
  "https://www.costco.com/gift-baskets.html?currentPage=4",
  "https://www.costco.com/emergency-kits-supplies.html?currentPage=1",
  "https://www.costco.com/emergency-kits-supplies.html?currentPage=2",
  "https://www.costco.com/emergency-kits-supplies.html?currentPage=3",
  "https://www.costco.com/floral.html?currentPage=1",
  "https://www.costco.com/floral.html?currentPage=2",
  "https://www.costco.com/floral.html?currentPage=3",
  "https://www.costco.com/pet-supplies.html?currentPage=1",
  "https://www.costco.com/pet-supplies.html?currentPage=2",
  "https://www.costco.com/pet-supplies.html?currentPage=3",
  "https://www.costco.com/pet-supplies.html?currentPage=4",
  "https://www.costco.com/pet-supplies.html?currentPage=5",
  "https://www.costco.com/pet-supplies.html?currentPage=6",
  "https://www.costco.com/pet-supplies.html?currentPage=7",
];

(async () => {
  console.log("starting script");
  const mainCategoryUrls = cachedCategoryUrls || (await getCategoryUrls());
  // console.log(mainCategoryUrls);

  if (!mainCategoryUrls.length || mainCategoryUrls.length === 0) {
    console.log("No category urls found");
    return;
  }

  // make an object where key is category url and value is page count
  // const pageCounts = {};
  // for (const url of mainCategoryUrls) {
  //   const count = await getPageCount(url);
  //   pageCounts[url] = count;
  // }
  // console.log(pageCounts);

  // make a list of all page urls with page count in it
  // const pageUrls = mainCategoryUrls
  //   .map((url) => {
  //     const pageCount = cachedPageCounts[url];
  //     return Array.from(
  //       { length: pageCount },
  //       (_, i) => `${url}?currentPage=${i + 1}`
  //     );
  //   })
  //   .flat();
  // console.log(pageUrls);

  const existingProducts = fs.readFileSync("./data/products.json", "utf8");
  const existingProductsJson = JSON.parse(existingProducts);
  const scrapedPages = Object.keys(existingProductsJson);

  const urlsOfUnscrapedPages = cachedPageUrls.filter(
    (url) => !scrapedPages.includes(url)
  );

  // get products from the first 10 unscraped pages
  const pageProducts0 = await getProducts(urlsOfUnscrapedPages[0]);
  const pageProducts1 = await getProducts(urlsOfUnscrapedPages[1]);
  const pageProducts2 = await getProducts(urlsOfUnscrapedPages[2]);
  // const pageProducts3 = await getProducts(urlsOfUnscrapedPages[3]);
  // const pageProducts4 = await getProducts(urlsOfUnscrapedPages[4]);
  // const pageProducts5 = await getProducts(urlsOfUnscrapedPages[5]);
  // const pageProducts6 = await getProducts(urlsOfUnscrapedPages[6]);
  // const pageProducts7 = await getProducts(urlsOfUnscrapedPages[7]);
  // const pageProducts8 = await getProducts(urlsOfUnscrapedPages[8]);
  // const pageProducts9 = await getProducts(urlsOfUnscrapedPages[9]);

  const newProducts = {
    ...pageProducts0,
    ...pageProducts1,
    ...pageProducts2,
    // ...pageProducts3,
    // ...pageProducts4,
    // ...pageProducts5,
    // ...pageProducts6,
    // ...pageProducts7,
    // ...pageProducts8,
    // ...pageProducts9,
  };

  const allProducts = { ...existingProductsJson, ...newProducts };
  // write back to the file
  fs.writeFileSync("data/products.json", JSON.stringify(allProducts, null, 2));
  console.log(
    `Saved products for ${urlsOfUnscrapedPages[0]} and ${urlsOfUnscrapedPages[1]} to products.json`
  );
})();
