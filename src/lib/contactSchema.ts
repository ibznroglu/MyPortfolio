import { z } from 'zod';
// Shared with the form so the counter and the rule can never disagree.
export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 500;
// One schema, two consumers: the form uses it for instant feedback, the API
// route uses it as the actual gate. Client-side validation is a convenience,
// never a security boundary.
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'nameTooShort').max(80, 'nameTooLong'),
  email: z.string().trim().email('emailInvalid').max(200, 'emailTooLong'),
  message: z.string().trim().min(MESSAGE_MIN, 'messageTooShort').max(MESSAGE_MAX, 'messageTooLong'),
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
