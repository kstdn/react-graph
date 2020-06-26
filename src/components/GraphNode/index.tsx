import React, { FunctionComponent, SyntheticEvent, useContext } from 'react';
import { getExpandedContext } from '../../context/ExpandedContext';
import { getNodesContext } from '../../context/NodesContext';
import { GraphNodeDef } from '../../models/GraphNodeDef';
import { preventUndesiredEventHandling } from './util';
import styles from './../../styles.module.css';

type Props<TId> = {
  /**
   * The id of the node
   */
  nodeId: TId;

  /**
   * Component to be displayed inside the node
   */
  nodeContent?: FunctionComponent<GraphNodeDef<TId>>;

  /**
   * The path of the parent node starting from the root node
   */
  parentPath: TId[];

  /**
   * Is this node the root node
   */
  isRoot: boolean;

  /**
   * Function to check if the current node is selected
   *
   */
  isSelected?: (nodeId: TId) => boolean;

  /**
   * If a node is readonly we cannot add children to it
   */
  readOnly: boolean;

  onNodeClick?: (node: GraphNodeDef<TId>) => any;
};

function GraphNode<TId extends string | number>({
  nodeId,
  parentPath,
  isRoot,
  readOnly,
  nodeContent,
  isSelected,
  onNodeClick,
}: Props<TId>) {
  const { getNode } = useContext(getNodesContext<TId>());
  const { isExpanded, onExpandToggled } = useContext(getExpandedContext<TId>());

  const node = getNode(nodeId);

  if (!node) return null;

  const path = [...parentPath, node.id];
  const expanded = isExpanded(path);
  const selected = isSelected && isSelected(node.id);

  const childrenCount = node.childrenIds.length;
  const leaf = childrenCount === 0;

  const handleNodeInteraction = (e: SyntheticEvent) => {
    preventUndesiredEventHandling(e, () => {
      onExpandToggled(path);
      onNodeClick && onNodeClick(node);
    });
  };

  const nodeChildren = (
    <div className={styles['node-children']}>
      {childrenCount > 0 &&
        node.childrenIds.map(nodeId => (
          <GraphNode
            key={nodeId}
            nodeId={nodeId}
            parentPath={path}
            isRoot={false}
            isSelected={isSelected}
            nodeContent={nodeContent}
            readOnly={readOnly}
            onNodeClick={onNodeClick}
          />
        ))}
    </div>
  );

  return (
    <div
      className={`${styles['branch']}${isRoot ? ` ${styles['root']}` : ''}${
        selected ? ` ${styles['selected']}` : ''
      }`}
    >
      <div
        tabIndex={0}
        onClick={handleNodeInteraction}
        onKeyDown={handleNodeInteraction}
        className={`${styles.node}${leaf ? ` ${styles.leaf}` : ''}`}
      >
        <div className={`${styles['link']} ${styles['to-parent']}`}></div>
        <div className={styles['node-content']}>
          {nodeContent ? nodeContent(node) : node.name}
        </div>
        {childrenCount > 0 &&
          (expanded ? (
            <div className={`${styles['link']} ${styles['to-children']}`}></div>
          ) : (
            <div className={styles['children-indicator']}></div>
          ))}
      </div>
      {expanded && nodeChildren}
    </div>
  );
}

export default GraphNode;
