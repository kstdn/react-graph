import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  VisibleGraphNode,
  areChildrenVisible,
  togglePathsVisibility
} from '../visible-graph.util';
import { GraphNodeDef } from '../models/GraphNodeDef';
import { getVisibleContext } from './VisibleContext';
import { getNodesContext } from './NodesContext';

type Props<TId> = {
  nodes: Map<TId, GraphNodeDef<TId>>;
  persistVisibleState: boolean;
  children: ReactNode;
  loadNodesAsyncFunc: (ids: TId[]) => Promise<void>;
  visibleStateKey: string;
  visibleGraph: VisibleGraphNode<TId>[];
  setVisibleGraph: Dispatch<SetStateAction<VisibleGraphNode<TId>[]>>;
};

export function Providers<TId>({
  nodes,
  persistVisibleState,
  children,
  loadNodesAsyncFunc,
  visibleStateKey,
  visibleGraph,
  setVisibleGraph,
}: Props<TId>) {

  const onVisibilityToggled = (parentPath: TId[], childrenIds: TId[]) => {
    const updatedVisibleGraph = togglePathsVisibility(parentPath, childrenIds, visibleGraph);
    if (persistVisibleState)
      localStorage.setItem(
        visibleStateKey,
        JSON.stringify(updatedVisibleGraph)
      );
    setVisibleGraph(updatedVisibleGraph);
  };

  const NodesContext = getNodesContext<TId>();
  const VisibleContext = getVisibleContext<TId>();

  const getNode = (id: TId) => {
    return nodes.get(id);
  };

  return (
    <NodesContext.Provider
      value={{
        nodes,
        getNode,
        loadNodesAsync: loadNodesAsyncFunc,
      }}
    >
      <VisibleContext.Provider
        value={{
          visibleGraph,
          areChildrenVisible: (path: TId[], childrenIds: TId[]) => areChildrenVisible(path, childrenIds, visibleGraph),
          onVisibilityToggled,
        }}
      >
        {children}
      </VisibleContext.Provider>
    </NodesContext.Provider>
  );
}

export default Providers;
