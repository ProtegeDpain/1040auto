import { ValidationError as YupValidationError } from 'yup';
import { ZodError } from 'zod';

export interface FormattedError {
  field: string;
  message: string;
}

export const formatYupValidationError = (error: YupValidationError): FormattedError[] => {
  if (!error.inner || error.inner.length === 0) {
    return [{
      field: 'form',
      message: error.message || 'Invalid input provided'
    }];
  }

  return error.inner.map(err => ({
    field: err.path || 'unknown',
    message: err.message || 'Invalid input provided'
  }));
};

export const formatZodValidationError = (error: ZodError): FormattedError[] => {
  return error.errors.map(err => ({
    field: err.path.join('.') || 'unknown',
    message: err.message
  }));
};

export const validateForm = async <T>(
  schema: any,
  data: T
): Promise<{ isValid: boolean; errors?: FormattedError[] }> => {
  try {    if (typeof schema.validate === 'function') {
      await schema.validate(data, { abortEarly: false }); // Yup validation
    } else {
      await schema.parseAsync(data); // Zod validation
    }
    return { isValid: true };
  } catch (error) {
    if (error instanceof YupValidationError) {
      return {
        isValid: false,
        errors: formatYupValidationError(error)
      };
    }
    if (error instanceof ZodError) {
      return {
        isValid: false,
        errors: formatZodValidationError(error)
      };
    }
    return {
      isValid: false,
      errors: [{
        field: 'form',
        message: 'An unexpected error occurred during validation'
      }]
    };
  }
};
