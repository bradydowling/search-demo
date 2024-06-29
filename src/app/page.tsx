"use client";

import { useState } from "react";
import parse from "html-react-parser";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([] as any[]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    try {
      const body = {
        query: searchTerm,
        search_type: "semantic",
      };

      const response = await fetch(`https://api.trieve.ai/api/chunk/search`, {
        method: "POST",
        // @ts-expect-error Custom Trieve headers
        headers: {
          "Content-Type": "application/json",
          "TR-Dataset": process.env.NEXT_PUBLIC_TRIEVE_DATASET_ID,
          Authorization: process.env.NEXT_PUBLIC_TRIEVE_API_KEY,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setSearchResults(data.score_chunks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const highlightText = (text: string, highlights: string[]) => {
    let highlightedText = text;

    highlights.forEach((highlight) => {
      const regex = new RegExp(`(${highlight.trim()})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200">$1</mark>'
      );
    });

    return highlightedText;
  };

  const DisplayHighlightedHTML = ({
    chunkHtml,
    highlights,
  }: {
    chunkHtml: string;
    highlights: string[];
  }) => {
    if (!chunkHtml) {
      return null;
    }

    const highlightedHtml = highlightText(chunkHtml, highlights);
    return <div>{parse(highlightedHtml)}</div>;
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start bg-gray-100 text-blue-800">
      <header className="w-full p-2 border-blue-700 border-t-2">
        <div className="flex justify-end gap-16 items-end max-w-7xl mx-auto py-4">
          <a href="#" className="hover:underline">
            Costco Next
          </a>
          <a href="#" className="hover:underline">
            While Supplies Last
          </a>
          <a href="#" className="hover:underline">
            Online-Only
          </a>
          <a href="#" className="hover:underline">
            Treasure Hunt
          </a>
          <a href="#" className="hover:underline">
            What&apos;s New
          </a>
          <a href="#" className="hover:underline">
            New Low Prices
          </a>
          <a href="#" className="hover:underline">
            Get Email Offers
          </a>
        </div>
        <div className="flex justify-between items-center w-full p-8 mx-auto relative z-50">
          <div className="flex items-center grow relative">
            <img
              src="https://www.costco.com/wcsstore/CostcoGLOBALSAS/images/Costco_Logo-1.png"
              alt="Costco Logo"
              className="w-56 h-auto"
            />
            <div className="relative flex-grow ml-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-4 border border-gray-600 text-black flex-grow"
                  placeholder="Search..."
                />
                <button
                  type="submit"
                  className="ml-2 bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  Search
                </button>
              </form>
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-40 bg-white shadow-lg mt-2 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div className="flex flex-col gap-4 text-black">
                    {searchResults.map((result) => (
                      <div
                        key={result.metadata[0].chunk_html}
                        className="border-gray-300 p-4 rounded-lg border"
                      >
                        <DisplayHighlightedHTML
                          chunkHtml={result.metadata[0].chunk_html}
                          highlights={result.highlights}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center text-white text-blue-800 ml-8">
            <a
              href="#"
              className="hover:underline px-4 border-r-2 border-gray-200 text-blue-800"
            >
              Sign In / Register
            </a>
            <a
              href="#"
              className="hover:underline px-4 border-r-2 border-gray-200 text-blue-800"
            >
              Orders & Returns
            </a>
            <a href="#" className="hover:underline px-4 text-blue-800">
              Cart
            </a>
          </div>
        </div>
      </header>

      <nav className="w-full bg-blue-700 text-white py-4">
        <div className="flex justify-around max-w-7xl mx-auto">
          <a href="#" className="hover:underline">
            Shop
          </a>
          <a href="#" className="hover:underline">
            Grocery
          </a>
          <a href="#" className="hover:underline">
            Same-Day
          </a>
          <a href="#" className="hover:underline">
            Deals
          </a>
          <a href="#" className="hover:underline">
            Business Delivery
          </a>
          <a href="#" className="hover:underline">
            Optical
          </a>
          <a href="#" className="hover:underline">
            Pharmacy
          </a>
          <a href="#" className="hover:underline">
            Services
          </a>
          <a href="#" className="hover:underline">
            Photo
          </a>
          <a href="#" className="hover:underline">
            Travel
          </a>
          <a href="#" className="hover:underline">
            Membership
          </a>
          <a href="#" className="hover:underline">
            Locations
          </a>
        </div>
      </nav>
    </main>
  );
}
