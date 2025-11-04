import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface OTPVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  email: string;
}

export function OTPVerification({ isOpen, onClose, onVerify, email }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    while (newOtp.length < 4) {
      newOtp.push('');
    }
    setOtp(newOtp.slice(0, 4));

    // Focus on the last filled input or first empty
    const lastFilledIndex = Math.min(pastedData.length - 1, 3);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      toast.error('Please enter all 4 digits');
      return;
    }

    setIsLoading(true);

    try {
      // Mock verification - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 4-digit code
      toast.success('Account verified successfully!');
      onVerify();
      setOtp(['', '', '', '']);
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('OTP has been resent to your email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Account</DialogTitle>
          <DialogDescription>
            We've sent a 4-digit verification code to {email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl border-2 border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background"
                  disabled={isLoading}
                />
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleVerify} 
              className="w-full" 
              disabled={isLoading || otp.join('').length !== 4}
            >
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                Didn't receive the code? <span className="underline">Resend OTP</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
