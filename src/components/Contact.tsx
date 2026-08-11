import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import TurnstileWidget from './TurnstileWidget';
import { settings } from '../helpers/functions/settings';
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

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';

const FIELD_CLASS =
  'w-full rounded-lg border bg-surface p-3 text-heading transition-colors placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50';

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
      : 'border-accent/30 focus:border-accent';

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
    over ? 'text-red-400' : count > max * 0.9 ? 'text-amber-400' : 'text-muted';

  return (
    <div className="section-shell flex w-full items-center justify-center bg-gradient-to-b from-raised to-surface py-6">
      <div className="mx-auto w-full max-w-2xl px-6 sm:px-8">
        <div className="mb-5 text-center">
          <h2 className="inline border-b-4 border-accent pb-2 text-3xl font-bold text-body sm:text-4xl">
            {t.contact.title}
          </h2>
          <p className="mt-4 text-sm text-body">
            {t.contact.subtitle}{' '}
            <a
              href={`mailto:${settings.email}`}
              className={`rounded text-body underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent-soft ${FOCUS_RING}`}
            >
              {settings.email}
            </a>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-3 rounded-xl border border-hairline/5 bg-raised p-4 shadow-2xl sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-4">
                <label htmlFor="contact-name" className="text-sm text-body">
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
              <label htmlFor="contact-email" className="mb-1.5 block text-sm text-body">
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
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm text-body">
              {t.contact.message}
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={3}
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
                className="rounded-md border border-hairline/25 px-3 py-1.5 text-body transition-colors hover:border-accent-soft hover:text-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
              >
                {t.contact.retry}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || awaitingHuman || widgetBroken}
            className="w-full rounded-lg bg-accent px-8 py-2.5 font-semibold text-white shadow-lg transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft disabled:cursor-not-allowed disabled:bg-accent/50"
          >
            {status === 'sending' ? t.contact.sending : t.contact.send}
          </button>

          <div aria-live="polite" className="min-h-[1.25rem]">
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
