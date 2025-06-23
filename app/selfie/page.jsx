'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { useTicket } from '../context/TicketContext';
import AppLayout from '../components/AppLayout';
import toast from 'react-hot-toast';

export default function SelfiePage() {
  const router = useRouter();
  const { phoneNumber, setSelfieImage } = useTicket();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // If no phone number is set, redirect back to auth
  useEffect(() => {
    if (!phoneNumber) {
      router.push('/auth');
    }
  }, [phoneNumber, router]);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCameraActive(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setIsCameraActive(true);
  };

const handleContinue = async () => {
  if (!capturedImage) {
    toast.error('Please take a selfie first');
    return;
  }

  setIsLoading(true);
  const base64Image = capturedImage.split(',')[1]; // clean base64 part

  try {
    const response = await fetch('/api/verify-face', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: "data:image/jpeg;base64," + base64Image }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify face');
    }

    const data = await response.json();
    console.log('Face verification response:', data);
    if (!data.match) {
      throw new Error(data.message || 'Face verification failed');
    }

    // Save the full captured image (still includes base64 prefix for display)
    setSelfieImage(capturedImage);

    router.push('/ticket-type');

  } catch (error) {
    toast.error('Failed to process image. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const videoConstraints = {
    width: 320,
    height: 320,
    facingMode: "user"
  };

  return (
    <AppLayout title="Take a Selfie" onBackClick={() => router.push('/auth')}>
      <div className="flex flex-col items-center mt-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
        </div>

        <div className="bg-white/90 backdrop-blur-sm w-full p-6 rounded-2xl shadow-lg border border-white/50">
          <div className="flex flex-col items-center space-y-6">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 w-72 h-72 relative shadow-lg border-2 border-primary/10">
              {isCameraActive ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                  mirrored={true}
                />
              ) : (
                capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Captured selfie"
                    className="w-full h-full object-cover"
                  />
                )
              )}
              {/* Overlay guide */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-3 border-l-3 border-primary/30 rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-3 border-r-3 border-primary/30 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-3 border-l-3 border-primary/30 rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-3 border-r-3 border-primary/30 rounded-br-lg"></div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              {isCameraActive ? (
                <button
                  onClick={capture}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black shadow-lg transition-all transform hover:scale-105"
                >

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                </button>
              ) : (
                <>
                  <button
                    onClick={retake}
                    className="flex items-center justify-center px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium border border-gray-200 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Retake
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success/80 text-black font-medium shadow-lg transition-all"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Continue
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium">Privacy Protected</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your selfie is used for verification purposes only and will not be shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
