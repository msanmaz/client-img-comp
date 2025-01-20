# ImageSquish - Browser-based Image Compression

High-performance client-side image compression tool built with React and Vite. Compress your images directly in the browser without compromising quality or uploading to servers.

-- Currently only webp format is outputted... soon support for other options will be added
## ✨ Features
- **🚀 Pure Client-Side Processing**
  - No server uploads needed - all processing happens in your browser
  - Instant compression feedback
  - Privacy-focused: your files never leave your device
  - WebAssembly powered compression

- **💪 Compression Features**
  - Support for WebP, JPEG, PNG formats
  - Adjustable quality settings (0-100)
  - File size validation (up to 30MB)
  - Batch processing support

- **⚡ Modern Architecture**
  - Custom hooks for state management
  - Component-based design
  - Comprehensive test coverage
  - Error handling and validation

- **🎨 Polished UI/UX**
  - Drag and drop interface
  - Live previews
  - Progress indicators
  - Responsive layout


### Hook Documentation

#### `useProcessingQueue`
A custom hook that manages parallel processing of files with the following features:
- Maintains a queue of files to be processed
- Handles parallel processing with configurable concurrency (default: 3 files)
- Provides queue management with add and cancel operations
- Tracks processing status and queue statistics
- Automatically processes next items when slots become available


#### `useImageProcessing`
A custom hook that handles image compression and processing with the following features:
- Processes images according to specified compression settings
- Manages processing state for each file (processing, complete, error)
- Supports cancellation of ongoing operations
- Generates previews and compressed blobs
- Handles errors and cleanup



#### `useCompressionSettings`
A custom hook that manages compression configuration with the following features:
- Controls image compression parameters
- Handles format selection (JPEG, PNG, WebP)
- Manages quality settings
- Provides dimension constraints

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| TailwindCSS | Styling |
| Vitest | Testing |
| React Testing Library | Component Testing |

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
npm or yarn
```

### Installation

```bash
# Clone the repository
git clone https://github.com/msanmaz/client-img-comp

# Navigate to project directory
cd client-img-comp

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## 🏗️ Project Structure

```
src/
├── components/                # UI Components
│   ├── CompressionOptions/   # Compression settings UI
│   │   ├── __tests__/
│   │   │   └── CompressionOptions.test.jsx
│   │   └── index.jsx
│   ├── DropZone/            # File upload area
│   │   ├── __tests__/
│   │   │   └── DropZone.test.jsx
│   │   └── dropZone.jsx
│   ├── FilePreviewGrid/     # Image preview grid
│   │   ├── __tests__/
│   │   │   └── FilePreviewGrid.test.jsx
│   │   └── filePreviewGrid.jsx
│   └── ImageUploadContainer.jsx
├── features/                # Core features
│   └── upload/
│       ├── hooks/          # Custom hooks
│       │   ├── __tests__/
│       │   │   └── useCompressionSettings.test.js
│       │   ├── useCompressionSettings.js
│       │   ├── useImageProcessing.js
│       │   ├── useProcessingQueue.js
│       │   └── useFileUpload.js
│       └── fileService.js  # File handling utilities
├── routes/                 # Route components
│   ├── __tests__/
│   │   └── Home.test.jsx
│   └── Home.jsx
├── pages/                  # Page components
│   ├── __tests__/
│   │   └── ImageUploadPage.test.jsx
│   └── ImageUploadPage.jsx
└── test/                   # Test utilities
    ├── setup.js
    └── utils.jsx
```

## 🧪 Testing

The project uses Vitest and React Testing Library for testing. Tests are organized alongside their components:

### Component Tests
- DropZone: File upload validation and handling
- FilePreviewGrid: Image preview and status display
- CompressionOptions: Format and quality control

### Hook Tests
- useCompressionSettings: Tests for managing compression settings
- useImageProcessing: Tests for processing and validating images
- useProcessingQueue: Tests for managing the processing queue

### Utility Tests
- fileService: File validation and processing
- Test utilities for mocking files and events

Run tests with:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome!
