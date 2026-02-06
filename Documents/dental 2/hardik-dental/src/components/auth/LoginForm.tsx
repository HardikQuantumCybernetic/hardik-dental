import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, EyeOff, User, Mail, Phone, Github, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface LoginFormProps {
  onLogin?: (user: any) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: ""
  });


  // Reset password state
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      if (onLogin) {
        onLogin(data.user);
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupData.fullName,
            phone: signupData.phone,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });

      setActiveTab("login");
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });

      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'linkedin_oidc' | 'google') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Redirecting...",
        description: `Redirecting to ${provider === 'github' ? 'GitHub' : provider === 'linkedin_oidc' ? 'LinkedIn' : 'Google'} for authentication.`,
      });

    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-dental-blue-light shadow-dental-card">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground font-inter">
            Patient Portal
          </CardTitle>
          <p className="text-dental-gray">
            Access your dental records and appointments
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-dental-gray font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-dental-gray" />
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="pl-10 border-dental-blue-light focus:border-dental-blue"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-dental-gray font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      placeholder="Enter your password"
                      className="pr-10 border-dental-blue-light focus:border-dental-blue"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-dental-gray" />
                      ) : (
                        <Eye className="h-4 w-4 text-dental-gray" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-dental-blue p-0 h-auto"
                    onClick={() => setActiveTab("reset")}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant="dental"
                  size="lg"
                  className="w-full font-inter"
                  disabled={isLoading || !loginData.email || !loginData.password}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-dental-gray">Or continue with</span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="w-full border-dental-blue-light hover:bg-dental-blue-light"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('github')}
                      disabled={isLoading}
                      className="w-full border-dental-blue-light hover:bg-dental-blue-light"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('linkedin_oidc')}
                      disabled={isLoading}
                      className="w-full border-dental-blue-light hover:bg-dental-blue-light"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>


            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-dental-gray font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-dental-gray" />
                    <Input
                      id="fullName"
                      type="text"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                      placeholder="Enter your full name"
                      className="pl-10 border-dental-blue-light focus:border-dental-blue"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-dental-gray font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-dental-gray" />
                    <Input
                      id="signupEmail"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="pl-10 border-dental-blue-light focus:border-dental-blue"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-dental-gray font-medium">
                    Phone Number
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dental-blue-light bg-muted text-muted-foreground text-sm">
                      <Phone className="h-4 w-4 mr-1" />+91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      value={signupData.phone.replace(/^\+91/, '')}
                      onChange={(e) => setSignupData({...signupData, phone: `+91${e.target.value.replace(/^\+91/, '')}`})}
                      placeholder="9876543210"
                      className="border-dental-blue-light focus:border-dental-blue rounded-l-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-dental-gray font-medium">
                    Password
                  </Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    placeholder="Create a password"
                    className="border-dental-blue-light focus:border-dental-blue"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-dental-gray font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    className="border-dental-blue-light focus:border-dental-blue"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="dental"
                  size="lg"
                  className="w-full font-inter"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="reset" className="space-y-4 mt-6">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-dental-gray font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-dental-gray" />
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 border-dental-blue-light focus:border-dental-blue"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="dental"
                  size="lg"
                  className="w-full font-inter"
                  disabled={isLoading || !resetEmail}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Reset Email"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setActiveTab("login")}
                >
                  Back to Login
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-xs text-dental-gray">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            <Link to="/" className="text-dental-blue hover:underline text-sm mt-2 block">
              ← Back to Website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;