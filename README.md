# ImageSquish - Browser-based Image Compression

High-performance client-side image compression tool built with React and Vite. Compress your images directly in the browser without compromising quality or uploading to servers.

## ✨ Features

- **🚀 Pure Client-Side Processing**
  - No server uploads needed
  - Instant compression
  - Privacy-focused

- **💪 Powerful Compression**
  - Up to 90% size reduction
  - Multiple format support (WebP, JPEG, PNG)
  - Quality control

- **⚡ Performance Optimized**
  - WebAssembly-powered compression
  - Efficient state management
  - Minimal re-renders

- **🎨 Modern UI/UX**
  - Drag and drop interface
  - Real-time preview
  - Responsive design
  - Dark mode support

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend Framework |
| Vite | Build Tool |
| TailwindCSS | Styling |
| jsquash | WebAssembly-based Codecs |
| React Hooks | State Management |

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
npm or yarn
```

### Installation

```bash
# Clone the repository
git clone https://github.com/msanmaz/client-img-comp.git

# Navigate to project directory
cd image-squish

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Architecture

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CompressionOptions/
│   │   ├── FormatSelector.jsx
│   │   ├── QualitySlider.jsx
│   │   └── index.jsx
│   ├── DropZone/
│   │   └── index.jsx
│   └── FilePreviewGrid/
│       └── index.jsx
├── lib/
│   ├── utils/
│   │   ├── imageProcessing.js
│   │   └── wasm.js
│   └── compression/
│       └── codecs.js
└── hooks/
    └── useFileUpload.js
```
