# GB_LandingPages — agent + dev guide

Static marketing site (plain HTML/CSS/JS, no build step). Deployed to Cloudflare
Pages project **`gblanding`** → custom domain **https://greatbless.com** (+ www).
All Pages projects here are direct-upload (NOT git-connected), so **a `git push`
does NOT publish** — you must deploy.

## Deploying (required for ANY change to go live)

```powershell
.\deploy.ps1          # wraps: wrangler pages deploy . --project-name gblanding
```
Committing to git only saves history. The live site serves the last *deployed*
upload. After editing anything under `/` or `/pages/`, run `deploy.ps1`.

## SEO files — keep in sync (IMPORTANT for any AI/dev editing pages)

`robots.txt` and `sitemap.xml` are **hand-maintained** (no generator).

- **When you ADD / RENAME / REMOVE a page** under `/` or `/pages/`, you MUST edit
  `sitemap.xml` to match (add/rename/remove the corresponding `<url>` entry, using
  the clean URL form e.g. `https://greatbless.com/pages/blog`), then redeploy.
- URLs in the sitemap are extensionless (Cloudflare Pages serves `foo.html` at `/foo`).
- After deploying, verify the files are live and correctly typed:
  ```
  curl https://greatbless.com/robots.txt    # text/plain, your file (not HTML)
  curl https://greatbless.com/sitemap.xml   # application/xml (not HTML)
  ```
  If they return `text/html`, the deploy didn't include them (or the path fell
  through to the SPA index fallback).

## Cloudflare zone settings this repo depends on (set once, in dashboard)

- **Manage your robots.txt = "Disable robots.txt configuration"** — else Cloudflare
  injects a managed robots.txt that overrides the file here and blocks AI bots.
- **Block AI training bots = "Do not block (allow crawlers)"** — allows AI to crawl.
- These are zone-level (greatbless.com) and also cover support-app.greatbless.com.

## RULE: no Vietnamese in URLs / slugs / identifiers (legal)

This broker must NOT be publicly identifiable as Vietnamese. Keep **all URLs, page
filenames, and code identifiers in English**. Vietnamese is fine in visible page
*content*, never in a path, filename, or anything that appears in a URL / sitemap.

## Not published to the live site

Cloudflare Pages `wrangler pages deploy` uploads the whole directory and does NOT
honor `.assetsignore`. So **`deploy.ps1` stages the publishable files into a temp
dir** (excluding `deploy.ps1`, `.gitignore`, `*.md` incl. this file) and deploys
that. If you add a new repo-only file, add it to `$excludeFiles` in `deploy.ps1`.

## Google Search Console

Sitemap submitted at property greatbless.com → Sitemaps → `https://greatbless.com/sitemap.xml`.
Re-check coverage there after adding pages.
