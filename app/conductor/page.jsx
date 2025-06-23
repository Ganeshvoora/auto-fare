"use client";
import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// This is the main component for the page
export default function UncommonImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('timestamp'); // 'timestamp' or 'filename'
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch data from our new API endpoint
  const fetchUncommonImages = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/find-not-match'); // Using the correct API endpoint
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch uncommon images');
      }
      
      const data = await response.json();
      // The API returns an object { uncommonImages: [...] }, so we get the array
      setImages(data.uncommonImages || []);
      setError(null); // Clear previous errors on success
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data when the component first loads
  useEffect(() => {
    fetchUncommonImages();
    // Optional: Refresh data every 30 seconds
    const intervalId = setInterval(fetchUncommonImages, 30000);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // useMemo will re-calculate the filtered/sorted images only when dependencies change
  const filteredAndSortedImages = useMemo(() => {
    if (!images) return [];

    const imagesWithTime = images.map(image => {
        const captureTime = new Date(image.timestamp);
        const currentTime = new Date();
        const elapsedMs = currentTime - captureTime;
        const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
        return { ...image, timeElapsed: elapsedMinutes };
    });

    return imagesWithTime
      .filter(image => {
          const filename = image.filename || '';
          return filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 image._id.includes(searchQuery);
      })
      .sort((a, b) => {
        if (sortBy === 'timestamp') {
          return new Date(b.timestamp) - new Date(a.timestamp);
        } else if (sortBy === 'filename') {
          return (a.filename || '').localeCompare(b.filename || '');
        }
        return 0;
      });
  }, [images, searchQuery, sortBy]);

  // UI for loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading Image Data...</h2>
        <p className="text-gray-500">This may take a moment.</p>
      </div>
    );
  }

  // Main page content
  return (
    <>
      <Head>
        <title>Uncommon Images | Smart CCTV</title>
      </Head>
      
      <header className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <h1 className="font-bold text-2xl">Smart CCTV Analysis</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Unrecognized Individuals
          </h2>
          <button 
            onClick={fetchUncommonImages}
            disabled={refreshing}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
          >
            {refreshing ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
               <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
               </svg>
            )}
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by filename or ID..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="timestamp">Sort by Newest</option>
              <option value="filename">Sort by Filename</option>
            </select>
          </div>
        </div>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}
        
        {filteredAndSortedImages.length === 0 && !error ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              {images.length === 0 
                ? "No uncommon images found at this time." 
                : "No images match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedImages.map((image) => (
              <div 
                key={image._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
              >
                <div className="relative">
                   {/* Displaying the image directly from base64 data */}
                  <img
                    src={image.image_base64}
                    alt={image.filename || 'Uncommon Image'}
                    className="w-full h-56 object-cover bg-gray-200"
                  />
                   <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-50 text-white rounded-md text-xs font-semibold">
                      {image.timeElapsed} min ago
                   </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-800 font-semibold truncate" title={image.filename}>
                    {image.filename || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Captured: {new Date(image.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
