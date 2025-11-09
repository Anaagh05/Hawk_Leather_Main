// src/components/CartContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  getCart,
  addToCart as addToCartAPI,
  updateCartQuantity as updateCartQuantityAPI,
  deleteFromCart as deleteFromCartAPI,
  mapBackendCartItemToFrontend,
  getAuthToken,
} from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  price: number;
  mrpPrice: number;
  image: string;
  category: string;
  gender?: "Men" | "Women" | "Unisex";
  description: string;
  features: string[];
  details?: string[];
  inStock?: boolean;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  getCartCount: () => number;
  getCartTotal: () => number;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await getCart();
      const mappedCart = response.data.cart.map(mapBackendCartItemToFrontend);
      setCartItems(mappedCart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await addToCartAPI(product.id, 1);
      await refreshCart();
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await deleteFromCartAPI(productId);
      await refreshCart();
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const currentItem = cartItems.find((item) => item.id === productId);
      if (!currentItem) return;

      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      // Determine action based on quantity change
      const action = quantity > currentItem.quantity ? "increase" : "decrease";
      const diff = Math.abs(quantity - currentItem.quantity);

      // Call API multiple times if needed
      for (let i = 0; i < diff; i++) {
        await updateCartQuantityAPI(productId, action);
      }

      await refreshCart();
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    // Total should sum the payable amount (mrpPrice) per item
    return cartItems.reduce(
      (total, item) => total + item.mrpPrice * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartCount,
        getCartTotal,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
