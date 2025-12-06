import { SignUp } from "@clerk/clerk-react";

const ClerkSignUpForm = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light flex items-center justify-center p-4">
      <SignUp 
        routing="virtual"
        signInUrl="/login"
        forceRedirectUrl="/patient-dashboard"
      />
    </div>
  );
};

export default ClerkSignUpForm;
