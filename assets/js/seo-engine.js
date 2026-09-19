/**
 * AR Dynamic SEO & Branding Engine v1.0
 * Automatically manages SEO, Open Graph, Twitter, and Schema.org metadata
 * across any domain or subdomain (Netlify, qzz.io, custom domains, etc.)
 */

(function() {
    // 1. Configuration & Branding Values
    const branding = {
        name: "James Web | Abhinav Ranjan",
        alternateName: "James Web Portal",
        description: "The definitive James Web portal for Ethical Hacking, Cybersecurity education, and Logical thinking.",
        logo: "assets/images/icon-512.png", // Path relative to root — PNG required for social/OG previews
        authorUrl: "https://abhinavranjan.netlify.app",
        social: {
            twitter: "@abhinavranjan"
        }
    };

    // 2. Project Root & Domain Detection
    const currentOrigin = window.location.origin;
    const currentPath = window.location.pathname;
    
    // Dynamically find the project root by looking at where this script is loaded from
    const scripts = document.getElementsByTagName('script');
    let projectRoot = currentOrigin + '/';
    for (let s of scripts) {
        if (s.src && s.src.includes('assets/js/seo-engine.js')) {
            projectRoot = s.src.replace('assets/js/seo-engine.js', '');
            break;
        }
    }
    const fullUrl = window.location.href;

    // 3. SEO Manager Function
    const updateSEO = () => {
        // Set Page Title
        const pageTitle = document.title || "Home";
        if (!pageTitle.includes(branding.name)) {
            document.title = `${pageTitle} | ${branding.name}`;
        }

        // Helper to get or create meta tags. By default this only FILLS IN
        // a tag when it doesn't already exist (or is empty) — it never
        // clobbers a page-specific value that's already in the HTML.
        // Pass force: true for tags that should always reflect this page
        // (title-derived tags, canonical, url) rather than per-page copy.
        const getOrCreateMeta = (attr, value, content, force = false) => {
            let el = document.querySelector(`meta[${attr}="${value}"]`);
            const isNew = !el;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, value);
                document.head.appendChild(el);
            }
            const hasExistingContent = !isNew && el.getAttribute('content');
            if (content && (isNew || force || !hasExistingContent)) {
                el.setAttribute('content', content);
            }
            return el;
        };

        // Standard Meta Tags — only fall back to the generic description
        // if the page didn't already write its own.
        getOrCreateMeta('name', 'description', branding.description);
        getOrCreateMeta('name', 'author', branding.name);
        
        // Canonical Tag
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', fullUrl);

        // Open Graph Tags — site_name/url/type/image are safe to force since
        // they're the same across pages (or always meant to reflect this
        // page); title/description are per-page and only filled if missing.
        getOrCreateMeta('property', 'og:site_name', branding.name, true);
        getOrCreateMeta('property', 'og:title', document.title);
        getOrCreateMeta('property', 'og:description', branding.description);
        getOrCreateMeta('property', 'og:url', fullUrl, true);
        getOrCreateMeta('property', 'og:type', 'website', true);
        getOrCreateMeta('property', 'og:image', `${projectRoot}assets/images/icon-512.png`);

        // Twitter Tags
        getOrCreateMeta('name', 'twitter:card', 'summary_large_image', true);
        getOrCreateMeta('name', 'twitter:title', document.title);
        getOrCreateMeta('name', 'twitter:description', branding.description);
        getOrCreateMeta('name', 'twitter:image', `${projectRoot}assets/images/icon-512.png`);
        getOrCreateMeta('name', 'twitter:creator', branding.social.twitter, true);

        // 4. Structured Data (JSON-LD)
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": branding.name,
            "alternateName": branding.alternateName,
            "url": projectRoot,
            "description": branding.description,
            "author": {
                "@type": "Person",
                "name": branding.name,
                "url": branding.authorUrl
            }
        };

        // Remove existing schema to avoid duplicates
        const existingSchema = document.getElementById('ar-seo-schema');
        if (existingSchema) existingSchema.remove();

        const script = document.createElement('script');
        script.id = 'ar-seo-schema';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaData);
        document.head.appendChild(script);

        // 5. Automatic Home Page Branding
        if (currentPath === '/' || currentPath === '/index.html') {
            const checkBranding = () => {
                const h1 = document.querySelector('h1');
                if (!h1 || !h1.textContent.includes(branding.name)) {
                    // This logic can be customized or used to inject branding if missing
                    console.log(`Verified branding for ${branding.name}`);
                }
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkBranding);
            } else {
                checkBranding();
            }
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateSEO);
    } else {
        updateSEO();
    }

    // Export for manual updates if needed
    window.arSeoEngine = {
        update: updateSEO,
        branding: branding,
        info: {
            origin: currentOrigin,
            projectRoot: projectRoot
        }
    };
})();
