# Project Structure

Visual guide to codebase organization.

---

**[← Architecture](./ARCHITECTURE.md)** | **[Back to README](./README.md)**

---

## Directory Tree

```
blocksuite-react/
├── src/
│   ├── features/
│   │   ├── document-management/
│   │   │   ├── document-management.tsx
│   │   │   ├── components/
│   │   │   │   ├── document-list.tsx
│   │   │   │   └── document-list-item.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-documents.ts
│   │   │   │   └── use-document-management-logic.ts
│   │   │   ├── services/
│   │   │   │   ├── document-service.ts
│   │   │   │   └── document-move-service.ts
│   │   │   └── models.ts
│   │   └── document-editor/
│   │       ├── document-editor.tsx
│   │       ├── components/
│   │       │   └── editor-canvas.tsx
│   │       └── models.ts
│   ├── infrastructure/
│   │   └── editor/
│   │       ├── editor-provider.tsx
│   │       ├── editor-context.ts
│   │       ├── editor-factory.ts
│   │       ├── models.ts
│   │       └── index.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── app-content.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toast-container.tsx
│   │   │   ├── icon.tsx
│   │   │   ├── editor-settings.tsx
│   │   │   └── browser-compatibility-checker.tsx
│   │   ├── contexts/
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-context.ts
│   │   │   ├── theme-models.ts
│   │   │   ├── editor-config-context.tsx
│   │   │   └── document-update-context.tsx
│   │   ├── hooks/
│   │   │   ├── use-toast.ts
│   │   │   └── use-modal.ts
│   │   ├── providers/
│   │   │   ├── toast-provider.tsx
│   │   │   └── modal-provider.tsx
│   │   ├── utils/
│   │   │   ├── sanitize.ts
│   │   │   └── validation.ts
│   │   ├── models/
│   │   │   ├── document.types.ts
│   │   │   └── toast.types.ts
│   │   └── icons/
│   │       └── icon-registry.ts
│   ├── styles/
│   │   ├── app.css
│   │   └── overrides.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── capture.png
├── ARCHITECTURE.md
├── STRUCTURE.md
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
└── biome.json
```

---

## Feature Breakdown

### Document Management

```mermaid
graph TB
    A[document-management.tsx] --> B[useDocumentManagementLogic]
    B --> C[useDocuments]
    B --> D[document-service]
    B --> E[document-move-service]
    A --> F[Sidebar via Layout]
    F --> G[TreeItem recursivo]
    G --> H[Drag & Drop]
    C --> I[EditorContext]
    D --> J[Create/Delete/Rename]
    E --> K[Move/Validate Depth]
```

**Responsibilities:**
- Create documents (root or nested)
- Hierarchical tree structure (max 4 levels)
- Drag & drop document reorganization
- Select documents for editing
- Rename documents with title sync
- Delete documents (with protection)
- Move documents between levels
- Validate circular references
- Navigate via internal links

**Key Files:**
- `hooks/use-document-management-logic.ts` - Orchestrates all document operations
- `hooks/use-documents.ts` - Fetches documents from collection
- `services/document-service.ts` - CRUD operations + BlockSuite bug fix
- `services/document-move-service.ts` - Move validation and execution
- `components/document-list.tsx` - Document list renderer
- `components/document-list-item.tsx` - Individual document item

---

### Document Editor

```mermaid
graph TB
    A[document-editor.tsx] --> B[EditorCanvas]
    B --> C[EditorContext]
    C --> D[BlockSuite Editor]
    D --> E[AffineEditorContainer]
    E --> F[Doc with Blocks]
```

**Responsibilities:**
- Render BlockSuite editor
- Mount editor to DOM
- Handle editor lifecycle
- Display active document content

**Key Files:**
- `document-editor.tsx` - Container component
- `components/editor-canvas.tsx` - Editor mounting logic

---

## Data Flow

### Application Lifecycle

```mermaid
sequenceDiagram
    participant M as main.tsx
    participant A as App.tsx
    participant P as Providers Stack
    participant EP as EditorProvider
    participant AC as AppContent
    participant L as Layout
    participant S as Sidebar
    participant DE as DocumentEditor
    
    M->>A: Mount
    A->>P: Initialize Providers
    P->>EP: createEditorInstance()
    EP->>AC: Provide EditorContext
    AC->>L: Pass document handlers
    L->>S: Render tree structure
    L->>DE: Render EditorCanvas
```

### Document Selection Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Sidebar
    participant DML as DocumentManagementLogic
    participant EC as EditorContext
    participant ED as DocumentEditor
    
    U->>S: Click document
    S->>DML: handleDocumentSelect(doc)
    DML->>EC: editor.doc = newDoc
    EC->>ED: Re-render with new doc
    ED->>U: Display document content
```

### Document Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Sidebar
    participant DML as DocumentManagementLogic
    participant DS as DocumentService
    participant C as Collection
    participant T as Toast
    
    U->>S: Click "Add Child"
    S->>DML: handleCreateDocument(title, parentId)
    DML->>DS: createDocument(collection, title, parentId)
    DS->>DS: Validate depth (max 4)
    DS->>C: collection.createDoc()
    DS->>C: setDocMeta(parentId)
    DS-->>DML: Return new doc
    DML->>T: toast.success()
    DML->>S: Auto-expand parent
```

### Drag & Drop Flow

```mermaid
sequenceDiagram
    participant U as User
    participant TI as TreeItem
    participant S as Sidebar
    participant DML as DocumentManagementLogic
    participant DMS as DocumentMoveService
    participant T as Toast
    
    U->>TI: Drag document
    U->>TI: Drop on target
    TI->>S: handleDocumentMove(draggedId, targetId)
    S->>DML: handleMoveDocument(docId, newParentId)
    DML->>DMS: moveDocument(collection, docId, newParentId)
    DMS->>DMS: Validate circular reference
    DMS->>DMS: Validate depth limit
    DMS-->>DML: Return success
    DML->>T: toast.success()
    DML->>S: Auto-expand target
```

---

## Import Graph

### Dependency Layers

```mermaid
graph TB
    subgraph Application
        A[App.tsx]
        AC[AppContent]
    end
    
    subgraph Features
        B[document-management]
        C[document-editor]
    end
    
    subgraph Shared
        S1[components]
        S2[contexts]
        S3[hooks]
        S4[providers]
        S5[utils]
    end
    
    subgraph Infrastructure
        D[editor]
    end
    
    subgraph External
        E[BlockSuite]
        F[React]
        G[DOMPurify]
        H[Lucide]
    end
    
    A --> AC
    AC --> B
    AC --> C
    A --> S2
    A --> S4
    B --> S1
    B --> S2
    B --> S3
    B --> S5
    C --> S1
    S1 --> S2
    S1 --> S5
    S3 --> S4
    B --> D
    C --> D
    D --> E
    D --> F
    S5 --> G
    S1 --> H
```

### Import Rules

| Layer | Can Import From |
|-------|----------------|
| Features | Infrastructure, Shared, External |
| Infrastructure | External only |
| Shared | External only |
| App | All layers |

**Forbidden:**
- ❌ Infrastructure → Features
- ❌ Feature A → Feature B
- ❌ Shared → Features

---

## Scope Visualization

```mermaid
graph LR
    subgraph Local Scope - Document Management
        A[DocumentList]
        B[DocumentListItem]
        C[useDocuments]
        D[useDocumentManagementLogic]
        E[document-service]
        F[document-move-service]
    end
    
    subgraph Local Scope - Document Editor
        G[EditorCanvas]
    end
    
    subgraph Shared Scope - Multi-feature
        H[Sidebar]
        I[Header]
        J[Layout]
        K[Modal]
        L[Toast]
        M[Icon]
        N[ThemeProvider]
        O[ToastProvider]
        P[ModalProvider]
    end
    
    subgraph Infrastructure Scope - Cross-cutting
        Q[EditorProvider]
        R[EditorContext]
        S[EditorFactory]
    end
```

---

## File Metrics

| Directory | Files | Lines | Purpose |
|-----------|-------|-------|---------|
| `features/document-management/` | 7 | ~500 | Document CRUD + hierarchy |
| `features/document-editor/` | 3 | ~50 | Content editing |
| `infrastructure/editor/` | 5 | ~100 | BlockSuite integration |
| `shared/components/` | 11 | ~800 | Reusable UI components |
| `shared/contexts/` | 5 | ~150 | React contexts |
| `shared/hooks/` | 2 | ~80 | Custom hooks |
| `shared/providers/` | 2 | ~80 | Context providers |
| `shared/utils/` | 2 | ~50 | Utilities |
| `shared/models/` | 2 | ~50 | TypeScript types |
| `styles/` | 2 | ~600 | Global CSS |

**Total**: 44 TypeScript/TSX files

---

## Component Hierarchy

```mermaid
graph TB
    App[App.tsx] --> TP[ThemeProvider]
    TP --> EP[EditorProvider]
    EP --> DUP[DocumentUpdateProvider]
    DUP --> ECP[EditorConfigProvider]
    ECP --> MP[ModalProvider]
    MP --> ToP[ToastProvider]
    ToP --> BCC[BrowserCompatibilityChecker]
    ToP --> AC[AppContent]
    
    AC --> L[Layout]
    L --> H[Header]
    L --> S[Sidebar]
    L --> MC[main content]
    
    H --> ES[EditorSettings]
    H --> BC[Breadcrumbs]
    
    S --> TI[TreeItem recursive]
    TI --> Icon1[Icon]
    TI --> TI
    
    MC --> DE[DocumentEditor]
    DE --> EC[EditorCanvas]
    
    ToP --> TC[ToastContainer]
    TC --> Toast[Toast]
    
    MP --> Modal[Modal]
```

---

**[← Architecture](./ARCHITECTURE.md)** | **[Back to README](./README.md)**
