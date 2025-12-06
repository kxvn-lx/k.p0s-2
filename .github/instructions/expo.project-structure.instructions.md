---
applyTo: "**"
---

# Project Structure - Expo React Native

## `app/`

Contains entry points, navigation layouts, and top-level routing.
Only global setup lives here (Expo Router / navigation containers).

---

## `features/`

Each folder inside represents a domain feature.  
A feature contains everything that belongs to it.

**Guideline**: A feature should be shippable and understandable on its own.

### Feature Subfolder Convention

```
features/<feature-name>/
├── api/           # TanStack Query queries, mutations
├── components/    # Feature-specific components
├── hooks/         # Feature-specific hooks
├── types/         # Feature-specific types
└── index.tsx      # Main screen export
```

---

## `components/ui/`

Reusable UI primitives accessible across all features.
- Buttons, cards, typography presets, form elements, layouts
- No business logic
- Must be fully presentation-only

---

## `components/shared/`

Extended components from react-native-reusables.
- Never modify bare UI primitives
- Only extend them here

---

## `lib/`

App-wide logic, not feature-specific.

| Folder | Purpose |
|--------|---------|
| `lib/hooks/` | Global hooks used by multiple features |
| `lib/store/` | Zustand stores (cross-feature state) |
| `lib/types/` | Cross-feature type definitions |
| `lib/styles/` | Global styling tokens, theme |
| `lib/constants/` | Pure constants (no logic) |

---

## Quick Reference

```
app/                    → Expo Router navigation + root setup
features/               → feature modules (screens, logic, components)
components/ui/          → reusable UI primitives
components/shared/      → extended react-native-reusables
lib/store/              → Zustand stores
lib/hooks/              → global hooks
lib/types/              → global types
```
