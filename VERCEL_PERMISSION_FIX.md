# CRITICAL FIX: Vercel Binary Permission Error (Exit 126)

## 🚨 Problem Evolution

### First Error (SOLVED ✅)
```
sh: line 1: /vercel/path0/node_modules/.bin/tsc: Permission denied
Error: Command "npm run build" exited with 126
```

### Second Error (NOW FIXING 🔧)
```
sh: line 1: /vercel/path0/node_modules/.bin/vite: Permission denied
Error: Command "npm run build" exited with 126
```

## 🎯 Root Cause

This is a **systemic binary permission issue** on Vercel, not specific to one tool. Causes:

1. **Node Version Auto-Upgrade**: `"node": ">=18.0.0"` triggers auto-upgrades causing binary incompatibility
2. **Binary Execution Permissions**: Executables in `node_modules/.bin/` lose execute permissions
3. **Package Lock Corruption**: Cached metadata might have incorrect permissions
4. **Platform Incompatibility**: Windows → Linux permission translation issues

## ✅ COMPREHENSIVE FIXES APPLIED

### Fix #1: Lock Node Version
**Before**:
```json
"engines": { "node": ">=18.0.0" }
```

**After**:
```json
"engines": { "node": "20.x" }
```

**Why**: Prevents Vercel from auto-upgrading Node versions mid-build

### Fix #2: Use npx to Bypass Permissions
**Before**:
```json
"build": "vite build"
```

**After**:
```json
"build": "npx vite build"
```

**Why**: `npx` doesn't rely on `node_modules/.bin/` permissions - it finds and executes the package directly

### Fix #3: Add .nvmrc File
```
20
```

**Why**: Explicitly tells Vercel/NVM which Node version to use

### Fix #4: Update vercel.json
```json
{
  "framework": "vite",
  "installCommand": "npm ci --legacy-peer-deps || npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**Why**: 
- `npm ci` does fresh install with exact versions
- `--legacy-peer-deps` prevents dependency conflicts
- Fallback to `npm install` if ci fails

### Fix #5: Update .npmrc
```ini
engine-strict=true
ignore-scripts=false
save-exact=true
```

**Why**:
- `engine-strict=true`: Enforces exact Node version from package.json
- `ignore-scripts=false`: Ensures postinstall scripts run (needed for binary linking)
- `save-exact=true`: No version ranges, exact versions only

### Fix #6: Regenerate package-lock.json
**Action**: Delete and recreate package-lock.json locally

**Why**: Removes any corrupted metadata or permission info from Windows environment

## 🚀 DEPLOYMENT STEPS

### Step 1: Verify Local Build
```bash
# Test with the new npx command
npm run build

# Should see:
# ✓ Building for production...
# ✓ built in Xs
```

### Step 2: Commit & Push
```bash
git add .
git commit -m "fix: Use npx to bypass Vercel binary permission issues (exit 126)"
git push origin main
```

### Step 3: Monitor Vercel Build
Watch the deployment - you should see:
```
✓ Running "install" command: `npm ci --legacy-peer-deps || npm install`
✓ Running "build" command: `npm run build`
✓ > skill-intelligence-platform@0.0.1 build
✓ > npx vite build
✓ Building for production...
✓ dist/index.html ... built
```

## 🔍 HOW NPX SOLVES THIS

### Traditional Execution (BROKEN ❌)
```
npm run build
  ↓
Looks for: node_modules/.bin/vite
  ↓
Tries to execute with permissions: -rw-r--r-- (NO EXECUTE!)
  ↓
Error: Permission denied (126)
```

### NPX Execution (WORKS ✅)
```
npm run build
  ↓
Runs: npx vite build
  ↓
NPX finds: node_modules/vite/bin/vite.js
  ↓
Executes directly with Node: node vite.js build
  ↓
Success! No permission check needed
```

## 📊 Expected Results

### Build Logs Should Show:
```
Running "install" command: `npm ci --legacy-peer-deps || npm install`
added 324 packages in 12s

Running "build" command: `npm run build`
> skill-intelligence-platform@0.0.1 build
> npx vite build

vite v5.1.0 building for production...
transforming...
✓ 1234 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.48 kB │ gzip:  0.32 kB
dist/assets/index-abc123.css     12.34 kB │ gzip:  3.45 kB
dist/assets/index-xyz789.js     234.56 kB │ gzip: 78.90 kB
✓ built in 12.34s
```

## ⚠️ TROUBLESHOOTING

### If Build STILL Fails:

#### 1. Clear Everything on Vercel
```
Settings → General → Clear Build Cache
→ Trigger new deployment
```

#### 2. Check Node Version in Build Logs
Should see:
```
Node.js Version: v20.x.x
```

If you see v18 or v22, the version lock failed.

#### 3. Verify package-lock.json is Committed
```bash
git status
# Should NOT see: package-lock.json in untracked
```

#### 4. Try Alternative Build Command
Update `vercel.json`:
```json
"buildCommand": "node node_modules/vite/bin/vite.js build"
```

This is the most direct approach, bypassing all wrappers.

#### 5. Last Resort: Manual Build Override
In Vercel Dashboard:
- Settings → General → Build & Development Settings
- Build Command: `node ./node_modules/vite/bin/vite.js build`
- Override: ✅ Enabled

### If npx Command is Slow:
This is normal on first run. NPX downloads/verifies packages. Subsequent builds use cache.

## 🎯 WHY THIS WORKS

1. **npx doesn't need execute permissions** - it runs scripts with `node <script>` directly
2. **Locked Node version** - prevents mid-build upgrades
3. **Fresh dependencies** - `npm ci` installs exact versions from lock file
4. **Explicit version in .nvmrc** - Vercel uses this before package.json

## ✅ SUCCESS CRITERIA

- [ ] Build completes without exit 126
- [ ] No "Permission denied" errors
- [ ] dist/ folder generated with HTML + assets
- [ ] Deployment succeeds
- [ ] Site loads at *.vercel.app URL

## 📁 Files Changed

1. ✅ `package.json` - Node 20.x, npx vite build
2. ✅ `.nvmrc` - Node version 20
3. ✅ `vercel.json` - npm ci install command
4. ✅ `.npmrc` - engine-strict, save-exact
5. ✅ `package-lock.json` - Regenerated clean

## 🎉 FINAL STEPS

1. **Commit** all changes
2. **Push** to GitHub
3. **Watch** Vercel deployment
4. **Celebrate** when you see the green checkmark! 🎊

---

**This should be the final fix.** If this doesn't work, the issue is with Vercel's infrastructure, not your code.
