import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, name || (isSignUp ? 'New Client' : undefined));
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-foreground border border-border rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-bold">
            {isSignUp ? 'Create Client Account' : 'Sign In to JB Lux'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Access order tracking, prefilled checkout, and wholesale tier pricing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Richard Okafor"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-primary text-black font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity shadow-sm mt-2"
          >
            {isSignUp ? 'Create Account & Continue' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? 'Sign In instead' : 'Create an Account'}
          </button>
        </div>

        <div className="mt-4 text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Guest checkout is also supported without an account</span>
        </div>
      </div>
    </div>
  );
};
