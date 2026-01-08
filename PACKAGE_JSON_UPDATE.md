# Package.json Update Guide

## Current vs New Dependencies

### Remove (CRA specific)
```json
{
  "react-scripts": "^5.0.1"  // Remove this
}
```

### Add/Update Dependencies

Update your `package.json` with these changes:

```json
{
  "name": "bcon-2.0",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    
    // Supabase
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    
    // Existing dependencies (keep these)
    "gsap": "^3.12.2",
    "three": "^0.158.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0",
    "react-router-dom": "^6.20.0",  // Remove - Next.js has built-in routing
    
    // Other existing deps - keep all your current ones
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "14.0.0"
  }
}
```

## Installation Steps

1. **Backup current package.json**
   ```bash
   cp package.json package.json.backup
   ```

2. **Update package.json** with the structure above

3. **Remove node_modules and package-lock.json**
   ```bash
   rm -rf node_modules package-lock.json
   ```

4. **Install new dependencies**
   ```bash
   npm install
   ```

5. **Verify installation**
   ```bash
   npm run dev
   ```

## Migration Notes

### Remove These Packages
- `react-scripts` - Not needed in Next.js
- `react-router-dom` - Next.js has built-in routing

### Keep These Packages
- All GSAP packages
- All Three.js packages
- Any other animation libraries
- Any utility libraries

### New Packages Needed
- `next` - Next.js framework
- `@supabase/supabase-js` - Supabase client
- `@supabase/auth-helpers-nextjs` - Next.js auth helpers
- TypeScript types (if using TypeScript)

## Common Issues

### Issue: Conflicting React versions
**Solution**: Ensure React 18 is used consistently
```bash
npm install react@^18.2.0 react-dom@^18.2.0
```

### Issue: GSAP not working
**Solution**: GSAP works the same in Next.js, just ensure `'use client'` directive

### Issue: Three.js SSR errors
**Solution**: Use dynamic imports with `ssr: false` for Three.js components

### Issue: Module not found errors
**Solution**: Check all imports use correct paths, Next.js uses `@/` alias for root




