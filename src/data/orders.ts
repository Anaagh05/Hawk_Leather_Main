export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'AH-2024-001',
    date: '2024-03-15',
    status: 'delivered',
    total: 388,
    items: [
      {
        id: '1',
        productId: '1',
        name: 'Classic Tote',
        image: 'https://images.unsplash.com/photo-1624687943971-e86af76d57de?w=400',
        price: 299,
        quantity: 1,
      },
      {
        id: '2',
        productId: '2',
        name: 'Minimal Wallet',
        image: 'https://images.unsplash.com/photo-1689844495806-321b5adaf5d5?w=400',
        price: 89,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
    trackingNumber: '1Z999AA10123456784',
    estimatedDelivery: 'Delivered on March 18, 2024',
  },
  {
    id: '2',
    orderNumber: 'AH-2024-002',
    date: '2024-03-20',
    status: 'shipped',
    total: 449,
    items: [
      {
        id: '3',
        productId: '4',
        name: 'Executive Briefcase',
        image: 'https://images.unsplash.com/photo-1611688599669-e0d5a0497670?w=400',
        price: 449,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
    trackingNumber: '1Z999AA10123456785',
    estimatedDelivery: 'Expected delivery: March 25, 2024',
  },
  {
    id: '3',
    orderNumber: 'AH-2024-003',
    date: '2024-03-22',
    status: 'processing',
    total: 258,
    items: [
      {
        id: '4',
        productId: '3',
        name: 'Signature Belt',
        image: 'https://images.unsplash.com/photo-1664286074176-5206ee5dc878?w=400',
        price: 129,
        quantity: 2,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
    estimatedDelivery: 'Processing - will ship soon',
  },
  {
    id: '4',
    orderNumber: 'AH-2024-004',
    date: '2024-02-10',
    status: 'delivered',
    total: 668,
    items: [
      {
        id: '5',
        productId: '5',
        name: 'Crossbody Messenger',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
        price: 279,
        quantity: 1,
      },
      {
        id: '6',
        productId: '6',
        name: 'Weekend Duffle',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        price: 389,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
    trackingNumber: '1Z999AA10123456786',
    estimatedDelivery: 'Delivered on February 15, 2024',
  },
];

export const getPendingOrders = () => mockOrders.filter(order => order.status === 'pending' || order.status === 'processing');
export const getShippedOrders = () => mockOrders.filter(order => order.status === 'shipped');
export const getDeliveredOrders = () => mockOrders.filter(order => order.status === 'delivered');
