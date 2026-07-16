# Copilot instructions — GB_LandingPages

Full guidance lives in **AGENTS.md** (repo root). Read it before editing pages,
updating SEO files (robots.txt / sitemap.xml), or deploying.

Critical rules (repeated here so they are never missed):
1. **English only in URLs / page filenames / identifiers** (legal: don't reveal the
   VN origin). Vietnamese is fine in visible page content, never in a path.
2. **Deploy with `.\deploy.ps1`** — a `git push` does NOT publish (direct-upload
   Pages project `gblanding`); the live site serves the last deployed upload.
3. **When you add/rename/remove a page, update `sitemap.xml`** to match, then deploy.
