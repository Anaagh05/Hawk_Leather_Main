// src/components/ProfilePage.tsx

import { useState, useEffect } from "react";
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
  Briefcase,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EditProfileDialog } from "./EditProfileDialog";
import { AddReviewDialog } from "./AddReviewDialog";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  getOrders,
  cancelOrder,
  mapBackendOrderToFrontend,
  BackendOrder,
} from "../services/orderApi";

interface ProfilePageProps {
  onBack: () => void;
  onCheckout: () => void;
}

interface FrontendOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  shippingAddress: any;
  items: any[];
  trackingNumber?: string;
}

export function ProfilePage({ onBack, onCheckout }: ProfilePageProps) {
  const { cartItems, getCartTotal, removeFromCart } = useCart();
  const { user } = useAuth();

  // Order states
  const [allOrders, setAllOrders] = useState<FrontendOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showAddReviewDialog, setShowAddReviewDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  // Pagination states
  const [allOrdersPage, setAllOrdersPage] = useState(1);
  const [cartPage, setCartPage] = useState(1);
  const [processingPage, setProcessingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  const itemsPerPage = 3;

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const response = await getOrders(); // Get all orders
      const mappedOrders = response.data.orders.map(mapBackendOrderToFrontend);
      setAllOrders(mappedOrders);
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      setOrdersError("Failed to load orders");
      toast.error("Failed to load orders");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      await cancelOrder(orderToCancel);
      toast.success("Order cancelled successfully");
      setOrderToCancel(null);
      // Refresh orders
      await fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    }
  };

  const handleReviewSuccess = () => {
    toast.success("Thank you for your review!");
  };

  // Filter orders by status
  const processingOrders = allOrders.filter(
    (order) => order.status === "processing" || order.status === "shipped"
  );
  const completedOrders = allOrders.filter(
    (order) => order.status === "delivered"
  );

  // Pagination logic
  const paginateOrders = (orders: FrontendOrder[], page: number) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return orders.slice(start, end);
  };

  const paginatedAllOrders = paginateOrders(allOrders, allOrdersPage);
  const paginatedProcessingOrders = paginateOrders(
    processingOrders,
    processingPage
  );
  const paginatedCompletedOrders = paginateOrders(
    completedOrders,
    completedPage
  );
  const paginatedCartItems = cartItems.slice(
    (cartPage - 1) * itemsPerPage,
    cartPage * itemsPerPage
  );

  const allOrdersPages = Math.ceil(allOrders.length / itemsPerPage);
  const processingPages = Math.ceil(processingOrders.length / itemsPerPage);
  const completedPages = Math.ceil(completedOrders.length / itemsPerPage);
  const cartPages = Math.ceil(cartItems.length / itemsPerPage);

  const getStatusColor = (status: FrontendOrder["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: FrontendOrder["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const renderOrderCard = (order: FrontendOrder) => (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">
                Order #{order.orderNumber}
              </h3>
              <p className="text-sm text-muted-foreground">
                Placed on{" "}
                {new Date(order.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              <span className="flex items-center gap-1 text-white">
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.category} • Qty: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Payment Method
              </span>
              <span className="text-sm font-medium">
                {order.paymentMethod.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Payment Status
              </span>
              <span className="text-sm font-medium capitalize">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">₹{order.total}</span>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">Shipping Address:</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.street}, {order.shippingAddress.city}
                <br />
                {order.shippingAddress.state} - {order.shippingAddress.pincode}
                <br />
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          )}

          {order.status === "processing" && (
            <div className="mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setOrderToCancel(order.id)}
                className="w-full"
              >
                Cancel Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderOrdersContent = (
    orders: FrontendOrder[],
    emptyMessage: string,
    emptyIcon: any
  ) => {
    if (isLoadingOrders) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (ordersError) {
      return (
        <div className="text-center py-20">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-red-500">{ordersError}</p>
          <Button onClick={fetchOrders} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          {emptyIcon}
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return <>{orders.map((order) => renderOrderCard(order))}</>;
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-1">
                        {user?.userName || "Guest User"}
                      </h1>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user?.userEmail || "guest@example.com"}
                      </p>
                    </div>
                    <Button onClick={() => setIsEditDialogOpen(true)}>
                      Edit Profile
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span>{user?.phoneNumber || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Occupation:</span>
                      <span>{user?.occupation || "N/A"}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm md:col-span-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Address:</span>
                        <p>
                          {user?.streetAddress || "N/A"}
                          <br />
                          {user?.city}, {user?.state} - {user?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">All Orders</TabsTrigger>
            <TabsTrigger value="cart">Cart</TabsTrigger>
            <TabsTrigger value="pending">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* All Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {renderOrdersContent(
                  paginatedAllOrders,
                  "No orders found",
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                )}

                {allOrdersPages > 1 && !isLoadingOrders && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setAllOrdersPage(Math.max(1, allOrdersPage - 1))
                          }
                          className={
                            allOrdersPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: allOrdersPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setAllOrdersPage(page)}
                            isActive={allOrdersPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setAllOrdersPage(
                              Math.min(allOrdersPages, allOrdersPage + 1)
                            )
                          }
                          className={
                            allOrdersPage === allOrdersPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cart Tab - Keep existing implementation */}
          <TabsContent value="cart">
            <Card>
              <CardHeader>
                <CardTitle>Your Cart</CardTitle>
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
                  <>
                    <div className="space-y-4 mb-6">
                      {paginatedCartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 border rounded-lg"
                        >
                          <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.category}
                                </p>
                                <p className="text-sm">Qty: {item.quantity}</p>
                              </div>
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
                                <p className="font-semibold">
                                  ₹{(item.mrpPrice * item.quantity).toFixed(2)}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {cartPages > 1 && (
                      <Pagination className="mb-6">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setCartPage(Math.max(1, cartPage - 1))
                              }
                              className={
                                cartPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: cartPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCartPage(page)}
                                isActive={cartPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setCartPage(Math.min(cartPages, cartPage + 1))
                              }
                              className={
                                cartPage === cartPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}

                    <Separator className="my-6" />
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-2xl">
                        ₹{getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    <Button onClick={onCheckout} className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processing Orders Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Processing Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {renderOrdersContent(
                  paginatedProcessingOrders,
                  "No processing orders",
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                )}

                {processingPages > 1 && !isLoadingOrders && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setProcessingPage(Math.max(1, processingPage - 1))
                          }
                          className={
                            processingPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: processingPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setProcessingPage(page)}
                            isActive={processingPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setProcessingPage(
                              Math.min(processingPages, processingPage + 1)
                            )
                          }
                          className={
                            processingPage === processingPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Orders Tab */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {renderOrdersContent(
                  paginatedCompletedOrders,
                  "No completed orders",
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                )}

                {completedPages > 1 && !isLoadingOrders && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCompletedPage(Math.max(1, completedPage - 1))
                          }
                          className={
                            completedPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: completedPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCompletedPage(page)}
                            isActive={completedPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCompletedPage(
                              Math.min(completedPages, completedPage + 1)
                            )
                          }
                          className={
                            completedPage === completedPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Your Reviews</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your experience with our products
                    </p>
                  </div>
                  <Button onClick={() => setShowAddReviewDialog(true)}>
                    <Star className="mr-2 h-4 w-4" />
                    Add Review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Click "Add Review" to share your feedback
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />

      <AddReviewDialog
        isOpen={showAddReviewDialog}
        onClose={() => setShowAddReviewDialog(false)}
        onSuccess={handleReviewSuccess}
      />

      <AlertDialog
        open={!!orderToCancel}
        onOpenChange={() => setOrderToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
