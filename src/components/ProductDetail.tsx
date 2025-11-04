import { ArrowLeft, Check, Package, Shield, Star, Truck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product, useCart } from "./CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-muted-foreground">{product.category}</p>
                {product.gender && (
                  <Badge variant="secondary" className="text-xs">
                    {product.gender}
                  </Badge>
                )}
              </div>
              <h1 className="mb-4">{product.name}</h1>
              <p className="text-3xl">₹{product.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-muted-foreground">(128 reviews)</span>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="space-y-3">
              <h3>Key Features</h3>
              <ul className="space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Orders over ₹200</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm">Lifetime Warranty</p>
                  <p className="text-xs text-muted-foreground">On all products</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="care">Care</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6 space-y-4">
              <h3>Product Details</h3>
              <ul className="space-y-2 text-muted-foreground">
                {product.details?.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="materials" className="mt-6 space-y-4">
              <h3>Materials & Construction</h3>
              <p className="text-muted-foreground">
                Crafted from premium full-grain leather sourced from environmentally responsible tanneries. 
                Our leather is vegetable-tanned for durability and develops a rich patina over time. 
                All hardware is solid brass with a protective coating to prevent tarnishing.
              </p>
              <ul className="space-y-2 text-muted-foreground mt-4">
                <li>• 100% Full-Grain Leather</li>
                <li>• Vegetable-Tanned</li>
                <li>• Solid Brass Hardware</li>
                <li>• Cotton Canvas Lining</li>
                <li>• Hand-Stitched Seams</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="care" className="mt-6 space-y-4">
              <h3>Care Instructions</h3>
              <p className="text-muted-foreground">
                Proper care will ensure your leather goods age beautifully and last for generations.
              </p>
              <ul className="space-y-2 text-muted-foreground mt-4">
                <li>• Clean with a soft, dry cloth</li>
                <li>• Condition leather every 3-6 months</li>
                <li>• Avoid prolonged exposure to direct sunlight</li>
                <li>• Store in a cool, dry place</li>
                <li>• Use leather protector spray before first use</li>
                <li>• If wet, allow to air dry naturally</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}