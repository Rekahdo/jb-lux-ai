export type ProductCategory = 'menswear' | 'streetwear' | 'traditional' | 'accessories';

export interface WholesaleTier {
  minQty: number;
  discountPercent: number; // e.g. 15 for 15% off
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  description: string;
  fullDescription: string;
  images: string[];
  retailPrice: number; // in NGN (₦)
  wholesaleTiers: WholesaleTier[];
  stock: number;
  isActive: boolean;
  sizes: string[];
  colors: string[];
  fabric: string;
  craftsmanshipOrigin: string;
  isFeatured?: boolean;
}

export interface CartItem {
  id: string; // unique item id: productId-size-color
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  retailPrice: number;
  unitPrice: number; // calculated according to wholesale tier
  discountPercent: number;
  mode: 'retail' | 'wholesale';
}

export type OrderStatus = 'pending_verification' | 'verified' | 'processing' | 'shipped' | 'rejected';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  qty: number;
  unitPrice: number;
  retailPrice: number;
  mode: 'retail' | 'wholesale';
  tierApplied?: string;
}

export interface OrderCustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customer: OrderCustomerInfo;
  items: OrderItemSnapshot[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  total: number;
  receiptFileName: string;
  receiptFileType: string;
  receiptFileSize: number;
  receiptDataUrl: string; // Base64 data URL
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  role: 'customer' | 'admin';
}

export interface StoreSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankBranch: string;
  transferInstructions: string;
  storeAddress: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  freeShippingWholesaleMin: number;
  updatedAt: string;
}
