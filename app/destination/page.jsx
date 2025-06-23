'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTicket } from '../context/TicketContext';
import AppLayout from '../components/AppLayout';
import toast from 'react-hot-toast';

// Mock destinations for the dropdown
const DESTINATIONS = [
  "Afzalgunj",
  "Ameerpet",
  "Balanagar",
  "Charminar",
  "Dilsukhnagar",
  "ECIL X Roads",
  "Gachibowli",
  "Hitech City",
  "JNTU",
  "Koti",
  "LB Nagar",
  "Mehdipatnam",
  "Paradise",
  "RTC X Roads",
  "Secunderabad",
  "Uppal"
];

export default function DestinationPage() {
  const router = useRouter();
  const { 
    phoneNumber, 
    selfieImage, 
    ticketType,
    setDestination,
    setIsPassValid
  } = useTicket();
  
  const [selectedDestination, setSelectedDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if we have all required data from previous steps
  useEffect(() => {
    if (!phoneNumber) {
      router.push('/auth');
    } else if (!selfieImage) {
      router.push('/selfie');
    } else if (!ticketType) {
      router.push('/ticket-type');
    }
  }, [phoneNumber, selfieImage, ticketType, router]);

  const handleContinue = async () => {
    if (!selectedDestination) {
      toast.error('Please select your destination');
      return;
    }

    setIsLoading(true);
    setDestination(selectedDestination);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (ticketType === 'pass') {
        // Mock API call to validate the pass
        // For demo: randomly decide if the pass is valid
        const isValid = Math.random() > 0.3; // 70% chance of being valid
        
        setIsPassValid(isValid);
        
        if (isValid) {
          toast.success('Pass validated successfully!');
          router.push('/confirmation');
        } else {
          toast.error('Your pass is not valid for this destination or has expired. Please buy a ticket instead.');
          // Redirect to payment page if the pass is invalid
          router.push('/payment');
        }
      } else {
        // If buying a ticket, go straight to payment
        router.push('/payment');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Select Destination" onBackClick={() => router.push('/ticket-type')}>
      <div className="flex flex-col items-center mt-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </div>

        <div className="bg-white/90 backdrop-blur-sm w-full p-6 rounded-2xl shadow-lg border border-white/50">
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Where are you going?</h2>
              <p className="text-muted">Select your destination from the list below</p>
            </div>

            <div>
              <label htmlFor="destination" className="block text-base font-semibold text-gray-800 mb-3">
                Select your destination
              </label>
              <div className="relative">
                <select
                  id="destination"
                  className="block w-full px-4 py-4 text-gray-900 rounded-xl border-2 border-gray-200 bg-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-lg appearance-none shadow-sm"
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                >
                  <option value="">-- Select destination --</option>
                  {DESTINATIONS.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <div className="bg-primary/20 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25A1.125 1.125 0 0 1 3.375 13.125h1.5a1.125 1.125 0 0 1 1.125 1.125v1.5a1.125 1.125 0 0 1-1.125 1.125H3.375ZM9.75 9.75h4.5a1.125 1.125 0 0 1 1.125 1.125v1.5a1.125 1.125 0 0 1-1.125 1.125h-4.5A1.125 1.125 0 0 1 8.625 12v-1.5A1.125 1.125 0 0 1 9.75 9.75Zm5.25 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                  </svg>
                </div>
                Current Journey Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-muted mb-1 text-gray-600">From</p>
                  <p className="font-semibold text-gray-800">Current Location</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-muted mb-1 text-gray-600">Bus Details</p>
                  <p className="font-semibold text-gray-800">TS09-UA-1234</p>
                  <p className="text-xs text-gray-600 font-medium">Route 206J</p>
                </div>
              </div>
              {selectedDestination && (
                <div className="mt-3 p-3 bg-white/70 rounded-lg border border-success/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted text-xs text-gray-800">To</p>
                      <p className="font-semibold text-gray-800">{selectedDestination}</p>
                    </div>
                    <div className="bg-black p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-success">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleContinue}
              disabled={isLoading || !selectedDestination}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-black bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mr-3"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                  Continue to {ticketType === 'pass' ? 'Validation' : 'Payment'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
