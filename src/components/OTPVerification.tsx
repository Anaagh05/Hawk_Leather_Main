// src/components/OTPVerification.tsx

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface OTPVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  email: string;
}

export function OTPVerification({
  isOpen,
  onClose,
  onVerify,
  email,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d{4}$/.test(pastedData)) {
      toast.error("Please paste a 4-digit OTP");
      return;
    }

    const digits = pastedData.split("");
    setOtp(digits);
    inputRefs.current[3]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(otpString);
      // Reset OTP on success
      setOtp(["", "", "", ""]);
    } catch (error) {
      // Error already handled in parent
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Constrain OTP modal and center; allow scrolling if needed */}
      <DialogContent className="w-[min(640px,90vw)] max-h-[70vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogDescription>
            We've sent a 4-digit code to {email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-semibold rounded-lg bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </motion.div>
            ))}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full"
            disabled={isLoading || otp.join("").length !== 4}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
