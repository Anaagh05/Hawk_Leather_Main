// src/components/CartDrawer.tsx

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Separator } from "./ui/separator";
import { motion, AnimatePresence } from "motion/react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginRequired: () => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  onLoginRequired,
  onCheckout,
}: CartDrawerProps) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
    isLoading,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const total = getCartTotal();
  const shipping = total > 1000 ? 0 : 150;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  // Calculate total savings (original price - payable price)
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.price - item.mrpPrice) * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    onCheckout();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${cartItems.length} ${
                  cartItems.length === 1 ? "item" : "items"
                } in your cart`}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4"
            >
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </motion.div>
            <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add items to your cart to see them here
            </p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2 mb-1">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {item.category}
                          {item.discount && item.discount > 0 && (
                            <span className="ml-2 text-green-600 font-medium">
                              {item.discount}% OFF
                            </span>
                          )}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            {item.discount && item.discount > 0 && (
                              <p
                                className="text-xs text-muted-foreground"
                                style={{ textDecoration: "line-through" }}
                              >
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            )}
                            <p className="font-semibold">
                              ₹{(item.mrpPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">
                      -₹{totalSavings.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button onClick={handleCheckout} className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                onClick={() => clearCart()}
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
