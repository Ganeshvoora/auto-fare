'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTicket } from '../context/TicketContext';
import AppLayout from '../components/AppLayout';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const router = useRouter();
  const { 
    phoneNumber, 
    selfieImage, 
    ticketType,
    destination,
    ticketPrice,
    setTransactionId
  } = useTicket();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check if we have all required data from previous steps
  useEffect(() => {
    if (!phoneNumber) {
      router.push('/auth');
    } else if (!selfieImage) {
      router.push('/selfie');
    } else if (!ticketType) {
      router.push('/ticket-type');
    } else if (!destination) {
      router.push('/destination');
    }
  }, [phoneNumber, selfieImage, ticketType, destination, router]);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast.error('Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        toast.error('Please enter your UPI ID');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate a mock transaction ID
      const mockTransactionId = 'TXN' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      setTransactionId(mockTransactionId);
      
      toast.success('Payment successful!');
      router.push('/confirmation');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <AppLayout title="Payment" onBackClick={() => router.push('/destination')}>
      <div className="flex flex-col mt-6">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center shadow-lg border border-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-10 h-10 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
          </div>
        </div>

        <div className="bg-white w-full p-6 md:p-8 rounded-2xl shadow-lg mb-6 border border-gray-100">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-black bg-gradient-to-r from-primary to-secondary">Ticket Summary</h2>
              <p className="text-muted mt-1 text-gray-800">From Current Location to {destination}</p>
            </div>
            <div className="text-2xl font-bold text-black">₹{ticketPrice}</div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-black mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                } flex flex-col items-center justify-center`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                  paymentMethod === 'card' ? 'bg-primary/20' : 'bg-gray-100'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-black' : 'text-gray-500'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                </div>
                <span className={`font-medium ${paymentMethod === 'card' ? 'text-black' : 'text-gray-700'}`}>Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                } flex flex-col items-center justify-center`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                  paymentMethod === 'upi' ? 'bg-primary/20' : 'bg-gray-100'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-black' : 'text-gray-500'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <span className={`font-medium ${paymentMethod === 'upi' ? 'text-black' : 'text-gray-700'}`}>UPI</span>
              </button>
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                } flex flex-col items-center justify-center`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                  paymentMethod === 'wallet' ? 'bg-primary/20' : 'bg-gray-100'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`w-6 h-6 ${paymentMethod === 'wallet' ? 'text-black' : 'text-gray-500'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                  </svg>
                </div>
                <span className={`font-medium ${paymentMethod === 'wallet' ? 'text-black' : 'text-gray-700'}`}>Wallet</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <form className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-black mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-black mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-black mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="cardCvv" className="block text-sm font-medium text-black mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cardCvv"
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={3}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-900"
                    />
                  </div>
                </div>
              </form>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-black mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-900"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="space-y-4">
                <div className="flex justify-center py-4">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-secondary/20 to-primary/20 p-6 rounded-xl mb-2 inline-block border border-secondary/20">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted text-black">Demo wallet balance</p>
                    <p className="text-lg font-bold text-black">₹500.00</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted text-black">Ticket price</span>
                <span className="text-black">₹{ticketPrice}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted text-black">Convenience fee</span>
                <span className="text-black">₹2.00</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                <span className="text-black">Total</span>
                <span className="text-black">₹{ticketPrice + 2}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-black bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 font-semibold transition-all duration-200"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Pay ₹${ticketPrice + 2}`
            )}
          </button>
        </div>

        <div className="text-center w-full">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/20">
            <div className="flex items-center justify-center gap-2 text-sm text-muted text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-black">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span>This is a demo payment gateway. No real money will be charged.</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
