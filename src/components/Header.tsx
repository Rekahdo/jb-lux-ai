import React, { useState } from 'react';
import { ShoppingBag, Sun, Moon, User, Shield, Menu, X, ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    cartCount,
    theme,
    toggleTheme,
    user,
    isAdmin,
    toggleAdminMode,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            navigateTo('home');
            setMobileMenuOpen(false);
          }}
          className="text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-[0.15em] text-foreground group-hover:text-primary transition-colors">
              JB LUX
            </span>
            <span className="text-xs tracking-[0.25em] text-primary uppercase font-light hidden sm:inline">
              ENTERPRISES
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (4-5 single-line links) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => navigateTo('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentRoute === 'home'
                ? 'text-primary border-b-2 border-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Collection
          </button>
          <button
            onClick={() => navigateTo('catalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentRoute === 'catalog'
                ? 'text-primary border-b-2 border-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Storefront & Wholesale
          </button>
          <button
            onClick={() => navigateTo('about')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentRoute === 'about'
                ? 'text-primary border-b-2 border-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Lagos Flagship
          </button>
          <button
            onClick={() => navigateTo('contact')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentRoute === 'contact'
                ? 'text-primary border-b-2 border-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Direct Contact
          </button>
          {isAdmin && (
            <button
              onClick={() => navigateTo('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                currentRoute === 'admin'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-amber-500/80 hover:text-amber-400 font-mono text-xs'
              }`}
            >
              Admin Portal
            </button>
          )}
        </nav>

        {/* Zone 3: Actions Cluster */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin Switcher Pill / Button */}
          <button
            onClick={toggleAdminMode}
            title={isAdmin ? 'Switch to Customer View' : 'Switch to Admin Management'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded border transition-colors ${
              isAdmin
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{isAdmin ? 'Admin View' : 'Staff Login'}</span>
          </button>

          {/* User Account Button */}
          <button
            onClick={() => navigateTo('profile')}
            className={`p-2 rounded-lg transition-colors ${
              currentRoute === 'profile'
                ? 'text-primary bg-secondary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            title={user ? `Signed in as ${user.name}` : 'Sign In / Account'}
          >
            <User className="w-4 h-4" />
          </button>

          {/* Cart Bag with Tabular Counter */}
          <button
            onClick={() => navigateTo('cart')}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              cartCount > 0
                ? 'bg-primary text-primary-foreground shadow-sm hover:opacity-90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            aria-label={`Cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono text-xs font-semibold tabular-nums">{cartCount}</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 py-4 space-y-3">
          <button
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-foreground hover:text-primary"
          >
            Home Collection
          </button>
          <button
            onClick={() => {
              navigateTo('catalog');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-foreground hover:text-primary"
          >
            Storefront & Wholesale Tiers
          </button>
          <button
            onClick={() => {
              navigateTo('about');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-foreground hover:text-primary"
          >
            Lagos Island Flagship
          </button>
          <button
            onClick={() => {
              navigateTo('contact');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-foreground hover:text-primary"
          >
            Direct Contact & WhatsApp
          </button>
          <button
            onClick={() => {
              navigateTo('profile');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-foreground hover:text-primary"
          >
            My Profile & Order History
          </button>
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <button
              onClick={() => {
                toggleAdminMode();
                if (!isAdmin) navigateTo('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-mono text-primary flex items-center gap-1.5 py-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Exit Admin Mode' : 'Switch to Admin Management'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
