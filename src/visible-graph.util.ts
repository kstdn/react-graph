export class VisibleGraphNode<T> {
  constructor(public value: T, public children: VisibleGraphNode<T>[] = []) {}
}

const copy = <T>(nodes: VisibleGraphNode<T>[]): VisibleGraphNode<T>[] => {
  return nodes.map(
    node => new VisibleGraphNode(node.value, copy(node.children))
  );
};

const isVisible = <TId>(
  path: TId[],
  visibleGraph: VisibleGraphNode<TId>[]
): boolean => {
  if (path.length === 0) {
    throw new Error('Path Not Valid');
  }

  let currentLevel: VisibleGraphNode<TId>[] = visibleGraph;

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

export const areChildrenVisible = <TId>(
  parentPath: TId[],
  childrenIds: TId[],
  visibleGraph: VisibleGraphNode<TId>[]
): boolean => {
  if (parentPath.length === 0) {
    throw new Error('Path Not Valid');
  }

  const paths = childrenIds.map(id => [...parentPath, id]);
  return paths.every(path => isVisible(path, visibleGraph));
};

export const togglePathsVisibility = <TId>(
  parentPath: TId[],
  childrenIds: TId[],
  visibleGraph: VisibleGraphNode<TId>[]
): VisibleGraphNode<TId>[] => {
  const paths = childrenIds.map(id => [...parentPath, id]);

  const visible =
    paths.length && paths.every(path => isVisible(path, visibleGraph));

  if (visible) {
    return hideLastNodeOfPaths(parentPath, childrenIds, visibleGraph);
  } else {
    return showPaths(parentPath, childrenIds, visibleGraph);
  }
};

export const showPaths = <TId>(
  parentPath: TId[],
  childrenIds: TId[],
  visibleGraph: VisibleGraphNode<TId>[]
): VisibleGraphNode<TId>[] => {
  const paths = childrenIds.map(id => [...parentPath, id]);

  if (parentPath.length === 0) {
    throw new Error('Path Not Valid');
  }

  const visibleGraphCopy: VisibleGraphNode<TId>[] = copy(visibleGraph);

  for (const path of paths) {
    let currentLevel = visibleGraphCopy;

    for (const pathSegment of path) {
      const found = currentLevel.find(node => node.value === pathSegment);
      if (found) {
        currentLevel = found.children;
      } else {
        const node = new VisibleGraphNode(pathSegment);
        currentLevel.push(node);
        currentLevel = node.children;
      }
    }
  }

  return visibleGraphCopy;
};

export const hideLastNodeOfPaths = <TId>(
  parentPath: TId[],
  childrenIds: TId[],
  visibleGraph: VisibleGraphNode<TId>[]
): VisibleGraphNode<TId>[] => {
  const paths = childrenIds.map(id => [...parentPath, id]);

  if (parentPath.length <= 0) {
    throw new Error('Path Not Valid');
  }

  const visibleGraphCopy: VisibleGraphNode<TId>[] = copy(visibleGraph);

  for (const path of paths) {
    let currentLevel = visibleGraphCopy;

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
          // if we're on the last segment, we remove it and break
          const index = currentLevel.indexOf(found);
          currentLevel.splice(index, 1);
          break;
        }
      } else {
        // if we don't find the path segment on the current level, we break
        break;
      }

      pathSegmentsLeft--;
    }
  }

  return visibleGraphCopy;
};

const getAllNodeIds = <TId>(visibleGraph: VisibleGraphNode<TId>[]): TId[] =>
  visibleGraph.reduce<TId[]>(
    (prev, curr) => [...prev, curr.value, ...getAllNodeIds(curr.children)],
    []
  );

export const getAllUniqueNodeIds = <TId>(
  visibleGraph: VisibleGraphNode<TId>[],
  rootId: TId,
): TId[] => {
  const foundGraphBranch = visibleGraph.find(node => node.value === rootId);
  return Array.from(new Set(getAllNodeIds(foundGraphBranch ? [foundGraphBranch] : [])))
};

export const getRootNodesIds = <TId>(visibleGraph: VisibleGraphNode<TId>[]) =>
  visibleGraph.map(node => node.value);
