import { Context, createContext } from "react";
import { GraphNodeDef } from "../models/GraphNodeDef";

type NodesContextState<TId> = {
  nodes: Map<TId, GraphNodeDef<TId>>;
  getNode: (id: TId) => GraphNodeDef<TId> | undefined;
  loadNodesAsync: (ids: TId[]) => Promise<any>;
};

const defaultNodes = new Map();
const context = createContext<NodesContextState<any>>({
  nodes: defaultNodes,
  getNode: (id: any) => defaultNodes.get(id),
  loadNodesAsync: () => Promise.resolve([])
});

export const getNodesContext = <TId>() =>
  context as Context<NodesContextState<TId>>;
