'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showCard, setShowCard] = useState(false);
  
  useEffect(() => {
    // Show card with animation
    setTimeout(() => setShowCard(true), 300);
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    // Redirect to auth page after animation completes
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 2500);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-secondary/8 rounded-full blur-3xl"></div>
      
      {/* Bus routes illustration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 left-5 w-full h-0.5 bg-primary"></div>
        <div className="absolute top-32 left-20 w-full h-0.5 bg-secondary"></div>
        <div className="absolute bottom-24 right-10 w-full h-0.5 bg-primary"></div>
        <div className="absolute bottom-48 right-20 w-full h-0.5 bg-secondary"></div>
      </div>
      
      <div 
        className={`bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md text-center border border-white/80 relative overflow-hidden transition-all duration-700 ${showCard ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>
        
        {/* Left side decoration */}
        <div className="absolute left-0 top-10 bottom-10 w-1 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0"></div>
        
        {/* Logo & branding */}
        <div className="flex justify-center mb-8 relative">
          <div className="w-36 h-36 bg-gradient-to-br from-primary/20 to-secondary/15 rounded-full flex items-center justify-center shadow-lg relative animate-pulse-slow">
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white via-blue-50 to-green-50 flex items-center justify-center border-4 border-white">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute w-14 h-14 bg-primary/8 rounded-full -top-1 -left-1 animate-ping-slow"></div>
                <span className="text-4xl font-bold text-black bg-clip-text bg-gradient-to-br from-primary to-secondary relative z-10">TSRTC</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Title & description */}
        <div className="relative mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 relative tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">TSRTC e-Ticket</span>
          </h1>
          <p className="text-gray-600 mb-2">Your digital journey companion</p>
          <p className="text-xs text-gray-500">Safe • Secure • Seamless</p>
          
          <div className="absolute -right-2 -top-6">
            <div className="text-8xl text-primary/5 font-bold rotate-12">TS</div>
          </div>
        </div>
        
        {/* Loading animation */}
        <div className="mb-4">
          <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-3 flex items-center justify-center">
            <span className="animate-pulse mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
              </svg>
            </span>
            Preparing your experience
          </p>
        </div>
        
        {/* Bottom decoration */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${loadingProgress > 20 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${loadingProgress > 40 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${loadingProgress > 60 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${loadingProgress > 80 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          </div>
        </div>
        
        {/* Bus routes preview */}
        <div className="mt-8 flex gap-2 items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-16 h-0.5 bg-gray-200"></div>
          <div className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          </div>
          <div className="w-16 h-0.5 bg-gray-200"></div>
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
        </div>
      </div>
    </div>
  );
}
