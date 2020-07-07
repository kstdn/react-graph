import React, { FunctionComponent, ReactNode, useState } from 'react';
import GraphNode from './components/GraphNode';
import Providers from './context/Providers';
import { GraphNodeDef } from './models/GraphNodeDef';
import { GraphStyleProps } from './models/GraphStyleProps';
import styles from './styles.module.css';
import { mapPropsToStyle } from './util';

type Props<TId> = {
  /**
   * The ID of the root node of this graph
   */
  rootNodeId: TId;
  /**
   * All the nodes of the graph
   */
  nodes: Map<TId, GraphNodeDef<TId>>;
  /**
   * Component to be rendered inside of the node
   * Will receive the node as props
   *
   * If not provided, the node name will be displayed
   *
   * Keep in mind that the component should have fixed height and
   * the height should be reflected in the graph by passing
   * { nodeContentHeight: *componentHeight* } as 'graphStyles' prop
   */
  nodeContent?: FunctionComponent<GraphNodeDef<TId>>;
  /**
   * Predefined set of properties to influence the graph appearance
   */
  graphStyles?: GraphStyleProps;
  /**
   * Should state of the expanded nodes be persisted in localStorage
   * and reloaded automatically
   */
  persistExpandedState?: boolean;
  /**
   * Fired after a node has been clicked
   */
  onNodeClicked?: (node: GraphNodeDef<TId>) => any;
  /**
   * Fired after a node has been selected
   * Note: Will not fire after a click on an already selected node
   */
  onNodeSelected?: (node: GraphNodeDef<TId>) => any;

  /**
   * Element to be displayed while loading children
   */
  childrenLoadingIndicator?: ReactNode;

  /**
   * Function to be used for loading new nodes into memory
   */
  loadNodesAsyncFunc?: (ids: TId[]) => Promise<GraphNodeDef<TId>[]>;
};

function Graph<TId extends string | number>({
  rootNodeId,
  nodes,
  nodeContent,
  graphStyles,
  persistExpandedState = false,
  onNodeClicked,
  onNodeSelected,
  childrenLoadingIndicator,
  loadNodesAsyncFunc,
}: Props<TId>) {
  const [selectedNode, setSelectedNode] = useState<GraphNodeDef<TId>>();

  const isSelected = (nodeId: TId) => {
    return !!(selectedNode && nodeId === selectedNode.id);
  };

  const handleNodeClick = (node: GraphNodeDef<TId>) => {
    // Handle click
    onNodeClicked && onNodeClicked(node);

    // Handle selection
    if (!isSelected(node.id)) {
      onNodeSelected && onNodeSelected(node);
      setSelectedNode(node);
    }
  };

  return (
    <Providers
      nodes={nodes}
      persistExpandedState={persistExpandedState}
      loadNodesAsyncFunc={loadNodesAsyncFunc}
    >
      <div className={styles['graph']} style={mapPropsToStyle(graphStyles)}>
        <GraphNode
          nodeContent={nodeContent}
          parentPath={[]}
          nodeId={rootNodeId}
          isRoot
          readOnly={false}
          isSelected={isSelected}
          childrenLoadingIndicator={childrenLoadingIndicator}
          onNodeClick={handleNodeClick}
        />
      </div>
    </Providers>
  );
}

export default Graph;
