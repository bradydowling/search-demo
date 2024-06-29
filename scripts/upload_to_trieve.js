require("dotenv").config();
const fs = require("fs");

const uploadChunks = async (chunksBatch) => {
  const response = await fetch("https://api.trieve.ai/api/chunk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TR-Dataset": process.env.TRIEVE_DATASET_ID,
      Authorization: process.env.TRIEVE_API_KEY,
    },
    body: JSON.stringify(chunksBatch),
  });

  const result = await response.json();
  console.log(result);
};

const main = async () => {
  const productChunks = fs.readFileSync("data/products.json");
  const productChunksJSON = JSON.parse(productChunks);
  const productsArray = Object.values(productChunksJSON).flat();
  console.log(productsArray.length);

  const chunks = productsArray.map((product) => {
    return {
      chunk_html: `${product.title}
${product.price}
${product.details}`,
      link: product.link,
      image_urls: [product.image],
    };
  });

  // Batch the chunks into sizes of 120
  const batchSize = 120;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const chunkBatch = chunks.slice(i, i + batchSize);
    await uploadChunks(chunkBatch);
  }
};

main();
