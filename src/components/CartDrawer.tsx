import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Separator } from "./ui/separator";
import { motion, AnimatePresence } from "motion/react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginRequired: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, onLoginRequired, onCheckout }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const total = getCartTotal();
  const shipping = total > 200 ? 0 : 15;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      onClose();
      onLoginRequired();
    } else {
      // Proceed to checkout
      onClose();
      onCheckout();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl lg:max-w-2xl flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6"
            >
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </motion.div>
            <h3 className="mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some items to get started
            </p>
            <Button onClick={onClose} className="hover:scale-105 transition-transform">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 px-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="mb-6 last:mb-0"
                  >
                    <div className="flex gap-5 group p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="relative w-28 h-28 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="truncate mb-1">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 h-fit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-3">
                          <div className="flex items-center gap-3 bg-background rounded-lg p-1.5 border">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </motion.button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>
                          </div>
                          <p className="text-xl">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t pt-6 px-6 pb-6 space-y-4 bg-background">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? <span className="text-green-600">FREE</span> : `${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && total < 200 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 p-3 rounded-lg"
                  >
                    🎉 Add ₹{(200 - total).toFixed(2)} more for free shipping!
                  </motion.div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center py-2">
                <span className="text-lg">Total</span>
                <span className="text-3xl">₹{finalTotal.toFixed(2)}</span>
              </div>
              
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              </div>

              {!isAuthenticated && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-center text-muted-foreground pt-2"
                >
                  Sign in to save your cart
                </motion.p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
