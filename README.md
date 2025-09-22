# Caselib Bundle - Legal Document Preparation

A modern web application for preparing legal annex bundles (Romanian: dosare anexe legale).

## Features

### Core Functionality
- **PDF Import**: Upload multiple PDF files via drag & drop or file picker
- **Annex Management**: Maintain ordered list of annexes with auto-numbering
- **Title Editing**: Rename annexes with persistent custom titles
- **Drag & Drop Reordering**: Easily reorder annexes with automatic number updates
- **Project Persistence**: Save and load project configurations

### Document Generation
- **Cover Page Generation**: Auto-generate professional cover pages for each annex
- **Table of Contents (Opis)**: Auto-generate comprehensive table of contents
- **PDF Export**: Merge all documents into a single, properly ordered PDF bundle

### Customization
- **Formatting Controls**: Configure fonts, sizes, alignment, and margins
- **Live Preview**: See changes instantly in the preview panel
- **Professional Styling**: Clean, legal-document appropriate formatting

## How to Use

1. **Import PDFs**: Drag and drop or click to add PDF files
2. **Organize**: Rename and reorder annexes as needed
3. **Format**: Customize the appearance in the Formatting tab
4. **Preview**: Review cover pages and table of contents
5. **Export**: Generate the final consolidated PDF bundle

## Technical Implementation

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **PDF Processing**: PDF-lib for document manipulation
- **Canvas Rendering**: html2canvas for cover page generation
- **Persistence**: Browser storage with JSON project files

## PDF Export Process

The export generates a complete legal bundle:

1. **Table of Contents (Opis)**: Lists all annexes with descriptions
2. **For each annex**:
   - Professional cover page with "ANEXA X" heading and title
   - Complete original PDF content

The final PDF maintains proper page ordering and professional formatting suitable for legal submissions.

## Browser Compatibility

- Modern browsers with PDF support
- File API for drag & drop functionality
- Canvas API for document rendering
- No server dependency - fully client-side operation