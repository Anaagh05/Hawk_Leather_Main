import { useState } from "react";
import React from "react";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  User as UserIcon,
  Mail,
  Phone,
  Star,
  Send,
  Briefcase,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EditProfileDialog } from "./EditProfileDialog";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { mockOrders, Order } from "../data/orders";
import { motion } from "motion/react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { user } = useAuth();
  const { cartItems, getCartTotal } = useCart();
  const [orders] = useState<Order[]>(mockOrders);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState<
    Array<{
      id: string;
      rating: number;
      text: string;
      date: string;
    }>
  >([]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "pending":
        return "bg-orange-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (reviewText.trim() === "") {
      toast.error("Please write a review");
      return;
    }

    const newReview = {
      id: `review-${Date.now()}`,
      rating,
      text: reviewText,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    setSubmittedReviews([newReview, ...submittedReviews]);
    setRating(0);
    setReviewText("");
    toast.success("Review submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                    <span className="text-3xl">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <h2 className="mb-2">{user?.name || "Guest User"}</h2>
                  <p className="text-muted-foreground mb-6">
                    {user?.email || "guest@example.com"}
                  </p>

                  <Separator className="my-6" />

                  <div className="w-full space-y-4 text-left">
                    <div className="flex items-start gap-3">
                      <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p>{user?.name || "John Doe"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="break-all">
                          {user?.email || "john.doe@example.com"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{user?.phone || "+1 (555) 123-4567"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Occupation
                        </p>
                        <p>{user?.occupation || "Software Developer"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>
                          {user?.address ||
                            "123 Main Street, New York, NY 10001"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="cart">Cart</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                              <div>
                                <h3 className="mb-1">{order.orderNumber}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Placed on{" "}
                                  {new Date(order.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} text-white flex items-center gap-1`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </Badge>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-3 mb-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                  <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                                    <ImageWithFallback
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="mb-1">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Qty: {item.quantity} × ₹{item.price}
                                    </p>
                                  </div>
                                  <p>₹{item.price * item.quantity}</p>
                                </div>
                              ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between items-center">
                              <p>Total</p>
                              <p className="text-xl">₹{order.total}</p>
                            </div>

                            {order.trackingNumber && (
                              <div className="mt-4 p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">
                                  Tracking Number
                                </p>
                                <p className="text-sm font-mono">
                                  {order.trackingNumber}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Cart Tab */}
              <TabsContent value="cart">
                <Card>
                  <CardHeader>
                    <CardTitle>Shopping Cart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">
                          Your cart is empty
                        </p>
                        <Button onClick={onBack}>Continue Shopping</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-4 bg-muted rounded-lg"
                          >
                            <div className="w-20 h-20 rounded bg-background overflow-hidden flex-shrink-0">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="mb-1">{item.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.category}
                              </p>
                              <p>Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl">
                                ₹{item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}

                        <Separator className="my-4" />

                        <div className="flex justify-between items-center text-xl">
                          <p>Total</p>
                          <p>₹{getCartTotal().toFixed(2)}</p>
                        </div>

                        <Button className="w-full" size="lg">
                          Proceed to Checkout
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pending Tab */}
              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orders
                      .filter(
                        (o) =>
                          o.status === "pending" || o.status === "processing"
                      )
                      .map((order) => (
                        <Card key={order.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="mb-1">{order.orderNumber}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {order.estimatedDelivery}
                                </p>
                              </div>
                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} text-white`}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-6">
                              {order.items.length} item
                              {order.items.length > 1 ? "s" : ""} • $
                              {order.total}
                            </p>

                            {/* Timeline */}
                            <div className="relative">
                              <div className="flex items-center justify-between">
                                {/* Processing Stage */}
                                <div className="flex flex-col items-center flex-1">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                      order.status === "processing" ||
                                      order.status === "shipped" ||
                                      order.status === "delivered"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    <Clock className="h-5 w-5" />
                                  </div>
                                  <p className="text-xs mt-2 text-center">
                                    Processing
                                  </p>
                                </div>

                                {/* Connecting Line 1 */}
                                <div
                                  className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                                    order.status === "shipped" ||
                                    order.status === "delivered"
                                      ? "bg-primary"
                                      : "bg-muted"
                                  }`}
                                />

                                {/* Shipped Stage */}
                                <div className="flex flex-col items-center flex-1">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                      order.status === "shipped" ||
                                      order.status === "delivered"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    <Truck className="h-5 w-5" />
                                  </div>
                                  <p className="text-xs mt-2 text-center">
                                    Shipped
                                  </p>
                                </div>

                                {/* Connecting Line 2 */}
                                <div
                                  className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                                    order.status === "delivered"
                                      ? "bg-primary"
                                      : "bg-muted"
                                  }`}
                                />

                                {/* Delivered Stage */}
                                <div className="flex flex-col items-center flex-1">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                      order.status === "delivered"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    <CheckCircle className="h-5 w-5" />
                                  </div>
                                  <p className="text-xs mt-2 text-center">
                                    Delivered
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {orders.filter(
                      (o) => o.status === "pending" || o.status === "processing"
                    ).length === 0 && (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          No pending orders
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tracking Tab */}
              <TabsContent value="tracking">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Tracking</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {orders
                      .filter((o) => o.trackingNumber)
                      .map((order) => (
                        <Card key={order.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="mb-1">{order.orderNumber}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Tracking: {order.trackingNumber}
                                </p>
                              </div>
                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} text-white`}
                              >
                                {order.status}
                              </Badge>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4">
                              <div className="flex gap-4">
                                <div
                                  className={`w-8 h-8 rounded-full ${
                                    order.status === "delivered" ||
                                    order.status === "shipped" ||
                                    order.status === "processing"
                                      ? "bg-primary"
                                      : "bg-muted"
                                  } flex items-center justify-center flex-shrink-0`}
                                >
                                  <CheckCircle className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div className="flex-1">
                                  <p>Order Confirmed</p>
                                  <p className="text-sm text-muted-foreground">
                                    Your order has been received
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-4">
                                <div
                                  className={`w-8 h-8 rounded-full ${
                                    order.status === "delivered" ||
                                    order.status === "shipped"
                                      ? "bg-primary"
                                      : "bg-muted"
                                  } flex items-center justify-center flex-shrink-0`}
                                >
                                  <Package className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div className="flex-1">
                                  <p>Shipped</p>
                                  <p className="text-sm text-muted-foreground">
                                    Package is on its way
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-4">
                                <div
                                  className={`w-8 h-8 rounded-full ${
                                    order.status === "delivered"
                                      ? "bg-primary"
                                      : "bg-muted"
                                  } flex items-center justify-center flex-shrink-0`}
                                >
                                  <Truck className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div className="flex-1">
                                  <p>Out for Delivery</p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.estimatedDelivery}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Review Form */}
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Rating</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= (hoveredRating || rating)
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="review-text" className="mb-2 block">
                          Your Review
                        </Label>
                        <Textarea
                          id="review-text"
                          placeholder="Share your experience with our products..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows={5}
                          className="resize-none"
                        />
                      </div>

                      <Button onClick={handleSubmitReview} className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Submit Review
                      </Button>
                    </div>

                    {/* Submitted Reviews */}
                    {submittedReviews.length > 0 && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-4">
                          <h3>Your Reviews</h3>
                          {submittedReviews.map((review, index) => (
                            <motion.div
                              key={review.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex">
                                      {[...Array(review.rating)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className="h-4 w-4 fill-primary text-primary"
                                        />
                                      ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {review.date}
                                    </p>
                                  </div>
                                  <p className="text-muted-foreground">
                                    {review.text}
                                  </p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>

        {/* Edit Profile Dialog */}
        <EditProfileDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      </div>
    </div>
  );
}
