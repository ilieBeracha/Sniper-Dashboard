# Sniper Dashboard - Visual Color Palette

## Quick Reference Color Swatches

### Primary Brand Colors

| Color Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|--------|
| **Primary Orange** | ![#E67E22](https://via.placeholder.com/100x40/E67E22/FFFFFF?text=Primary) `oklch(0.74 0.16 34.57)` | ![#E67E22](https://via.placeholder.com/100x40/E67E22/FFFFFF?text=Primary) `oklch(0.74 0.16 34.57)` | Primary buttons, CTAs, active states |
| **Accent Yellow** | ![#F39C12](https://via.placeholder.com/100x40/F39C12/FFFFFF?text=Accent) `oklch(0.83 0.11 57.89)` | ![#F39C12](https://via.placeholder.com/100x40/F39C12/FFFFFF?text=Accent) `oklch(0.83 0.11 57.89)` | Highlights, badges, accents |
| **Dark Base** | ![#161616](https://via.placeholder.com/100x40/161616/FFFFFF?text=Dark) `#161616` | ![#161616](https://via.placeholder.com/100x40/161616/FFFFFF?text=Dark) `#161616` | Headers in light mode |

### Semantic Colors

#### Success (Green)
| Shade | Hex Code | Preview | Usage |
|-------|----------|---------|--------|
| Green 600 | `#1E943D` | ![#1E943D](https://via.placeholder.com/80x30/1E943D/FFFFFF?text=+) | Dark variant |
| Green 500 | `#27BF4F` | ![#27BF4F](https://via.placeholder.com/80x30/27BF4F/FFFFFF?text=+) | Primary success |
| Green 100 | `#BFF2CD` | ![#BFF2CD](https://via.placeholder.com/80x30/BFF2CD/000000?text=+) | Light background |
| Green 50 | `#EAFBEE` | ![#EAFBEE](https://via.placeholder.com/80x30/EAFBEE/000000?text=+) | Subtle background |

#### Warning (Yellow)
| Shade | Hex Code | Preview | Usage |
|-------|----------|---------|--------|
| Yellow 600 | `#CC7700` | ![#CC7700](https://via.placeholder.com/80x30/CC7700/FFFFFF?text=+) | Dark variant |
| Yellow 500 | `#FFB800` | ![#FFB800](https://via.placeholder.com/80x30/FFB800/000000?text=+) | Primary warning |
| Yellow 100 | `#FFF0CC` | ![#FFF0CC](https://via.placeholder.com/80x30/FFF0CC/000000?text=+) | Light background |
| Yellow 50 | `#FFFBF0` | ![#FFFBF0](https://via.placeholder.com/80x30/FFFBF0/000000?text=+) | Subtle background |

#### Error (Red)
| Shade | Hex Code | Preview | Usage |
|-------|----------|---------|--------|
| Red 600 | `#CC0000` | ![#CC0000](https://via.placeholder.com/80x30/CC0000/FFFFFF?text=+) | Dark variant |
| Red 500 | `#FF3333` | ![#FF3333](https://via.placeholder.com/80x30/FF3333/FFFFFF?text=+) | Primary error |
| Red 100 | `#FFCCCC` | ![#FFCCCC](https://via.placeholder.com/80x30/FFCCCC/000000?text=+) | Light background |
| Red 50 | `#FFF0F0` | ![#FFF0F0](https://via.placeholder.com/80x30/FFF0F0/000000?text=+) | Subtle background |

#### Info (Blue)
| Shade | Hex Code | Preview | Usage |
|-------|----------|---------|--------|
| Blue 600 | `#004BCC` | ![#004BCC](https://via.placeholder.com/80x30/004BCC/FFFFFF?text=+) | Dark variant |
| Blue 500 | `#005EFF` | ![#005EFF](https://via.placeholder.com/80x30/005EFF/FFFFFF?text=+) | Primary info |
| Blue 100 | `#CCDDFF` | ![#CCDDFF](https://via.placeholder.com/80x30/CCDDFF/000000?text=+) | Light background |
| Blue 50 | `#E5EFFF` | ![#E5EFFF](https://via.placeholder.com/80x30/E5EFFF/000000?text=+) | Subtle background |

### Neutral Colors (Grays)

| Shade | Hex Code | Preview | Usage |
|-------|----------|---------|--------|
| Grey 900 | `#121212` | ![#121212](https://via.placeholder.com/80x30/121212/FFFFFF?text=+) | Darkest text |
| Grey 800 | `#2D2D2D` | ![#2D2D2D](https://via.placeholder.com/80x30/2D2D2D/FFFFFF?text=+) | Dark elements |
| Grey 700 | `#424242` | ![#424242](https://via.placeholder.com/80x30/424242/FFFFFF?text=+) | Dark gray |
| Grey 600 | `#585858` | ![#585858](https://via.placeholder.com/80x30/585858/FFFFFF?text=+) | Medium dark |
| Grey 500 | `#7B7B7B` | ![#7B7B7B](https://via.placeholder.com/80x30/7B7B7B/FFFFFF?text=+) | Medium gray |
| Grey 400 | `#B0B0B0` | ![#B0B0B0](https://via.placeholder.com/80x30/B0B0B0/000000?text=+) | Light gray |
| Grey 300 | `#D0D0D0` | ![#D0D0D0](https://via.placeholder.com/80x30/D0D0D0/000000?text=+) | Borders |
| Grey 200 | `#E7E7E7` | ![#E7E7E7](https://via.placeholder.com/80x30/E7E7E7/000000?text=+) | Light borders |
| Grey 100 | `#EFEFEF` | ![#EFEFEF](https://via.placeholder.com/80x30/EFEFEF/000000?text=+) | Light background |
| Grey 25 | `#F9F9F9` | ![#F9F9F9](https://via.placeholder.com/80x30/F9F9F9/000000?text=+) | Subtle background |

## Theme-Specific Colors

### Light Mode
```css
--background: oklch(0.99 0.01 67.74)    /* Near white background */
--foreground: oklch(0.34 0.01 7.89)     /* Dark text */
--card: oklch(1 0 0)                    /* Pure white cards */
--border: oklch(0.93 0.04 40.57)        /* Light gray borders */
```

### Dark Mode
```css
--background: oklch(0.26 0.02 351.79)   /* Deep dark background */
--foreground: oklch(0.94 0.01 48.7)     /* Light text */
--card: oklch(0.32 0.02 339.89)         /* Dark cards */
--border: oklch(0.36 0.02 342.33)       /* Subtle borders */
```

## Chart Color Palette

| Chart | Color | Preview | OKLCH Value |
|-------|-------|---------|-------------|
| Chart 1 | Primary Orange | ![#E67E22](https://via.placeholder.com/60x30/E67E22/FFFFFF?text=1) | `oklch(0.74 0.16 34.57)` |
| Chart 2 | Accent Yellow | ![#F39C12](https://via.placeholder.com/60x30/F39C12/FFFFFF?text=2) | `oklch(0.83 0.11 57.89)` |
| Chart 3 | Light Yellow | ![#F1C40F](https://via.placeholder.com/60x30/F1C40F/000000?text=3) | `oklch(0.88 0.08 56.41)` |
| Chart 4 | Orange-Yellow | ![#E67E22](https://via.placeholder.com/60x30/D68910/FFFFFF?text=4) | `oklch(0.82 0.11 41.27)` |
| Chart 5 | Deep Orange | ![#D35400](https://via.placeholder.com/60x30/D35400/FFFFFF?text=5) | `oklch(0.64 0.13 32.06)` |

## Usage Examples

### Button States

#### Primary Button
- **Default**: Background `oklch(0.74 0.16 34.57)`, Text `white`
- **Hover**: Background `oklch(0.70 0.18 34.57)`, Text `white`
- **Active**: Background `oklch(0.65 0.20 34.57)`, Text `white`
- **Disabled**: Background `oklch(0.74 0.08 34.57)`, Text `rgba(255,255,255,0.6)`

#### Secondary Button
- **Default**: Background `transparent`, Border `oklch(0.74 0.16 34.57)`, Text `oklch(0.74 0.16 34.57)`
- **Hover**: Background `oklch(0.74 0.16 34.57)`, Text `white`
- **Active**: Background `oklch(0.65 0.20 34.57)`, Text `white`
- **Disabled**: Border `oklch(0.74 0.08 34.57)`, Text `oklch(0.74 0.08 34.57)`

### Component Examples

#### Success State
```css
background-color: #EAFBEE;  /* green-50 */
border-color: #27BF4F;      /* green-500 */
color: #1E943D;             /* green-600 */
```

#### Error State
```css
background-color: #FFF0F0;  /* red-50 */
border-color: #FF3333;      /* red-500 */
color: #CC0000;             /* red-600 */
```

#### Info State
```css
background-color: #E5EFFF;  /* blue-50 */
border-color: #005EFF;      /* blue-500 */
color: #004BCC;             /* blue-600 */
```

## Accessibility Notes

### Contrast Ratios
- **Primary Orange on White**: 3.5:1 (AA for large text)
- **Primary Orange on Dark**: 4.2:1 (AA compliant)
- **Dark Text on Light BG**: 12:1 (AAA compliant)
- **Light Text on Dark BG**: 13:1 (AAA compliant)

### Color Blind Considerations
- Avoid relying solely on color for information
- Use icons alongside color indicators
- Maintain sufficient contrast between colors
- Test with color blindness simulators

## Color Application Guidelines

1. **Primary Actions**: Use primary orange for main CTAs
2. **Secondary Actions**: Use outlined buttons with primary color
3. **Destructive Actions**: Use red color family
4. **Success Feedback**: Use green color family
5. **Warnings**: Use yellow/orange color family
6. **Information**: Use blue color family
7. **Neutral Elements**: Use gray scale
8. **Backgrounds**: Use appropriate theme colors

## Quick CSS Reference

```css
/* Primary Colors */
.primary { color: oklch(0.74 0.16 34.57); }
.accent { color: oklch(0.83 0.11 57.89); }

/* Semantic Colors */
.success { color: #27BF4F; }
.warning { color: #FFB800; }
.error { color: #FF3333; }
.info { color: #005EFF; }

/* Backgrounds */
.bg-success-light { background-color: #EAFBEE; }
.bg-warning-light { background-color: #FFFBF0; }
.bg-error-light { background-color: #FFF0F0; }
.bg-info-light { background-color: #E5EFFF; }
```