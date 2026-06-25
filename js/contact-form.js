/**
 * Contact form handler for the lead-capture form on the marketing site.
 *
 * Manages form submission via FormSubmit, displays success/error states,
 * and optionally shows a booking link on the success screen.
 */

/**
 * Parse the first name from a full-name string.
 * Returns "there" when the input is empty or whitespace-only.
 */
function parseFirstName(fullName) {
  var first = (fullName || '').trim().split(/\s+/)[0];
  return first || 'there';
}

/**
 * Collect all form fields into a plain object.
 */
function collectFormData(formElement) {
  var data = {};
  new FormData(formElement).forEach(function (value, key) {
    data[key] = value;
  });
  return data;
}

/**
 * Configure the booking block on the success screen.
 * If bookingUrl is truthy the block is revealed and the link set;
 * otherwise the block stays hidden.
 */
function configureBookingBlock(bookingUrl) {
  var bookBtn = document.getElementById('book-btn');
  var bookBlock = document.getElementById('book-block');
  if (bookingUrl && bookBtn && bookBlock) {
    bookBtn.href = bookingUrl;
    bookBlock.hidden = false;
    return true;
  }
  return false;
}

/**
 * Show the success state: hide the form, personalise the greeting,
 * reveal the success box, and scroll it into view.
 */
function showSuccess(formElement, successBox, firstName, bookingUrl) {
  document.getElementById('success-name').textContent = firstName;
  configureBookingBlock(bookingUrl);
  formElement.hidden = true;
  successBox.hidden = false;
}

/**
 * Show the error state: re-enable the submit button and reveal the
 * error message.
 */
function showError(submitBtn, originalLabel, errorBox) {
  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;
  errorBox.hidden = false;
}

/**
 * Build the fetch options object for a FormSubmit POST.
 */
function buildFetchOptions(data) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  };
}

/**
 * Initialise the contact form. Attaches a submit handler that posts
 * to FormSubmit and toggles between success / error UI states.
 *
 * @param {Object}  opts
 * @param {string}  opts.bookingUrl   - Calendly / Cal.com URL (or "")
 * @param {string}  opts.submitEndpoint - FormSubmit endpoint URL
 */
function initContactForm(opts) {
  var bookingUrl = opts.bookingUrl || '';
  var submitEndpoint = opts.submitEndpoint || '';

  var form = document.getElementById('lead-form');
  if (!form) return null;

  var submitBtn = document.getElementById('submit-btn');
  var errorBox = document.getElementById('form-error');
  var successBox = document.getElementById('form-success');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorBox.hidden = true;
    submitBtn.disabled = true;
    var label = submitBtn.textContent;
    submitBtn.textContent = 'Sending\u2026';

    var data = collectFormData(form);

    fetch(submitEndpoint, buildFetchOptions(data))
      .then(function (res) {
        if (!res.ok) throw new Error('bad status');
        return res.json().catch(function () { return {}; });
      })
      .then(function () {
        var first = parseFirstName(data.name);
        showSuccess(form, successBox, first, bookingUrl);
      })
      .catch(function () {
        showError(submitBtn, label, errorBox);
      });
  });

  return { form: form, submitBtn: submitBtn, errorBox: errorBox, successBox: successBox };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseFirstName: parseFirstName,
    collectFormData: collectFormData,
    configureBookingBlock: configureBookingBlock,
    showSuccess: showSuccess,
    showError: showError,
    buildFetchOptions: buildFetchOptions,
    initContactForm: initContactForm,
  };
}
