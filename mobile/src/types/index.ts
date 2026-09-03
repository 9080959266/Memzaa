export type UserRole = 'customer' | 'shop_owner' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  studioId?: string;
  addresses?: Array<{
    label: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
}

export interface IStudio {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  ownerId: any;
  city: string;
  address: string;
  phone: string;
  email: string;
  startingPrice: number;
  priceRange: string;
  rating: number;
  reviewCount: number;
  verifiedStatus: 'pending' | 'approved' | 'rejected';
  bannerImage: string;
  logoImage: string;
  portfolio: Array<{
    url: string;
    title: string;
    category: string;
    featured: boolean;
  }>;
  amenities: string[];
  equipment: string[];
  operatingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
}

export interface IPhotoshootCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  startingPrice?: number;
  packageCount?: number;
}

export interface IPackage {
  _id: string;
  studioId: any;
  categoryId: any;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  durationHours: number;
  editedPhotosCount: number;
  rawPhotosCount: number;
  deliverables: string[];
  advancePercentage: number;
  isPopular?: boolean;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  basePrice: number;
  discountPrice?: number;
  thumbnail: string;
  images: string[];
  stock: number;
  customizationOptions: {
    allowsPhotoUpload: boolean;
    allowsCustomText: boolean;
    allowsNamesDate: boolean;
    availableSizes: string[];
    frameColors: string[];
  };
  rating: number;
  reviewCount: number;
}

export interface ICartItem {
  _id: string;
  productId: any;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  customization?: {
    uploadedPhoto?: string;
    customText?: string;
    customName?: string;
    customDate?: string;
    frameColor?: string;
    size?: string;
  };
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
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

export interface IOrder {
  _id: string;
  orderId: string;
  customerId: any;
  items: Array<{
    productId: any;
    title: string;
    category: string;
    quantity: number;
    unitPrice: number;
    itemTotal: number;
    thumbnail: string;
    customization?: any;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string;
  currentStatus: OrderWorkflowStatus;
  timeline: Array<{
    stage: OrderWorkflowStatus;
    title: string;
    description: string;
    completedAt?: string;
    isCompleted: boolean;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentStatus: string;
  createdAt: string;
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
    venueType: string;
    address: string;
    city: string;
  };
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
}

export interface IPhotoJob {
  _id: string;
  jobId: string;
  orderId?: any;
  bookingId?: any;
  studioId: any;
  customerId: any;
  title: string;
  currentStage: OrderWorkflowStatus;
  qcChecklist: Array<{ item: string; checked: boolean }>;
  notes?: string;
  createdAt: string;
}

export interface IProof {
  _id: string;
  proofId: string;
  jobId: any;
  studioId: any;
  customerId: any;
  title: string;
  version: number;
  previewUrls: string[];
  status: 'pending_review' | 'approved' | 'revisions_requested';
  customerFeedback?: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountPercent: number;
  flatDiscount: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  isActive: boolean;
}

export interface IReview {
  _id: string;
  userId: any;
  studioId?: any;
  productId?: any;
  rating: number;
  title: string;
  comment: string;
  photos?: string[];
  createdAt: string;
}
