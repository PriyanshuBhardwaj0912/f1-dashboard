import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';
import { F1Provider } from '../store/f1Store';
import { Sidebar } from '../components/Layout/Sidebar';
import { Header } from '../components/Layout/Header';
import { ToastContainer } from '../components/UI/Toast';
import { DetailsModals } from '../components/UI/DetailsModals';

export const metadata: Metadata = {
  title: 'Formula 1 Hub',
  description: 'Premium dark themed F1 Telemetry, Live Timing, Standings, and Statistics Tracker for the 2026 Season.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <F1Provider>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Header />
              <main className="content-wrapper">
                {children}
              </main>
            </div>
            <DetailsModals />
            <ToastContainer />
          </div>
        </F1Provider>
      </body>
    </html>
  );
}
