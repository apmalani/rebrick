"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// Define the structure for each search result
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("query") || "";

  // Local state for the search input, pre-filled from the URL query
  const [searchValue, setSearchValue] = useState(initialQuery);

  // State for search results and loading status
  const [results, setResults] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  // Infinite scrolling: each "page" shows 12 items
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch new results when the URL query changes
  useEffect(() => {
    setSearchValue(initialQuery);
    if (initialQuery) {
      setPage(1); // Reset to the first page for new searches
      const fetchResults = async () => {
        setLoading(true);
        try {
          const response = await fetch("http://127.0.0.1:8000/search_embed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: initialQuery }),
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
  }, [initialQuery]);

  // Setup an Intersection Observer for infinite scrolling
  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page * 12 < results.length) {
          setPage((prev) => prev + 1);
        }
      });
      if (loadMoreRef.current) observer.observe(loadMoreRef.current);
      return () => {
        if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
      };
    }
  }, [loading, page, results]);

  // Only display results up to (page × 12)
  const visibleResults = results.slice(0, page * 12);

  // On search submission, navigate to /search?query=...
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header: single row with logo, centered search bar, and nav links */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md flex items-center px-4 py-2">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          ReBrick
        </Link>
        {/* Centered Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-grow mx-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for a LEGO set"
            className="w-full px-6 py-2 text-xl border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </form>
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/about" className="text-gray-600 hover:text-gray-800">
            About
          </Link>
          <Link href="/top10" className="text-gray-600 hover:text-gray-800">
            Top 10
          </Link>
        </nav>
      </header>

      {/* Main Content Area with extra top padding */}
      <main className="pt-20 p-4">
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
        {/* Sentinel element for infinite scrolling */}
        <div ref={loadMoreRef} className="h-4"></div>
        {loading && page > 1 && (
          <p className="text-center text-gray-500 mt-4">Loading more...</p>
        )}
      </main>
    </div>
  );
}
