import { GraphNodeDef } from './..';

let nodes = new Map<string, GraphNodeDef<string>>();
nodes.set('1', new GraphNodeDef('Node 1', '1', ['2', '3', '5']));
nodes.set('2', new GraphNodeDef('Node 2', '2', ['4', '6']));
nodes.set('3', new GraphNodeDef('Node 3', '3', ['2', '4']));
nodes.set('4', new GraphNodeDef('Node 4', '4', []));
nodes.set('5', new GraphNodeDef('Node 5', '5', ['4']));
nodes.set('6', new GraphNodeDef('Node 6', '6', []));

export function getNodes(ids: string[]): Promise<GraphNodeDef<string>[]> {
  return new Promise((resolve, reject) => {
    const found = ids.reduce<GraphNodeDef<string>[]>((prev, curr) => {
      const foundNode = nodes.get(curr);
      if (foundNode) {
        return [...prev, foundNode];
      } else return prev;
    }, []);

    if (found.length) {
      setTimeout(() => {
        resolve(found);
      }, 3000);
    } else {
      reject();
    }
  });
}
