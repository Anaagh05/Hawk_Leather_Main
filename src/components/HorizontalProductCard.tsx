import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Product } from "./CartContext";
import { motion } from "motion/react";

interface HorizontalProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function HorizontalProductCard({ product, onViewDetails }: HorizontalProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col sm:flex-row gap-6 bg-card border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative w-full sm:w-64 h-80 flex-shrink-0 overflow-hidden bg-muted">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground">{product.category}</p>
                {product.gender && (
                  <Badge variant="secondary" className="text-xs">
                    {product.gender}
                  </Badge>
                )}
              </div>
              <h3 className="mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
            </div>
            <p className="text-2xl">₹{product.price}</p>
          </div>
          
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="mb-4">
            <p className="text-sm mb-2">Key Features:</p>
            <ul className="space-y-1">
              {product.features?.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="w-full sm:w-auto opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            onClick={() => onViewDetails(product)}
          >
            View Details
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}