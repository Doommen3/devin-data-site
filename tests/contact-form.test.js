/**
 * @jest-environment jsdom
 */

const {
  parseFirstName,
  collectFormData,
  configureBookingBlock,
  showSuccess,
  showError,
  buildFetchOptions,
  initContactForm,
} = require('../js/contact-form');

// ---------------------------------------------------------------------------
// parseFirstName
// ---------------------------------------------------------------------------
describe('parseFirstName', () => {
  it('returns the first word of a full name', () => {
    expect(parseFirstName('Devin Oommen')).toBe('Devin');
  });

  it('handles a single-word name', () => {
    expect(parseFirstName('Devin')).toBe('Devin');
  });

  it('trims leading and trailing whitespace', () => {
    expect(parseFirstName('  Devin  Oommen  ')).toBe('Devin');
  });

  it('returns "there" for an empty string', () => {
    expect(parseFirstName('')).toBe('there');
  });

  it('returns "there" for null', () => {
    expect(parseFirstName(null)).toBe('there');
  });

  it('returns "there" for undefined', () => {
    expect(parseFirstName(undefined)).toBe('there');
  });

  it('returns "there" for whitespace-only input', () => {
    expect(parseFirstName('   ')).toBe('there');
  });

  it('handles names with multiple spaces between words', () => {
    expect(parseFirstName('John    Doe')).toBe('John');
  });
});

// ---------------------------------------------------------------------------
// buildFetchOptions
// ---------------------------------------------------------------------------
describe('buildFetchOptions', () => {
  it('returns a POST request with JSON content type', () => {
    const data = { name: 'Test', email: 'a@b.com' };
    const opts = buildFetchOptions(data);

    expect(opts.method).toBe('POST');
    expect(opts.headers['Content-Type']).toBe('application/json');
    expect(opts.headers['Accept']).toBe('application/json');
    expect(JSON.parse(opts.body)).toEqual(data);
  });

  it('serialises an empty object', () => {
    const opts = buildFetchOptions({});
    expect(JSON.parse(opts.body)).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// DOM-dependent helpers — shared setup
// ---------------------------------------------------------------------------
function setUpFormDOM() {
  document.body.innerHTML = `
    <form id="lead-form">
      <input name="name" type="text" value="Jane Smith">
      <input name="email" type="email" value="jane@example.com">
      <input name="industry" value="Retail">
      <textarea name="pain_point">Manual reports</textarea>
      <button id="submit-btn" type="submit">Send</button>
    </form>
    <div id="form-error" hidden></div>
    <div id="form-success" hidden>
      <span id="success-name"></span>
      <div id="book-block" hidden>
        <a id="book-btn" href="#"></a>
      </div>
    </div>
  `;
}

afterEach(() => {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// collectFormData
// ---------------------------------------------------------------------------
describe('collectFormData', () => {
  it('collects all form fields into a plain object', () => {
    setUpFormDOM();
    const form = document.getElementById('lead-form');
    const data = collectFormData(form);

    expect(data.name).toBe('Jane Smith');
    expect(data.email).toBe('jane@example.com');
    expect(data.industry).toBe('Retail');
    expect(data.pain_point).toBe('Manual reports');
  });
});

// ---------------------------------------------------------------------------
// configureBookingBlock
// ---------------------------------------------------------------------------
describe('configureBookingBlock', () => {
  beforeEach(setUpFormDOM);

  it('reveals the booking block and sets href when URL is provided', () => {
    const result = configureBookingBlock('https://calendly.com/test');
    expect(result).toBe(true);

    const bookBlock = document.getElementById('book-block');
    const bookBtn = document.getElementById('book-btn');
    expect(bookBlock.hidden).toBe(false);
    expect(bookBtn.href).toContain('calendly.com/test');
  });

  it('returns false and keeps block hidden when URL is empty', () => {
    const result = configureBookingBlock('');
    expect(result).toBe(false);

    const bookBlock = document.getElementById('book-block');
    expect(bookBlock.hidden).toBe(true);
  });

  it('returns false when URL is null', () => {
    expect(configureBookingBlock(null)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// showSuccess
// ---------------------------------------------------------------------------
describe('showSuccess', () => {
  beforeEach(setUpFormDOM);

  it('hides the form and reveals the success box', () => {
    const form = document.getElementById('lead-form');
    const successBox = document.getElementById('form-success');

    showSuccess(form, successBox, 'Jane', '');

    expect(form.hidden).toBe(true);
    expect(successBox.hidden).toBe(false);
  });

  it('sets the success-name element to the provided first name', () => {
    const form = document.getElementById('lead-form');
    const successBox = document.getElementById('form-success');

    showSuccess(form, successBox, 'Carlos', '');

    expect(document.getElementById('success-name').textContent).toBe('Carlos');
  });

  it('configures booking block when a URL is provided', () => {
    const form = document.getElementById('lead-form');
    const successBox = document.getElementById('form-success');

    showSuccess(form, successBox, 'Jane', 'https://calendly.com/test');

    expect(document.getElementById('book-block').hidden).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// showError
// ---------------------------------------------------------------------------
describe('showError', () => {
  beforeEach(setUpFormDOM);

  it('re-enables the submit button with original label', () => {
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending\u2026';
    const errorBox = document.getElementById('form-error');

    showError(btn, 'Send', errorBox);

    expect(btn.disabled).toBe(false);
    expect(btn.textContent).toBe('Send');
  });

  it('reveals the error box', () => {
    const btn = document.getElementById('submit-btn');
    const errorBox = document.getElementById('form-error');

    showError(btn, 'Send', errorBox);

    expect(errorBox.hidden).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// initContactForm
// ---------------------------------------------------------------------------
describe('initContactForm', () => {
  beforeEach(setUpFormDOM);

  it('returns form references when the form exists', () => {
    const refs = initContactForm({
      bookingUrl: '',
      submitEndpoint: 'https://formsubmit.co/ajax/test@test.com',
    });

    expect(refs).not.toBeNull();
    expect(refs.form).toBe(document.getElementById('lead-form'));
    expect(refs.submitBtn).toBe(document.getElementById('submit-btn'));
  });

  it('returns null when no lead-form element exists', () => {
    document.body.innerHTML = '<div>No form here</div>';
    const refs = initContactForm({ bookingUrl: '', submitEndpoint: '' });
    expect(refs).toBeNull();
  });

  it('disables submit button and shows "Sending..." on submit', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }));

    const refs = initContactForm({
      bookingUrl: '',
      submitEndpoint: 'https://formsubmit.co/ajax/test@test.com',
    });

    refs.form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(refs.submitBtn.disabled).toBe(true);
    expect(refs.submitBtn.textContent).toBe('Sending\u2026');

    // Let the microtask queue flush
    await new Promise((r) => setTimeout(r, 0));
    delete global.fetch;
  });

  it('shows success state after a successful fetch', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }));

    const refs = initContactForm({
      bookingUrl: 'https://calendly.com/test',
      submitEndpoint: 'https://formsubmit.co/ajax/test@test.com',
    });

    refs.form.dispatchEvent(new Event('submit', { cancelable: true }));
    await new Promise((r) => setTimeout(r, 0));

    expect(refs.form.hidden).toBe(true);
    expect(refs.successBox.hidden).toBe(false);
    expect(document.getElementById('success-name').textContent).toBe('Jane');
    expect(document.getElementById('book-block').hidden).toBe(false);

    delete global.fetch;
  });

  it('shows error state when fetch rejects', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('network')));

    const refs = initContactForm({
      bookingUrl: '',
      submitEndpoint: 'https://formsubmit.co/ajax/test@test.com',
    });

    refs.form.dispatchEvent(new Event('submit', { cancelable: true }));
    await new Promise((r) => setTimeout(r, 0));

    expect(refs.submitBtn.disabled).toBe(false);
    expect(refs.errorBox.hidden).toBe(false);

    delete global.fetch;
  });

  it('shows error state when fetch returns non-ok response', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }));

    const refs = initContactForm({
      bookingUrl: '',
      submitEndpoint: 'https://formsubmit.co/ajax/test@test.com',
    });

    refs.form.dispatchEvent(new Event('submit', { cancelable: true }));
    await new Promise((r) => setTimeout(r, 0));

    expect(refs.submitBtn.disabled).toBe(false);
    expect(refs.errorBox.hidden).toBe(false);

    delete global.fetch;
  });
});
