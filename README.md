# QuickQR – Create. Scan. Share.

A fast, private QR code generator that runs entirely in your browser. Enter a link or any text, customize the colours and size, and download a crisp PNG — no account, no uploads, no backend.

**🔗 Live demo: [quickqrscanner.netlify.app](https://quickqrscanner.netlify.app/)**

## Features

- **Instant generation** from URLs or plain text, with smart URL detection and an "Add https://" helper
- **Live customization** – foreground/background colours (picker + HEX), curated presets, and export sizes of 256–2048 px
- **Scan-safety warnings** for low-contrast or inverted colour combinations
- **Download PNG** with a descriptive filename, plus **copy to clipboard** where supported
- **Light & dark mode** – follows your system setting, remembers your choice, no flash on load
- **Responsive & accessible** – mobile-first layout, keyboard shortcuts (`Ctrl/⌘ + Enter`), visible focus states, screen-reader announcements, reduced-motion support
- **Private by design** – everything happens locally; your content never leaves your device

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [qrcode](https://www.npmjs.com/package/qrcode) for QR generation
- [lucide-react](https://lucide.dev/) for icons
- Plain CSS with design tokens (CSS custom properties)

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  components/
    layout/      Navbar, Footer
    sections/    Hero, GeneratorSection, HowItWorks
    generator/   InputPanel, CustomizePanel, PreviewPanel
    ui/          Button, Card, ColorField, SegmentedControl, ThemeToggle, Toast, Logo
  hooks/         useQRCode, useTheme, useDebounce, usePersistentState, useToast
  utils/         validation, color contrast, filenames, platform detection
  constants/     QR defaults, sizes, presets
  styles/        tokens.css (light/dark design tokens), global.css
```
