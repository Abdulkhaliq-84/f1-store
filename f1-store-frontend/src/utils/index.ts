// Format currency with number only (no symbol)
export const formatCurrencyNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Legacy format currency function (kept for compatibility)
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Check if element is in viewport
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Smooth scroll to element
export const scrollToElement = (elementId: string, offset = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

// API Utilities
import { API_BASE_URL } from '../constants';
import type { CreateUserDto, UserDto, SignInDto, SignInResponseDto, FileUploadResponse } from '../types';

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// User API functions
export const userApi = {
  // Register a new user
  register: async (userData: CreateUserDto): Promise<UserDto> => {
    return apiRequest<UserDto>('/Users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Sign in user
  signIn: async (credentials: SignInDto): Promise<SignInResponseDto> => {
    return apiRequest<SignInResponseDto>('/Users/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get user by ID
  getUser: async (id: number): Promise<UserDto> => {
    return apiRequest<UserDto>(`/Users/${id}`);
  },

  // Get all users
  getAllUsers: async (): Promise<UserDto[]> => {
    return apiRequest<UserDto[]>('/Users');
  },
};

// File upload API functions
export const fileApi = {
  // Upload profile photo
  uploadProfilePhoto: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = `${API_BASE_URL}/Files/upload-profile-photo`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type header for FormData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during file upload');
    }
  },

  // Delete profile photo
  deleteProfilePhoto: async (fileName: string): Promise<void> => {
    return apiRequest<void>(`/Files/profile-photo/${fileName}`, {
      method: 'DELETE',
    });
  },
};

// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Saudi phone number validation
  const phoneRegex = /^(\+966|966|0)?5[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};