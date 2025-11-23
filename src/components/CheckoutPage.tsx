// src/components/CheckoutPage.tsx

import { useState } from "react";
import { CreateOrderRequest } from "../services/orderApi";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Wallet,
  Edit2,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/orderApi";



declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutPageProps {
  onBack: () => void;
}

export function CheckoutPage({ onBack }: CheckoutPageProps) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Address editing state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.streetAddress || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode?.toString() || "",
    phone: user?.phoneNumber?.toString() || "",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 150;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleAddressEdit = () => {
    setIsEditingAddress(true);
  };

  const handleAddressSave = () => {
    // Validate address fields
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode ||
      !shippingAddress.phone
    ) {
      toast.error("Please fill in all address fields");
      return;
    }
    setIsEditingAddress(false);
    toast.success("Delivery address updated");
  };

  const handleAddressCancel = () => {
    // Reset to original user address
    setShippingAddress({
      street: user?.streetAddress || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode?.toString() || "",
      phone: user?.phoneNumber?.toString() || "",
    });
    setIsEditingAddress(false);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate address
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode ||
      !shippingAddress.phone
    ) {
      toast.error("Please complete your shipping address");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // COD Flow - Direct order creation
      if (paymentMethod === "cod") {
        const orderData: CreateOrderRequest = {
          shippingAddress: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            phone: shippingAddress.phone,
          },
          paymentMethod: "cod" as const,
        };

        const response = await createOrder(orderData);
        toast.success("Order placed successfully!");
        clearCart();

        setTimeout(() => {
          onBack();
        }, 1500);
      }
      // Online Payment Flow - Razorpay Integration
      else if (paymentMethod === "online") {
        // Step 1: Create Razorpay order
        const razorpayOrderResponse = await createRazorpayOrder({
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          phone: shippingAddress.phone,
        });

        // Step 2: Open Razorpay payment gateway
        const options = {
          key: razorpayOrderResponse.data.keyId,
          amount: razorpayOrderResponse.data.amount * 100, // Amount in paise
          currency: razorpayOrderResponse.data.currency,
          name: "Hawk Leather",
          description: "Purchase Premium Leather Products",
          order_id: razorpayOrderResponse.data.orderId,
          prefill: {
            name: user?.userName || "",
            email: user?.userEmail || "",
            contact: shippingAddress.phone || "",
          },
          theme: {
            color: "#8B4513", // Brown color for leather theme
          },
          handler: async function (response: any) {
            try {
              // Step 3: Verify payment on backend
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress: {
                  street: shippingAddress.street,
                  city: shippingAddress.city,
                  state: shippingAddress.state,
                  pincode: shippingAddress.pincode,
                  phone: shippingAddress.phone,
                },
              };

              const verifyResponse = await verifyRazorpayPayment(verificationData);

              toast.success("Payment successful! Order placed.");
              clearCart();

              setTimeout(() => {
                onBack();
              }, 1500);
            } catch (error: any) {
              toast.error(error.message || "Payment verification failed");
            } finally {
              setIsPlacingOrder(false);
            }
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment cancelled");
              setIsPlacingOrder(false);
            },
          },
        };

        // Check if Razorpay is loaded
        if (typeof window.Razorpay === "undefined") {
          toast.error("Payment gateway not loaded. Please refresh the page.");
          setIsPlacingOrder(false);
          return;
        }

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" className="mb-6" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Add items to your cart to proceed with checkout
              </p>
              <Button onClick={onBack}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                    {!isEditingAddress && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddressEdit}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Address
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingAddress ? (
                    <>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            value={shippingAddress.street}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                street: e.target.value,
                              })
                            }
                            placeholder="Enter street address"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={shippingAddress.city}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  city: e.target.value,
                                })
                              }
                              placeholder="Enter city"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={shippingAddress.state}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  state: e.target.value,
                                })
                              }
                              placeholder="Enter state"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                              id="pincode"
                              value={shippingAddress.pincode}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  pincode: e.target.value,
                                })
                              }
                              placeholder="Enter pincode"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={shippingAddress.phone}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleAddressSave} className="flex-1">
                          Save Address
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleAddressCancel}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Full Name
                        </p>
                        <p className="font-medium">{user?.userName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Phone Number
                        </p>
                        <p className="font-medium">
                          {shippingAddress.phone || "N/A"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">
                          Delivery Address
                        </p>
                        <p className="font-medium">
                          {shippingAddress.street || "N/A"}
                          <br />
                          {shippingAddress.city}, {shippingAddress.state} -{" "}
                          {shippingAddress.pincode}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Email
                        </p>
                        <p className="font-medium break-all">
                          {user?.userEmail || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: "cod" | "online") =>
                      setPaymentMethod(value)
                    }
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg mb-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label
                        htmlFor="cod"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Wallet className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">
                            Pay when you receive
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="online" id="online" />
                      <Label
                        htmlFor="online"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Online Payment</p>
                          <p className="text-sm text-muted-foreground">
                            UPI, Cards, Net Banking
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items ({cartItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.category}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                <span
                                  style={{ textDecoration: "line-through" }}
                                >
                                  ₹{item.price.toFixed(2)}
                                </span>
                                <span className="ml-2 text-sm text-green-600">
                                  -
                                  {item.discount ??
                                    Math.round(
                                      ((item.price - item.mrpPrice) /
                                        item.price) *
                                      100
                                    )}
                                  %
                                </span>
                              </div>
                              <div className="font-medium">
                                ₹{item.mrpPrice.toFixed(2)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{(item.mrpPrice * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>
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
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-lg">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full"
                    size="lg"
                    disabled={isPlacingOrder || isEditingAddress}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  <div className="pt-4 space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-current rounded-full" />
                      Safe and secure payments
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-current rounded-full" />
                      Free shipping on orders above ₹1000
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-current rounded-full" />
                      Easy returns within 7 days
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
