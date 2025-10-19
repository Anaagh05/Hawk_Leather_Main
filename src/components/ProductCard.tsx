import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import React from "react";
interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  category: string;
  onClick?: () => void;
}

export function ProductCard({ name, price, image, category, onClick }: ProductCardProps) {
  return (
    <motion.div
      className="group cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4 rounded-lg">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">{category}</p>
        <h3 className="group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-foreground">{price}</p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="outline"
            className="w-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            View Details
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
