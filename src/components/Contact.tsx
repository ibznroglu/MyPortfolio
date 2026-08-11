import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import TurnstileWidget from './TurnstileWidget';
import {
  MESSAGE_MAX,
  NAME_MAX,
  contactSchema,
  toFieldErrors,
  validateField,
  type ContactErrors,
  type ContactField,
} from '../lib/contactSchema';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

const EMPTY = { name: '', email: '', message: '', company: '' };

// Absent in local development, where the API falls back to its other guards.
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const FIELD_CLASS =
  'w-full rounded-lg border bg-[#0a192f] p-3 text-gray-200 transition-colors placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600/50';

const Contact = () => {
  const { t } = useLanguage();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  // A field only starts showing errors once the visitor has left it. Validating
  // from the first keystroke would flag every email as invalid while it is typed.
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [widgetBroken, setWidgetBroken] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);

  const messages = t.contact.errors as Record<string, string>;

  const update =
    (field: keyof typeof EMPTY) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));

      if (field === 'company') return;

      // Once a field has been touched its error updates live, so the visitor
      // sees the message clear the moment they fix it.
      if (touched[field as ContactField]) {
        setErrors((current) => ({
          ...current,
          [field as ContactField]: validateField(field as ContactField, value),
        }));
      }
    };

  const handleBlur =
    (field: ContactField) => (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched((current) => ({ ...current, [field]: true }));
      setErrors((current) => ({ ...current, [field]: validateField(field, event.target.value) }));
    };

  const borderFor = (field: ContactField) =>
    errors[field]
      ? 'border-red-500/70 focus:border-red-500'
      : 'border-pink-600/30 focus:border-pink-600';

  const describedBy = (field: ContactField, extra?: string) =>
    [errors[field] ? `contact-${field}-error` : null, extra].filter(Boolean).join(' ') || undefined;

  // Tokens are single use, so every attempt needs a fresh widget.
  const renewChallenge = () => {
    setToken(null);
    setWidgetKey((current) => current + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    setFormError(null);
    setTouched({ name: true, email: true, message: true });

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
        body: JSON.stringify({ ...parsed.data, turnstileToken: token }),
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: ContactErrors;
      };

      renewChallenge();

      if (response.ok) {
        setValues(EMPTY);
        setTouched({});
        setStatus('sent');
        return;
      }

      if (body.fields) setErrors(body.fields);
      setFormError(messages[body.error ?? 'sendFailed'] ?? messages.sendFailed);
      setStatus('failed');
    } catch {
      renewChallenge();
      setFormError(messages.network);
      setStatus('failed');
    }
  };

  const nameCount = values.name.length;
  const messageCount = values.message.length;
  const nameOver = nameCount > NAME_MAX;
  const messageOver = messageCount > MESSAGE_MAX;

  const awaitingHuman = Boolean(SITE_KEY) && !widgetBroken && !token;
  const counterTone = (over: boolean, count: number, max: number) =>
    over ? 'text-red-400' : count > max * 0.9 ? 'text-amber-400' : 'text-gray-500';

  return (
    <div className="section-shell flex w-full items-center justify-center bg-gradient-to-b from-[#112240] to-[#0a192f] py-12">
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
            <div className="mb-1.5 flex items-baseline justify-between gap-4">
              <label htmlFor="contact-name" className="text-sm text-gray-400">
                {t.contact.name}
              </label>
              {nameCount > NAME_MAX * 0.75 && (
                <span
                  className={`text-xs tabular-nums ${counterTone(nameOver, nameCount, NAME_MAX)}`}
                  aria-hidden="true"
                >
                  {nameCount} / {NAME_MAX}
                </span>
              )}
            </div>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={update('name')}
              onBlur={handleBlur('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy('name')}
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
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              value={values.email}
              onChange={update('email')}
              onBlur={handleBlur('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy('email')}
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
              onBlur={handleBlur('message')}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy('message', 'contact-message-count')}
              className={`${FIELD_CLASS} resize-none ${borderFor('message')}`}
            />
            <div className="mt-1.5 flex items-start justify-between gap-4">
              {errors.message ? (
                <p id="contact-message-error" className="text-sm text-red-400">
                  {messages[errors.message]}
                </p>
              ) : (
                <span />
              )}
              <span
                id="contact-message-count"
                className={`shrink-0 text-xs tabular-nums ${counterTone(messageOver, messageCount, MESSAGE_MAX)}`}
              >
                {messageCount} / {MESSAGE_MAX}
              </span>
            </div>
          </div>

          {/* Honeypot: off-screen, skipped by keyboard, hidden from assistive tech.
              The name is deliberately meaningless so browser autofill leaves it
              alone; a plausible one like "company" gets filled by Chrome. */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <input
              id="contact-reference-code"
              name="reference_code"
              type="text"
              tabIndex={-1}
              autoComplete="new-password"
              value={values.company}
              onChange={update('company')}
            />
          </div>

          {SITE_KEY && !widgetBroken && (
            <TurnstileWidget
              siteKey={SITE_KEY}
              resetKey={widgetKey}
              onVerify={setToken}
              onExpire={() => setToken(null)}
              onError={() => {
                setToken(null);
                setWidgetBroken(true);
              }}
            />
          )}

          {widgetBroken && (
            <div className="space-y-2 text-sm">
              <p className="text-amber-400">{messages.humanCheckUnavailable}</p>
              <button
                type="button"
                onClick={() => {
                  setWidgetBroken(false);
                  renewChallenge();
                }}
                className="rounded-md border border-gray-600 px-3 py-1.5 text-gray-300 transition-colors hover:border-pink-500 hover:text-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
              >
                {t.contact.retry}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || awaitingHuman || widgetBroken}
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
