'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTicket } from '../context/TicketContext';
import AppLayout from '../components/AppLayout';
import toast from 'react-hot-toast';

export default function ConfirmationPage() {
  const router = useRouter();
  const { 
    phoneNumber,
    ticketType,
    destination,
    transactionId,
    busDetails,
    isPassValid,
    ticketPrice
  } = useTicket();
  
  const [showExitAlert, setShowExitAlert] = useState(false);
  const ticketRef = useRef(null);
  
  // Check if we have all required data from previous steps
  useEffect(() => {
    if (!phoneNumber) {
      router.push('/auth');
    } else if (!destination) {
      router.push('/destination');
    } else if (ticketType === 'buy' && !transactionId) {
      router.push('/payment');
    }
  }, [phoneNumber, destination, ticketType, transactionId, router]);

  // Simulate the exit alert after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExitAlert(true);
    }, 15000); // Show after 15 seconds
    
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadTicket = () => {
    toast.success('Ticket downloaded successfully!');
  };

  const handleScreenshot = () => {
    // In a real app, we might use html2canvas or similar
    toast.success('Screenshot captured!');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const today = new Date();

  return (
    <AppLayout title="Ticket Confirmation" showBackButton={false}>
      <div className="flex flex-col items-center mt-4">
        <div className="w-full mb-4">
          {showExitAlert && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    Please be ready. Your selected stop <strong className="font-semibold text-gray-900">{destination}</strong> is approaching.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ticket */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden" ref={ticketRef}>
            <div className="p-4 bg-gradient-to-r from-primary to-secondary">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-black">TSRTC e-Ticket</h2>
                <span className="bg-white/20 px-3 py-1 rounded-full text-black text-sm font-semibold backdrop-blur-sm">{ticketType === 'pass' ? 'Monthly Pass' : 'Single Journey'}</span>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-secondary/5 border-b border-dashed">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-600">Bus ID</p>
                  <p className="font-medium text-gray-800">{busDetails.busId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Bus Number</p>
                  <p className="font-medium text-gray-800">{busDetails.busNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Date</p>
                  <p className="font-medium text-gray-800">{formatDate(today)}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-b">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">From</p>
                  <p className="font-medium text-black">Current Location</p>
                </div>
                <div className="flex items-center px-4">
                  <div className="border-t-2 border-primary/30 w-12"></div>
                  <div className="bg-gradient-to-r from-primary to-secondary rounded-full p-1 mx-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-black">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                  <div className="border-t-2 border-secondary/30 w-12"></div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">To</p>
                  <p className="font-medium text-black">{destination}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Passenger</p>
                  <p className="font-medium text-black">+91 {phoneNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium text-black">{formatTime(today)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Driver</p>
                  <p className="font-medium text-black">{busDetails.driverName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-medium text-black">
                    {ticketType === 'pass' ? (
                      isPassValid ? 'Valid Pass' : `₹${ticketPrice}`
                    ) : (
                      `₹${ticketPrice}`
                    )}
                  </p>
                </div>
              </div>
              
              {ticketType === 'buy' && transactionId && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">Transaction ID</p>
                  <p className="font-mono text-sm text-black font-medium">{transactionId}</p>
                </div>
              )}
            </div>

            <div className="p-6 flex justify-center bg-gradient-to-b from-white to-gray-50">
              <div className="text-center">
                <div className="mb-3 relative">
                  {/* QR code placeholder with styling */}
                  <div className="w-36 h-36 bg-white p-3 mx-auto rounded-lg shadow-md border-2 border-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#1f2937,#1f2937_1px,transparent_1px,transparent_4px)]"></div>
                  </div>
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-3 border-l-3 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-3 border-r-3 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-3 border-l-3 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-3 border-r-3 border-primary rounded-br-lg"></div>
                </div>
                <p className="text-sm text-gray-700 font-medium flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75z" />
                  </svg>
                  Scan QR code for verification
                </p>
              </div>
            </div>
            
            <div className="p-4 text-center border-t border-gray-200 bg-gradient-to-r from-blue-50/50 to-green-50/50">
              <p className="text-sm text-gray-600">For customer support</p>
              <p className="font-semibold text-black">{busDetails.customerCare}</p>
            </div>
          </div>
          
          <div className="flex justify-between gap-3 mt-6">
            <button
              onClick={handleDownloadTicket}
              className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-primary/30 rounded-xl shadow-sm text-sm font-medium text-black bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={handleScreenshot}
              className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-secondary/30 rounded-xl shadow-sm text-sm font-medium text-black bg-secondary/5 hover:bg-secondary/10 hover:border-secondary/50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Take Screenshot
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-black">Thank you for choosing TSRTC</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
            >
              Start New Journey
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
