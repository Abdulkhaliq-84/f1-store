// Product Types
export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  category: ProductCategory;
  isNew: boolean;
  isSale: boolean;
  description?: string;
  team?: F1Team;
}

// Backend API Product DTO
export interface ProductDto {
  id: number;
  productName: string;
  price: number;
  team?: string;
  driver?: string;
  size?: string;
  description?: string;
  imagePath?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 'Apparel' | 'Accessories' | 'Collectibles' | 'Memorabilia';

export type F1Team = 
  | 'Mercedes'
  | 'Red Bull Racing'
  | 'Ferrari'
  | 'McLaren'
  | 'Alpine'
  | 'Aston Martin'
  | 'Williams'
  | 'Haas'
  | 'AlphaTauri'
  | 'Alfa Romeo';

// Hero Section Types
export interface HeroImage {
  src: string;
  title: string;
  subtitle: string;
  description: string;
}

// Common UI Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

// User Types
export interface CreateUserDto {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  profilePhotoPath?: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  profilePhotoPath?: string;
  createdAt: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignInResponseDto {
  success: boolean;
  user?: UserDto;
  token?: string;
  message?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Form State Types
export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

// File Upload Types
export interface FileUploadResponse {
  message: string;
  filePath: string;
  fileName: string;
}

// Cart Types
export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  productDescription?: string;
  team?: string;
  driver?: string;
  size?: string;
  imagePath?: string;
  price: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartDto {
  id: number;
  userId: number;
  cartItems: CartItemDto[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CheckoutDto {
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
}

export interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  productDescription?: string;
  team?: string;
  driver?: string;
  size?: string;
  imagePath?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface OrderDto {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  orderItems: OrderItemDto[];
  createdAt: string;
}

// Additional order types for frontend
export interface UpdateOrderStatusDto {
  status: string;
}

export interface OrderAnalyticsDto {
  totalRevenue: number;
  totalOrders: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';