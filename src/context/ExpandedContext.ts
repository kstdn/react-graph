import { Context, createContext } from "react";
import { ExpandedGraphNode } from "../expanded-graph.util";

type ExpandedContextState<TId> = {
  expandedGraph: ExpandedGraphNode<TId>[];
  isExpanded: (path: TId[]) => boolean;
  onExpandToggled: (path: TId[]) => void;
};

const context = createContext<ExpandedContextState<any>>({
  expandedGraph: [],
  isExpanded: () => false,
  onExpandToggled: () => {}
});
export const getExpandedContext = <TId>() =>
  context as Context<ExpandedContextState<TId>>;
