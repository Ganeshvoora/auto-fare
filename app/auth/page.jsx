'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTicket } from '../context/TicketContext';
import AppLayout from '../components/AppLayout';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const { setPhoneNumber } = useTicket();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    
    // Mock API call to send OTP
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Always succeeds in demo mode
      setIsOtpSent(true);
      toast.success('OTP sent successfully! (123456)');
      
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll accept any 6-digit OTP (or just 123456)
      if (otp === '123456' || (otp.length === 6 && /^\d+$/.test(otp))) {
        setPhoneNumber(phone);
        toast.success('OTP verified successfully!');
        router.push('/selfie');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
      
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="User Authentication" showBackButton={false}>
      <div className="flex flex-col items-center mt-8 relative">
        {/* Background decoration */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-20 w-72 h-72 rounded-full bg-secondary/10 blur-3xl"></div>
        
        {/* Icon with enhanced styling */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-8 shadow-lg relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white drop-shadow-md">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
        </div>
        
        {/* Title with improved visibility */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome to <span className="bg-clip-text bg-gradient-to-r from-primary to-secondary">TSRTC</span>
          </h2>
          <p className="text-gray-700 text-lg">Please verify your mobile number to continue</p>
        </div>

        {/* Main card with improved contrast */}
        <div className="bg-white/90 backdrop-blur-sm w-full p-8 rounded-3xl shadow-xl border border-white relative z-10">
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="phone" className="block text-base font-semibold text-gray-800">
                  Enter your mobile number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-600 font-medium text-lg">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    className="flex-1 min-w-0 block w-full px-4 py-4 rounded-r-xl border border-gray-300 bg-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-xl text-gray-800 shadow-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 ml-1">We'll send a verification code to this number</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-black bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 text-lg font-semibold mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/30 border-t-white mr-3"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send OTP
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl mb-4 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">OTP sent successfully!</h3>
                  <p className="text-base text-gray-700">We've sent a 6-digit code to</p>
                  <p className="text-lg font-medium text-gray-900">+91 {phone}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        id="otp"
                        className="block w-full px-4 py-5 text-center rounded-xl border-2 border-gray-300 bg-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-2xl tracking-widest font-mono text-gray-800 shadow-sm"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="••••••"
                        maxLength={6}
                        required
                      />
                      <div className="absolute top-0 left-0 right-0 h-full flex justify-between items-center pointer-events-none px-4">
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-700 text-center flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        For demo purposes, use code: <span className="font-mono font-bold ml-1">123456</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="text-base font-medium text-gray-700 hover:text-primary flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Change number
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="text-base font-medium text-primary hover:text-primary/80 flex items-center bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 mt-6 border border-transparent rounded-xl shadow-lg bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 text-lg font-semibold text-black"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/30 border-t-white mr-3"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verify OTP
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
