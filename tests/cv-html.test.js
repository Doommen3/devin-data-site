/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../cv.html'), 'utf8');

beforeEach(() => {
  document.documentElement.innerHTML = html;
});

afterEach(() => {
  document.documentElement.innerHTML = '';
});

// ---------------------------------------------------------------------------
// Meta / head
// ---------------------------------------------------------------------------
describe('cv.html — meta tags', () => {
  it('has a <title> with CV-related text', () => {
    const title = document.querySelector('title');
    expect(title).not.toBeNull();
    expect(title.textContent.toLowerCase()).toContain('cv');
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
describe('cv.html — navigation', () => {
  it('has a <nav> element', () => {
    expect(document.querySelector('nav')).not.toBeNull();
  });

  it('contains a logo linking back to index.html', () => {
    const logo = document.querySelector('nav .logo');
    expect(logo).not.toBeNull();
    expect(logo.getAttribute('href')).toBe('index.html');
  });

  it('has navigation links including Home and CV', () => {
    const links = Array.from(document.querySelectorAll('nav ul a')).map((a) => a.textContent.trim());
    expect(links).toContain('Home');
    expect(links).toContain('CV');
  });
});

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
describe('cv.html — header', () => {
  it('has a cv-header section', () => {
    expect(document.querySelector('.cv-header')).not.toBeNull();
  });

  it('displays the name in an h1', () => {
    const h1 = document.querySelector('.cv-header h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent).toContain('Devin Oommen');
  });

  it('has a contact row with email and LinkedIn', () => {
    const contactRow = document.querySelector('.cv-header .contact-row');
    expect(contactRow).not.toBeNull();

    const links = Array.from(contactRow.querySelectorAll('a'));
    const hrefs = links.map((a) => a.getAttribute('href'));
    expect(hrefs.some((h) => h.includes('mailto:'))).toBe(true);
    expect(hrefs.some((h) => h.includes('linkedin.com'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// CV sections
// ---------------------------------------------------------------------------
describe('cv.html — sections', () => {
  it('has multiple cv-section blocks', () => {
    const sections = document.querySelectorAll('.cv-section');
    expect(sections.length).toBeGreaterThanOrEqual(4);
  });

  it('includes a Tools & Skills section', () => {
    const headings = Array.from(document.querySelectorAll('.cv-section h2')).map((h) => h.textContent);
    expect(headings.some((h) => h.toLowerCase().includes('skills'))).toBe(true);
  });

  it('includes a Work Experience section', () => {
    const headings = Array.from(document.querySelectorAll('.cv-section h2')).map((h) => h.textContent);
    expect(headings.some((h) => h.toLowerCase().includes('work experience'))).toBe(true);
  });

  it('includes an Education section', () => {
    const headings = Array.from(document.querySelectorAll('.cv-section h2')).map((h) => h.textContent);
    expect(headings.some((h) => h.toLowerCase().includes('education'))).toBe(true);
  });

  it('includes a Technical Projects section', () => {
    const headings = Array.from(document.querySelectorAll('.cv-section h2')).map((h) => h.textContent);
    expect(headings.some((h) => h.toLowerCase().includes('technical projects'))).toBe(true);
  });

  it('includes an Awards section', () => {
    const headings = Array.from(document.querySelectorAll('.cv-section h2')).map((h) => h.textContent);
    expect(headings.some((h) => h.toLowerCase().includes('awards'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
describe('cv.html — skills', () => {
  it('has skill tags', () => {
    const tags = document.querySelectorAll('.skill-tag');
    expect(tags.length).toBeGreaterThanOrEqual(10);
  });

  it('includes key languages: Python, R, SQL', () => {
    const tags = Array.from(document.querySelectorAll('.skill-tag')).map((t) => t.textContent.trim());
    expect(tags).toContain('Python');
    expect(tags).toContain('R');
    expect(tags).toContain('SQL');
  });
});

// ---------------------------------------------------------------------------
// Work experience entries
// ---------------------------------------------------------------------------
describe('cv.html — work experience entries', () => {
  it('has at least 3 work entries', () => {
    // Find the Work Experience section by heading
    const sections = document.querySelectorAll('.cv-section');
    let workSection;
    sections.forEach((s) => {
      const h2 = s.querySelector('h2');
      if (h2 && h2.textContent.toLowerCase().includes('work experience')) {
        workSection = s;
      }
    });
    expect(workSection).toBeDefined();

    const entries = workSection.querySelectorAll('.cv-entry');
    expect(entries.length).toBeGreaterThanOrEqual(3);
  });

  it('each work entry has an h3 title', () => {
    const sections = document.querySelectorAll('.cv-section');
    let workSection;
    sections.forEach((s) => {
      const h2 = s.querySelector('h2');
      if (h2 && h2.textContent.toLowerCase().includes('work experience')) {
        workSection = s;
      }
    });
    const entries = workSection.querySelectorAll('.cv-entry');
    entries.forEach((entry) => {
      expect(entry.querySelector('h3')).not.toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
describe('cv.html — education', () => {
  it('lists at least 2 educational institutions', () => {
    const sections = document.querySelectorAll('.cv-section');
    let eduSection;
    sections.forEach((s) => {
      const h2 = s.querySelector('h2');
      if (h2 && h2.textContent.toLowerCase().includes('education')) {
        eduSection = s;
      }
    });
    expect(eduSection).toBeDefined();

    const entries = eduSection.querySelectorAll('.cv-entry');
    expect(entries.length).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------
describe('cv.html — awards', () => {
  it('has award items', () => {
    const awards = document.querySelectorAll('.award-item');
    expect(awards.length).toBeGreaterThanOrEqual(3);
  });

  it('each award has a year and name', () => {
    const awards = document.querySelectorAll('.award-item');
    awards.forEach((a) => {
      expect(a.querySelector('.award-year')).not.toBeNull();
      expect(a.querySelector('.award-name')).not.toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
describe('cv.html — footer', () => {
  it('has a footer', () => {
    expect(document.querySelector('footer')).not.toBeNull();
  });

  it('contains a copyright notice', () => {
    const footer = document.querySelector('footer');
    expect(footer.textContent).toMatch(/©\s*2026/);
  });

  it('has a link back to Home', () => {
    const footer = document.querySelector('footer');
    const homeLink = footer.querySelector('a[href="index.html"]');
    expect(homeLink).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------
describe('cv.html — accessibility', () => {
  it('has lang="en" on <html>', () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
  });

  it('external links have rel containing "noopener"', () => {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((a) => {
      expect(a.getAttribute('rel')).toContain('noopener');
    });
  });

  it('no duplicate IDs exist in the document', () => {
    const allIds = Array.from(document.querySelectorAll('[id]')).map((el) => el.id);
    const unique = new Set(allIds);
    expect(allIds.length).toBe(unique.size);
  });
});

// ---------------------------------------------------------------------------
// Presentations
// ---------------------------------------------------------------------------
describe('cv.html — presentations', () => {
  it('has at least 2 presentation entries', () => {
    const entries = document.querySelectorAll('.presentation-entry');
    expect(entries.length).toBeGreaterThanOrEqual(2);
  });

  it('each presentation has a title and venue', () => {
    const entries = document.querySelectorAll('.presentation-entry');
    entries.forEach((entry) => {
      expect(entry.querySelector('h3')).not.toBeNull();
      expect(entry.querySelector('.venue')).not.toBeNull();
    });
  });
});
