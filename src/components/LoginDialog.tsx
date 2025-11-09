// src/components/LoginDialog.tsx

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
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);
  const [signupPhone, setSignupPhone] = useState("");
  const [signupOccupation, setSignupOccupation] = useState("");
  const [signupAddress, setSignupAddress] = useState("");
  const [signupCity, setSignupCity] = useState("");
  const [signupState, setSignupState] = useState("");
  const [signupPincode, setSignupPincode] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      onClose();
      // Reset form
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      // Error toast already shown in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !signupName ||
      !signupEmail ||
      !signupPassword ||
      !signupPhone ||
      !signupOccupation ||
      !signupAddress ||
      !signupCity ||
      !signupState ||
      !signupPincode
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signup(
        signupName,
        signupEmail,
        signupPassword,
        signupPhone,
        signupOccupation,
        signupAddress,
        signupCity,
        signupState,
        signupPincode
      );
      onClose();
      // Reset form
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
      setSignupPhone("");
      setSignupOccupation("");
      setSignupAddress("");
      setSignupCity("");
      setSignupState("");
      setSignupPincode("");
    } catch (error) {
      // Error toast already shown in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* Constrain dialog to a professional rectangle and allow scrolling for long signup */}
        <DialogContent className="!w-[min(900px,95vw)] !max-w-[900px] max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Welcome to Addict Hawk</DialogTitle>
            <DialogDescription>
              Login to your account or create a new one to continue
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      aria-label={
                        showLoginPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowLoginPassword((s) => !s)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 h-auto"
                    onClick={() => {
                      onClose();
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-occupation">Occupation</Label>
                    <Input
                      id="signup-occupation"
                      type="text"
                      placeholder="Enter your occupation"
                      value={signupOccupation}
                      onChange={(e) => setSignupOccupation(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="signup-address">Street Address</Label>
                    <Input
                      id="signup-address"
                      type="text"
                      placeholder="Enter your street address"
                      value={signupAddress}
                      onChange={(e) => setSignupAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-city">City</Label>
                    <Input
                      id="signup-city"
                      type="text"
                      placeholder="City"
                      value={signupCity}
                      onChange={(e) => setSignupCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-state">State</Label>
                    <Input
                      id="signup-state"
                      type="text"
                      placeholder="State"
                      value={signupState}
                      onChange={(e) => setSignupState(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-pincode">Pincode</Label>
                    <Input
                      id="signup-pincode"
                      type="text"
                      placeholder="Enter pincode"
                      value={signupPincode}
                      onChange={(e) => setSignupPincode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="Create a password (min 6 characters)"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        aria-label={
                          showSignupPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowSignupPassword((s) => !s)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showSignupConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signupConfirmPassword}
                        onChange={(e) =>
                          setSignupConfirmPassword(e.target.value)
                        }
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        aria-label={
                          showSignupConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() => setShowSignupConfirmPassword((s) => !s)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                      >
                        {showSignupConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action button placed after all fields */}
                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="w-[320px] md:w-1/2 lg:w-1/3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ForgotPasswordDialog
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
}
