# BCON Club Website Architecture

## Overview

The BCON Club website uses a **Component Switching** approach for responsive design, where mobile and desktop components are completely separate. This allows for independent development and optimization of each platform.

## Folder Structure

```
app/
├── page.tsx                    # Homepage (uses ResponsiveSection)
├── work/
│   └── page.tsx               # Work page (uses ResponsiveSection)
└── services/
    └── page.tsx                # Services page

components/
├── mobile/                     # Mobile-specific components
│   ├── Hero.tsx
│   ├── BusinessApps.tsx
│   ├── WorkGrid.tsx
│   └── index.ts                # Exports all mobile components
├── desktop/                    # Desktop-specific components
│   ├── Hero.tsx
│   ├── BusinessApps.tsx
│   ├── WorkGrid.tsx
│   └── index.ts                # Exports all desktop components
├── ResponsiveSection.tsx       # Wrapper component for device switching
└── shared/                     # Components used by both mobile & desktop
    └── (future shared components)

lib/
├── hooks/
│   └── useMediaQuery.ts        # Hook for detecting viewport size
└── supabase/                   # Shared data layer

sections/                       # Original section components (still used)
├── RotatingText/
├── ScrollReveal/
├── ServicesGrid/
└── ...
```

## How It Works

### ResponsiveSection Component

The `ResponsiveSection` component automatically renders the correct version based on viewport size:

```tsx
import { ResponsiveSection } from '@/components/ResponsiveSection';
import * as Mobile from '@/components/mobile';
import * as Desktop from '@/components/desktop';

<ResponsiveSection
  mobile={<Mobile.Hero />}
  desktop={<Desktop.Hero />}
/>
```

### Device Detection

- **Mobile**: Viewport width ≤ 768px
- **Desktop**: Viewport width > 768px

The breakpoint can be customized per component if needed:

```tsx
<ResponsiveSection
  mobile={<Mobile.BusinessApps />}
  desktop={<Desktop.BusinessApps />}
  breakpoint="(max-width: 1024px)"  // Custom breakpoint
/>
```

## Development Workflow

### Working on Mobile

1. Edit files in `components/mobile/`
2. Test in mobile viewport (Chrome DevTools)
3. Desktop version remains unaffected

### Working on Desktop

1. Edit files in `components/desktop/`
2. Test in desktop viewport
3. Mobile version remains unaffected

### Shared Updates

- Update data fetching in `lib/` (e.g., `lib/supabase/`)
- Both mobile and desktop components automatically get new data
- Shared UI components stay in `sections/` or `components/shared/`

## Component Mapping

| Section | Mobile Component | Desktop Component | Status |
|---------|------------------|-------------------|--------|
| Hero | `components/mobile/Hero.tsx` | `components/desktop/Hero.tsx` | ✅ Complete |
| Business Apps | `components/mobile/BusinessApps.tsx` | `components/desktop/BusinessApps.tsx` | ✅ Complete |
| Work Grid | `components/mobile/WorkGrid.tsx` | `components/desktop/WorkGrid.tsx` | ✅ Complete |
| Services Grid | `sections/ServicesGrid/` | `sections/ServicesGrid/` | 🔄 Shared (responsive CSS) |
| Portfolio | `sections/LiquidBentoPortfolio/` | `sections/LiquidBentoPortfolio/` | 🔄 Shared (responsive CSS) |
| Contact | `sections/ContactSection/` | `sections/ContactSection/` | 🔄 Shared (responsive CSS) |

## Benefits

1. **Clean Separation**: Mobile and desktop code don't interfere with each other
2. **Independent Development**: Work on one platform without affecting the other
3. **Better Performance**: Only load the code needed for the current device
4. **Easier Maintenance**: Clear structure makes it easy to find and fix issues
5. **Shared Data Layer**: Same data fetching logic for both platforms

## Future Enhancements

- [ ] Split ServicesGrid into mobile/desktop versions
- [ ] Split LiquidBentoPortfolio into mobile/desktop versions
- [ ] Split ContactSection into mobile/desktop versions
- [ ] Add more shared components to `components/shared/`
- [ ] Implement dynamic imports for code splitting
- [ ] Add performance monitoring per platform

## Notes

- The `useMediaQuery` hook uses `window.matchMedia` for accurate device detection
- Components are client-side only (`'use client'`) for proper hydration
- CSS files are shared where possible to reduce duplication
- The original `sections/` folder remains for backward compatibility

