import { Doc } from '@blocksuite/store';
import { useEditorContext } from '@infrastructure/editor';
import { Icon } from '@shared/components/icon';
import { ExtendedDocMeta, TreeNode } from '@shared/models/document.types';
import { useCallback, useMemo, useState } from 'react';

interface TreeItemProps {
  node: TreeNode;
  level: number;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  onMove?: (draggedId: string, targetId: string | null) => void;
  selectedId?: string;
}

const TreeItem = ({
  node,
  level,
  onToggle,
  onSelect,
  onAddChild,
  onMove,
  selectedId,
}: TreeItemProps) => {
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== node.id && onMove) {
      onMove(draggedId, node.id);
    }
  };

  return (
    <div className="tree-item">
      <div
        className={`tree-item-content ${isSelected ? 'selected' : ''} ${isDragOver ? 'drag-over' : ''}`}
        onClick={() => node.type === 'document' && onSelect(node.id)}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={`tree-icon-container ${hasChildren ? 'has-children' : ''}`}
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation();
              onToggle(node.id);
            }
          }}
        >
          <Icon
            name={hasChildren ? (node.isExpanded ? 'folderOpen' : 'folder') : 'document'}
            size={16}
            className="tree-item-icon"
          />
          {hasChildren && (
            <Icon
              name={node.isExpanded ? 'chevronDown' : 'chevronRight'}
              size={14}
              className="tree-toggle-icon"
            />
          )}
        </div>

        <span className="tree-item-name" title={node.name}>
          {node.name}
        </span>

        <div className="tree-actions">
          {onAddChild && (
            <button
              className="tree-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node.id);
              }}
              title="Add child"
            >
              <Icon name="add" size={12} />
            </button>
          )}
        </div>
      </div>

      {hasChildren && node.isExpanded && (
        <div className="tree-children">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onMove={onMove}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
  documents: Doc[];
  documentMap: Map<string, Doc>;
  activeDocId?: string;
  onDocumentSelect: (doc: Doc) => void;
  onCreateDocument: (title?: string, parentId?: string) => Doc | null;
  onDocumentMove?: (docId: string, newParentId: string | null) => void;
}

export const Sidebar = ({
  isOpen,
  documents,
  documentMap,
  activeDocId,
  onDocumentSelect,
  onCreateDocument,
  onDocumentMove,
}: SidebarProps) => {
  const { collection } = useEditorContext();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isRootDropZoneActive, setIsRootDropZoneActive] = useState(false);

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleAddChild = useCallback(
    (parentId: string) => {
      const newDoc = onCreateDocument('New Page', parentId);
      // Auto-expand parent only if child was created successfully
      if (newDoc) {
        setExpandedNodes((prev) => new Set([...prev, parentId]));
      }
    },
    [onCreateDocument]
  );

  const handleDocumentSelect = useCallback(
    (docId: string) => {
      const doc = documentMap.get(docId);
      if (doc) {
        onDocumentSelect(doc);
      }
    },
    [documentMap, onDocumentSelect]
  );

  const handleDocumentMove = useCallback(
    (draggedId: string, targetId: string | null) => {
      if (onDocumentMove) {
        onDocumentMove(draggedId, targetId);
        // Auto-expand target when document is moved into it
        if (targetId) {
          setExpandedNodes((prev) => new Set([...prev, targetId]));
        }
      }
    },
    [onDocumentMove]
  );

  const handleRootDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsRootDropZoneActive(true);
  };

  const handleRootDropZoneDragLeave = () => {
    setIsRootDropZoneActive(false);
  };

  const handleRootDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsRootDropZoneActive(false);

    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && onDocumentMove) {
      onDocumentMove(draggedId, null);
    }
  };

  // Build hierarchical tree structure
  const treeData: TreeNode[] = useMemo(() => {
    const nodeMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // First pass: create all nodes
    documents.forEach((doc) => {
      const meta = collection.meta.getDocMeta(doc.id) as ExtendedDocMeta;
      const node: TreeNode = {
        id: doc.id,
        name: meta?.title || `Document ${doc.id.slice(0, 8)}`,
        type: 'document',
        isExpanded: expandedNodes.has(doc.id),
        children: [],
      };
      nodeMap.set(doc.id, node);
    });

    // Second pass: build hierarchy
    documents.forEach((doc) => {
      const meta = collection.meta.getDocMeta(doc.id) as ExtendedDocMeta;
      const node = nodeMap.get(doc.id)!;

      if (meta?.parentId && nodeMap.has(meta.parentId)) {
        // Add to parent's children
        const parent = nodeMap.get(meta.parentId)!;
        parent.children!.push(node);
      } else {
        // Root level document
        rootNodes.push(node);
      }
    });

    return rootNodes;
  }, [documents, expandedNodes, collection]);

  if (!isOpen) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Icon name="folder" size={18} />
          <span>Explorer</span>
        </div>
        <button
          className="create-document-btn"
          onClick={() => onCreateDocument()}
          title="New Document"
        >
          <Icon name="add" size={16} />
        </button>
      </div>

      <div className="sidebar-content">
        {treeData.length === 0 ? (
          <div className="empty-state">
            <Icon name="document" size={32} />
            <p>No documents yet</p>
            <button className="empty-state-btn" onClick={() => onCreateDocument()}>
              Create your first document
            </button>
          </div>
        ) : (
          <>
            {treeData.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                level={0}
                onToggle={toggleNode}
                onSelect={handleDocumentSelect}
                onAddChild={handleAddChild}
                onMove={handleDocumentMove}
                selectedId={activeDocId}
              />
            ))}
            <div
              className={`root-drop-zone ${isRootDropZoneActive ? 'active' : ''}`}
              onDragOver={handleRootDropZoneDragOver}
              onDragLeave={handleRootDropZoneDragLeave}
              onDrop={handleRootDropZoneDrop}
            >
              <Icon name="home" size={14} />
              <span>Drop here to move to root</span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
