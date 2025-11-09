import { Star, Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { fetchAllReviews, BackendReview } from "../services/api";

interface TestimonialsProps {
  onSeeAll: () => void;
}

export function Testimonials({ onSeeAll }: TestimonialsProps) {
  const [reviews, setReviews] = useState<BackendReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reviews from backend (only first 6)
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAllReviews();
        setReviews(response.reviews.slice(0, 6)); // Only show 6 on home page
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Helper to get user initials for avatar fallback
  const getUserInitials = (userName: string): string => {
    const names = userName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  // Generate a consistent avatar image URL based on user name
  const getAvatarUrl = (userName: string) => {
    const initials = getUserInitials(userName);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials
    )}&background=random&size=48`;
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers have to
            say about their experience with Addict Hawk.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {reviews.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="bg-background h-full transition-shadow duration-300 hover:shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300">
                      <ImageWithFallback
                        src={getAvatarUrl(testimonial.userId.userName)}
                        alt={testimonial.userId.userName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="mb-0 group-hover:text-primary transition-colors duration-300">
                        {testimonial.userId.userName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.userId.occupation}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground">{testimonial.comment}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Button variant="outline" size="lg" onClick={onSeeAll}>
            See All Reviews
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
