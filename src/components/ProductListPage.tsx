import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { HorizontalProductCard } from "./HorizontalProductCard";
import { Product } from "./CartContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface ProductListPageProps {
  products: Product[];
  title: string;
  description: string;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

const ITEMS_PER_PAGE = 6;

export function ProductListPage({
  products,
  title,
  description,
  onBack,
  onProductClick,
}: ProductListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Men' | 'Women' | 'Unisex'>('All');
  
  // Filter products by gender
  const filteredProducts = genderFilter === 'All' 
    ? products 
    : products.filter(p => p.gender === genderFilter);
  
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenderFilterChange = (filter: 'All' | 'Men' | 'Women' | 'Unisex') => {
    setGenderFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
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
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="mb-4">{title}</h1>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </div>

        {/* Gender Filter */}
        <div className="mb-8 flex items-center gap-3 flex-wrap">
          <span className="text-sm">Filter by:</span>
          <div className="flex gap-2">
            <Button
              variant={genderFilter === 'All' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleGenderFilterChange('All')}
            >
              All
            </Button>
            <Button
              variant={genderFilter === 'Men' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleGenderFilterChange('Men')}
            >
              Men
            </Button>
            <Button
              variant={genderFilter === 'Women' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleGenderFilterChange('Women')}
            >
              Women
            </Button>
            <Button
              variant={genderFilter === 'Unisex' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleGenderFilterChange('Unisex')}
            >
              Unisex
            </Button>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <HorizontalProductCard
                key={product.id}
                product={product}
                onViewDetails={onProductClick}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found for the selected filter.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}