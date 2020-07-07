import React, {
  FunctionComponent,
  ReactNode,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getExpandedContext } from '../../context/ExpandedContext';
import { getNodesContext } from '../../context/NodesContext';
import { GraphNodeDef } from '../../models/GraphNodeDef';
import styles from './../../styles.module.css';
import { LoadingStatus } from './../../util';
import Indicators from './Indicators';
import NodeContent from './NodeContent';
import { preventUndesiredEventHandling } from './util';

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

  /**
   * Element to be displayed while loading children
   */
  childrenLoadingIndicator?: ReactNode;

  /**
   * Node click callback
   */
  onNodeClick?: (node: GraphNodeDef<TId>) => any;
};

function GraphNode<TId extends string | number>({
  nodeId,
  parentPath,
  isRoot,
  readOnly,
  nodeContent,
  isSelected,
  childrenLoadingIndicator,
  onNodeClick,
}: Props<TId>) {
  const { getNode, loadNodesAsync } = useContext(getNodesContext<TId>());
  const { isExpanded, onExpandToggled } = useContext(getExpandedContext<TId>());
  const [childrenStatus, setChildrenStatus] = useState<LoadingStatus>(
    LoadingStatus.Idle
  );

  const node = getNode(nodeId);

  useEffect(() => {
    if (
      node &&
      node.childrenIds.length &&
      childrenStatus === LoadingStatus.Idle
    ) {
      setChildrenStatus(LoadingStatus.Loading);
      loadNodesAsync(node.childrenIds)
        .then(() => setChildrenStatus(LoadingStatus.Resolved))
        .catch(() => setChildrenStatus(LoadingStatus.Rejected));
    }
  }, [node, childrenStatus]);

  if (!node) return null;

  const path = [...parentPath, node.id];
  const expanded = isExpanded(path);
  const selected = isSelected && isSelected(node.id);

  const childrenCount = node.childrenIds.length;
  const leaf = childrenCount === 0;

  const handleNodeInteraction = (e: SyntheticEvent) => {
    preventUndesiredEventHandling(e, () => {
      if (childrenStatus === LoadingStatus.Resolved) {
        onExpandToggled(path);
      }
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
            childrenLoadingIndicator={childrenLoadingIndicator}
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
        <NodeContent>
          {nodeContent ? nodeContent(node) : node.name}
        </NodeContent>
        <Indicators
          childrenCount={childrenCount}
          childrenStatus={childrenStatus}
          childrenLoadingIndicator={childrenLoadingIndicator}
          expanded={expanded}
        />
      </div>
      {expanded && childrenStatus === LoadingStatus.Resolved && nodeChildren}
    </div>
  );
}

export default GraphNode;
