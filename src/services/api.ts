// src/services/api.ts

const API_BASE_URL = 'https://hawk-leather-backend.vercel.app/api/v1';

// ==================== TYPE DEFINITIONS ====================

export interface BackendProduct {
  _id: string;
  categoryName: string;
  itemName: string;
  itemPrice: number;
  itemDescription: string;
  itemFeatures: string[];
  itemImageUrl: string;
  inStock: boolean;
  discount: number;
  gender?: 'Men' | 'Women' | 'Unisex';
}

export interface BackendReview {
  _id: string;
  userId: {
    _id: string;
    userName: string;
    occupation: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  userName: string;
  occupation: string;
  pincode: number;
  state: string;
  city: string;
  streetAddress: string;
  phoneNumber: number;
  userEmail: string;
  cart: any[];
  pendingOrders: any[];
  completedOrders: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: {
    _id: string;
    categoryName: string;
    itemName: string;
    itemPrice: number;
    itemImageUrl: string;
    inStock: boolean;
    discount: number;
  };
  quantity: number;
  addedAt: string;
  _id: string;
}

// ==================== HELPER FUNCTIONS ====================

// Get stored JWT token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Store JWT token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove JWT token
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Get stored user data
export const getStoredUser = (): User | null => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Store user data
export const setStoredUser = (user: User): void => {
  localStorage.setItem('userData', JSON.stringify(user));
};

// Remove stored user data
export const removeStoredUser = (): void => {
  localStorage.removeItem('userData');
};

// Helper to create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to get user initials for avatar
export const getUserInitials = (userName: string): string => {
  const names = userName.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return userName.substring(0, 2).toUpperCase();
};

// Helper function to map backend product to frontend Product interface
export const mapBackendProductToFrontend = (backendProduct: BackendProduct) => {
  const discountedPrice =
    backendProduct.itemPrice -
    (backendProduct.itemPrice * backendProduct.discount) / 100;
  return {
    id: backendProduct._id,
    name: backendProduct.itemName,
    // Keep `price` as original MRP and `mrpPrice` as the payable (discounted) amount
    price: backendProduct.itemPrice,
    mrpPrice: discountedPrice,
    image: backendProduct.itemImageUrl,
    category: backendProduct.categoryName,
    gender: backendProduct.gender,
    description: backendProduct.itemDescription,
    features: backendProduct.itemFeatures,
    details: [],
    inStock: backendProduct.inStock,
    discount: backendProduct.discount,
  };
};

// Helper function to map backend cart item to frontend
export const mapBackendCartItemToFrontend = (cartItem: CartItem) => {
  const product = cartItem.productId;
  const discountedPrice =
    product.itemPrice - (product.itemPrice * product.discount) / 100;

  return {
    id: product._id,
    name: product.itemName,
    // price: original MRP, mrpPrice: payable (discounted)
    price: product.itemPrice,
    mrpPrice: discountedPrice,
    image: product.itemImageUrl,
    category: product.categoryName,
    description: '',
    features: [],
    inStock: product.inStock,
    discount: product.discount,
    quantity: cartItem.quantity,
  };
};

// ==================== PRODUCT APIs (Phase 1) ====================

export const fetchAllProducts = async (
  category?: string,
  gender?: string
): Promise<{ success: boolean; count: number; data: BackendProduct[] }> => {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (gender) params.append('gender', gender);

    const url = `${API_BASE_URL}/products/all${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (
  productId: string
): Promise<{ success: boolean; data: BackendProduct }> => {
  try {
    const url = `${API_BASE_URL}/products/${productId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const fetchAllReviews = async (): Promise<{ message: string; reviews: BackendReview[] }> => {
  try {
    const url = `${API_BASE_URL}/auth/review`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// ==================== AUTH APIs (Phase 2) ====================

// Register new user
export const registerUser = async (data: {
  userName: string;
  occupation: string;
  pincode: number;
  state: string;
  city: string;
  streetAddress: string;
  phoneNumber: number;
  userEmail: string;
  userPassword: string;
}): Promise<{ success: boolean; message: string; data: { user: User; token: string } }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const result = await response.json();
    
    // Store token and user data
    setAuthToken(result.data.token);
    setStoredUser(result.data.user);
    
    return result;
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (data: {
  userEmail: string;
  userPassword: string;
}): Promise<{ success: boolean; message: string; data: { user: User; token: string } }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const result = await response.json();
    
    // Store token and user data
    setAuthToken(result.data.token);
    setStoredUser(result.data.user);
    
    return result;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Request forgot password (Step 1)
export const requestForgotPassword = async (userEmail: string): Promise<{
  success: boolean;
  message: string;
  data: { email: string; expiresIn: string };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send OTP');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

// Verify OTP (Step 2)
export const verifyForgotPasswordOTP = async (
  userEmail: string,
  otp: number
): Promise<{
  success: boolean;
  message: string;
  data: { resetToken: string; expiresIn: string };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forget/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid OTP');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Reset password (Step 3)
export const resetPassword = async (
  resetToken: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forget/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resetToken}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get user details
export const getUserDetails = async (): Promise<{ success: boolean; data: User }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const result = await response.json();
    setStoredUser(result.data); // Update stored user data
    return result;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Update user details
export const updateUserDetails = async (data: {
  userName: string;
  occupation: string;
  pincode: number;
  state: string;
  city: string;
  streetAddress: string;
  phoneNumber: number;
}): Promise<{ success: boolean; message: string; data: User }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    const result = await response.json();
    setStoredUser(result.data); // Update stored user data
    return result;
  } catch (error: any) {
    console.error('Error updating user details:', error);
    throw error;
  }
};

// Add review
export const addReview = async (data: {
  rating: number;
  comment: string;
}): Promise<{ message: string; review: BackendReview }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/review`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add review');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// ==================== CART APIs (Phase 2) ====================

// Get cart
export const getCart = async (): Promise<{
  success: boolean;
  data: {
    cart: CartItem[];
    summary: { totalItems: number; subtotal: number; itemCount: number };
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Add to cart
export const addToCart = async (
  productId: string,
  quantity: number = 1
): Promise<{ success: boolean; message: string; data: { cart: CartItem[] } }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to cart');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Update cart quantity
export const updateCartQuantity = async (
  productId: string,
  action: 'increase' | 'decrease'
): Promise<{ success: boolean; message: string; data: { cart: CartItem[]; removed?: boolean } }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update cart');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

// Delete from cart
export const deleteFromCart = async (
  productId: string
): Promise<{ success: boolean; message: string; data: { cart: CartItem[] } }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove from cart');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};


// Export getAuthHeaders so orderApi can use it
export { getAuthHeaders };
