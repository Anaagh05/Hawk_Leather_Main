import { useState, useEffect } from "react";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { motion } from "motion/react";
import { fetchAllReviews, BackendReview } from "../services/api";
import { toast } from "sonner";

interface TestimonialsPageProps {
  onBack: () => void;
}

const ITEMS_PER_PAGE = 9;

export function TestimonialsPage({ onBack }: TestimonialsPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<BackendReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews from backend
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAllReviews();
        setReviews(response.reviews);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setError("Failed to load reviews");
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTestimonials = reviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  // Helper to get user initials for avatar fallback
  const getUserInitials = (userName: string): string => {
    const names = userName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate a consistent avatar image URL based on user name
  const getAvatarUrl = (userName: string) => {
    // Using UI Avatars API for consistent avatar generation
    const initials = getUserInitials(userName);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials
    )}&background=random&size=48`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" className="mb-6" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-center py-20 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-12 text-center">
          <h1 className="mb-4">Customer Reviews</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Read what our customers have to say about their experience with
            Addict Hawk leather goods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="bg-card h-full transition-shadow duration-300 hover:shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300">
                      <ImageWithFallback
                        src={getAvatarUrl(testimonial.userId.userName)}
                        alt={testimonial.userId.userName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-0 truncate group-hover:text-primary transition-colors duration-300">
                        {testimonial.userId.userName}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {testimonial.userId.occupation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary group-hover:scale-110 transition-transform duration-300"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(testimonial.createdAt)}
                    </p>
                  </div>

                  <p className="text-muted-foreground">{testimonial.comment}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  size="default"
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      size="default"
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  size="default"
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
