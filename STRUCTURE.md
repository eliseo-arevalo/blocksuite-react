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
│   │   │   │   └── use-documents.ts
│   │   │   └── services/
│   │   │       └── document-service.ts
│   │   └── document-editor/
│   │       ├── document-editor.tsx
│   │       └── components/
│   │           └── editor-canvas.tsx
│   ├── infrastructure/
│   │   └── editor/
│   │       ├── editor-provider.tsx
│   │       ├── editor-context.ts
│   │       ├── editor-factory.ts
│   │       ├── models.ts
│   │       └── index.ts
│   ├── shared/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── ARCHITECTURE.md
├── STRUCTURE.md
├── README.md
└── package.json
```

---

## Feature Breakdown

### Document Management

```mermaid
graph TB
    A[document-management.tsx] --> B[useDocuments hook]
    A --> C[DocumentList]
    A --> D[document-service]
    C --> E[DocumentListItem]
    B --> F[EditorContext]
    D --> G[Create/Delete/Rename]
```

**Responsibilities:**
- Create new documents
- List all documents
- Select documents for editing
- Rename documents
- Delete documents
- Display active document state

---

### Document Editor

```mermaid
graph TB
    A[document-editor.tsx] --> B[EditorCanvas]
    B --> C[EditorContext]
    C --> D[BlockSuite Editor]
```

**Responsibilities:**
- Render BlockSuite editor
- Mount editor to DOM
- Handle editor lifecycle

---

## Data Flow

### Application Lifecycle

```mermaid
sequenceDiagram
    participant M as main.tsx
    participant A as App.tsx
    participant P as EditorProvider
    participant DM as DocumentManagement
    participant DE as DocumentEditor
    
    M->>A: Mount
    A->>P: Initialize
    P->>P: createEditorInstance()
    P->>DM: Provide context
    P->>DE: Provide context
    DM->>DM: useDocuments()
    DE->>DE: Mount EditorCanvas
```

### Document Selection Flow

```mermaid
sequenceDiagram
    participant U as User
    participant DL as DocumentList
    participant DM as DocumentManagement
    participant EC as EditorContext
    participant ED as DocumentEditor
    
    U->>DL: Click document
    DL->>DM: onDocumentSelect()
    DM->>EC: editor.doc = newDoc
    EC->>ED: Re-render with new doc
```

---

## Import Graph

### Dependency Layers

```mermaid
graph TB
    subgraph Application
        A[App.tsx]
    end
    
    subgraph Features
        B[document-management]
        C[document-editor]
    end
    
    subgraph Infrastructure
        D[editor]
    end
    
    subgraph External
        E[BlockSuite]
        F[React]
    end
    
    A --> B
    A --> C
    A --> D
    B --> D
    C --> D
    D --> E
    D --> F
    B --> F
    C --> F
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
    subgraph Local Scope
        A[DocumentList]
        B[DocumentListItem]
        C[EditorCanvas]
        D[useDocuments]
    end
    
    subgraph Shared Scope
        E[Empty - Awaiting Reuse]
    end
    
    subgraph Infrastructure Scope
        F[EditorProvider]
        G[EditorContext]
        H[EditorFactory]
    end
```

---

## File Metrics

| Directory | Files | Purpose |
|-----------|-------|---------|
| `features/document-management/` | 4 | Document listing & selection |
| `features/document-editor/` | 2 | Content editing |
| `infrastructure/editor/` | 5 | BlockSuite integration |
| `shared/` | 0 | Awaiting multi-feature reuse |

---

**[← Architecture](./ARCHITECTURE.md)** | **[Back to README](./README.md)**
