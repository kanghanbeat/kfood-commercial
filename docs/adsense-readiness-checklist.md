# AdSense Readiness Checklist

Last reviewed: 2026-06-04

## Site Ownership And Metadata

- Set `EXPO_PUBLIC_SITE_URL` to the production HTTPS domain before export/deploy.
- Add the AdSense verification value to `EXPO_PUBLIC_ADSENSE_SITE_VERIFICATION` only after Google provides it.
- Do not treat the AdSense verification value as a secret; it is rendered as a public meta tag.
- Confirm the rendered home page includes standard title, description, canonical, Open Graph, and `google-adsense-account` metadata when configured.

## ads.txt

- Do not publish fake or placeholder publisher IDs.
- Add `public/ads.txt` only after the real Google publisher ID is available.
- Use the exact seller line provided by Google AdSense for the verified account.
- Confirm the publisher ID in `ads.txt` exactly matches the AdSense account before deployment.

## Policy And Disclosure Pages

- `/privacy` discloses Google AdSense, third-party advertising cookies, recommendation behavior data, uploaded content, AI photo analysis, and deletion/contact paths.
- `/cookie-policy` explains cookies, Google AdSense, third-party advertising, user controls, and non-intrusive ad placement principles.
- `/content-policy`, `/report-policy`, `/terms`, `/contact`, `/about`, and `/ai-disclaimer` remain publicly accessible from footer trust links.

## Ad Placement Rules

- Do not place ads near upload, report, login, map-opening, save, search submit, tab, or navigation controls.
- Do not add popups, sticky overlays, interstitials, or screen-blocking ad units.
- Keep initial launch ad-free or use very limited in-content placements only after review readiness is confirmed.
- If ads are added later, separate them visually from editorial food guides and traveler journals.

## Content Quality

- Do not present sample, seeded, or curated content as real user reviews.
- Keep pages useful without ads: region, food, place, journal, search, and trust pages should stand on their own.
- Ensure sitemap and robots files use the real production domain and do not expose admin or debug paths.

## Final Pre-Review Checks

- Run `npm run typecheck`.
- Run `npm run lint`.
- Build/export the web app and inspect the generated HTML for metadata.
- Visit `/privacy`, `/cookie-policy`, `/content-policy`, `/report-policy`, `/about`, `/contact`, `/terms`, and `/ai-disclaimer` on the deployed domain.
- Confirm no fake publisher ID, fake ad slot, or aggressive ad placement exists in source or deployed output.
