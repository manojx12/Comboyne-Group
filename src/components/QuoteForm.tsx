/**
 * Quote request form.
 *
 * Two modes, chosen at build time:
 *
 * 1. PREVIEW (default: no PUBLIC_QUOTE_ENDPOINT set)
 *    Nothing is transmitted by the website. After client-side validation the
 *    visitor is offered a pre-filled email (mailto:) to the orders inbox and a
 *    copyable summary. The page never says an enquiry was "received".
 *
 * 2. ENDPOINT (PUBLIC_QUOTE_ENDPOINT=https://...)
 *    The form POSTs multipart FormData to that endpoint and shows success only
 *    when the server replies 2xx with JSON { ok: true }. See docs/INTEGRATIONS.md.
 */
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type SyntheticEvent } from 'react';
import Icon from './Icon';
import { company, locations, services, telHref, mailHref } from '../data/site';
import { QUOTE_ENDPOINT } from '../config';
import { cx } from '../lib/cx';
import './QuoteForm.css';

type FieldName = 'name' | 'email' | 'phone' | 'pickup' | 'delivery' | 'services' | 'scope' | 'date' | 'files';
type ResultKind = 'preview' | 'success' | 'error';

const endpoint = QUOTE_ENDPOINT;
const previewMode = !endpoint;
const bookings = locations[0].contacts.find((c) => c.department === 'Bookings');
const orders = locations[0].contacts.find((c) => c.department === 'General orders');

const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.shortTitle === 'Warehousing' ? 'Warehousing & storage' : s.shortTitle })),
  { value: 'not-sure', label: 'Not sure yet' },
];

const timeframes = ['As soon as possible', 'Within 2 weeks', '2-4 weeks', '1-3 months', 'More than 3 months', 'Flexible / not sure'];

const MAX_FILES = 5;
const MAX_FILE_MB = 10;
const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.dwg,.jpg,.jpeg,.png';
const allowedExt = ACCEPT.split(',');

/** Element that receives focus for each field (the services group focuses its first checkbox). */
const fieldIds: Record<FieldName, string> = {
  name: 'q-name',
  email: 'q-email',
  phone: 'q-phone',
  pickup: 'q-pickup',
  delivery: 'q-delivery',
  services: 'q-service-transport',
  scope: 'q-scope',
  date: 'q-date',
  files: 'q-files',
};
const fieldOrder = Object.keys(fieldIds) as FieldName[];

const localToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const touched = useRef(new Set<FieldName>());

  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [summaryErrors, setSummaryErrors] = useState<FieldName[]>([]);
  const [focusTarget, setFocusTarget] = useState<'summary' | 'result' | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [minDate, setMinDate] = useState<string>();
  const [result, setResult] = useState<ResultKind | null>(null);
  const [mailtoHref, setMailtoHref] = useState(mailHref(company.quoteEmail));
  const [summaryText, setSummaryText] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy enquiry text');
  const [busy, setBusy] = useState(false);

  // Client-only values: today and a service pre-selected by ?service=... links.
  useEffect(() => {
    setMinDate(localToday());
    const preselect = new URLSearchParams(window.location.search).get('service');
    const box = preselect && document.getElementById(`q-service-${preselect}`);
    if (box instanceof HTMLInputElement) box.checked = true;
  }, []);

  // Move focus once the panel it targets has rendered.
  useEffect(() => {
    if (focusTarget === 'summary') summaryRef.current?.focus();
    if (focusTarget === 'result') resultRef.current?.focus();
    if (focusTarget) setFocusTarget(null);
  }, [focusTarget]);

  const value = (name: string) => {
    const el = formRef.current?.elements.namedItem(name);
    return el && 'value' in el ? String(el.value).trim() : '';
  };

  const checkedServices = () =>
    Array.from(formRef.current?.querySelectorAll<HTMLInputElement>('input[name="services"]:checked') ?? []);

  const validators: Record<FieldName, () => string> = {
    name: () => (value('name').length >= 2 ? '' : 'Enter your full name.'),
    email: () => {
      const v = value('email');
      if (!v) return 'Enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter an email address in the format name@company.com.au.';
    },
    phone: () => {
      const v = value('phone');
      if (!v) return 'Enter a phone number so we can discuss the job.';
      const digits = v.replace(/[^\d]/g, '');
      return /^[\d\s()+-]+$/.test(v) && digits.length >= 8 && digits.length <= 15
        ? ''
        : 'Enter a valid phone number, e.g. 0400 000 000 or 02 0000 0000.';
    },
    pickup: () => (value('pickup') ? '' : 'Enter the pickup suburb or address.'),
    delivery: () => (value('delivery') ? '' : 'Enter the delivery suburb or address.'),
    services: () => (checkedServices().length ? '' : 'Choose at least one service.'),
    scope: () => (value('scope') ? '' : 'Describe the furniture quantity or project scope.'),
    date: () => {
      const v = value('date');
      return !v || v >= localToday() ? '' : 'Choose a date that is today or later.';
    },
    files: () => {
      const list = Array.from((formRef.current?.elements.namedItem('files') as HTMLInputElement | null)?.files ?? []);
      if (list.length > MAX_FILES) return `Attach no more than ${MAX_FILES} files.`;
      const tooBig = list.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
      if (tooBig) return `"${tooBig.name}" is larger than ${MAX_FILE_MB} MB.`;
      const badType = list.find((f) => !allowedExt.includes(`.${f.name.split('.').pop()?.toLowerCase()}`));
      if (badType) return `"${badType.name}" is not an accepted file type.`;
      return '';
    },
  };

  const validate = (name: FieldName) => {
    const message = validators[name]();
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message;
  };

  const fieldOf = (target: EventTarget): FieldName | null => {
    const name = (target as HTMLInputElement).name;
    return name in fieldIds ? (name as FieldName) : null;
  };

  // Re-validate as the visitor corrects a field, but do not nag before they have tried.
  const onBlur = (event: SyntheticEvent<HTMLFormElement>) => {
    const name = fieldOf(event.target);
    if (!name) return;
    if ((event.target as HTMLInputElement).value?.trim() || touched.current.has(name)) {
      touched.current.add(name);
      validate(name);
    }
  };
  const onEdit = (event: SyntheticEvent<HTMLFormElement>) => {
    const name = fieldOf(event.target);
    if (name && touched.current.has(name)) validate(name);
  };

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files ?? []));
    touched.current.add('files');
    validate('files');
  };

  const buildSummary = () => {
    const chosen = checkedServices().map((box) => serviceOptions.find((o) => o.value === box.value)?.label ?? box.value);
    const line = (label: string, v: string) => (v ? `${label}: ${v}` : '');
    // Blocks are separated by a blank line; empty optional fields are dropped.
    const blocks = [
      ['Quote request via comboynegroup.com'],
      [line('Name', value('name')), line('Company', value('company')), line('Email', value('email')), line('Phone', value('phone'))],
      [
        line('Pickup', value('pickup')),
        line('Delivery', value('delivery')),
        line('Services', chosen.join(', ')),
        line('Scope', value('scope')),
        line('Timeframe', value('timeframe')),
        line('Preferred date', value('date')),
      ],
      [line('Additional details', value('details')), files.length ? `Documents to attach: ${files.map((f) => f.name).join(', ')}` : ''],
    ];
    return blocks
      .map((block) => block.filter(Boolean).join('\n'))
      .filter(Boolean)
      .join('\n\n');
  };

  const showResult = (kind: ResultKind) => {
    setResult(kind);
    setFocusTarget('result');
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setResult(null);

    const failed = fieldOrder.filter((name) => {
      touched.current.add(name);
      return Boolean(validate(name));
    });
    if (failed.length) {
      setSummaryErrors(failed);
      setFocusTarget('summary');
      return;
    }
    setSummaryErrors([]);

    // Honeypot filled: silently stop (bots only).
    if (value('website')) return;

    if (!endpoint) {
      const summary = buildSummary();
      const subject = `Quote request: ${value('company') || value('name')}`;
      // Keep the mailto URL within common client length limits; the full text stays copyable.
      const body =
        summary.length > 1800 ? `${summary.slice(0, 1800)}\n\n[Shortened. See full details copied from the website form]` : summary;
      const href = `mailto:${company.quoteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setMailtoHref(href);
      setSummaryText(summary);
      showResult('preview');
      window.location.href = href;
      return;
    }

    // Endpoint mode: success is shown only when the server confirms.
    setBusy(true);
    try {
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const json = await response.json().catch(() => ({}));
      if (response.ok && json && json.ok === true) {
        form.reset();
        setFiles([]);
        showResult('success');
      } else {
        showResult('error');
      }
    } catch {
      showResult('error');
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopyLabel('Copied');
    } catch {
      document.querySelector<HTMLTextAreaElement>('#q-summary')?.select();
      setCopyLabel('Select and copy the text below');
    }
    setTimeout(() => setCopyLabel('Copy enquiry text'), 3000);
  };

  /** Wrapper class, aria-invalid and error paragraph for one field. */
  const field = (name: FieldName, base = 'field') => ({
    wrapper: cx(base, errors[name] && 'has-error'),
    invalid: errors[name] ? true : touched.current.has(name) ? false : undefined,
    error: (
      <p className="field__error" id={`q-${name}-error`} hidden={!errors[name]}>
        {errors[name]}
      </p>
    ),
  });

  const nameField = field('name');
  const emailField = field('email');
  const phoneField = field('phone');
  const pickupField = field('pickup');
  const deliveryField = field('delivery');
  const servicesField = field('services', 'field field--full choices');
  const scopeField = field('scope', 'field field--full');
  const dateField = field('date');
  const filesField = field('files', 'field field--full');

  return (
    <form
      ref={formRef}
      className="quote-form"
      id="quote-form"
      method="post"
      action={endpoint || undefined}
      encType="multipart/form-data"
      noValidate
      onSubmit={onSubmit}
      onBlur={onBlur}
      onInput={onEdit}
      onChange={onEdit}
    >
      {previewMode && (
        <div className="notice" role="note">
          <Icon name="info" size={20} />
          <div>
            <p className="notice__title">Online submission is being set up</p>
            <p>
              This form does not send anything yet. Fill it in and select <strong>Prepare enquiry email</strong>. We will
              check your details and open a pre-filled email to{' '}
              <a href={mailHref(company.quoteEmail)}>{company.quoteEmail}</a> in your email app for you to send. Prefer to
              talk? Call <a href={telHref(company.phone)}>{company.phone}</a>.
            </p>
          </div>
        </div>
      )}

      <div className="error-summary" role="alert" tabIndex={-1} hidden={!summaryErrors.length} ref={summaryRef}>
        <h2 className="error-summary__title">
          <Icon name="alert-circle" size={20} />
          Please check the highlighted fields
        </h2>
        <ul role="list">
          {summaryErrors.map((n) => (
            <li key={n}>
              <a
                href={`#${fieldIds[n]}`}
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById(fieldIds[n])?.focus();
                }}
              >
                {errors[n]}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <fieldset className="quote-form__group">
        <legend>
          <span className="label">01</span> Your details
        </legend>
        <div className="quote-form__grid">
          <div className={nameField.wrapper}>
            <label htmlFor="q-name">
              Full name <span className="req">(required)</span>
            </label>
            <input
              id="q-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={nameField.invalid}
              aria-describedby="q-name-error"
            />
            {nameField.error}
          </div>
          <div className="field">
            <label htmlFor="q-company">
              Company <span className="opt">(optional)</span>
            </label>
            <input id="q-company" name="company" type="text" autoComplete="organization" />
          </div>
          <div className={emailField.wrapper}>
            <label htmlFor="q-email">
              Business email <span className="req">(required)</span>
            </label>
            <input
              id="q-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              required
              aria-invalid={emailField.invalid}
              aria-describedby="q-email-error"
            />
            {emailField.error}
          </div>
          <div className={phoneField.wrapper}>
            <label htmlFor="q-phone">
              Phone <span className="req">(required)</span>
            </label>
            <input
              id="q-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              aria-invalid={phoneField.invalid}
              aria-describedby="q-phone-hint q-phone-error"
            />
            <p className="field__hint" id="q-phone-hint">
              Mobile or landline, e.g. 0400 000 000
            </p>
            {phoneField.error}
          </div>
        </div>
      </fieldset>

      <fieldset className="quote-form__group">
        <legend>
          <span className="label">02</span> The job
        </legend>
        <div className="quote-form__grid">
          <div className={pickupField.wrapper}>
            <label htmlFor="q-pickup">
              Pickup location <span className="req">(required)</span>
            </label>
            <input
              id="q-pickup"
              name="pickup"
              type="text"
              autoComplete="off"
              required
              aria-invalid={pickupField.invalid}
              aria-describedby="q-pickup-hint q-pickup-error"
            />
            <p className="field__hint" id="q-pickup-hint">
              Suburb or full address
            </p>
            {pickupField.error}
          </div>
          <div className={deliveryField.wrapper}>
            <label htmlFor="q-delivery">
              Delivery location <span className="req">(required)</span>
            </label>
            <input
              id="q-delivery"
              name="delivery"
              type="text"
              autoComplete="off"
              required
              aria-invalid={deliveryField.invalid}
              aria-describedby="q-delivery-hint q-delivery-error"
            />
            <p className="field__hint" id="q-delivery-hint">
              Suburb or full address
            </p>
            {deliveryField.error}
          </div>

          <fieldset className={servicesField.wrapper} aria-describedby="q-services-error">
            <legend>
              Services required <span className="req">(required, choose at least one)</span>
            </legend>
            <div className="choices__list">
              {serviceOptions.map((opt) => (
                <label className="choice" key={opt.value}>
                  <input type="checkbox" name="services" value={opt.value} id={`q-service-${opt.value}`} aria-invalid={servicesField.invalid} />
                  <span className="choice__box" aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            {servicesField.error}
          </fieldset>

          <div className={scopeField.wrapper}>
            <label htmlFor="q-scope">
              Estimated furniture quantity or project scope <span className="req">(required)</span>
            </label>
            <textarea
              id="q-scope"
              name="scope"
              rows={3}
              required
              aria-invalid={scopeField.invalid}
              aria-describedby="q-scope-hint q-scope-error"
            />
            <p className="field__hint" id="q-scope-hint">
              For example: approx. 40 workstations, 60 task chairs and 6 storage units.
            </p>
            {scopeField.error}
          </div>

          <div className="field">
            <label htmlFor="q-timeframe">
              Preferred timeframe <span className="opt">(optional)</span>
            </label>
            <select id="q-timeframe" name="timeframe" defaultValue="">
              <option value="">Select a timeframe</option>
              {timeframes.map((t) => (
                <option value={t} key={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className={dateField.wrapper}>
            <label htmlFor="q-date">
              Preferred date <span className="opt">(optional)</span>
            </label>
            <input id="q-date" name="date" type="date" min={minDate} aria-invalid={dateField.invalid} aria-describedby="q-date-error" />
            {dateField.error}
          </div>
        </div>
      </fieldset>

      <fieldset className="quote-form__group">
        <legend>
          <span className="label">03</span> Anything else
        </legend>
        <div className="quote-form__grid">
          <div className="field field--full">
            <label htmlFor="q-details">
              Additional details <span className="opt">(optional)</span>
            </label>
            <textarea id="q-details" name="details" rows={5} maxLength={2000} aria-describedby="q-details-hint" />
            <p className="field__hint" id="q-details-hint">
              Site access, loading docks, lifts, stairs, working-hours restrictions or anything else we should know.
            </p>
          </div>

          <div className={filesField.wrapper}>
            <label htmlFor="q-files">
              Project documents <span className="opt">(optional)</span>
            </label>
            <div className="file-drop">
              <Icon name="upload" size={20} />
              <input
                id="q-files"
                name="files"
                type="file"
                multiple
                accept={ACCEPT}
                aria-invalid={filesField.invalid}
                aria-describedby="q-files-hint q-files-error"
                onChange={onFiles}
              />
            </div>
            <p className="field__hint" id="q-files-hint">
              Floor plans, furniture schedules or specifications. PDF, Word, Excel, CSV, DWG, JPG or PNG, up to {MAX_FILES}{' '}
              files, {MAX_FILE_MB} MB each.
              {previewMode && ' While online submission is being set up, please attach these to the email instead.'}
            </p>
            <ul className="file-list" role="list" hidden={!files.length}>
              {files.map((file) => (
                <li key={file.name + file.size}>
                  {file.name} ({formatSize(file.size)})
                </li>
              ))}
            </ul>
            {filesField.error}
          </div>
        </div>
      </fieldset>

      {/* Spam honeypot for the future endpoint: real visitors never see or fill this. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="q-website">Leave this field empty</label>
        <input id="q-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="quote-form__submit">
        <p className="muted quote-form__privacy">
          {previewMode
            ? 'Your details stay in your browser until you choose to send the email from your own email app.'
            : 'Your details are used only to respond to this enquiry.'}{' '}
          Quotes are provided under our <a href="/quote-terms-and-validity">Quote Terms and Validity</a>.
        </p>
        <button className="btn btn--primary" type="submit" disabled={busy} aria-busy={busy || undefined}>
          {previewMode ? 'Prepare enquiry email' : 'Send enquiry'}
          <Icon name="arrow-right" />
        </button>
      </div>

      {/* Result panel. In preview mode it never claims an enquiry was received. */}
      <div className="result" role="status" aria-live="polite" tabIndex={-1} hidden={!result} ref={resultRef}>
        <div hidden={result !== 'preview'}>
          <h2 className="result__title">Your enquiry email is ready</h2>
          <p>
            Your email app should have opened with a message addressed to <strong>{company.quoteEmail}</strong>.{' '}
            <strong>Nothing has been sent yet.</strong> The enquiry is only sent when you press send in your email app.
          </p>
          <p>If no email opened, use one of these options:</p>
          <div className="result__actions">
            <a className="btn btn--primary btn--small" href={mailtoHref}>
              <Icon name="mail" size={16} /> Open email again
            </a>
            <button className="btn btn--secondary btn--small" type="button" onClick={onCopy}>
              <Icon name="copy" size={16} /> <span>{copyLabel}</span>
            </button>
          </div>
          <label className="result__summary-label label" htmlFor="q-summary">
            Enquiry summary
          </label>
          <textarea id="q-summary" className="result__summary" rows={10} readOnly value={summaryText} />
          <p className="muted">
            Or call {orders?.name} on <a href={telHref(orders?.phone ?? company.phone)}>{orders?.phone}</a> (general
            orders)
            {bookings && (
              <>
                , or {bookings.name} on <a href={telHref(bookings.phone)}>{bookings.phone}</a> (bookings)
              </>
            )}
            .
          </p>
        </div>
        <div hidden={result !== 'success'}>
          <h2 className="result__title">Thank you. Your enquiry has been sent</h2>
          <p>We have received your details and will be in touch.</p>
        </div>
        <div hidden={result !== 'error'}>
          <h2 className="result__title">Your enquiry could not be sent</h2>
          <p>
            Please try again, email <a href={mailHref(company.quoteEmail)}>{company.quoteEmail}</a> or call{' '}
            <a href={telHref(company.phone)}>{company.phone}</a>.
          </p>
        </div>
      </div>
    </form>
  );
}
