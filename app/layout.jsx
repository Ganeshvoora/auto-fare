
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { TicketProvider } from "./context/TicketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Auto Fare - Telangana RTC Bus Ticketing System",
  description: "Telangana RTC Bus Ticketing System",
  authors: [
    { name: "Voora Venkata Sai Ganesh", url: "https://linkedin.com/in/venkata-sai-ganesh-voora" }
  ],
  openGraph: {
    title: "TSRTC e-Ticket",
    description: "Telangana RTC Bus Ticketing System",
    authors: ["Voora Venkata Sai Ganesh"]
  }
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TicketProvider>
          <Toaster position="top-center" />
          {children}
        </TicketProvider>
      </body>
    </html>
  );
}
