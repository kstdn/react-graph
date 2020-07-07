import React, { ReactNode, useState } from "react";
import {
  ExpandedGraphNode,
  isExpanded,
  togglePath
} from "../expanded-graph.util";
import { GraphNodeDef } from "../models/GraphNodeDef";
import { getExpandedContext } from "./ExpandedContext";
import { getNodesContext } from "./NodesContext";
// import { getSelectedNodeContext } from "./SelectedNodeContext";

const expandedStateKey = "expanded-state";

type Props<TId> = {
  nodes: Map<TId, GraphNodeDef<TId>>;
  // onNodeSelected: (nodeId: TId | undefined) => any;
  persistExpandedState: boolean;
  children: ReactNode;
  loadNodesAsyncFunc?: (ids: TId[]) => Promise<GraphNodeDef<TId>[]>;
};

export function Providers<TId>({
  nodes,
  persistExpandedState,
  children,
  loadNodesAsyncFunc,
}: Props<TId>) {
  const [expandedGraph, setExpandedGraph] = useState<ExpandedGraphNode<TId>[]>(
    persistExpandedState
      ? JSON.parse(localStorage.getItem(expandedStateKey) ?? "[]")
      : []
  );

  // const [selectedNodeId, setSelectedNodeId] = useState<TId | undefined>(
  //   undefined
  // );

  const onExpandToggled = (path: TId[]) => {
    const updatedExpandedGraph = togglePath(path, expandedGraph);
    if (persistExpandedState)
      localStorage.setItem(
        expandedStateKey,
        JSON.stringify(updatedExpandedGraph)
      );
    setExpandedGraph(updatedExpandedGraph);
  };

  // const handleNodeSelectionChange = (nodeId: TId | undefined) => {
  //   setSelectedNodeId(() => {
  //     onNodeSelected(nodeId);
  //     return nodeId;
  //   })
  // }

  // const SelectedNodeContext = getSelectedNodeContext<TId>();
  const NodesContext = getNodesContext<TId>();
  const ExpandedContext = getExpandedContext<TId>();

  const getNode = (id: TId) => {
    return nodes.get(id);
  };

  const loadNodesAsync = (childrenIds: TId[]): Promise<any> => {
    const toLoad = childrenIds.filter(id => !nodes.has(id));

    if (toLoad.length === 0) {
      return Promise.resolve([]);
    }

    return loadNodesAsyncFunc
      ? loadNodesAsyncFunc(toLoad).then(result => {
          result.forEach(node => nodes.set(node.id, node))
        })
      : Promise.resolve([]);
  };

  return (
    // <SelectedNodeContext.Provider
    //   value={{
    //     selectedNodeId: selectedNodeId,
    //     setSelectedNodeId: handleNodeSelectionChange,
    //     isSelected: (id: TId) => id === selectedNodeId,
    //   }}
    // >
      <NodesContext.Provider
        value={{
          nodes,
          getNode,
          loadNodesAsync,
        }}
      >
        <ExpandedContext.Provider
          value={{
            expandedGraph,
            isExpanded: (path: TId[]) => isExpanded(path, expandedGraph),
            onExpandToggled,
          }}
        >
          {children}
        </ExpandedContext.Provider>
      </NodesContext.Provider>
    // </SelectedNodeContext.Provider>
  );
}

export default Providers;
