import React, {
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getExpandedContext } from '../../context/ExpandedContext';
import { getNodesContext } from '../../context/NodesContext';
import { GraphNodeDef } from '../../models/GraphNodeDef';
import Level from '../Presentation/Level';
import LoadingLevel from '../Presentation/LoadingBranch';
import NodeChildren from '../Presentation/NodeChildren';
import { LoadingStatus } from './../../util';

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
    let isCanceled = false;

    if (node && node.childrenIds.length) {
      setChildrenStatus(LoadingStatus.Loading);
      loadNodesAsync(node.childrenIds)
        .then(() => !isCanceled && setChildrenStatus(LoadingStatus.Resolved))
        .catch(() => !isCanceled && setChildrenStatus(LoadingStatus.Rejected));
    }

    return () => {
      isCanceled = true;
    };
  }, [node]);

  if (!node) return null;

  const path = [...parentPath, node.id];
  const expanded = isExpanded(path);
  const selected = isSelected && isSelected(node.id);

  const childrenCount = node.childrenIds.length;
  const hasChildren = childrenCount > 0;
  const leaf = childrenCount === 0;

  const handleNodeInteraction = () => {
    onExpandToggled(path);
  };

  const nodeChildren = (
    <NodeChildren>
      {hasChildren &&
        node.childrenIds.map(nodeId =>
          childrenStatus === LoadingStatus.Loading ? (
            <LoadingLevel key={nodeId} loadingIndicator={childrenLoadingIndicator}/>
          ) : (
            <GraphNode
              key={nodeId}
              nodeId={nodeId}
              parentPath={path}
              isRoot={false}
              isSelected={isSelected}
              nodeContent={nodeContent}
              childrenLoadingIndicator={childrenLoadingIndicator}
              onNodeClick={onNodeClick}
            />
          )
        )}
    </NodeChildren>
  );

  return (
    <Level
      nodeContent={nodeContent ? nodeContent : node.name}
      isRoot={isRoot}
      isLeaf={leaf}
      isSelected={!!selected}
      isExpanded={expanded}
      onNodeClick={handleNodeInteraction}
      hasChildren={childrenCount > 0}
      nodeChildren={nodeChildren}
    />
  );
}

export default GraphNode;
