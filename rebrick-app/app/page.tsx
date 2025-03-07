"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only navigate if there's a non-empty search query
    if (searchQuery.trim()) {
      // Push a route to /search with the query parameter.
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }

  };
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 bg-white">
        <div className="flex items-center justify-between p-4 w-full">
          {/* "ReBrick" Logo linking to Home */}
          <Link href="/" className="text-2xl font-bold text-gray-800">
            ReBrick
          </Link>
          {/* Navigation Links */}
          <nav>
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
          <h2 className="text-xl text-center mb-4 text-gray-500">Search for similar LEGO sets</h2>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a LEGO set"
              className="w-full px-6 py-4 text-xl border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </form>
        </div>
      </div>
    </>
  );
}
