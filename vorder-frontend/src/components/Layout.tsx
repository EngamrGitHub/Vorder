import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout(): ReactNode {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
