import {
  Menu,
  Search,
  ShoppingBag,
  X,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onCartClick: () => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  onBagsClick?: () => void;
  onPursesClick?: () => void;
  onBeltsClick?: () => void;
  onHomeClick?: () => void;
  onAboutClick?: () => void;
}

export function Header({
  onCartClick,
  onLoginClick,
  onProfileClick,
  onLogoClick,
  onBagsClick,
  onPursesClick,
  onBeltsClick,
  onHomeClick,
  onAboutClick,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    onLogoClick(); // Navigate to home page
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={onLogoClick}>
            <h1 className="tracking-tight">HAWK EXPORTS</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={onHomeClick}
              className="text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={onBagsClick}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Bags
            </button>
            <button
              onClick={onPursesClick}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Purses
            </button>
            <button
              onClick={onBeltsClick}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Belts
            </button>
            <button
              onClick={onAboutClick}
              className="text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all hover:scale-105">
                    <span className="text-sm">
                      {user?.userName?.charAt(0) || "U"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm">{user?.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.userEmail}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onProfileClick}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                onClick={onLoginClick}
                className="hover:scale-105 transition-transform"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <button
              onClick={() => {
                onHomeClick?.();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => {
                onBagsClick?.();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-foreground hover:text-muted-foreground transition-colors"
            >
              Bags
            </button>
            <button
              onClick={() => {
                onPursesClick?.();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-foreground hover:text-muted-foreground transition-colors"
            >
              Purses
            </button>
            <button
              onClick={() => {
                onBeltsClick?.();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-foreground hover:text-muted-foreground transition-colors"
            >
              Belts
            </button>
            <button
              onClick={() => {
                onAboutClick?.();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
            >
              About
            </button>
            <div className="flex items-center space-x-4 pt-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={onCartClick}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onProfileClick}
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                  >
                    <span className="text-sm">
                      {user?.userName?.charAt(0) || "U"}
                    </span>
                  </button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" onClick={onLoginClick}>
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
