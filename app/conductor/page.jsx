"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function UnverifiedPassengers() {
  const [unverifiedPassengers, setUnverifiedPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnverifiedPassengers = async () => {
      try {
        setLoading(true);
        // Make API call to backend to get unverified passengers
        const response = await fetch('/api/find-not-match');
        
        if (!response.ok) {
          throw new Error('Failed to fetch unverified passengers');
        }
        
        const data = await response.json();
        setUnverifiedPassengers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUnverifiedPassengers();

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchUnverifiedPassengers, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-60vh gap-4 p-8">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading passenger data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Unverified Passengers | Smart Bus Ticketing</title>
      </Head>
      
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Unverified Passengers
        </h1>
        
        {unverifiedPassengers.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-blue-700">All passengers have validated their tickets!</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              The following {unverifiedPassengers.length} passengers have been detected but haven't booked a ticket:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {unverifiedPassengers.map((passenger) => (
                <div 
                  key={passenger.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="relative">
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white
                      ${passenger.timeElapsed > 7 ? 'bg-red-500' : 'bg-amber-500'}`}>
                      {passenger.timeElapsed} min
                    </div>
                    <img
                      src={passenger.imageUrl}
                      alt="Passenger"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Location:</span> {passenger.location || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Detected at:</span> {new Date(passenger.detectedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}