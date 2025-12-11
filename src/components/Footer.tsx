import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface FooterProps {
  onBagsClick?: () => void;
  onPursesClick?: () => void;
  onBeltsClick?: () => void;
}

export function Footer({
  onBagsClick,
  onPursesClick,
  onBeltsClick,
}: FooterProps) {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-primary-foreground">HAWK EXPORTS</h3>
            <p className="text-primary-foreground/80">
              Crafting timeless leather goods since 1999. Quality, durability,
              and elegance in every stitch.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-primary-foreground">Shop</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onBagsClick}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Bags
                </button>
              </li>
              <li>
                <button
                  onClick={onPursesClick}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Purses
                </button>
              </li>
              <li>
                <button
                  onClick={onBeltsClick}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Belts
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-primary-foreground">Connect</h4>

            {/* Contact rows: address / phone / email */}
            <div className="mt-4 space-y-3 text-primary-foreground/80">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-primary-foreground/80" />
                <div className="text-sm">
                  74-C Leather Complex, Jalandhar-144021
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 text-primary-foreground/80" />
                <div className="text-sm">+919872664468</div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-primary-foreground/80" />
                <div className="text-sm">addicthawk9@gmail.com</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © {new Date().getFullYear()} Hawk Exports. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
