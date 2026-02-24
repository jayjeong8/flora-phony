# FloraPhony Design Concept: Organic Warm

## Visual Identity

FloraPhony's visual language draws from handmade, organic textures — warm paper tones, soft watercolor washes, and natural earth pigments. The UI should feel like a lovingly crafted sketchbook rather than a sterile digital interface.

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--flora-bg` | `#F9F7F2` | Main canvas / page background (warm off-white) |
| `--flora-bg-subtle` | `#F3EDE4` | Subtle surface differentiation |
| `--flora-green` | `#6B8E23` | Primary plant green (Olive Drab) |
| `--flora-green-light` | `#8FB339` | Hover / highlight green |
| `--flora-terra` | `#D4A373` | Accent (Terra Cotta) — buttons, active states |
| `--flora-terra-light` | `#E4C9A8` | Subtle accent backgrounds |
| `--flora-text` | `#333333` | Primary text (Dark Grey) |
| `--flora-text-muted` | `#7A7A6E` | Secondary / muted text |
| `--flora-border` | `#D9D3C7` | Borders and dividers |

## Typography

- **Display / Logo**: `Quicksand` — rounded, friendly, organic feel
- **Body / UI**: `Montserrat` — clean, modern readability
- Both loaded via `next/font/google` for optimal performance

## Design Principles

1. **Warmth over Precision**: Soft edges, organic shapes, muted tones
2. **Negative Space**: Generous whitespace to let the garden breathe
3. **Subtle Texture**: Noise overlays and warm gradients for paper-like feel
4. **Minimal Chrome**: UI fades into background; plants are the stars
5. **Gentle Transitions**: Slow, eased animations that feel natural

## Component Style

- **Buttons**: Rounded (`border-radius: 9999px`), soft shadows, terra cotta accent
- **Cards / Panels**: Off-white with subtle border, no harsh shadows
- **Icons**: Line art style, thin strokes, organic curves
- **Seed Bar**: Frosted glass effect over warm background
- **Modals**: Centered, soft backdrop blur, warm tones
