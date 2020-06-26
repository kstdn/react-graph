import { Context, createContext } from "react";

type SelectedNodeState<TId> = {
  selectedNodeId: TId | undefined;
  setSelectedNodeId: (nodeId: TId | undefined) => any;
  isSelected: (id: TId) => boolean;
};

const context = createContext<SelectedNodeState<any>>({
  selectedNodeId: undefined,
  setSelectedNodeId: () => {},
  isSelected: () => false,
});

export const getSelectedNodeContext = <TId>() => context as Context<SelectedNodeState<TId>>;
