import { Context, createContext } from "react";
import { VisibleGraphNode as VisibleGraphNode } from "../visible-graph.util";

type VisibleContextState<TId> = {
  visibleGraph: VisibleGraphNode<TId>[];
  areChildrenVisible: (parentPath: TId[], childrenIds: TId[]) => boolean;
  onVisibilityToggled: (parentPath: TId[], childrenIds: TId[]) => void;
};

const context = createContext<VisibleContextState<any>>({
  visibleGraph: [],
  areChildrenVisible: () => false,
  onVisibilityToggled: () => {}
});
export const getVisibleContext = <TId>() =>
  context as Context<VisibleContextState<TId>>;
