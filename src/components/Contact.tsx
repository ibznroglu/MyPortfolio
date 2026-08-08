import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { contactSchema, toFieldErrors, type ContactErrors } from '../lib/contactSchema';

type Field = 'name' | 'email' | 'message';
type Status = 'idle' | 'sending' | 'sent' | 'failed';

const EMPTY = { name: '', email: '', message: '', company: '' };

const FIELD_CLASS =
  'w-full rounded-lg border bg-[#0a192f] p-3 text-gray-200 transition-colors placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600/50';

const Contact = () => {
  const { t } = useLanguage();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const messages = t.contact.errors as Record<string, string>;

  const update =
    (field: keyof typeof EMPTY) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));

      // Clear a field's error as soon as the visitor edits it; re-validation
      // happens on submit so they are not nagged mid-typing.
      setErrors((current) =>
        current[field as Field] ? { ...current, [field as Field]: undefined } : current,
      );
    };

  const borderFor = (field: Field) =>
    errors[field]
      ? 'border-red-500/70 focus:border-red-500'
      : 'border-pink-600/30 focus:border-pink-600';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    setFormError(null);

    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setStatus('idle');
      return;
    }

    setErrors({});
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: ContactErrors;
      };

      if (response.ok) {
        setValues(EMPTY);
        setStatus('sent');
        return;
      }

      if (body.fields) setErrors(body.fields);
      setFormError(messages[body.error ?? 'sendFailed'] ?? messages.sendFailed);
      setStatus('failed');
    } catch {
      setFormError(messages.network);
      setStatus('failed');
    }
  };

  return (
    <div className="section-shell w-full bg-gradient-to-b from-[#112240] to-[#0a192f] flex items-center justify-center py-12">
      <div className="mx-auto w-full max-w-2xl px-6 sm:px-8">
        <div className="mb-8 text-center">
          <h2 className="inline border-b-4 border-pink-600 pb-2 text-4xl font-bold text-gray-300">
            {t.contact.title}
          </h2>
          <p className="mt-4 text-gray-400">{t.contact.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-xl border border-white/5 bg-[#112240] p-6 shadow-2xl"
        >
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm text-gray-400">
              {t.contact.name}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={update('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className={`${FIELD_CLASS} ${borderFor('name')}`}
            />
            {errors.name && (
              <p id="contact-name-error" className="mt-1.5 text-sm text-red-400">
                {messages[errors.name]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm text-gray-400">
              {t.contact.email}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={update('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className={`${FIELD_CLASS} ${borderFor('email')}`}
            />
            {errors.email && (
              <p id="contact-email-error" className="mt-1.5 text-sm text-red-400">
                {messages[errors.email]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm text-gray-400">
              {t.contact.message}
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={update('message')}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className={`${FIELD_CLASS} resize-none ${borderFor('message')}`}
            />
            {errors.message && (
              <p id="contact-message-error" className="mt-1.5 text-sm text-red-400">
                {messages[errors.message]}
              </p>
            )}
          </div>

          {/* Honeypot: off-screen, skipped by keyboard, hidden from assistive tech. */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="contact-company">Company</label>
            <input
              id="contact-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.company}
              onChange={update('company')}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-lg bg-pink-600 px-8 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 disabled:cursor-not-allowed disabled:bg-pink-600/50"
          >
            {status === 'sending' ? t.contact.sending : t.contact.send}
          </button>

          <div aria-live="polite" className="min-h-[1.5rem]">
            {status === 'sent' && <p className="text-sm text-green-400">{t.contact.success}</p>}
            {status === 'failed' && formError && (
              <p className="text-sm text-red-400">{formError}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
