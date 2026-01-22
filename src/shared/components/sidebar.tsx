import { useState, useMemo, useCallback } from 'react';
import { Icon } from '@shared/components/icon';
import { useEditorContext } from '@infrastructure/editor';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'document';
  children?: TreeNode[];
  isExpanded?: boolean;
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  selectedId?: string;
}

const TreeItem = ({ node, level, onToggle, onSelect, selectedId }: TreeItemProps) => {
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div className="tree-item">
      <div 
        className={`tree-item-content ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => node.type === 'document' && onSelect(node.id)}
      >
        {hasChildren && (
          <button 
            className="tree-toggle"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            <Icon 
              name={node.isExpanded ? 'chevronDown' : 'chevronRight'} 
              size={14} 
            />
          </button>
        )}
        
        <Icon 
          name={node.type === 'folder' 
            ? (node.isExpanded ? 'folderOpen' : 'folder')
            : 'document'
          } 
          size={16} 
        />
        
        <span className="tree-item-name">{node.name}</span>
      </div>
      
      {hasChildren && node.isExpanded && (
        <div className="tree-children">
          {node.children!.map(child => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onSelect={onSelect}
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
  documents: any[];
  activeDocId?: string;
  onDocumentSelect: (doc: any) => void;
  onCreateDocument: () => void;
}

export const Sidebar = ({ 
  isOpen, 
  documents, 
  activeDocId, 
  onDocumentSelect,
  onCreateDocument 
}: SidebarProps) => {
  const { collection } = useEditorContext();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleDocumentSelect = useCallback((docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      onDocumentSelect(doc);
    }
  }, [documents, onDocumentSelect]);

  // Memoize tree data to avoid recalculation on every render
  const treeData: TreeNode = useMemo(() => ({
    id: 'root',
    name: 'Documents',
    type: 'folder',
    isExpanded: expandedNodes.has('root'),
    children: documents.map(doc => ({
      id: doc.id,
      name: collection.meta.getDocMeta(doc.id)?.title || `Document ${doc.id.slice(0, 8)}`,
      type: 'document' as const,
    }))
  }), [documents, expandedNodes, collection]);

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
          onClick={onCreateDocument}
          title="New Document"
        >
          <Icon name="add" size={16} />
        </button>
      </div>
      
      <div className="sidebar-content">
        <TreeItem
          node={treeData}
          level={0}
          onToggle={toggleNode}
          onSelect={handleDocumentSelect}
          selectedId={activeDocId}
        />
      </div>
    </aside>
  );
};
