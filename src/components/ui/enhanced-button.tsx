import React, { memo, forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends Omit<ButtonProps, 'variant'> {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: ButtonProps['variant'] | 'gradient';
}

const EnhancedButton = memo(forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    loading = false, 
    loadingText = 'Loading...', 
    icon, 
    children, 
    disabled, 
    className,
    fullWidth,
    variant = 'default',
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    const variantClasses = {
      dental: 'bg-gradient-to-r from-dental-blue to-dental-mint hover:from-dental-blue/90 hover:to-dental-mint/90 text-white shadow-dental-button',
      gradient: 'bg-gradient-to-r from-dental-blue via-dental-mint to-dental-blue bg-[length:200%_100%] hover:bg-[position:100%_0] text-white shadow-dental-button transition-all duration-500',
    };

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'relative transition-all duration-300 transform hover:scale-105 active:scale-95',
          fullWidth && 'w-full',
          variant === 'dental' && variantClasses.dental,
          variant === 'gradient' && variantClasses.gradient,
          loading && 'cursor-not-allowed opacity-80',
          className
        )}
        variant={variant === 'dental' || variant === 'gradient' ? 'default' : variant}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{loadingText}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
          </div>
        )}
      </Button>
    );
  }
));

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;