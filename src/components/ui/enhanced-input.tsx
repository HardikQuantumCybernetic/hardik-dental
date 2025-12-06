import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EnhancedInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  success?: boolean;
  showPasswordToggle?: boolean;
  realTimeValidation?: boolean;
  filterInput?: (value: string) => string;
  validateInput?: (value: string) => { isValid: boolean; error?: string };
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    label, 
    error, 
    success, 
    showPasswordToggle = false,
    realTimeValidation = true,
    filterInput,
    validateInput,
    type: originalType = "text",
    onChange,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalError, setInternalError] = React.useState<string>("");
    const [touched, setTouched] = React.useState(false);
    const [type, setType] = React.useState(originalType);

    React.useEffect(() => {
      if (showPasswordToggle && originalType === "password") {
        setType(showPassword ? "text" : "password");
      }
    }, [showPassword, showPasswordToggle, originalType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Apply input filtering
      if (filterInput) {
        value = filterInput(value);
        e.target.value = value;
      }

      // Real-time validation
      if (realTimeValidation && validateInput && touched) {
        const validation = validateInput(value);
        setInternalError(validation.error || "");
      }

      if (onChange) {
        onChange(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      
      if (validateInput) {
        const validation = validateInput(e.target.value);
        setInternalError(validation.error || "");
      }

      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    const displayError = error || internalError;
    const isValid = success || (touched && !displayError && props.value);
    const hasError = touched && displayError;

    const inputClasses = cn(
      "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
      {
        "border-input": !touched,
        "border-success": isValid,
        "border-destructive": hasError,
        "pr-20": showPasswordToggle && isValid,
        "pr-10": (showPasswordToggle && !isValid) || (!showPasswordToggle && isValid)
      },
      className
    );

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-dental-blue font-medium">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            type={type}
            className={inputClasses}
            onChange={handleChange}
            onBlur={handleBlur}
            ref={ref}
            {...props}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {isValid && (
              <CheckCircle className="h-4 w-4 text-success" />
            )}
            {hasError && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            {showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-dental-gray" />
                ) : (
                  <Eye className="h-4 w-4 text-dental-gray" />
                )}
              </Button>
            )}
          </div>
        </div>
        {hasError && (
          <p className="text-sm text-destructive animate-fade-in">
            {displayError}
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };