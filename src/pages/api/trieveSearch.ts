import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("hit it");
  if (req.method === "POST") {
    try {
      const { query, search_type } = req.body;

      const body = {
        query,
        search_type,
      };

      const response = await axios.post(
        "https://api.trieve.ai/api/chunk/search",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            "TR-Dataset": process.env.TRIEVE_DATASET_ID,
            Authorization: process.env.TRIEVE_API_KEY,
          },
        }
      );

      const data = response.data;
      res.status(200).json(data);
    } catch (error: unknown | any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
