# VeoPR - Next.js TypeScript Project

A modern React application showcasing Puerto Rican entertainment programs, built with Next.js, TypeScript, Tailwind CSS, and HeroUI.

## Features

- 🚀 Built with Next.js for optimized performance and SEO
- ⚡ TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🌟 HeroUI (NextUI) for beautiful UI components
- 📱 Fully responsive design
- 🎭 Smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## Project Structure

```
pages/               # Next.js pages
  _app.tsx          # App wrapper
  _document.tsx     # Document head
  index.tsx         # Home page
  producto/         # Product pages
  productos.tsx     # Products listing
  programas/        # Program pages
src/
  components/       # React components
    Header.tsx      # Navigation header
    Hero.tsx        # Hero banner section
    CarruselProgramas.tsx  # Programs carousel
    CarruselProductos.tsx  # Products carousel
    Footer.tsx      # Footer with links
  pages/            # Page components
  index.css         # Global styles with Tailwind
public/             # Static assets
  *.png, *.jpeg     # Program and product images
```

## Technologies Used

- **Next.js 15** - React framework with SSR/SSG
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **HeroUI** - Modern React UI components
- **Framer Motion** - Animation library

## License

MIT