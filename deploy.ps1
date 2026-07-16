# GreatBless Landing Page — Cloudflare Pages Deploy Script
# Usage: .\deploy.ps1 [-ProjectName gb] [-Branch main]
#
# Static site — no build step. Every file in this directory IS the deploy output.
# (wrangler pages deploy ignores .git / node_modules automatically, verified: the
#  live site does not serve /.git/*.)

param(
    [string]$ProjectName = "gb",
    [string]$Branch = "main"
)

Write-Host ""
Write-Host "=== GreatBless Landing Deploy ===" -ForegroundColor Cyan
Write-Host "Project:  $ProjectName" -ForegroundColor White
Write-Host "Branch:   $Branch" -ForegroundColor White
Write-Host ""

$deployDir = $PSScriptRoot

Write-Host "Deploying from: $deployDir" -ForegroundColor Yellow
Write-Host ""

# Deploy to Cloudflare Pages
pnpm dlx wrangler pages deploy $deployDir `
    --project-name $ProjectName `
    --branch $Branch `
    --commit-dirty=true

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Deploy failed! Check logs above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deploy successful!" -ForegroundColor Green
Write-Host "URL: https://$ProjectName.pages.dev  (custom domain: https://greatbless.com)" -ForegroundColor White
Write-Host ""
Write-Host "Post-deploy checklist:" -ForegroundColor Yellow
Write-Host "  1. Verify robots.txt + sitemap are LIVE (sitemap must be XML, not HTML):" -ForegroundColor White
Write-Host "       curl https://greatbless.com/robots.txt" -ForegroundColor DarkGray
Write-Host "       curl https://greatbless.com/sitemap.xml" -ForegroundColor DarkGray
Write-Host "  2. Cloudflare zone greatbless.com -> Manage AI bot access ->" -ForegroundColor White
Write-Host "       'Manage your robots.txt' = 'Disable robots.txt configuration'" -ForegroundColor DarkGray
Write-Host "       (otherwise Cloudflare's managed robots.txt overrides this file)" -ForegroundColor DarkGray
Write-Host "  3. Submit the sitemap in Google Search Console (property greatbless.com):" -ForegroundColor White
Write-Host "       https://search.google.com/search-console  ->  Sitemaps  ->  add:" -ForegroundColor DarkGray
Write-Host "       https://greatbless.com/sitemap.xml" -ForegroundColor DarkGray
Write-Host "  4. When you add/rename/remove a page, update sitemap.xml BEFORE deploying." -ForegroundColor White
Write-Host ""
