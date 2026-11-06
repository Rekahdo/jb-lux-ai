import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, StoreSettings, UserProfile, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_USER } from '../data/mockData';

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  orderNumber: string;
  type: 'order_placed' | 'status_updated';
  timestamp: string;
  htmlContent: string;
}

interface StoreContextType {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Navigation
  currentRoute: string;
  routeParams: Record<string, string>;
  navigateTo: (route: string, params?: Record<string, string>) => void;

  // Catalog
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // User / Auth
  user: UserProfile | null;
  isAdmin: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleAdminMode: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: {
    product: Product;
    size: string;
    color: string;
    quantity: number;
    mode: 'retail' | 'wholesale';
  }) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customer: Order['customer'];
    receiptFile: {
      name: string;
      type: string;
      size: number;
      dataUrl: string;
    };
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Email notifications
  latestEmail: EmailNotification | null;
  dismissEmail: () => void;
  viewEmail: (email: EmailNotification) => void;
  sentEmails: EmailNotification[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('jblux_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('jblux_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Simple client-side routing
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  const navigateTo = (route: string, params: Record<string, string> = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('jblux_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('jblux_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Store settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('jblux_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('jblux_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    }));
  };

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('jblux_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('jblux_is_admin');
    return saved === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('jblux_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jblux_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('jblux_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  const login = (email: string, name?: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || 'Valued Client',
      email,
      phone: '+234 803 000 0000',
      address: 'Lagos Island, Nigeria',
      city: 'Lagos',
      role: 'customer',
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const updateProfile = (profileUpdates: Partial<UserProfile>) => {
    if (!user) return;
    setUser(prev => (prev ? { ...prev, ...profileUpdates } : null));
  };

  const toggleAdminMode = () => {
    setIsAdmin(prev => !prev);
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jblux_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('jblux_cart', JSON.stringify(cart));
  }, [cart]);

  // Wholesale calculation helper
  const calculateTierPrice = (product: Product, quantity: number, mode: 'retail' | 'wholesale') => {
    if (mode === 'retail' || !product.wholesaleTiers || product.wholesaleTiers.length === 0) {
      return { unitPrice: product.retailPrice, discountPercent: 0 };
    }
    // Find highest qualifying tier
    const sortedTiers = [...product.wholesaleTiers].sort((a, b) => b.minQty - a.minQty);
    const qualifyingTier = sortedTiers.find(t => quantity >= t.minQty);
    if (qualifyingTier) {
      const discount = qualifyingTier.discountPercent;
      const unitPrice = Math.round(product.retailPrice * (1 - discount / 100));
      return { unitPrice, discountPercent: discount };
    }
    return { unitPrice: product.retailPrice, discountPercent: 0 };
  };

  const addToCart = ({
    product,
    size,
    color,
    quantity,
    mode,
  }: {
    product: Product;
    size: string;
    color: string;
    quantity: number;
    mode: 'retail' | 'wholesale';
  }) => {
    const itemId = `${product.id}-${size}-${color}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      const newQty = existing ? existing.quantity + quantity : quantity;
      const { unitPrice, discountPercent } = calculateTierPrice(product, newQty, mode);

      if (existing) {
        return prev.map(item =>
          item.id === itemId
            ? {
                ...item,
                quantity: newQty,
                unitPrice,
                discountPercent,
                mode,
              }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          name: product.name,
          image: product.images[0] || '',
          size,
          color,
          quantity: newQty,
          retailPrice: product.retailPrice,
          unitPrice,
          discountPercent,
          mode,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            const { unitPrice, discountPercent } = calculateTierPrice(product, quantity, item.mode);
            return {
              ...item,
              quantity,
              unitPrice,
              discountPercent,
            };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.retailPrice * item.quantity, 0);
  const cartDiscount = cart.reduce(
    (acc, item) => acc + (item.retailPrice - item.unitPrice) * item.quantity,
    0
  );
  const cartTotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('jblux_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('jblux_orders', JSON.stringify(orders));
  }, [orders]);

  // Email notifications log
  const [sentEmails, setSentEmails] = useState<EmailNotification[]>(() => {
    try {
      const saved = localStorage.getItem('jblux_sent_emails');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [latestEmail, setLatestEmail] = useState<EmailNotification | null>(null);

  useEffect(() => {
    localStorage.setItem('jblux_sent_emails', JSON.stringify(sentEmails));
  }, [sentEmails]);

  const viewEmail = (email: EmailNotification) => {
    setLatestEmail(email);
  };

  const dismissEmail = () => {
    setLatestEmail(null);
  };

  // Helper to generate Luxury HTML Email Template
  const generateOrderPlacedEmailHtml = (order: Order): string => {
    return `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0E0E10; color: #F5F3EC; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #282830; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 1px solid #282830; padding-bottom: 24px;">
          <h1 style="font-family: 'Bodoni Moda', serif; font-size: 26px; color: #D4AF37; margin: 0; letter-spacing: 2px;">JB LUX ENTERPRISES</h1>
          <p style="font-size: 11px; color: #A1A1AA; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 6px;">Gbode Ventures Plaza, Lagos Island · Premium Apparel</p>
        </div>
        <div style="padding: 24px 0;">
          <h2 style="font-size: 18px; color: #FFFFFF; margin-bottom: 8px;">Payment Receipt Received & Under Verification</h2>
          <p style="font-size: 14px; color: #A1A1AA; line-height: 1.6;">Dear <strong>${order.customer.name}</strong>, thank you for your order. We have securely received your transfer receipt (<strong>${order.receiptFileName}</strong>) for <strong>₦${order.total.toLocaleString()}</strong>.</p>
          <div style="background-color: #151518; border-left: 3px solid #D4AF37; padding: 14px; margin: 20px 0;">
            <p style="font-size: 12px; color: #D4AF37; margin: 0; font-weight: 600; text-transform: uppercase;">Order Reference: ${order.orderNumber}</p>
            <p style="font-size: 13px; color: #FFFFFF; margin: 4px 0 0 0;">Status: <span style="color: #FACC15; font-weight: 600;">Pending Verification</span> (Reviewed within 24 hours)</p>
          </div>
          <h3 style="font-size: 14px; text-transform: uppercase; color: #D4AF37; letter-spacing: 1px; margin-top: 24px;">Itemized Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
            <tbody>
              ${order.items
                .map(
                  it => `
                <tr style="border-bottom: 1px solid #202024;">
                  <td style="padding: 10px 0; color: #F5F3EC;">
                    <strong>${it.name}</strong><br/>
                    <span style="font-size: 12px; color: #A1A1AA;">Size: ${it.size} · Color: ${it.color} · Qty: ${it.qty}</span>
                  </td>
                  <td style="padding: 10px 0; text-align: right; color: #D4AF37; font-weight: 600;">
                    ₦${(it.unitPrice * it.qty).toLocaleString()}
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div style="margin-top: 20px; text-align: right; font-size: 13px;">
            <p style="margin: 4px 0; color: #A1A1AA;">Subtotal: ₦${order.subtotal.toLocaleString()}</p>
            ${order.discountTotal > 0 ? `<p style="margin: 4px 0; color: #4ADE80;">Wholesale Discount: -₦${order.discountTotal.toLocaleString()}</p>` : ''}
            <p style="margin: 4px 0; color: #A1A1AA;">Shipping: ${order.shippingFee === 0 ? 'FREE' : `₦${order.shippingFee.toLocaleString()}`}</p>
            <p style="margin: 8px 0; font-size: 18px; font-weight: bold; color: #D4AF37;">Total Paid: ₦${order.total.toLocaleString()}</p>
          </div>
          <div style="margin-top: 24px; padding: 14px; background-color: #151518; border-radius: 6px; font-size: 12px; color: #A1A1AA;">
            <p style="margin: 0; color: #FFFFFF; font-weight: 600;">Delivery Address:</p>
            <p style="margin: 4px 0 0 0;">${order.customer.address}, ${order.customer.city} · Phone: ${order.customer.phone}</p>
          </div>
        </div>
        <div style="border-top: 1px solid #282830; padding-top: 20px; font-size: 11px; color: #666666; text-align: center;">
          <p style="margin: 0;">JB Lux Enterprises · Nnamdi Azikiwe St, Lagos Island</p>
          <p style="margin: 4px 0 0 0;">Questions? WhatsApp us: +234 906 124 0069 or reply to realjblux@gmail.com</p>
        </div>
      </div>
    `;
  };

  const generateStatusUpdatedEmailHtml = (order: Order, newStatus: OrderStatus, note?: string): string => {
    const statusTitles: Record<OrderStatus, string> = {
      pending_verification: 'Receipt Under Review',
      verified: 'Payment Verified & Approved',
      processing: 'Order in Tailoring / Dispatch Preparation',
      shipped: 'Order Dispatched for Delivery',
      rejected: 'Receipt Verification Issue',
    };

    return `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0E0E10; color: #F5F3EC; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #282830; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 1px solid #282830; padding-bottom: 24px;">
          <h1 style="font-family: 'Bodoni Moda', serif; font-size: 26px; color: #D4AF37; margin: 0; letter-spacing: 2px;">JB LUX ENTERPRISES</h1>
          <p style="font-size: 11px; color: #A1A1AA; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 6px;">Gbode Ventures Plaza, Lagos Island · Order Status Update</p>
        </div>
        <div style="padding: 24px 0;">
          <h2 style="font-size: 18px; color: #FFFFFF; margin-bottom: 8px;">${statusTitles[newStatus]}</h2>
          <p style="font-size: 14px; color: #A1A1AA; line-height: 1.6;">Dear <strong>${order.customer.name}</strong>, your order <strong>${order.orderNumber}</strong> has been updated to <strong>${newStatus.toUpperCase()}</strong>.</p>
          ${note ? `<div style="background-color: #151518; border-left: 3px solid #D4AF37; padding: 14px; margin: 16px 0; color: #F5F3EC; font-size: 13px;"><em>"${note}"</em></div>` : ''}
          <p style="font-size: 13px; color: #A1A1AA; margin-top: 16px;">Total Amount: <strong style="color: #D4AF37;">₦${order.total.toLocaleString()}</strong></p>
        </div>
        <div style="border-top: 1px solid #282830; padding-top: 20px; font-size: 11px; color: #666666; text-align: center;">
          <p style="margin: 0;">JB Lux Enterprises · Lagos Island, Nigeria</p>
          <p style="margin: 4px 0 0 0;">Track your order directly in your JB Lux customer portal.</p>
        </div>
      </div>
    `;
  };

  const createOrder = async (orderData: {
    customer: Order['customer'];
    receiptFile: {
      name: string;
      type: string;
      size: number;
      dataUrl: string;
    };
  }): Promise<Order> => {
    const orderNum = `JBLUX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const isWholesale = cart.some(it => it.mode === 'wholesale');
    const shippingFee = isWholesale && cartTotal >= settings.freeShippingWholesaleMin ? 0 : 3500;
    const finalTotal = cartTotal + shippingFee;

    const orderItems: Order['items'] = cart.map(it => ({
      productId: it.productId,
      name: it.name,
      image: it.image,
      size: it.size,
      color: it.color,
      qty: it.quantity,
      unitPrice: it.unitPrice,
      retailPrice: it.retailPrice,
      mode: it.mode,
      tierApplied: it.discountPercent > 0 ? `${it.discountPercent}% Wholesale Tier` : undefined,
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: user?.id || null,
      customer: orderData.customer,
      items: orderItems,
      subtotal: cartSubtotal,
      discountTotal: cartDiscount,
      shippingFee,
      total: finalTotal,
      receiptFileName: orderData.receiptFile.name,
      receiptFileType: orderData.receiptFile.type,
      receiptFileSize: orderData.receiptFile.size,
      receiptDataUrl: orderData.receiptFile.dataUrl,
      status: 'pending_verification',
      statusHistory: [
        {
          status: 'pending_verification',
          timestamp: new Date().toISOString(),
          note: `Order placed with payment receipt (${orderData.receiptFile.name}). Awaiting admin verification.`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Trigger Automated Order Confirmation Email via Resend Simulation
    const emailNotif: EmailNotification = {
      id: `email-${Date.now()}`,
      recipientEmail: newOrder.customer.email,
      recipientName: newOrder.customer.name,
      subject: `[JB LUX] Order Confirmation & Receipt Verification — ${newOrder.orderNumber}`,
      orderNumber: newOrder.orderNumber,
      type: 'order_placed',
      timestamp: new Date().toISOString(),
      htmlContent: generateOrderPlacedEmailHtml(newOrder),
    };

    setSentEmails(prev => [emailNotif, ...prev]);
    setLatestEmail(emailNotif);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const defaultNotes: Record<OrderStatus, string> = {
            pending_verification: 'Receipt placed back in review queue.',
            verified: 'Bank transfer receipt verified against store account ledger. Order approved.',
            processing: 'Order sent to cutting and tailoring team on Lagos Island.',
            shipped: 'Order dispatched with dispatch carrier.',
            rejected: 'Receipt illegible or transfer not detected in account. Customer notified.',
          };
          const resolvedNote = note || defaultNotes[status];
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: resolvedNote,
            },
          ];
          const updatedOrder: Order = {
            ...ord,
            status,
            statusHistory: updatedHistory,
            updatedAt: new Date().toISOString(),
          };

          // Trigger automated status email
          const emailNotif: EmailNotification = {
            id: `email-${Date.now()}`,
            recipientEmail: updatedOrder.customer.email,
            recipientName: updatedOrder.customer.name,
            subject: `[JB LUX] Status Update: ${status.toUpperCase()} — ${updatedOrder.orderNumber}`,
            orderNumber: updatedOrder.orderNumber,
            type: 'status_updated',
            timestamp: new Date().toISOString(),
            htmlContent: generateStatusUpdatedEmailHtml(updatedOrder, status, resolvedNote),
          };

          setSentEmails(ePrev => [emailNotif, ...ePrev]);
          setLatestEmail(emailNotif);

          return updatedOrder;
        }
        return ord;
      })
    );
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(o => o.id === orderId || o.orderNumber === orderId);
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme,
        currentRoute,
        routeParams,
        navigateTo,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        settings,
        updateSettings,
        user,
        isAdmin,
        login,
        logout,
        updateProfile,
        toggleAdminMode,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        cartCount,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        latestEmail,
        dismissEmail,
        viewEmail,
        sentEmails,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
