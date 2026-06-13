param(
  [string]$Message = ""
)

$ErrorActionPreference = "Stop"

function Stop-WithMessage {
  param([string]$Text)
  Write-Host ""
  Write-Host $Text -ForegroundColor Red
  exit 1
}

function Invoke-Git {
  param([string[]]$GitArgs)
  & git @GitArgs
  if ($LASTEXITCODE -ne 0) {
    throw "git $($GitArgs -join ' ') failed"
  }
}

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $repoRoot

Write-Host "Smartgrid Lab website publish helper" -ForegroundColor Cyan
Write-Host "Folder: $repoRoot"
Write-Host ""

try {
  & git --version | Out-Host
} catch {
  Stop-WithMessage "Git is not installed or is not available from this terminal."
}

try {
  $inside = (& git rev-parse --is-inside-work-tree).Trim()
  if ($inside -ne "true") {
    Stop-WithMessage "This folder is not a Git repository."
  }
} catch {
  Stop-WithMessage "This folder is not a Git repository."
}

$branch = (& git branch --show-current).Trim()
if (-not $branch) {
  Stop-WithMessage "Could not determine the current Git branch."
}

$remote = ""
try {
  $remote = (& git remote get-url origin).Trim()
} catch {
  Write-Host "No origin remote is configured. Commit can be made, but push will fail." -ForegroundColor Yellow
}

$status = & git status --short
if (-not $status) {
  Write-Host "No changed files to publish." -ForegroundColor Green
  exit 0
}

Write-Host "Changed files that may be published:" -ForegroundColor Yellow
$status | ForEach-Object { Write-Host "  $_" }
Write-Host ""
Write-Host "Public repository caution:" -ForegroundColor Yellow
Write-Host "Only continue if these files are safe to make public on GitHub Pages."
Write-Host ""

$confirm = Read-Host "Commit and push these changes to branch '$branch'? Type y to continue"
if ($confirm -notmatch "^(y|Y|yes|YES)$") {
  Write-Host "Canceled. Nothing was committed or pushed."
  exit 0
}

if (-not $Message) {
  $Message = Read-Host "Commit message (Enter = Update lab website content)"
  if (-not $Message) {
    $Message = "Update lab website content"
  }
}

Write-Host ""
Write-Host "Staging files..."
Invoke-Git @("add", "--all")

$staged = & git diff --cached --name-only
if (-not $staged) {
  Write-Host "No staged changes after git add. Nothing to commit." -ForegroundColor Green
  exit 0
}

Write-Host "Committing..."
Invoke-Git @("commit", "-m", $Message)

Write-Host "Pushing to origin/$branch..."
if (-not $remote) {
  Stop-WithMessage "No origin remote is configured. Commit was created locally, but push was skipped."
}
Invoke-Git @("push", "origin", $branch)

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "GitHub Pages will usually update in 1-3 minutes."
Write-Host "Live site: https://jsmtkd0516-sudo.github.io/smartgrid-lab/"
