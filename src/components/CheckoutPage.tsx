import { useState } from "react";
import { ArrowLeft, CreditCard, MapPin, Package, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface CheckoutPageProps {
  onBack: () => void;
}

export function CheckoutPage({ onBack }: CheckoutPageProps) {
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = getCartTotal();
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    toast.success("Order placed successfully!");
    // Here you would typically process the payment and create the order
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                      <p>{user?.name || "John Doe"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                      <p>{user?.phone || "+1 (555) 123-4567"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="break-all">{user?.email || "john.doe@example.com"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Address</p>
                      <p>{user?.address || "123 Main Street"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">City</p>
                      <p>{user?.city || "New York"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">State</p>
                      <p>{user?.state || "NY"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p>Credit / Debit Card</p>
                          <p className="text-sm text-muted-foreground">Pay with your card</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Package className="h-5 w-5" />
                        <div>
                          <p>Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when you receive</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5" />
                        <div>
                          <p>UPI Payment</p>
                          <p className="text-sm text-muted-foreground">Pay via UPI apps</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Items Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Image</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="w-16 h-16 rounded bg-muted overflow-hidden">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="mb-1">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center justify-center px-3 py-1 bg-muted rounded">
                                {item.quantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <span>₹{shipping.toFixed(2)}</span>
                      )}
                    </div>
                    {shipping > 0 && subtotal < 200 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 p-3 rounded-lg"
                      >
                        🎉 Add ₹{(200 - subtotal).toFixed(2)} more for free shipping!
                      </motion.div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg">Total</span>
                    <span className="text-3xl">₹{total.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="space-y-3 pt-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
                        Place Order
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="w-full" onClick={onBack}>
                        Continue Shopping
                      </Button>
                    </motion.div>
                  </div>

                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <Package className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Free shipping on orders over ₹200</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CreditCard className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Secure payment processing</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
