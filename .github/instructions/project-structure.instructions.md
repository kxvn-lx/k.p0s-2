---
applyTo: "**"
---

# Project Structure Overview

## `app/`
Contains entry points, navigation layouts, and top-level routing.

Only global setup lives here (Expo Router / navigation containers).

---

## `features/`
Each folder inside represents a domain feature.  
A feature contains everything that belongs to it:

- screens/pages  
- feature-specific UI components  
- business logic  
- queries, mutations, services  
- types/models  
- hooks specific to that feature  

Guideline: A feature should be shippable and understandable on its own.

---

## `components/ui/`
Reusable UI primitives accessible across all features.

Buttons, cards, typography presets, form elements, layouts.

No business logic.  
Must be fully presentation-only.

---

## `components/`
Reusable composite components that are not UI primitives and not feature-bound.

“Shared building blocks.”

Example: modal wrappers, list containers, layout shells.

---

## `lib/`
App-wide logic, not feature-specific.

Examples:

- API clients  
- configuration  
- global helpers  
- global service instances  
- environment handlers  
- platform utilities  

---

### `lib/hooks/`
Global React hooks used by multiple features.

State hooks, sensor hooks, global settings hooks, etc.  
Anything feature-specific must stay inside its feature.

---

### `lib/store/`
Shared global state containers (Zustand/Jotai/Redux).  
Only place for cross-feature state.

---

### `lib/types/`
Cross-feature type definitions and models.  
Feature-specific types remain inside the feature.

---

### `lib/styles/`
Global styling tokens (colors, spacing, typography).  
Theme definitions for RN or NativeWind.

---

### `lib/constants/`
Pure constants used across features.  
No logic or business rules.

---

# 🎯 Final Minimal Structure (LLM-Friendly)
```
app/ → navigation + root setup
features/ → feature modules (screens, logic, components)
components/ui/ → reusable UI primitives
components/ → shared composite components
lib/ → global logic + config
lib/hooks/ → global hooks
lib/store/ → global state
lib/types/ → global types
lib/styles/ → global theming
lib/constants/ → app-wide constants
```