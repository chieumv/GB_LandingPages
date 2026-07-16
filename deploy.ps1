# GreatBless Landing Page — Cloudflare Pages Deploy Script
# Usage: .\deploy.ps1 [-ProjectName gblanding] [-Branch main]
#
# Static site — no build step. Every file in this directory IS the deploy output.
# (wrangler pages deploy ignores .git / node_modules automatically, verified: the
#  live site does not serve /.git/*.)

param(
    [string]$ProjectName = "gblanding",
    [string]$Branch = "main"
)

Write-Host ""
Write-Host "=== GreatBless Landing Deploy ===" -ForegroundColor Cyan
Write-Host "Project:  $ProjectName" -ForegroundColor White
Write-Host "Branch:   $Branch" -ForegroundColor White
Write-Host ""

$deployDir = $PSScriptRoot

# Cloudflare Pages `wrangler pages deploy` uploads the WHOLE directory and does
# NOT honor .assetsignore. To keep repo-only files (deploy.ps1, docs, .gitignore)
# off the public site, stage the publishable files into a temp dir and deploy THAT.
# Kept: index.html, pages/, public/, components/, robots.txt, sitemap.xml.
$excludeFiles = @("deploy.ps1", ".gitignore", ".assetsignore", "*.md")
$excludeDirs = @(".git", ".github", ".wrangler", ".deploy", "node_modules")

$staging = Join-Path ([System.IO.Path]::GetTempPath()) ("gbdeploy_" + [System.Guid]::NewGuid().ToString("N"))
Write-Host "Staging publishable files -> $staging" -ForegroundColor Yellow
robocopy $deployDir $staging /E /NFL /NDL /NJH /NJS /NC /NS /NP /XF $excludeFiles /XD $excludeDirs | Out-Null
if ($LASTEXITCODE -ge 8) {
    Write-Host "Staging copy failed (robocopy exit $LASTEXITCODE)." -ForegroundColor Red
    Remove-Item -Recurse -Force $staging -ErrorAction SilentlyContinue
    exit 1
}
Write-Host ""

Write-Host "Deploying staged files..." -ForegroundColor Yellow
pnpm dlx wrangler pages deploy $staging `
    --project-name $ProjectName `
    --branch $Branch `
    --commit-dirty=true
$deployExit = $LASTEXITCODE

Remove-Item -Recurse -Force $staging -ErrorAction SilentlyContinue

if ($deployExit -ne 0) {
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
