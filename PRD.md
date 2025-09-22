# Caselib Bundle - Legal Document Bundle Preparation Tool

A web-based application that helps legal professionals prepare organized annex bundles by importing PDFs, managing their order, and generating professional cover pages and table of contents.

**Experience Qualities**:
1. Professional - Clean, authoritative interface that inspires confidence in legal workflows
2. Efficient - Streamlined document management with minimal clicks and intuitive drag-and-drop
3. Precise - Accurate numbering, formatting, and organization that meets legal standards

**Complexity Level**: Light Application (multiple features with basic state)
The application manages document collections with reordering, formatting, and export capabilities but doesn't require complex user accounts or advanced functionality.

## Essential Features

### PDF Import and Management
- **Functionality**: Import multiple PDF files via drag-and-drop or file picker
- **Purpose**: Foundation for building document bundles from existing legal documents
- **Trigger**: User drags files to drop zone or clicks "Add PDFs" button
- **Progression**: File selection → validation → automatic title extraction → addition to annex list → live preview update
- **Success criteria**: Files appear in ordered list with auto-generated titles and sequential numbering

### Drag-and-Drop Reordering
- **Functionality**: Reorder annexes by dragging list items up or down
- **Purpose**: Allows logical organization of documents to match legal requirements
- **Trigger**: User drags an annex item to new position in the list
- **Progression**: Drag start → visual feedback → drop → automatic renumbering → table of contents update
- **Success criteria**: Items reorder smoothly with automatic number updates and no data loss

### Annex Title Management
- **Functionality**: Edit custom titles for each annex with automatic fallback to filename
- **Purpose**: Provides meaningful descriptions for documents in the final bundle
- **Trigger**: User clicks on title field or uses context menu "Rename"
- **Progression**: Click title → inline editing mode → type new name → save on enter/blur → update throughout app
- **Success criteria**: Custom titles persist across sessions and display consistently

### Auto-Generated Cover Pages
- **Functionality**: Creates professional cover pages with "ANEXA {n}" and document title
- **Purpose**: Provides clear separation and identification for each document in the bundle
- **Trigger**: Automatic generation based on current annex order and formatting settings
- **Progression**: Format change → immediate preview update → export includes updated covers
- **Success criteria**: Cover pages display correct numbering and formatting, update live with changes

### Table of Contents (Opis) Generation
- **Functionality**: Auto-generates professional table of contents with annex numbers and descriptions
- **Purpose**: Provides navigation overview for the complete document bundle
- **Trigger**: Automatic generation based on current annex list and order
- **Progression**: Order change → immediate table update → export includes current table
- **Success criteria**: Table of contents accurately reflects current state with proper formatting

### Formatting Controls
- **Functionality**: Customizable fonts, sizes, alignment, and styling for covers and table of contents
- **Purpose**: Ensures output matches organizational or legal formatting requirements
- **Trigger**: User adjusts formatting controls in the settings panel
- **Progression**: Control change → live preview update → settings persistence → export formatting
- **Success criteria**: Changes apply immediately to previews and persist across sessions

### PDF Export
- **Functionality**: Combines table of contents, cover pages, and original documents into single PDF
- **Purpose**: Creates final deliverable bundle ready for legal submission or filing
- **Trigger**: User clicks "Export PDF" button
- **Progression**: Click export → processing indicator → PDF generation → download prompt → success confirmation
- **Success criteria**: Exported PDF contains all components in correct order with proper formatting

### Project Save/Load
- **Functionality**: Save current work as project file and reload for continued editing
- **Purpose**: Enables iterative work on complex bundles over multiple sessions
- **Trigger**: User clicks save/load buttons or before closing with unsaved changes
- **Progression**: Save: serialize state → download project file; Load: file selection → state restoration → UI update
- **Success criteria**: All document references, titles, and settings restore correctly

## Edge Case Handling
- **Large File Handling**: Progress indicators and chunked processing for files over 10MB
- **Missing Files**: Clear warnings when referenced files can't be found with options to relocate
- **Invalid PDFs**: Error messages for corrupted or non-PDF files with graceful skipping
- **Browser Limitations**: File size warnings and recommendations for optimal performance
- **Duplicate Files**: Smart handling with user confirmation for intentional duplicates

## Design Direction
The design should feel authoritative and professional, befitting legal document preparation. Clean typography and generous whitespace create a sense of precision and reliability. The interface should feel substantial yet approachable, with visual hierarchy that guides users through complex workflows efficiently.

## Color Selection
Complementary (opposite colors) - Using a professional blue-gray palette with warm accent colors to create trustworthy authority while maintaining approachability and clarity.

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.12 240)) - Communicates trust, authority, and legal professionalism
- **Secondary Colors**: Warm Gray (oklch(0.65 0.02 45)) for supporting elements and Light Blue-Gray (oklch(0.85 0.04 240)) for backgrounds
- **Accent Color**: Warm Orange (oklch(0.65 0.15 45)) for call-to-action elements and progress indicators
- **Foreground/Background Pairings**: 
  - Background (Light Blue-Gray #F8F9FB): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 8.2:1 ✓
  - Card (Pure White #FFFFFF): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 9.1:1 ✓
  - Primary (Deep Blue): White text (oklch(1 0 0)) - Ratio 5.8:1 ✓
  - Secondary (Warm Gray): Dark Blue text (oklch(0.25 0.08 240)) - Ratio 5.1:1 ✓
  - Accent (Warm Orange): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection
Typography should convey precision and professionalism while maintaining excellent readability for legal document review. Inter provides clean, technical clarity ideal for data-heavy interfaces.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing
  - H3 (Subsection): Inter Medium/18px/normal spacing
  - Body (Document Lists): Inter Regular/16px/relaxed line height
  - Caption (File Paths): Inter Regular/14px/muted color
  - UI Labels: Inter Medium/14px/slight letter spacing

## Animations
Subtle and purposeful animations that reinforce the sense of precision and control. Motion should feel deliberate and never frivolous, supporting the professional context.

- **Purposeful Meaning**: Smooth transitions communicate system responsiveness and build confidence in document handling accuracy
- **Hierarchy of Movement**: Drag-and-drop reordering receives primary animation focus, with secondary emphasis on state changes and loading indicators

## Component Selection
- **Components**: Cards for document items, Tables for table of contents preview, Dialogs for formatting settings, Buttons with clear action hierarchy, Tabs for preview/settings organization
- **Customizations**: Drag-handle indicators for reorderable list items, file upload drop zones with clear visual feedback, inline editing components for title management
- **States**: Clear hover, active, and disabled states for all interactive elements with professional color transitions
- **Icon Selection**: Document icons for file types, drag handles for reordering, settings gear for formatting, download for export actions
- **Spacing**: Generous padding (16-24px) between major sections, consistent 8px grid for fine spacing, comfortable touch targets (44px minimum)
- **Mobile**: Responsive layout that stacks panels vertically on smaller screens, touch-friendly controls with larger hit areas, simplified formatting controls for mobile editing