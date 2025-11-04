import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'email' | 'otp' | 'password';

export function ForgotPasswordDialog({ isOpen, onClose }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && step === 'otp' && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog is closed
      setStep('email');
      setEmail('');
      setOtp(['', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('OTP sent to your email');
      setStep('otp');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
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

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
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

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      toast.error('Please enter all 4 digits');
      return;
    }

    setIsLoading(true);

    try {
      // Mock verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('OTP verified successfully');
      setStep('password');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password reset successfully! You can now login with your new password.');
      onClose();
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('OTP has been resent to your email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('email');
      setOtp(['', '', '', '']);
    } else if (step === 'password') {
      setStep('otp');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'password' && 'Reset Password'}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' && 'Enter your email to receive a verification code'}
            {step === 'otp' && `We've sent a 4-digit code to ${email}`}
            {step === 'password' && 'Enter your new password'}
          </DialogDescription>
        </DialogHeader>

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <div className="space-y-6 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

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
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    onPaste={handleOTPPaste}
                    className="w-14 h-14 text-center text-2xl border-2 border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background"
                    disabled={isLoading}
                  />
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full" 
                disabled={isLoading || otp.join('').length !== 4}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  Didn't receive the code? <span className="underline">Resend OTP</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Step */}
        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              type="button"
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
