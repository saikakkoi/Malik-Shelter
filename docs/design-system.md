# Design System: Malik Shelter
## 1. Brand Identity

| Attribute | Description |
| :--- | :--- |
| **Personality** | Friendly, Cute, Animal-Cute, Trustworthy |
| **Voice** | Warm, encouraging, soft, and clear. Avoids bureaucratic language. |
| **Logo** | [Placeholder] |

---

## 2. Color Palette

### Primary Palette
| Role | Color Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Sage Green | `#C4CEA1` | Brand identity, headers, active states. "Calming, natural." |
| **Secondary** | Soft Rose | `#E4B1AB` | Supportive elements, illustrations. "Love and tenderness." |
| **Accent** | Terracotta | `#CF9963` | **Call-to-Action (Buttons)**, links. "Warm and prominent." |

### Neutral & Utility
| Role | Color Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | Warm White | `#FEF0EF` | Page background. "Clean, soft, not stiff." |
| **Highlight** | Pale Yellow | `#FDF2B0` | Badges (e.g., "New Cat"), tips. "Cheerful." |
| **Text (Dark)** | Charcoal | `#4A4A4A` | Main text (for contrast on Warm White). |
| **Text (Light)** | Off White | `#FFFDFD` | Text on dark backgrounds/buttons. |

---

## 3. Typography

### Font Families
*   **Headings / Body / Buttons**: **[Delius Unicase](https://fonts.google.com/specimen/Delius+Unicase)**
    *   *Usage*: All main text, descriptions, navigation, and buttons. Adds the "cute/handwritten" feel.
*   **Forms / Inputs / UI Labels**: **[Lexend](https://fonts.google.com/specimen/Lexend)**
    *   *Usage*: Input fields, form labels, data tables. Ensures high legibility for data entry.

### Type Scale (Reference)
| Style | Size (rem) | Weight | Font Family |
| :--- | :--- | :--- | :--- |
| **H1** | 2.5 | 700 | Delius Unicase |
| **H2** | 2.0 | 700 | Delius Unicase |
| **H3** | 1.75 | 400 | Delius Unicase |
| **Body** | 1.0 | 400 | Delius Unicase |
| **Button** | 1.0 | 700 | Delius Unicase |
| **Label** | 0.875 | 500 | Lexend |
| **Input** | 1.0 | 400 | Lexend |

---

## 4. Unification & Shape

*   **Corner Radius**: **Rounded** (`12px` to `24px`). Avoid sharp 90° corners.
*   **Spacing**: **Spacious**. Use liberal whitespace (padding/margin) to create a relaxed, uncluttered feel.
*   **Shadows**: Soft, diffused shadows (e.g., `0px 4px 12px rgba(196, 206, 161, 0.3)`) to add depth without harshness.

---

## 5. UI Elements

### Buttons
*   **Primary (Adopt)**:
    *   Background: `#CF9963` (Terracotta)
    *   Text: `#FFFDFD` (Off White)
    *   Font: Delius Unicase
    *   Shape: Rounded (`12px`)
*   **Secondary**:
    *   Background: `#C4CEA1` (Sage Green)
    *   Text: `#FFFDFD`
    *   Shape: Rounded (`12px`)

### Cards (Pet Profile)
*   Background: White (`#FFFFFF`) or v. light tint of Warm White.
*   Border: None or subtle border in Sage Green (`#C4CEA1`).
*   Radius: `20px`.
*   Layout: Image top (curved top corners), content below.

### Forms
*   Font: **Lexend**.
*   Input Background: White (`#FFFFFF`).
*   Border: `#C4CEA1` (Sage Green).
*   Focus State: Glow of `#E4B1AB` (Soft Rose).
*   Radius: `12px` (Soft rounded).

### Badges / Tags
*   **"New"**: Background `#FDF2B0` (Pale Yellow), Text Dark.
*   **Personality**: Background `#E4B1AB` (Soft Rose), Text White.

### Loading Screen
*   **Animation**: Cat Mark Loading (Lottie)
*   **Source**: [https://lottiefiles.com/free-animation/cat-mark-loading-VlrnxEpvgu](https://lottiefiles.com/free-animation/cat-mark-loading-VlrnxEpvgu)


---

## 6. Iconography
*   Style: Rounded, outline or soft-filled.
*   Library Recommendation: **Iconify** (using rounded/soft icon sets).

---

## 7. Accessibility Checklist
*   [ ] Ensure meaningful contrast between `#CF9963` (Accent) and white text.
*   [ ] Verify `Delius Unicase` readability for long paragraphs (fallback to sans-serif if needed).
*   [ ] Focus states must be visible on inputs.
