// Input validation utilities
export const validateName = (value: string): { isValid: boolean; error?: string } => {
  if (!value.trim()) return { isValid: false, error: 'Name is required' };
  if (!/^[A-Za-z\s]+$/.test(value)) {
    return { isValid: false, error: 'Please enter only letters and spaces for the name' };
  }
  return { isValid: true };
};

export const validateNumber = (value: string): { isValid: boolean; error?: string } => {
  if (!value.trim()) return { isValid: false, error: 'Number is required' };
  if (!/^[0-9]+$/.test(value)) {
    return { isValid: false, error: 'Please enter only numbers' };
  }
  return { isValid: true };
};

export const validateEmail = (value: string): { isValid: boolean; error?: string } => {
  if (!value.trim()) return { isValid: false, error: 'Email is required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

export const validatePhone = (value: string): { isValid: boolean; error?: string } => {
  if (!value.trim()) return { isValid: false, error: 'Phone number is required' };
  const cleanPhone = value.replace(/[\s\-\(\)\+]/g, '');
  if (!/^[0-9]{10,15}$/.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  return { isValid: true };
};

// Real-time input filtering
export const filterNameInput = (value: string): string => {
  return value.replace(/[^A-Za-z\s]/g, '');
};

export const filterNumberInput = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

export const filterPhoneInput = (value: string): string => {
  return value.replace(/[^0-9\s\-\(\)\+]/g, '');
};