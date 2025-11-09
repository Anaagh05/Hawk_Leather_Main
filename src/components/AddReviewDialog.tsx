// src/components/AddReviewDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Star, Loader2 } from "lucide-react";
import { addReview } from "../services/api";
import { toast } from "sonner";
import { motion } from "motion/react";

interface AddReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddReviewDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsLoading(true);
    try {
      await addReview({ rating, comment });
      toast.success("Review added successfully!");
      setRating(0);
      setComment("");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to add review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Constrain modal to a pleasant rectangular size and allow scrolling when needed */}
      <DialogContent className="w-[min(720px,90vw)] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Your Review</DialogTitle>
          <DialogDescription>
            Share your experience with Addict Hawk products
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoveredRating || rating);
                return (
                  <motion.button
                    key={star}
                    type="button"
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: star * 0.03,
                    }}
                    whileHover={{ scale: 1.18 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors duration-150 ${
                        isActive
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                      style={{
                        // ensure fill is visible on lucide icons
                        fill: isActive ? "currentColor" : "none",
                      }}
                    />
                  </motion.button>
                );
              })}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                You rated: {rating} star{rating > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
