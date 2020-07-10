export class ExpandedGraphNode<T> {
  constructor(public value: T, public children: ExpandedGraphNode<T>[] = []) {}
}

const copy = <T>(nodes: ExpandedGraphNode<T>[]): ExpandedGraphNode<T>[] => {
  return nodes.map(
    node => new ExpandedGraphNode(node.value, copy(node.children))
  );
};

export const isExpanded = <TId>(
  path: TId[],
  expandedGraph: ExpandedGraphNode<TId>[]
): boolean => {
  if (path.length === 0) {
    throw new Error('Path Not Valid');
  }

  let currentLevel: ExpandedGraphNode<TId>[] = expandedGraph;

  let index = 0;
  while (index < path.length) {
    const segment = path[index];
    const found = currentLevel.find(s => s.value === segment);
    if (found) {
      currentLevel = found.children;
    } else {
      return false;
    }
    index++;
  }

  return true;
};

export const togglePath = <TId>(
  path: TId[],
  expandedGraph: ExpandedGraphNode<TId>[]
): ExpandedGraphNode<TId>[] => {
  const expanded = isExpanded(path, expandedGraph);

  if (expanded) {
    return collapseLastNodeOfPath(path, expandedGraph);
  } else {
    return expandPath(path, expandedGraph);
  }
};

export const expandPath = <TId>(
  path: TId[],
  expandedGraph: ExpandedGraphNode<TId>[]
): ExpandedGraphNode<TId>[] => {
  if (path.length === 0) {
    throw new Error('Path Not Valid');
  }

  const expandedGraphCopy: ExpandedGraphNode<TId>[] = copy(expandedGraph);
  let currentLevel = expandedGraphCopy;

  for (const pathSegment of path) {
    const found = currentLevel.find(node => node.value === pathSegment);
    if (found) {
      currentLevel = found.children;
    } else {
      const node = new ExpandedGraphNode(pathSegment);
      currentLevel.push(node);
      currentLevel = node.children;
    }
  }

  return expandedGraphCopy;
};

export const collapseLastNodeOfPath = <TId>(
  path: TId[],
  expandedGraph: ExpandedGraphNode<TId>[]
): ExpandedGraphNode<TId>[] => {
  if (path.length <= 0) {
    throw new Error('Path Not Valid');
  }

  const expandedGraphCopy: ExpandedGraphNode<TId>[] = copy(expandedGraph);

  let currentLevel = expandedGraphCopy;

  let pathSegmentsLeft = path.length;
  while (pathSegmentsLeft > 0) {
    const i = path.length - pathSegmentsLeft;
    const pathSegment = path[i];
    const found = currentLevel.find(node => node.value === pathSegment);

    if (found) {
      if (pathSegmentsLeft > 1) {
        // if we're not on the last path segment, we continue iterating
        currentLevel = found.children;
      } else {
        // if we're on the last segment, we remove it and return the graph
        const index = currentLevel.indexOf(found);
        currentLevel.splice(index, 1);
        return expandedGraphCopy;
      }
    } else {
      // if we don't find the path segment on the current level, we return
      return expandedGraphCopy;
    }

    pathSegmentsLeft--;
  }

  return expandedGraphCopy;
};

const getAllNodeIds = <TId>(expandedGraph: ExpandedGraphNode<TId>[]): TId[] =>
  expandedGraph.reduce<TId[]>(
    (prev, curr) => [...prev, curr.value, ...getAllNodeIds(curr.children)],
    []
  );

export const getAllUniqueNodeIds = <TId>(
  expandedGraph: ExpandedGraphNode<TId>[]
): TId[] => Array.from(new Set(getAllNodeIds(expandedGraph)));
