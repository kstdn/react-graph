import React, { FunctionComponent, ReactNode, useState, useRef } from 'react';
import GraphNode from './components/GraphNode';
import LoadingRoot from './components/Presentation/LoadingRoot';
import Providers from './context/Providers';
import { GraphNodeDef } from './models/GraphNodeDef';
import { GraphStyleProps } from './models/GraphStyleProps';
import styles from './styles.module.css';
import { useBeforeFirstRender } from './useBeforeFirstRender';
import { mapPropsToStyle, hasUnloadedNodes } from './util';
import {
  getAllUniqueNodeIds,
  VisibleGraphNode,
  getRootNodesIds,
} from './visible-graph.util';

const visibleStateKey = 'visible-state';

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
   * Should state of the visible nodes be persisted in localStorage
   * and reloaded automatically
   */
  persistVisibleState?: boolean;
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
  loadingIndicator?: ReactNode;

  /**
   * Function to be used for loading new nodes into memory
   */
  loadNodesAsyncFunc?: (ids: TId[]) => Promise<GraphNodeDef<TId>[]>;

  /**
   * Should all visible nodes be preloaded at once
   * using loadNodesAsyncFunc
   */
  preloadVisibleNodes?: boolean;
};

function Graph<TId extends string | number>({
  rootNodeId,
  nodes,
  nodeContent,
  graphStyles,
  persistVisibleState = false,
  onNodeClicked,
  onNodeSelected,
  loadingIndicator,
  loadNodesAsyncFunc,
  preloadVisibleNodes = true,
}: Props<TId>) {
  const [selectedNode, setSelectedNode] = useState<GraphNodeDef<TId>>();
  const [visibleGraph, setVisibleGraph] = useState<VisibleGraphNode<TId>[]>(
    persistVisibleState
      ? JSON.parse(localStorage.getItem(visibleStateKey) ?? '[]')
      : []
  );

  const loadingInitialValue = useRef(preloadVisibleNodes ? true : false);

  const loadNodesFunc = (childrenIds: TId[]): Promise<void> => {
    const toLoad = childrenIds.filter(id => !nodes.has(id));

    if (toLoad.length === 0) {
      return Promise.resolve();
    }

    return loadNodesAsyncFunc
      ? loadNodesAsyncFunc(toLoad).then(result => {
          result.forEach(node => nodes.set(node.id, node));
        })
      : Promise.resolve();
  };

  useBeforeFirstRender(isCanceled => {
    if (preloadVisibleNodes) {
      const visibleGraphRootNodesIds = getRootNodesIds(visibleGraph);
      const allUniquesIds = getAllUniqueNodeIds(visibleGraph, rootNodeId);
      if (
        !visibleGraphRootNodesIds.includes(rootNodeId) ||
        !allUniquesIds.length ||
        !hasUnloadedNodes(allUniquesIds, Array.from(nodes.keys()))
      ) {
        loadingInitialValue.current = false;
      } else {
        loadNodesFunc(allUniquesIds).then(() => {
          !isCanceled.value && setLoading(false);
        });
      }
    }
  });

  const [loading, setLoading] = useState(loadingInitialValue.current);

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
      persistVisibleState={persistVisibleState}
      loadNodesAsyncFunc={loadNodesFunc}
      visibleStateKey={visibleStateKey}
      visibleGraph={visibleGraph}
      setVisibleGraph={setVisibleGraph}
    >
      <div className={styles['graph']} style={mapPropsToStyle(graphStyles)}>
        {loading ? (
          <LoadingRoot loadingIndicator={loadingIndicator} />
        ) : (
          <GraphNode
            nodeContent={nodeContent}
            parentPath={[]}
            nodeId={rootNodeId}
            isRoot
            isSelected={isSelected}
            childrenLoadingIndicator={loadingIndicator}
            onNodeClick={handleNodeClick}
          />
        )}
      </div>
    </Providers>
  );
}

export default Graph;
