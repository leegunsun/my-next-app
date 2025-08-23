# Project Cleanup Instructions

This file provides guidance for cleaning up the my-next-app project structure and removing unnecessary files.

## Phase 1: Directory Structure Analysis

### Current Root Directory Structure
The project has accumulated numerous files at the root level that should be organized into appropriate directories:

**Documentation Files** (should move to `docs/` folder):
- ADMIN_DESIGN_SYSTEM.md
- CLEANUP_INSTRUCTIONS.md  
- FIXES_APPLIED.md
- GOOGLE_LOGIN_TROUBLESHOOTING.md
- MESSAGES_SETUP.md
- PORTFOLIO_INTEGRATION_REPORT.md
- test-report-section-editing.md

**Script Files** (should move to `scripts/` folder):
- build.ps1
- clean-build.ps1  
- cleanup.mjs
- cleanup.ps1
- delete-test-dirs.js
- fix-build.ps1
- fix-eperm.ps1
- install-deps.bat
- install-missing-deps.bat
- test-build.bat
- test-build.ps1
- test-build2.ps1
- test-fcm.js

**Temporary/Test Files** (should be removed):
- test-resume.html
- test-resume.txt

**Configuration Files** (should remain in root):
- package.json, next.config.ts, tsconfig.json, tailwind.config.ts, eslint.config.mjs, postcss.config.mjs
- README.md (main project readme)
- CLAUDE.md (project instructions)

## Phase 2: File Organization

### Create Directory Structure
1. Create `docs/` directory for documentation
2. Create `scripts/` directory for build/utility scripts

### Move Files to Appropriate Locations
1. Move documentation files to `docs/`
2. Move script files to `scripts/`
3. Remove temporary test files

## Phase 3: Test Directory Cleanup

### Test Pages in Root App Directory
The following test pages exist in the app directory and should be evaluated:

**Potential Cleanup Candidates:**
- `app/test-admin-header/page.tsx` - Admin header testing
- `app/test-admin-stats/page.tsx` - Admin statistics testing  
- `app/test-breadcrumb/page.tsx` - Breadcrumb component testing
- `app/test-search-fixed/page.tsx` - Fixed search functionality testing
- `app/test-search/page.tsx` - Search functionality testing
- `app/test-select-layer/page.tsx` - Select component layer testing
- `app/test-select/page.tsx` - Select component testing
- `app/mobile-auth-test/page.tsx` - Mobile authentication testing

**Recommendation:** These test pages can be removed once their functionality is confirmed to work in the main application.

## Phase 4: Component Cleanup

### DevGate Alternative Files
Several `-new` variants exist in the dev-gate directory:
- `DevGateLayout-new.tsx`
- `auth-context-new.tsx`
- Various component variants with `-new` suffix

**Action Required:** Determine which versions to keep and remove alternatives.

## Phase 5: API Cleanup

### Unused API Endpoints
Based on the FIXES_APPLIED.md analysis:
- `/api/portfolio/resume-upload` - May be unused
- `/api/portfolio/resume-upload-firebase` - Marked as unused
- `/api/portfolio/resume-upload-admin` - Marked as unused

**Action Required:** Confirm these endpoints are not needed and remove if confirmed unused.

## Phase 6: Public Directory Cleanup

### Resume Files in Public/Uploads
Multiple resume backup files exist:
- backup-resume-*.pdf (multiple versions)
- resume-*.pdf (multiple versions)

**Recommendation:** Keep only the current resume and remove old backup files.

## Implementation Steps

### Step 1: Backup Current State
```bash
git add .
git commit -m "Backup before cleanup - all current files"
```

### Step 2: Execute Phase 2 (Directory Organization)
```bash
# Create directories
mkdir docs scripts

# Move documentation files
mv *.md docs/ (excluding README.md and CLAUDE.md)

# Move script files  
mv *.ps1 *.bat *.mjs scripts/

# Remove temporary files
rm test-resume.html test-resume.txt
```

### Step 3: Test Application
```bash
npm run build
npm run dev
```

### Step 4: Remove Test Pages (if confirmed safe)
```bash
rm -rf app/test-*
rm -rf app/mobile-auth-test
```

### Step 5: Clean Public Directory
```bash
# Remove old resume backups (keep current-resume.pdf)
rm public/uploads/resumes/backup-resume-*.pdf
rm public/uploads/resumes/resume-*.pdf
```

### Step 6: Final Verification
```bash
npm run build
npm run lint
git add .
git commit -m "Project cleanup complete - organized directory structure"
```

## Expected Benefits

1. **Cleaner Root Directory** - Only essential configuration files remain
2. **Better Organization** - Documentation and scripts in appropriate directories
3. **Reduced Clutter** - Temporary and duplicate files removed
4. **Improved Navigation** - Easier to find relevant files
5. **Professional Structure** - Follows Next.js project best practices

## Rollback Plan

If issues arise after cleanup:
```bash
git log --oneline -10  # Find the backup commit
git reset --hard <backup-commit-hash>
```

This cleanup should significantly improve the project structure while maintaining all essential functionality.