"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Match {
  id: string;
  score: number;
  metadata: {
    name: string;
    year: string | number;
    theme: string;
    img_url?: string;
    parts?: string;
    [key: string]: any;
  };
}

export default function SearchPage() {
  // Get the query parameter from the URL (e.g., /search?query=LEGO)
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  
  const [results, setResults] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  
  // for infinite scrolling: track current "page" (each page shows 12 items)
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // When the query changes, fetch the results & reset page count
  useEffect(() => {
    if (query) {
      setPage(1); // reset to first page when query changes
      const fetchResults = async () => {
        setLoading(true);
        try {
          const response = await fetch("http://127.0.0.1:8000/search_embed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          setResults(data.matches || []);
        } catch (error) {
          console.error("Error during search:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [query]);
  
  // Infinite scrolling: when the loadMoreRef becomes visible, increase page count
  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver((entries) => {
        // If the load-more element is visible and more items exist, load next page
        if (entries[0].isIntersecting) {
          if (page * 12 < results.length) {
            setPage((prevPage) => prevPage + 1);
          }
        }
      });
      if (loadMoreRef.current) {
        observer.observe(loadMoreRef.current);
      }
      return () => {
        if (loadMoreRef.current) {
          observer.unobserve(loadMoreRef.current);
        }
      };
    }
  }, [loading, page, results]);
  
  // Only show numberOfResults = page * 12 items from the results array
  const visibleResults = results.slice(0, page * 12);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header (unchanged; reused across pages) */}
      <header className="fixed top-0 left-0 right-0 shadow-md z-10 bg-white">
        <div className="flex items-center justify-start p-4 w-full">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            ReBrick
          </Link>
          <nav className="ml-8">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-800"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/top10"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Top 10
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
  
      {/* Main content area */}
      <main className="p-4 pt-20">
        {loading && page === 1 ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : visibleResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visibleResults.map((match) => (
              <Link
                key={match.id}
                href={`/details/${match.id}`}
                className="relative group block w-full h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
                style={{
                  backgroundImage: match.metadata.img_url
                    ? `url('${match.metadata.img_url}')`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute inset-0 bg-opacity-40 group-hover:bg-opacity-50 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/20 to-transparent">
                  <div
                    className="absolute bottom-0 left-0 w-full p-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <h3 className="text-white text-xl font-bold">
                      {match.metadata.name}
                    </h3>
                    <p className="text-gray-200">{match.metadata.year}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No results found.</p>
        )}
        
        {/* This div is observed for infinite scrolling */}
        <div ref={loadMoreRef} className="h-4"></div>
        {loading && page > 1 && (
          <p className="text-center text-gray-500 mt-4">Loading more...</p>
        )}
      </main>
    </div>
  );
}
