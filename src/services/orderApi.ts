// src/services/orderApi.ts

import { getAuthHeaders } from './api';

const API_BASE_URL = 'https://hawk-leather-backend.vercel.app/api/v1';

// ==================== TYPE DEFINITIONS ====================

export interface OrderItem {
  productId: {
    _id: string;
    categoryName: string;
    itemName: string;
    itemImageUrl: string;
  };
  itemName: string;
  itemPrice: number;
  quantity: number;
  _id: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface BackendOrder {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'cod' | 'online';
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: BackendOrder[];
    summary: {
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
    };
    totalOrders: number;
  };
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'online';
}

// ==================== ORDER APIs ====================

/**
 * Get orders by status or all orders
 * @param status - Optional: 'processing' | 'shipped' | 'delivered' | 'cancelled'
 */
export const getOrders = async (
  status?: 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<OrdersResponse> => {
  try {
    const params = status ? `?status=${status}` : '';
    const url = `${API_BASE_URL}/orders/myOrder${params}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Cancel an order
 * @param orderId - Order ID to cancel
 */
export const cancelOrder = async (
  orderId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const url = `${API_BASE_URL}/orders/${orderId}/cancel`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel order');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

/**
 * Create a new order (checkout)
 * @param orderData - Shipping address and payment method
 */
export const createOrder = async (
  orderData: CreateOrderRequest
): Promise<{
  success: boolean;
  message: string;
  data: BackendOrder;
}> => {
  try {
    const url = `${API_BASE_URL}/orders/create`;

    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Helper function to map backend order to frontend format
export const mapBackendOrderToFrontend = (backendOrder: BackendOrder) => {
  return {
    id: backendOrder._id,
    orderNumber: backendOrder._id.slice(-8).toUpperCase(),
    date: backendOrder.createdAt,
    status: backendOrder.orderStatus,
    paymentStatus: backendOrder.paymentStatus,
    paymentMethod: backendOrder.paymentMethod,
    total: backendOrder.totalAmount,
    shippingAddress: backendOrder.shippingAddress,
    items: backendOrder.items.map(item => ({
      id: item._id,
      name: item.itemName,
      price: item.itemPrice,
      quantity: item.quantity,
      image: item.productId.itemImageUrl,
      category: item.productId.categoryName,
    })),
    trackingNumber: undefined, // Add if backend provides
  };
};
