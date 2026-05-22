# Wish List Design System — "WishList Pro Tracker"

Welcome to the **WishList Pro Tracker** design system specification. This document captures the complete visual language, design guidelines, color palette tokens, and typographic scale extracted directly from the official Stitch project.

---

## 🎨 Color Palette

This design system uses a premium **"Deep Emerald"** primary palette, balanced by warm chamapgne tones and sophisticated muted/neutral surfaces. This layout follows Material Design 3 token logic.

### 🟢 Primary Colors
The primary theme uses rich emerald tones to convey high quality and premium branding.

| Token Name | Hex Code | Description / Usage |
| :--- | :--- | :--- |
| `primary` | `#032121` | Deepest brand action/headline color |
| `primary_container` | `#1A3636` | Primary background color for containers and highlighted cards |
| `on_primary` | `#FFFFFF` | Text/icons displayed on top of the primary color |
| `on_primary_container` | `#829F9F` | Text/icons displayed on top of primary container |
| `primary_fixed` | `#CAE8E8` | Fixed light variant of the primary color |
| `primary_fixed_dim` | `#AECCCC` | Muted variant of fixed primary |

### 🟤 Secondary & Tertiary Accent Colors
These accent colors are used for category tags, priority flags, secondary actions, and subtle brand accents.

| Token Name | Hex Code | Description / Usage |
| :--- | :--- | :--- |
| `secondary` | `#6F5B3D` | Soft brand secondary color (champagne tone) |
| `secondary_container` | `#F6DCB5` | Container background for secondary accents |
| `on_secondary` | `#FFFFFF` | Text on secondary color |
| `on_secondary_container` | `#736041` | Text on secondary container |
| `tertiary` | `#0D201A` | Dark forest emerald, used for high-contrast tag accents |
| `tertiary_container` | `#23352F` | Soft forest tone container background |
| `on_tertiary` | `#FFFFFF` | Text on tertiary color |
| `on_tertiary_container` | `#8A9E96` | Muted text on tertiary container |

### ⚪ Background & Surfaces
Neutral surface steps designed to provide natural hierarchy, tonal elevation, and smooth dark/light depth.

| Token Name | Hex Code | Description / Usage |
| :--- | :--- | :--- |
| `background` | `#F9F9FB` | Default app/page background |
| `on_background` | `#1A1C1D` | Standard text/content on the page background |
| `surface` | `#F9F9FB` | Base surface color |
| `surface_bright` | `#F9F9FB` | Brightest surface card variation |
| `surface_dim` | `#D9DADC` | Muted/shaded surface variation |
| `surface_container_lowest` | `#FFFFFF` | Lowest depth/card surface (pure white card background) |
| `surface_container_low` | `#F3F3F5` | Low depth container background |
| `surface_container` | `#EEEEF0` | Default container color |
| `surface_container_high` | `#E8E8EA` | Elevating background color for secondary containers |
| `surface_container_highest`| `#E2E2E4` | Deepest/highest depth container background |
| `on_surface` | `#1A1C1D` | Primary text color on standard surfaces |
| `on_surface_variant` | `#414848` | Muted/secondary text color on surfaces |
| `outline` | `#727878` | Key borders and dividers |
| `outline_variant` | `#C1C8C7` | Soft, subtle decorative divider borders |

### 🔴 Status & Feedback Colors
Clean and soft feedback tokens.

| Token Name | Hex Code | Description / Usage |
| :--- | :--- | :--- |
| `error` | `#BA1A1A` | Alert, delete, and high-priority action indicator |
| `error_container` | `#FFDAD6` | Background tint for error banners |
| `on_error` | `#FFFFFF` | Text on error |
| `on_error_container` | `#93000A` | Text on error container |

---

## ✍️ Typography

The typography system pairs the elegant and geometric **Manrope** for primary headers/display text with the clean, highly-legible **Inter** for descriptions, tags, and interface values.

| Style Name | Font Family | Size (px) | Weight | Line Height | Letter Spacing | Ideal Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Large** | `Manrope` | `40px` | `700` (Bold) | `48px` | `-0.02em` | Splash screens, empty states, hero titles |
| **Headline Large** | `Manrope` | `28px` | `600` (Semi-Bold) | `36px` | Normal | Core section headings, drawer headers |
| **Headline Small** | `Manrope` | `18px` | `600` (Semi-Bold) | `24px` | Normal | Card titles, minor sub-sections |
| **Body Large** | `Inter` | `16px` | `400` (Regular) | `24px` | Normal | Descriptions, paragraph copy, item details |
| **Body Medium** | `Inter` | `14px` | `400` (Regular) | `20px` | Normal | Supporting metadata, lists, input labels |
| **Label Medium** | `Inter` | `12px` | `500` (Medium) | `16px` | `0.05em` | Chips, category badges, button label tags |

---

## 📏 Layout & Spacing

An **8pt grid logic** guides all interface proportions, utilizing a **4pt baseline** for clean typographic alignment.

*   **Side Margins:** A fluid **20px** margin on mobile screens guarantees a generous "premium" whitespace, allowing layouts to breathe.
*   **Grid Cards:** Card structures leverage a **16px** gutter spacing.
*   **Vertical Rhythm:**
    *   `stack-sm` (`8px`): Spacing between closely coupled metadata items (e.g., label to title).
    *   `stack-md` (`16px`): Spacing between standard elements inside a card or form inputs.
    *   `stack-lg` (`32px`): Spacing between main page sections (e.g., separating "Recently Added" from "Folders").

---

## 📐 Shape & Corner Roundness

Large, architectural rounded corners distinguish this layout, creating a pleasant tactile feedback:

*   **Small (`sm`) - `0.25rem` (4px):** Used for micro UI indicators and badges.
*   **Default - `0.5rem` (8px):** Standard corner radius.
*   **Medium (`md`) - `0.75rem` (12px):** Form input fields, dropdown menus, and overlays.
*   **Large (`lg`) - `1rem` (16px):** Secondary buttons, search bars, and floating controls.
*   **Extra Large (`xl`) - `1.5rem` (24px):** Main wish cards and list container cards.
*   **Full (`full`) - `9999px` (Pill):** Main action buttons, progress bars, category tabs, and priority chips.

---

## 🕶️ Depth & Elevation

Depth is communicated through **Tonal Elevation** and soft shadows instead of heavy, dark lines.

1.  **Background (Level 0):** Flat, using the neutral `#F9F9FB` surface background.
2.  **Cards & Containers (Level 1):** Uses `#FFFFFF` surface color with a subtle `1px` border (`#E0E0E0` or `outline_variant` `#C1C8C7`) accompanied by a highly diffused, ambient shadow (`Blur: 20px, Y: 4, Opacity: 4% Black`).
3.  **Active Interactions (Level 2):** Triggers an elevated scale-up transition to `1.02x` scale and deepens the shadow opacity to `8%`.
4.  **Overlays & Bottom Sheets (Level 3):** Elevates floating sheets above backgrounds, paired with a modern `12px` backdrop-filter blur.

---

## 🧩 Key Component Guidelines

*   **Wish List Item Cards:** Keep generous `20px` internal card padding. Images should use standard `1:1` or `4:5` aspect ratios with matched top-border corner radii.
*   **Action Buttons:**
    *   *Primary:* Solid primary emerald fill (`#1A3636` or `#032121`) with clean white text.
    *   *Secondary:* Tonal secondary fill (`10%` of Primary) with `#032121` text.
*   **Progress Chips & Status Tags:** Showcase badges like "Price Drop," "In Stock," or "High Priority" using the warm secondary champagne tint (`#F6DCB5`) or desaturated tertiary tones.
*   **Input Fields:** Float the small helper labels upward on focus, and keep container borders minimal or bottom-only.
