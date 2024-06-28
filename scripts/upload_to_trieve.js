require("dotenv").config();
const fs = require("fs");

const main = async () => {
  const productChunks = fs.readFileSync("data/products.json");
  const productChunksJSON = JSON.parse(productChunks);
  const productsArray = Object.values(productChunksJSON).flat();
  const chunks = productsArray.map((product) => {
    return {
      chunk_html: `${product.title}
${product.price}
${product.details}`,
      link: product.link,
      image_urls: [product.image],
    };
  });

  fetch("https://api.trieve.ai/api/chunk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TR-Dataset": process.env.TRIEVE_DATASET_ID,
      Authorization: process.env.TRIEVE_API_KEY,
    },
    body: JSON.stringify(chunks),
  });
};

main();
