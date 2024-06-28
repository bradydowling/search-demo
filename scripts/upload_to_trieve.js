require("dotenv").config();
const fs = require("fs");

const main = async () => {
  const productChunks = fs.readFileSync("data/products.json");
  const productChunksJSON = JSON.parse(productChunks);
  const productsArray = Object.values(productChunksJSON).flat();

  productsArray.forEach(async (product) => {
    fetch("https://api.trieve.ai/api/chunk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "TR-Dataset": process.env.TRIEVE_DATASET_ID,
        Authorization: process.env.TRIEVE_API_KEY,
      },
      body: JSON.stringify({
        chunk_html: `${product.title}
${product.price}
${product.details}`,
        link: product.link,
      }),
    });
  });
};

main();
