// pages/api/trieveSearch.ts

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { query, search_type } = req.body;

      const body = {
        query,
        search_type,
      };

      const response = await fetch("https://api.trieve.ai/api/chunk/search", {
        method: "POST",
        // @ts-expect-error Custom Trieve headers
        headers: {
          "Content-Type": "application/json",
          "TR-Dataset": process.env.NEXT_PUBLIC_TRIEVE_DATASET_ID,
          Authorization: process.env.NEXT_PUBLIC_TRIEVE_API_KEY,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error: unknown | any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
