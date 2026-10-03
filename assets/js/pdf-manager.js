/**
 * PDF Manager System for James Web Portal
 * Handles PDF metadata, downloads, and page count accuracy
 * @version 1.0.0
 */

class PDFManager {
  constructor(options = {}) {
    this.basePath = options.basePath || '/books-library/';
    this.cacheKey = 'jamesweb_pdf_cache';
    this.books = new Map();
    this.init();
  }

  /**
   * Initialize the PDF Manager
   */
  init() {
    this.registerBooks();
    this.setupEventListeners();
    // Note: no server/API backing this static site, so there is no
    // remote metadata to refresh — books are registered locally above.
  }

  /**
   * Register all available books with accurate metadata
   */
  registerBooks() {
    const books = [
      {
        id: 'james-web-logical',
        title: 'James Web Logical',
        subtitle: 'Complete Guide to Ethical Hacking',
        author: 'AR. Abhinav Ranjan',
        filename: 'logical.pdf',
        pages: 24,
        size: '4.8 MB',
        published: '2026-05-01',
        version: '1.0',
        description: 'A comprehensive 24-page guide to ethical hacking, Kali Linux, and cybersecurity',
        chapters: 5,
        keywords: ['ethical hacking', 'kali linux', 'cybersecurity', 'nmap', 'xss'],
        downloadUrl: `${this.basePath}logical.pdf`,
        previewUrl: `${this.basePath}logical.pdf`
      }
    ];

    books.forEach(book => {
      this.books.set(book.id, book);
    });
  }

  /**
   * Get book metadata by ID
   */
  getBook(bookId) {
    return this.books.get(bookId) || null;
  }

  /**
   * Get all books
   */
  getAllBooks() {
    return Array.from(this.books.values());
  }

  /**
   * Create download link with tracking
   */
  createDownloadLink(bookId) {
    const book = this.getBook(bookId);
    if (!book) return null;

    const link = document.createElement('a');
    link.href = book.downloadUrl;
    link.download = `${book.id}-${book.version}.pdf`;
    link.dataset.bookId = bookId;
    link.addEventListener('click', () => this.trackDownload(bookId));
    return link;
  }

  /**
   * Track PDF downloads for analytics
   */
  trackDownload(bookId) {
    const book = this.getBook(bookId);
    if (!book) return;

    const event = {
      type: 'pdf_download',
      bookId: bookId,
      title: book.title,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'file_download', {
        file_name: book.filename,
        file_extension: 'pdf'
      });
    }

    // Store local analytics
    this.storeAnalytics(event);
  }

  /**
   * Store analytics locally
   */
  storeAnalytics(event) {
    const key = 'jamesweb_analytics';
    const analytics = JSON.parse(localStorage.getItem(key) || '[]');
    analytics.push(event);
    
    // Keep only last 100 events
    if (analytics.length > 100) {
      analytics.shift();
    }
    
    localStorage.setItem(key, JSON.stringify(analytics));
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Download button handlers
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('pdf-download-btn')) {
        const bookId = e.target.dataset.bookId;
        const link = this.createDownloadLink(bookId);
        if (link) link.click();
      }
    });

    // Preview handlers
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('pdf-preview-btn')) {
        const bookId = e.target.dataset.bookId;
        this.openPreview(bookId);
      }
    });
  }

  /**
   * Open PDF preview in modal or new tab
   */
  openPreview(bookId) {
    const book = this.getBook(bookId);
    if (!book) return;

    // Check if PDF viewer library is available
    if (window.PDFJSViewer) {
      this.showPDFModal(book);
    } else {
      // Fallback: open in new tab
      window.open(book.previewUrl, '_blank');
    }
  }

  /**
   * Display PDF in a modal with viewer
   */
  showPDFModal(book) {
    // Implementation for PDF modal display
    console.log('[PDFManager] Opening preview for:', book.title);
    // This would typically use PDF.js library
  }

  /**
   * Get structured data for SEO
   */
  getStructuredData() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: 'James Web Logical',
      author: {
        '@type': 'Person',
        name: 'AR. Abhinav Ranjan'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Luminary Books'
      },
      numberOfPages: 24, // Accurate page count
      url: 'https://jamesweb.dpdns.org/logical/'
    };
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.pdfManager = new PDFManager({
    basePath: '/books/'
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFManager;
}
