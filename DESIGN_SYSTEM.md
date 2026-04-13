# 🎨 Design System Documentation

## Overview

Design system được refactor để đảm bảo tính nhất quán, dễ bảo trì và tuân thủ các nguyên tắc thiết kế hiện đại.

## 📁 Cấu trúc Files

```
src/site/styles/
├── _design-tokens.scss    # Design tokens (colors, spacing, typography, etc.)
├── _components.scss        # Reusable component styles
├── custom-style.scss       # Main stylesheet (imports tokens & components)
├── style.scss             # Base template styles (don't modify)
├── digital-garden-base.scss
└── obsidian-base.scss
```

## 🎯 Design Tokens

### Colors

#### Base Colors
- `--color-bg-primary`: #000000
- `--color-bg-secondary`: #0A0F1A
- `--color-bg-tertiary`: #111921

#### Surface Colors (Glassmorphism)
- `--color-surface-base`: rgba(255, 255, 255, 0.05)
- `--color-surface-elevated`: rgba(255, 255, 255, 0.08)
- `--color-surface-hover`: rgba(255, 255, 255, 0.12)

#### Text Colors
- `--color-text-primary`: rgba(255, 255, 255, 0.95)
- `--color-text-secondary`: rgba(255, 255, 255, 0.8)
- `--color-text-tertiary`: rgba(255, 255, 255, 0.6)

#### Accent Colors
- `--color-primary`: rgba(135, 206, 235, 0.9) - Sky Blue
- `--color-primary-hover`: rgba(95, 158, 160, 0.95)
- `--color-primary-active`: rgba(70, 130, 180, 1)

### Spacing System (8px base unit)

```scss
--spacing-1: 0.25rem;  // 4px
--spacing-2: 0.5rem;   // 8px
--spacing-4: 1rem;     // 16px
--spacing-6: 1.5rem;   // 24px
--spacing-8: 2rem;     // 32px
--spacing-12: 3rem;    // 48px
```

### Typography

#### Font Families
- `--font-family-primary`: 'Inter', system fonts
- `--font-family-mono`: 'SF Mono', monospace

#### Font Sizes
- `--font-size-xs`: 0.75rem (12px)
- `--font-size-sm`: 0.875rem (14px)
- `--font-size-base`: 1rem (16px)
- `--font-size-lg`: 1.125rem (18px)
- `--font-size-xl`: 1.25rem (20px)
- `--font-size-2xl`: 1.5rem (24px)
- `--font-size-3xl`: 1.875rem (30px)
- `--font-size-4xl`: 2.25rem (36px)
- `--font-size-5xl`: 3rem (48px)

#### Font Weights
- `--font-weight-light`: 300
- `--font-weight-normal`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700

### Border Radius

```scss
--radius-sm: 0.25rem;   // 4px
--radius-md: 0.5rem;    // 8px
--radius-lg: 0.75rem;   // 12px
--radius-xl: 1rem;     // 16px
--radius-2xl: 1.5rem;   // 24px
--radius-full: 9999px;
```

### Shadows

```scss
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.37);
```

### Breakpoints (Mobile-first)

```scss
--breakpoint-xs: 375px;
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## 🧩 Components

### Buttons

```html
<button class="btn btn--primary">Primary Button</button>
<button class="btn btn--secondary">Secondary Button</button>
<button class="btn btn--ghost">Ghost Button</button>
```

### Cards

```html
<div class="card">
  <div class="card__header">
    <h3 class="card__title">Card Title</h3>
  </div>
  <div class="card__content">
    Card content
  </div>
</div>
```

### Badges

```html
<span class="badge badge--primary">Primary</span>
<span class="badge badge--success">Success</span>
<span class="badge badge--warning">Warning</span>
```

### Glassmorphism

```html
<div class="glass glass--md">
  Glassmorphic content
</div>
```

## 🎨 Mixins

### Glassmorphism

```scss
@include glass($opacity: 0.05, $blur: var(--backdrop-blur-lg));
```

### Card

```scss
@include card;
```

### Button

```scss
@include button-primary;
@include button-secondary;
```

### Responsive

```scss
@include respond-to(md) {
  // Styles for medium screens and up
}
```

## 📱 Responsive Design

### Mobile-first Approach

1. **Base styles**: Mobile (default)
2. **Breakpoints**: Use `@include respond-to()` mixin
3. **Progressive enhancement**: Add features for larger screens

### Example

```scss
.component {
  padding: var(--spacing-4);
  
  @include respond-to(md) {
    padding: var(--spacing-8);
  }
  
  @include respond-to(lg) {
    padding: var(--spacing-12);
  }
}
```

## ♿ Accessibility

### Focus States

All interactive elements have visible focus states:

```scss
@include focus-visible;
```

### Screen Reader Only

```scss
.sr-only {
  @include sr-only;
}
```

### Skip Links

```html
<a href="#main-content" class="skip-link">Skip to content</a>
```

### Reduced Motion

Animations respect `prefers-reduced-motion`:

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🎭 Utility Classes

### Text

```html
<p class="text--primary">Primary text</p>
<p class="text--secondary">Secondary text</p>
<p class="text--accent">Accent text</p>
<p class="text--truncate">Long text that truncates...</p>
```

### Spacing

```html
<div class="spacing--mt-4 spacing--mb-6">Content</div>
<div class="spacing--p-8">Padded content</div>
```

### Flexbox

```html
<div class="flex flex--center flex--gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Grid

```html
<div class="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## 🚀 Best Practices

### 1. Use Design Tokens

✅ **DO:**
```scss
color: var(--color-text-primary);
padding: var(--spacing-4);
border-radius: var(--radius-lg);
```

❌ **DON'T:**
```scss
color: rgba(255, 255, 255, 0.95);
padding: 16px;
border-radius: 12px;
```

### 2. Use Mixins for Common Patterns

✅ **DO:**
```scss
.card {
  @include card;
}
```

❌ **DON'T:**
```scss
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  // ... many more lines
}
```

### 3. Mobile-first Responsive Design

✅ **DO:**
```scss
.component {
  padding: var(--spacing-4);
  
  @include respond-to(md) {
    padding: var(--spacing-8);
  }
}
```

❌ **DON'T:**
```scss
.component {
  @media (max-width: 767px) {
    padding: var(--spacing-4);
  }
  
  @media (min-width: 768px) {
    padding: var(--spacing-8);
  }
}
```

### 4. Accessibility First

✅ **DO:**
- Always include focus states
- Use semantic HTML
- Provide alt text for images
- Use ARIA labels when needed

### 5. Performance

✅ **DO:**
- Use CSS variables for theming
- Minimize specificity
- Use efficient selectors
- Leverage browser caching

## 📚 Resources

- [Design Tokens W3C Spec](https://www.w3.org/community/design-tokens/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: 2024-12-15
