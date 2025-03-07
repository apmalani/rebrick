import React from "react";
import Link from "next/link";

export default function Home() {
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
      <div className="flex items-center justify-center bg-white" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="w-full max-w-2xl pt-4">
          {/* Main Title */}
          <h1 className="text-5xl font-bold text-center mb-2 text-gray-800">
            Top 10
          </h1>
        </div>
      </div>
    </>
  );
}
