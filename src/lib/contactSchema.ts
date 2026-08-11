import { z } from 'zod';
// Shared with the form so the counter and the rule can never disagree.
export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 500;
// One schema, two consumers: the form uses it for instant feedback, the API
// route uses it as the actual gate. Client-side validation is a convenience,
// never a security boundary.
export const contactSchema = z.object({
  name: z.string().trim().min(NAME_MIN, 'nameTooShort').max(NAME_MAX, 'nameTooLong'),
  email: z.string().trim().email('emailInvalid').max(200, 'emailTooLong'),
  message: z.string().trim().min(MESSAGE_MIN, 'messageTooShort').max(MESSAGE_MAX, 'messageTooLong'),
  // Verified server side against Cloudflare, so the shape is all we check here.
  turnstileToken: z.string().optional(),
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

export type ContactField = 'name' | 'email' | 'message';

export type ContactErrors = Partial<Record<ContactField, ContactFieldError>>;

/**
 * Validates one field on its own. Used while the visitor is typing, so a
 * mistake in the email does not light up the message box as well.
 */
export const validateField = (
  field: ContactField,
  value: string,
): ContactFieldError | undefined => {
  const result = contactSchema.shape[field].safeParse(value);
  return result.success ? undefined : (result.error.issues[0]?.message as ContactFieldError);
};

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
