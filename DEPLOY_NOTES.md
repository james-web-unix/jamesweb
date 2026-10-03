# James Web — SEO / AEO / GEO / E-E-A-T build notes (3 Oct 2026)

Deploy: upload this folder to Netlify as before (publish dir `.`). Then see "After deploy".

## What changed
- **Entity graph on every page** (JSON-LD): Luminary Technicals > James Web (division) > Luminary Books (imprint) > James Web Logical (Book) with the author as Person. Same `@id`s everywhere.
- **Book schema**: real chapter titles (they now match the page), Kindle + Google Play + online `workExample`s with Offers (free in India, $3 USD stores), ASIN `B0GYG67XF5`. Fake ISBN removed.
- **Cover as OG image on `/logical/` only** (`og-james-web-logical.jpg`, 1200x630, whole banner kept). The book crop `james-web-logical-book.jpg` is used as the on-page book preview (home card, reader card, schema image). Other pages keep the logo.
- **Store buttons** (Amazon Kindle, Google Play Books) on home, `/logical/` hero + pricing, About. HTTPS links, `rel="noopener noreferrer"`.
- **Upcoming slot**: "James Web Onion Mode — Coming soon" on home, `/logical/`, Learning Portal. No schema/price/ISBN until it exists.
- **AEO/GEO**: FAQ (8 Q&As, visible text = schema text), HowTo for the Legal Lab Checklist, Speakable, `llms.txt`, disambiguation from the James Webb Space Telescope.
- **E-E-A-T pages**: `/about/`, `/ethics/`, `/contact/`, `/privacy/`, `/disclaimer/`, `/corrections/` (+ dated change log), `/.well-known/security.txt`.
- **Removed `seo-engine.js`**: it rewrote canonicals/OG at runtime and injected a conflicting WebSite schema. All metadata is static HTML now.
- **Privacy**: removed exact birth date, city, coordinates (ICBM) and the age stat; region only (`IN-BR`, "Bihar, India").
- **Unsourced claims removed** (Guinness / Golden Book / "youngest" / "2x World Record Holder") from page, FAQ and schema. See below to put them back with proof.
- **Redirects**: single source `_redirects` (correct old domain `james-web-unix.netlify.app`; `netlify.toml` no longer duplicates it). Clean URLs, `/index.html` duplicates redirect.
- **Sitemap**: one generator (`scripts/generate-sitemap.js`), all 10 pages, image entries for the book page. Old root generator deleted.
- **Headers**: HSTS added, deprecated X-XSS-Protection dropped, JS/CSS no longer cached "immutable" for a year (they are not fingerprinted).
- `/logical/` page went from 489 KB to ~100 KB (the cover was embedded as base64).

## Needs you
1. **Check both store links open the right listing.** The Amazon URL slug reads "Security Simplified", which differs from the book's subtitle. If the Amazon title differs, update it everywhere (search `B0GYG67XF5`).
2. **Recognition claims**: when you have a certificate or official listing URL, add a "Recognition" section to `/about/` with the link, then add `award` to the Person node. Do not add them without a source.
3. **ISBN**: if the book has one, add `"isbn"` to the Book and the Kindle/Play workExamples.
4. **Social profiles**: add any official profiles (YouTube, LinkedIn, GitHub) to the Person `sameAs` in the Person node (search `"sameAs"` in each page).
5. **Contact email**: Contact page and `security.txt` use the Luminary Technicals site as the channel. Add a real mailbox if you want one.

## After deploy
1. Google Search Console: submit `https://jamesweb.dpdns.org/sitemap.xml`, then Request Indexing for `/`, `/logical/`, `/about/`, `/ethics/`.
2. Bing Webmaster Tools: add the site (import from Search Console), submit the sitemap, then run `node scripts/indexnow.js`.
3. Test `/` and `/logical/` in Google's Rich Results Test and validator.schema.org.
4. Test the share preview of `/logical/` (Facebook Sharing Debugger, X/LinkedIn inspectors). They cache old previews, so re-scrape once.

## When James Web Onion Mode is released
Add a Book node (copy `book_node` in the schema), store links and ISBN; add it to home `#books`, `learning/` `COURSES`, `reader/` `BOOKS`, `llms.txt`, `sitemap`; remove "Coming soon".

## Bigger lever
`.dpdns.org` is a free shared subdomain, which limits how much authority Google assigns. A custom domain (with the 301s already in place) would help more than any markup.
