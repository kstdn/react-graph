import { Context, createContext } from "react";
import { GraphNodeDef } from "../models/GraphNodeDef";

type NodesContextState<TId> = {
  nodes: Map<TId, GraphNodeDef<TId>>;
  getNode: (id: TId) => GraphNodeDef<TId> | undefined;
};

const defaultNodes = new Map();
const context = createContext<NodesContextState<any>>({
  nodes: defaultNodes,
  getNode: (id: any) => defaultNodes.get(id),
});

export const getNodesContext = <TId>() =>
  context as Context<NodesContextState<TId>>;
