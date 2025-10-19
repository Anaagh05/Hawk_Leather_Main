import { Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";
export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-primary-foreground">HAWK EXPORTS</h3>
            <p className="text-primary-foreground/80">
              Crafting timeless leather goods since 1999. Quality, durability, and elegance in every stitch.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-primary-foreground">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a href="#bags" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Bags
                </a>
              </li>
              <li>
                <a href="#purses" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Purses
                </a>
              </li>
              <li>
                <a href="#belts" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Belts
                </a>
              </li>
              <li>
                <a href="#new" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-primary-foreground">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#careers" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#sustainability" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-primary-foreground">Connect</h4>
            <p className="text-primary-foreground/80">
              Follow us on social media for updates and inspiration.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2025 Addict Hawk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
