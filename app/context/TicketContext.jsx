'use client';

import { createContext, useContext, useState, ReactNode } from 'react';



const defaultBusDetails = {
  busId: 'TS09-UA-1234',
  driverName: 'Ravi Kumar',
  busNumber: '206J',
  customerCare: '1800-123-4567'
};

const TicketContext = createContext(undefined);

export const TicketProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selfieImage, setSelfieImage] = useState(null);
  const [ticketType, setTicketType] = useState(null);
  const [destination, setDestination] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [isPassValid, setIsPassValid] = useState(null);
  const [busDetails] = useState(defaultBusDetails);
  const [ticketPrice] = useState(45); // Static price for demo

  const resetTicketData = () => {
    setPhoneNumber('');
    setSelfieImage(null);
    setTicketType(null);
    setDestination('');
    setTransactionId(null);
    setIsPassValid(null);
  };

  return (
    <TicketContext.Provider
      value={{
        phoneNumber,
        setPhoneNumber,
        selfieImage,
        setSelfieImage,
        ticketType,
        setTicketType,
        destination,
        setDestination,
        transactionId,
        setTransactionId,
        isPassValid,
        setIsPassValid,
        busDetails,
        ticketPrice,
        resetTicketData,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};
