import { z } from 'zod';

// One schema, two consumers: the form uses it for instant feedback, the API
// route uses it as the actual gate. Client-side validation is a convenience,
// never a security boundary.
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'nameTooShort').max(80, 'nameTooLong'),
  email: z.string().trim().email('emailInvalid').max(200, 'emailTooLong'),
  message: z.string().trim().min(20, 'messageTooShort').max(3000, 'messageTooLong'),
  // Honeypot: hidden from humans, irresistible to naive bots.
  company: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldError =
  | 'nameTooShort'
  | 'nameTooLong'
  | 'emailInvalid'
  | 'emailTooLong'
  | 'messageTooShort'
  | 'messageTooLong';

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', ContactFieldError>>;

/** Flattens a Zod failure into one message code per field. */
export const toFieldErrors = (error: z.ZodError): ContactErrors => {
  const errors: ContactErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === 'name' || field === 'email' || field === 'message') {
      errors[field] ??= issue.message as ContactFieldError;
    }
  }

  return errors;
};
