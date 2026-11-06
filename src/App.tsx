/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EmailModal } from './components/EmailModal';
import { SocialPreviewModal } from './components/SocialPreviewModal';
import { Share2 } from 'lucide-react';

import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

const MainRouter: React.FC = () => {
  const { currentRoute } = useStore();
  const [showSeoPreview, setShowSeoPreview] = useState(false);

  const renderView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'catalog':
        return <CatalogView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-confirmation':
        return <OrderConfirmationView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-primary selection:text-black relative">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer />
      <EmailModal />
      <SocialPreviewModal
        isOpen={showSeoPreview}
        onClose={() => setShowSeoPreview(false)}
      />

      {/* Floating SEO & Social Card Preview Inspector Trigger */}
      <button
        onClick={() => setShowSeoPreview(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2 rounded-full bg-[#151518]/90 hover:bg-[#151518] text-white border border-[#282830] hover:border-primary shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-mono transition-all group"
        title="Inspect dynamic React Helmet SEO, OpenGraph and Twitter cards for this route"
      >
        <Share2 className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline text-[#A1A1AA] group-hover:text-white">SEO & Social Previews</span>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <StoreProvider>
        <MainRouter />
      </StoreProvider>
    </HelmetProvider>
  );
}
