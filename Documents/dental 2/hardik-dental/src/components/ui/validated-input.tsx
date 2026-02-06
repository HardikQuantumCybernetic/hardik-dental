import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useInputValidation, ValidationRules } from "@/hooks/useInputValidation";

export interface ValidatedInputProps extends Omit<React.ComponentProps<"input">, 'onChange' | 'onBlur'> {
  label?: string;
  validation: ValidationRules;
  onValueChange?: (value: string, isValid: boolean) => void;
  showValidationIcons?: boolean;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ className, label, validation, onValueChange, showValidationIcons = true, ...props }, ref) => {
    const {
      value,
      error,
      touched,
      isValid,
      hasError,
      handleChange,
      handleBlur
    } = useInputValidation(validation);

    React.useEffect(() => {
      if (onValueChange) {
        onValueChange(value, isValid && touched);
      }
    }, [value, isValid, touched, onValueChange]);

    const inputClasses = cn(
      "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
      {
        "border-input": !touched,
        "border-success": isValid && touched,
        "border-destructive": hasError,
        "pr-10": showValidationIcons && touched
      },
      className
    );

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-dental-blue font-medium">
            {label}
            {validation.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            className={inputClasses}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            ref={ref}
            {...props}
          />
          {showValidationIcons && touched && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValid ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : hasError ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : null}
            </div>
          )}
        </div>
        {hasError && (
          <p className="text-sm text-destructive animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";

export { ValidatedInput };