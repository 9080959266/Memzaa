export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'shop_owner' | 'admin';
  phone?: string;
  avatar?: string;
  addresses?: Array<{
    id?: string;
    label?: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
  studioId?: string;
  createdAt?: string;
}

export interface IPortfolioItem {
  _id?: string;
  url: string;
  title: string;
  category: string;
  featured?: boolean;
}

export interface IStudio {
  _id: string;
  name: string;
  ownerId?: any;
  tagline: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  portfolio: IPortfolioItem[];
  amenities: string[];
  equipment: string[];
  operatingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
  verifiedStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  bannerImage: string;
  logoImage: string;
  featured: boolean;
  createdAt?: string;
}

export interface IPhotoshootCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  banner?: string;
  featured: boolean;
  order: number;
  packageCount?: number;
}

export interface IPackage {
  _id: string;
  studioId: any;
  categoryId: any;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  advancePercentage: number;
  durationHours: number;
  editedPhotosCount: number;
  rawPhotosCount: number;
  deliverables: string[];
  inclusions: string[];
  exclusions: string[];
  isPopular: boolean;
  isActive: boolean;
  bannerImage?: string;
}

export interface IBooking {
  _id: string;
  bookingId: string;
  customerId: any;
  studioId: any;
  packageId: any;
  eventDate: string;
  timeSlot: string;
  venue: {
    address: string;
    city: string;
    landmark?: string;
    pincode?: string;
    venueType: 'studio' | 'outdoor' | 'customer_home' | 'resort_hotel' | 'temple_hall';
  };
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  paymentStatus: 'pending' | 'advance_paid' | 'fully_paid' | 'refunded';
  bookingStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  specialRequests?: string;
  createdAt: string;
}

export interface ICustomizationOptions {
  allowPhoto: boolean;
  allowText: boolean;
  allowDate: boolean;
  allowName: boolean;
  frameColors?: string[];
  sizes?: Array<{ name: string; priceOffset: number; dimensions?: string }>;
  materials?: string[];
  defaultTemplateUrl?: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  thumbnail: string;
  customizationOptions: ICustomizationOptions;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
}

export interface ICartItemCustomization {
  uploadedPhoto?: string;
  customText?: string;
  customName?: string;
  customDate?: string;
  frameColor?: string;
  size?: string;
  material?: string;
  notes?: string;
  previewMockup?: string;
}

export interface ICartItem {
  _id: string;
  productId: any;
  quantity: number;
  unitPrice: number;
  customization?: ICartItemCustomization;
  itemTotal: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  subtotal: number;
  couponCode?: string;
  discount: number;
  deliveryFee: number;
  total: number;
}

export type OrderWorkflowStatus =
  | 'ORDER_PLACED'
  | 'PAYMENT_CONFIRMED'
  | 'PHOTOS_UPLOADED'
  | 'EDITING'
  | 'PROOF_READY'
  | 'CUSTOMER_APPROVED'
  | 'PRINTING'
  | 'QUALITY_CHECK'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface ITimelineStep {
  status: OrderWorkflowStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  updatedBy?: string;
}

export interface IOrderItem {
  productId: any;
  title: string;
  category: string;
  thumbnail: string;
  quantity: number;
  price: number;
  customization?: ICartItemCustomization;
  itemTotal: number;
}

export interface IOrder {
  _id: string;
  orderId: string;
  customerId: any;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  currentStatus: OrderWorkflowStatus;
  timeline: ITimelineStep[];
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
  invoiceId?: any;
  createdAt: string;
}

export interface IPhotoItem {
  _id?: string;
  url: string;
  originalName: string;
  status: 'uploaded' | 'selected' | 'rejected';
  rejectionReason?: string;
  comments?: string;
  uploadedAt: string;
}

export interface IPhotoJob {
  _id: string;
  jobId: string;
  title: string;
  orderId?: any;
  bookingId?: any;
  studioId: any;
  customerId: any;
  stage: OrderWorkflowStatus | 'NEW_ORDER' | 'PHOTOS_UPLOADED' | 'EDITING' | 'PROOF_READY' | 'CUSTOMER_APPROVAL' | 'PRINTING' | 'QUALITY_CHECK' | 'READY' | 'DELIVERY' | 'COMPLETED';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  photos: IPhotoItem[];
  proofVersion: number;
  latestProofUrl?: string;
  customerApprovalStatus: 'pending' | 'approved' | 'changes_requested';
  qcChecklist: Array<{ item: string; checked: boolean }>;
  dueDate?: string;
  assignedEditor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProof {
  _id: string;
  proofId: string;
  photoJobId: any;
  studioId: any;
  customerId: any;
  version: number;
  title: string;
  previewUrls: string[];
  highResUrls?: string[];
  watermarked: boolean;
  status: 'pending_review' | 'approved' | 'changes_requested';
  customerFeedback?: string;
  revisionRequests?: Array<{
    photoIndex: number;
    comment: string;
    requestedAt: string;
  }>;
  approvedAt?: string;
  createdAt: string;
}

export interface IReview {
  _id: string;
  targetType: 'studio' | 'product';
  targetId: string;
  userId: any;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  studioReply?: {
    comment: string;
    repliedAt: string;
  };
  helpfulCount: number;
  createdAt: string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'order' | 'proof' | 'payment' | 'system' | 'review' | 'inventory';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountPercent: number;
  flatDiscount: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  validTill: string;
  isActive: boolean;
}

export interface IInvoice {
  _id: string;
  invoiceNumber: string;
  orderId?: any;
  bookingId?: any;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  sellerDetails: {
    businessName: string;
    gstin?: string;
    pan?: string;
    address: string;
    email: string;
    phone: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  taxAmount: number;
  grandTotal: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentRef?: string;
  issuedDate: string;
}
