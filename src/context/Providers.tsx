import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  ExpandedGraphNode,
  isExpanded,
  togglePath
} from '../expanded-graph.util';
import { GraphNodeDef } from '../models/GraphNodeDef';
import { getExpandedContext } from './ExpandedContext';
import { getNodesContext } from './NodesContext';

type Props<TId> = {
  nodes: Map<TId, GraphNodeDef<TId>>;
  persistExpandedState: boolean;
  children: ReactNode;
  loadNodesAsyncFunc: (ids: TId[]) => Promise<void>;
  expandedStateKey: string;
  expandedGraph: ExpandedGraphNode<TId>[];
  setExpandedGraph: Dispatch<SetStateAction<ExpandedGraphNode<TId>[]>>;
};

export function Providers<TId>({
  nodes,
  persistExpandedState,
  children,
  loadNodesAsyncFunc,
  expandedStateKey,
  expandedGraph,
  setExpandedGraph,
}: Props<TId>) {

  const onExpandToggled = (path: TId[]) => {
    const updatedExpandedGraph = togglePath(path, expandedGraph);
    if (persistExpandedState)
      localStorage.setItem(
        expandedStateKey,
        JSON.stringify(updatedExpandedGraph)
      );
    setExpandedGraph(updatedExpandedGraph);
  };

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

    return loadNodesAsyncFunc(childrenIds);
  };

  return (
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
  );
}

export default Providers;
