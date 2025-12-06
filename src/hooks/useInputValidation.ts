import { useState, useCallback } from 'react';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationRules {
  type: 'name' | 'number' | 'email' | 'phone' | 'text';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  customPattern?: RegExp;
  customMessage?: string;
}

export const useInputValidation = (rules: ValidationRules) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const validateValue = useCallback((inputValue: string): ValidationResult => {
    // Required field validation
    if (rules.required && !inputValue.trim()) {
      return { isValid: false, error: 'This field is required' };
    }

    // Skip validation if field is empty and not required
    if (!inputValue.trim() && !rules.required) {
      return { isValid: true };
    }

    // Length validation
    if (rules.minLength && inputValue.length < rules.minLength) {
      return { isValid: false, error: `Minimum ${rules.minLength} characters required` };
    }

    if (rules.maxLength && inputValue.length > rules.maxLength) {
      return { isValid: false, error: `Maximum ${rules.maxLength} characters allowed` };
    }

    // Type-specific validation
    switch (rules.type) {
      case 'name':
        const namePattern = /^[A-Za-z\s]+$/;
        if (!namePattern.test(inputValue)) {
          return { isValid: false, error: 'Please enter only letters and spaces for the name' };
        }
        break;

      case 'number':
        const numberPattern = /^[0-9]+$/;
        if (!numberPattern.test(inputValue)) {
          return { isValid: false, error: 'Please enter only numbers' };
        }
        break;

      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(inputValue)) {
          return { isValid: false, error: 'Please enter a valid email address' };
        }
        break;

      case 'phone':
        const phonePattern = /^[\d\s\-\(\)\+]+$/;
        if (!phonePattern.test(inputValue)) {
          return { isValid: false, error: 'Please enter a valid phone number' };
        }
        break;

      case 'text':
        // Basic text validation - no special restrictions
        break;
    }

    // Custom pattern validation
    if (rules.customPattern && !rules.customPattern.test(inputValue)) {
      return { isValid: false, error: rules.customMessage || 'Invalid input format' };
    }

    return { isValid: true };
  }, [rules]);

  const handleChange = useCallback((inputValue: string) => {
    setValue(inputValue);
    if (touched) {
      const validation = validateValue(inputValue);
      setError(validation.error || '');
    }
  }, [touched, validateValue]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    const validation = validateValue(value);
    setError(validation.error || '');
  }, [value, validateValue]);

  const reset = useCallback(() => {
    setValue('');
    setError('');
    setTouched(false);
  }, []);

  const validate = useCallback(() => {
    setTouched(true);
    const validation = validateValue(value);
    setError(validation.error || '');
    return validation.isValid;
  }, [value, validateValue]);

  const isValid = !error && touched;
  const hasError = error && touched;

  return {
    value,
    error,
    touched,
    isValid,
    hasError,
    handleChange,
    handleBlur,
    reset,
    validate,
    setValue
  };
};