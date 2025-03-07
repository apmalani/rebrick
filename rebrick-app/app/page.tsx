"use client"

import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/search_embed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchValue }),
      });

      if (!response.ok) {
        throw new Error("Search API error");
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white">
        <div className="flex items-center justify-start p-4 w-full">
          {/* "ReBrick" Logo linking to Home */}
          <Link href="/" className="text-2xl font-bold text-gray-800">
            ReBrick
          </Link>
          {/* Navigation Links */}
          <nav className="ml-8">
            <ul className="flex space-x-6">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-800">
                  About
                </Link>
              </li>
              <li>
                <Link href="/top10" className="text-gray-600 hover:text-gray-800">
                  Top 10
                </Link>
              </li>

            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center bg-white" style={{ minHeight: "calc(100vh - 64px)" }}>
        <div className="w-full max-w-2xl pt-4">
          <h1 className="text-5xl font-bold text-center mb-2 text-gray-800">ReBrick</h1>
          <h2 className="text-xl text-center mb-4 text-gray-500">Get the most brick for your buck</h2>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for a LEGO set"
              className="w-full px-6 py-4 text-xl border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </form>
          {results && (
            <div className="mt-4">
              <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
