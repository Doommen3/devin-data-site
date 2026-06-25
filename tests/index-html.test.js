/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

beforeEach(() => {
  document.documentElement.innerHTML = html;
});

afterEach(() => {
  document.documentElement.innerHTML = '';
});

// ---------------------------------------------------------------------------
// Meta / head
// ---------------------------------------------------------------------------
describe('index.html — meta tags', () => {
  it('has a <title>', () => {
    const title = document.querySelector('title');
    expect(title).not.toBeNull();
    expect(title.textContent.length).toBeGreaterThan(0);
  });

  it('has a meta description', () => {
    const desc = document.querySelector('meta[name="description"]');
    expect(desc).not.toBeNull();
    expect(desc.content.length).toBeGreaterThan(0);
  });

  it('has a viewport meta tag', () => {
    const vp = document.querySelector('meta[name="viewport"]');
    expect(vp).not.toBeNull();
    expect(vp.content).toContain('width=device-width');
  });

  it('has charset set to UTF-8', () => {
    const charset = document.querySelector('meta[charset]');
    expect(charset).not.toBeNull();
    expect(charset.getAttribute('charset').toUpperCase()).toBe('UTF-8');
  });
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
describe('index.html — navigation', () => {
  it('has a <nav> element', () => {
    expect(document.querySelector('nav')).not.toBeNull();
  });

  it('contains the logo link', () => {
    const logo = document.querySelector('nav .logo');
    expect(logo).not.toBeNull();
    expect(logo.textContent).toContain('Oommen');
  });

  it('has at least 3 navigation links', () => {
    const links = document.querySelectorAll('nav ul a');
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it('includes a "Book a call" CTA', () => {
    const cta = document.querySelector('nav .nav-cta');
    expect(cta).not.toBeNull();
    expect(cta.textContent.toLowerCase()).toContain('book');
  });
});

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------
describe('index.html — hero section', () => {
  it('has a hero header', () => {
    const hero = document.querySelector('.hero');
    expect(hero).not.toBeNull();
  });

  it('contains an h1', () => {
    const h1 = document.querySelector('.hero h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent.length).toBeGreaterThan(0);
  });

  it('has a primary CTA button', () => {
    const ctaBtn = document.querySelector('.hero .btn-primary');
    expect(ctaBtn).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Proof bar
// ---------------------------------------------------------------------------
describe('index.html — proof bar', () => {
  it('displays at least 4 proof items', () => {
    const items = document.querySelectorAll('.proof-item');
    expect(items.length).toBeGreaterThanOrEqual(4);
  });

  it('each proof item has a number and a label', () => {
    const items = document.querySelectorAll('.proof-item');
    items.forEach((item) => {
      expect(item.querySelector('.proof-num')).not.toBeNull();
      expect(item.querySelector('.proof-label')).not.toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Services section
// ---------------------------------------------------------------------------
describe('index.html — services section', () => {
  it('has a services section with id="services"', () => {
    expect(document.getElementById('services')).not.toBeNull();
  });

  it('has at least 3 service cards', () => {
    const cards = document.querySelectorAll('#services .svc');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it('each service card has an h3 heading and description', () => {
    const cards = document.querySelectorAll('#services .svc');
    cards.forEach((card) => {
      expect(card.querySelector('h3')).not.toBeNull();
      expect(card.querySelector('p')).not.toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Case studies / work section
// ---------------------------------------------------------------------------
describe('index.html — case studies', () => {
  it('has a work section with id="work"', () => {
    expect(document.getElementById('work')).not.toBeNull();
  });

  it('has at least 2 featured case studies', () => {
    const features = document.querySelectorAll('#work .feature');
    expect(features.length).toBeGreaterThanOrEqual(2);
  });

  it('each feature has a problem, what-I-built, and result block', () => {
    const features = document.querySelectorAll('#work .feature');
    features.forEach((f) => {
      const labs = Array.from(f.querySelectorAll('.lab')).map((l) => l.textContent.toLowerCase());
      expect(labs).toContain('the problem');
      expect(labs).toContain('what i built');
      expect(labs).toContain('the result');
    });
  });
});

// ---------------------------------------------------------------------------
// About section
// ---------------------------------------------------------------------------
describe('index.html — about section', () => {
  it('has an about section with id="about"', () => {
    expect(document.getElementById('about')).not.toBeNull();
  });

  it('contains a tools/technologies list', () => {
    const tools = document.querySelectorAll('#about .tool');
    expect(tools.length).toBeGreaterThanOrEqual(5);
  });
});

// ---------------------------------------------------------------------------
// Contact section & form
// ---------------------------------------------------------------------------
describe('index.html — contact section', () => {
  it('has a contact section with id="contact"', () => {
    expect(document.getElementById('contact')).not.toBeNull();
  });

  it('has the lead-capture form', () => {
    expect(document.getElementById('lead-form')).not.toBeNull();
  });

  it('form has required fields: name, email, industry, pain_point', () => {
    const form = document.getElementById('lead-form');
    expect(form.querySelector('[name="name"]')).not.toBeNull();
    expect(form.querySelector('[name="email"]')).not.toBeNull();
    expect(form.querySelector('[name="industry"]')).not.toBeNull();
    expect(form.querySelector('[name="pain_point"]')).not.toBeNull();
  });

  it('form has a submit button', () => {
    expect(document.getElementById('submit-btn')).not.toBeNull();
  });

  it('has a hidden success box', () => {
    const box = document.getElementById('form-success');
    expect(box).not.toBeNull();
    expect(box.hidden).toBe(true);
  });

  it('has a hidden error box', () => {
    const box = document.getElementById('form-error');
    expect(box).not.toBeNull();
    expect(box.hidden).toBe(true);
  });

  it('honeypot field is present and hidden', () => {
    const honey = document.querySelector('input[name="_honey"]');
    expect(honey).not.toBeNull();
    expect(honey.tabIndex).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
describe('index.html — footer', () => {
  it('has a footer element', () => {
    expect(document.querySelector('footer')).not.toBeNull();
  });

  it('contains a copyright notice', () => {
    const footer = document.querySelector('footer');
    expect(footer.textContent).toMatch(/©\s*2026/);
  });
});

// ---------------------------------------------------------------------------
// Accessibility basics
// ---------------------------------------------------------------------------
describe('index.html — accessibility', () => {
  it('has lang="en" on <html>', () => {
    // Re-parse to get the lang attribute which innerHTML strips
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
  });

  it('all <img> tags have alt attributes (if any exist)', () => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });

  it('external links have rel="noopener"', () => {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((a) => {
      expect(a.getAttribute('rel')).toContain('noopener');
    });
  });

  it('form inputs have associated labels', () => {
    const inputs = document.querySelectorAll('#lead-form input:not([type="hidden"]):not([name="_honey"]), #lead-form select, #lead-form textarea');
    inputs.forEach((input) => {
      const id = input.id;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        expect(label).not.toBeNull();
      }
    });
  });
});

// ---------------------------------------------------------------------------
// Links integrity
// ---------------------------------------------------------------------------
describe('index.html — internal anchor links', () => {
  it('all internal hash links point to existing anchors', () => {
    const hashLinks = document.querySelectorAll('a[href^="#"]');
    hashLinks.forEach((a) => {
      const hash = a.getAttribute('href');
      if (hash === '#' || hash === '#top') return; // generic
      const targetId = hash.replace('#', '');
      const target = document.getElementById(targetId);
      expect(target).not.toBeNull();
    });
  });
});
