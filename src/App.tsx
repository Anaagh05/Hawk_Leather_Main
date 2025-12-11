import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProductCard } from "./components/ProductCard";
import { Button } from "./components/ui/button";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArrowRight, Award, Package, Sparkles, Loader2 } from "lucide-react";
import { CartProvider, Product } from "./components/CartContext";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { CartDrawer } from "./components/CartDrawer";
import { ProductDetail } from "./components/ProductDetail";
import { ProductListPage } from "./components/ProductListPage";
import { TestimonialsPage } from "./components/TestimonialsPage";
import { ProfilePage } from "./components/ProfilePage";
import { CheckoutPage } from "./components/CheckoutPage";
import { Testimonials } from "./components/Testimonials";
import { LoginDialog } from "./components/LoginDialog";
import { Toaster } from "./components/ui/sonner";
import { motion } from "motion/react";
import { fetchAllProducts, mapBackendProductToFrontend } from "./services/api";
import { toast } from "sonner";

type ViewType =
  | "home"
  | "product-detail"
  | "all-products"
  | "bags"
  | "purses"
  | "belts"
  | "testimonials"
  | "profile"
  | "checkout";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Backend product states
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Protected route: redirect to home if trying to access profile without authentication
  useEffect(() => {
    if (currentView === "profile" && !isAuthenticated) {
      setCurrentView("home");
      setIsLoginOpen(true);
    }
  }, [currentView, isAuthenticated]);

  // Fetch all products from backend on mount
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      setProductsError(null);
      try {
        const response = await fetchAllProducts();
        if (response.success) {
          const mappedProducts = response.data.map(mapBackendProductToFrontend);
          setProducts(mappedProducts);
          // Set first 4 as featured products
          setFeaturedProducts(mappedProducts.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        setProductsError("Failed to load products. Please try again later.");
        toast.error("Failed to load products");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAllProducts = () => {
    setCurrentView("all-products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (category: "bags" | "purses" | "belts") => {
    setCurrentView(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewTestimonials = () => {
    setCurrentView("testimonials");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewProfile = () => {
    setCurrentView("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewCheckout = () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }
    setCurrentView("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeClick = () => {
    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAboutClick = () => {
    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(() => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "product-detail":
        if (!selectedProduct) return renderHome();
        return (
          <>
            <ProductDetail
              product={selectedProduct}
              onBack={handleBackToHome}
            />
          </>
        );

      case "profile":
        return (
          <ProfilePage
            onBack={handleBackToHome}
            onCheckout={handleViewCheckout}
          />
        );

      case "checkout":
        return <CheckoutPage onBack={handleViewProfile} />;

      case "all-products":
        return (
          <ProductListPage
            onBack={handleBackToHome}
            onProductClick={handleProductClick}
          />
        );

      case "bags":
        return (
          <ProductListPage
            onBack={handleBackToHome}
            onProductClick={handleProductClick}
            category="Bags"
          />
        );

      case "purses":
        return (
          <ProductListPage
            onBack={handleBackToHome}
            onProductClick={handleProductClick}
            category="Purses"
          />
        );

      case "belts":
        return (
          <ProductListPage
            onBack={handleBackToHome}
            onProductClick={handleProductClick}
            category="Belts"
          />
        );

      case "testimonials":
        return <TestimonialsPage onBack={handleBackToHome} />;

      default:
        return renderHome();
    }
  };

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1689844496310-b261f7602bc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbGVhdGhlciUyMGdvb2RzfGVufDF8fHx8MTc1OTk5Mjc3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl mb-6"
          >
            Timeless Craftsmanship
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-white/90"
          >
            Discover handcrafted leather goods that blend tradition with modern
            design
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 transition-all"
                onClick={handleViewAllProducts}
              >
                Shop Collection
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 transition-all"
                onClick={handleAboutClick}
              >
                Learn Our Story
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4"
              >
                <Award className="h-8 w-8" />
              </motion.div>
              <h3 className="mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Only the finest full-grain leather, carefully selected for
                durability and beauty
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4"
              >
                <Sparkles className="h-8 w-8" />
              </motion.div>
              <h3 className="mb-2">Handcrafted</h3>
              <p className="text-muted-foreground">
                Each piece is meticulously crafted by skilled artisans with
                decades of experience
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4"
              >
                <Package className="h-8 w-8" />
              </motion.div>
              <h3 className="mb-2">Lifetime Warranty</h3>
              <p className="text-muted-foreground">
                We stand behind our craftsmanship with a comprehensive lifetime
                warranty
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated selection of premium leather goods
            </p>
          </motion.div>

          {isLoadingProducts ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : productsError ? (
            <div className="text-center py-20 text-red-500">
              {productsError}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                  >
                    <ProductCard
                      name={product.name}
                      price={product.price}
                      mrpPrice={product.mrpPrice}
                      image={product.image}
                      category={product.category}
                      gender={product.gender}
                      onClick={() => handleProductClick(product)}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mt-12"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleViewAllProducts}
                    className="group"
                  >
                    View All Products
                    <motion.span
                      className="ml-2 inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Shop by Category</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Bags",
                image:
                  "https://images.unsplash.com/photo-1611688599669-e0d5a0497670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsZWF0aGVyJTIwYmFnfGVufDF8fHx8MTc1OTk1NTg3MXww&ixlib=rb-4.1.0&q=80&w=1080",
                onClick: () => handleCategoryClick("bags"),
              },
              {
                name: "Purses",
                image:
                  "https://images.unsplash.com/photo-1689844495806-321b5adaf5d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwcHVyc2UlMjB3YWxsZXR8ZW58MXx8fHwxNzU5OTkyNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
                onClick: () => handleCategoryClick("purses"),
              },
              {
                name: "Belts",
                image:
                  "https://images.unsplash.com/photo-1664286074176-5206ee5dc878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmVsdHxlbnwxfHx8fDE3NTk5OTI3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
                onClick: () => handleCategoryClick("belts"),
              },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -10 }}
                className="group relative h-96 overflow-hidden rounded-lg cursor-pointer"
                onClick={category.onClick}
              >
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-white"
                  >
                    <h3 className="text-white mb-2">{category.name}</h3>
                    <p className="text-white/80 group-hover:text-white transition-colors">
                      Explore Collection →
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials onSeeAll={handleViewTestimonials} />

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] rounded-lg overflow-hidden"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1755924648847-f733ed2818c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwd29ya3Nob3AlMjBjcmFmdHNtYW58ZW58MXx8fHwxNzU5OTY5Nzc5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Craftsman at work"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="mb-6">Crafted with Passion</h2>
              <p className="mb-4 text-muted-foreground">
                For over a decade, Addict Hawk has been committed to creating
                exceptional leather goods that stand the test of time. Our
                journey began in a small workshop with a simple vision: to craft
                products that combine traditional techniques with contemporary
                design.
              </p>
              <p className="mb-4 text-muted-foreground">
                Every piece we create tells a story of dedication, skill, and
                attention to detail. We source the finest full-grain leather
                from sustainable tanneries and work with master artisans who
                bring decades of experience to every stitch.
              </p>
              <p className="mb-8 text-muted-foreground">
                Our commitment to quality means that each product is not just an
                accessory, but an investment that will develop its own unique
                character over the years, becoming more beautiful with age.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="group">
                  <a href="https://www.hawkexports.org/" target="_blank">
                    Discover Our Process
                  </a>

                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        onProfileClick={handleViewProfile}
        onLogoClick={handleHomeClick}
        onBagsClick={() => handleCategoryClick("bags")}
        onPursesClick={() => handleCategoryClick("purses")}
        onBeltsClick={() => handleCategoryClick("belts")}
        onHomeClick={handleHomeClick}
        onAboutClick={handleAboutClick}
      />

      {renderContent()}

      <Footer
        onBagsClick={() => handleCategoryClick("bags")}
        onPursesClick={() => handleCategoryClick("purses")}
        onBeltsClick={() => handleCategoryClick("belts")}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onLoginRequired={() => setIsLoginOpen(true)}
        onCheckout={handleViewCheckout}
      />

      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}
