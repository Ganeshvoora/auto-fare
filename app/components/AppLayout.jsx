'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


const AppLayout = ({ 
  children, 
  showBackButton = true, 
  title,
  onBackClick 
}) => {
  const router = useRouter();
  const [showAIChat, setShowAIChat] = useState(false);
  
  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="text-gray-800 p-4 shadow-lg border-b border-white/50 backdrop-blur-md bg-white/90 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button 
                onClick={handleBack} 
                className="p-2 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-black">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-clip-text text-black bg-gradient-to-r from-primary to-secondary">{title}</h1>
              <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white shadow-md">
              <span className="text-lg font-bold text-black bg-clip-text bg-gradient-to-br from-primary to-secondary">TS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 max-w-md mx-auto w-full pb-24">
        {children}
      </main>

      {/* AI Chat Helper */}
      <div className="fixed bottom-4 right-4 z-20">
        {showAIChat ? (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 w-80 border border-white animate-fade-in">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">TSRTC Assistant</h3>
              </div>
              <button 
                onClick={() => setShowAIChat(false)} 
                className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto mb-3 py-2">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-secondary flex-shrink-0 mt-1 flex items-center justify-center text-white text-xs font-bold">TS</div>
                <div className="bg-gradient-to-br from-primary/10 to-secondary/5 p-3 rounded-2xl text-sm text-gray-800 shadow-sm border border-primary/10">
                  Hello! How can I help you with your TSRTC bus ticket today?
                </div>
              </div>
            </div>
            
            <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
              <input 
                type="text" 
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none text-gray-800"
                placeholder="Ask me anything..." 
              />
              <button className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowAIChat(true)}
            className="p-3.5 bg-gradient-to-r from-primary to-secondary rounded-full text-white shadow-lg hover:shadow-xl transition-all relative"
            aria-label="Open chat assistant"
          >
            <span className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/20 to-transparent"></span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AppLayout;
