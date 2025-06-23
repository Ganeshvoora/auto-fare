'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTicket } from '../context/TicketContext';
import AppLayout from '../components/AppLayout';
import toast from 'react-hot-toast';

export default function TicketTypePage() {
  const router = useRouter();
  const { phoneNumber, selfieImage, setTicketType } = useTicket();

  // If no phone number or selfie image is set, redirect back
  useEffect(() => {
    if (!phoneNumber) {
      router.push('/auth');
    } else if (!selfieImage) {
      router.push('/selfie');
    }
  }, [phoneNumber, selfieImage, router]);

  const handleTicketChoice = (type) => {
    setTicketType(type);
    
    // Show a toast based on selection
    if (type === 'buy') {
      toast.success('Proceeding to buy a new ticket');
    } else {
      toast('Proceeding with monthly pass');
    }
    
    // Navigate to the next step
    router.push('/destination');
  };

  return (
    <AppLayout title="Select Ticket Type" onBackClick={() => router.push('/selfie')}>
      <div className="flex flex-col items-center mt-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
          </svg>
        </div>

        <div className="space-y-6 w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your ticket option</h2>
            <p className="text-gray-600">Select how you'd like to travel today</p>
          </div>
          
          <div className="grid gap-6">
            <button
              onClick={() => handleTicketChoice('buy')}
              className="bg-white/90 backdrop-blur-sm hover:bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl group"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-xl mr-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-gray-900">Buy New Ticket</h3>
                  <p className="text-sm text-muted text-gray-700">Pay for a single journey</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-primary/10 text-gray-700 px-2 py-1 rounded-full">Recommended</span>
                  </div>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
            
            <button
              onClick={() => handleTicketChoice('pass')}
              className="bg-white/90 backdrop-blur-sm hover:bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between border-2 border-secondary/10 hover:border-secondary/30 transition-all hover:shadow-xl group"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 p-4 rounded-xl mr-4 group-hover:from-secondary/30 group-hover:to-secondary/20 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-gray-900">Use Monthly Pass</h3>
                  <p className="text-sm text-muted text-gray-700">Validate your existing pass</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-secondary/10 text-gray-700 px-2 py-1 rounded-full">For subscribers</span>
                  </div>
                </div>
              </div>
              <div className="bg-secondary/10 p-2 rounded-full group-hover:bg-secondary/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-800 font-medium">Monthly Pass Information</p>
                <p className="text-xs text-amber-700 mt-1">
                  Monthly passes must be purchased in advance at TSRTC offices or authorized centers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
