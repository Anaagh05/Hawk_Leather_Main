// src/components/ForgotPasswordDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { OTPVerification } from "./OTPVerification";
import {
  requestForgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
} from "../services/api";

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "email" | "otp" | "reset" | "success";

export function ForgotPasswordDialog({
  isOpen,
  onClose,
}: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      await requestForgotPassword(email);
      toast.success("OTP sent to your email");
      setShowOTPDialog(true);
      setStep("otp");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true);
    try {
      const response = await verifyForgotPasswordOTP(email, parseInt(otp));
      setResetToken(response.data.resetToken);
      setShowOTPDialog(false);
      setStep("reset");
      toast.success("OTP verified successfully");
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setStep("success");
      toast.success("Password reset successfully!");

      // Auto close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOTPDialog(false);
    onClose();
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("email");
      setShowOTPDialog(false);
    } else if (step === "reset") {
      setStep("otp");
      setShowOTPDialog(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen && !showOTPDialog} onOpenChange={handleClose}>
        {/* Slightly larger, professional rectangle with comfortable padding; responsive and scrollable */}
        <DialogContent className="!w-[min(820px,92vw)] !max-w-[820px] max-h-[88vh] overflow-auto p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {(step === "otp" || step === "reset") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              Forgot Password
            </DialogTitle>
            <DialogDescription>
              {step === "email" &&
                "Enter your email to receive a password reset OTP"}
              {step === "reset" && "Enter your new password"}
              {step === "success" &&
                "Your password has been reset successfully"}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleEmailSubmit}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </motion.form>
            )}

            {step === "reset" && (
              <motion.form
                key="reset"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePasswordReset}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowNewPassword((s) => !s)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </motion.form>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Password Reset Successful!
                </h3>
                <p className="text-muted-foreground">
                  You can now login with your new password
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <OTPVerification
        isOpen={showOTPDialog}
        onClose={() => {
          setShowOTPDialog(false);
          setStep("email");
        }}
        onVerify={handleOTPVerify}
        email={email}
      />
    </>
  );
}
