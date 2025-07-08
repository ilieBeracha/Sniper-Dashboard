// Core validation utilities
export const isNotEmpty = (value: string) => {
  return value !== null && value !== undefined && value.trim() !== "";
};

export const isNotEmptyArray = (value: any[]) => {
  return Array.isArray(value) && value.length > 0;
};

export const isNotEmptyObject = (value: any) => {
  return value !== null && value !== undefined && Object.keys(value).length > 0;
};

export const isNotEmptyDate = (value: string) => {
  return value !== null && value !== undefined && value.trim() !== "";
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string) => {
  return password.length >= 8;
};

export const isValidName = (name: string) => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const isValidDate = (date: string) => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime()) && dateObj > new Date();
};

export const isValidLength = (value: string, min: number, max: number) => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

// Form-specific validation functions
export const validateAuthForm = (formData: any) => {
  const { email, password, firstName, lastName } = formData;

  if (!isNotEmpty(email)) {
    return "Email is required";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address";
  }

  if (!isNotEmpty(password)) {
    return "Password is required";
  }

  if (!isValidPassword(password)) {
    return "Password must be at least 8 characters long";
  }

  if (firstName !== undefined && !isValidName(firstName)) {
    return "First name must be between 2 and 50 characters";
  }

  if (lastName !== undefined && !isValidName(lastName)) {
    return "Last name must be between 2 and 50 characters";
  }

  return null;
};

export const validateTrainingForm = (formData: any) => {
  const { session_name, location, date, assignmentIds } = formData;

  if (!isNotEmpty(session_name)) {
    return "Session name is required";
  }

  if (!isValidLength(session_name, 3, 100)) {
    return "Session name must be between 3 and 100 characters";
  }

  if (!isNotEmpty(location)) {
    return "Location is required";
  }

  if (!isValidLength(location, 2, 100)) {
    return "Location must be between 2 and 100 characters";
  }

  if (!isNotEmptyDate(date)) {
    return "Date is required";
  }

  if (!isValidDate(date)) {
    return "Please select a future date";
  }

  if (!isNotEmptyArray(assignmentIds)) {
    return "At least one assignment must be selected";
  }

  return null;
};

export const validateAssignmentForm = (formData: any) => {
  const { assignmentName } = formData;

  if (!isNotEmpty(assignmentName)) {
    return "Assignment name is required";
  }

  if (!isValidLength(assignmentName, 3, 100)) {
    return "Assignment name must be between 3 and 100 characters";
  }

  return null;
};

export const validateAiForm = (formData: any) => {
  const { prompt } = formData;

  if (!isNotEmpty(prompt)) {
    return "Prompt is required";
  }

  if (!isValidLength(prompt, 10, 1000)) {
    return "Prompt must be between 10 and 1000 characters";
  }

  return null;
};

// Generic form validation (legacy support)
export const genericFormValidation = (formData: any) => {
  return validateTrainingForm(formData);
};

export const validateForm = (formData: any) => {
  const errors = genericFormValidation(formData);
  if (errors) {
    return errors;
  }
  return null;
};
