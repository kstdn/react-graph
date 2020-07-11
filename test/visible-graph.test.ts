import {
  hideLastNodeOfPaths,
  VisibleGraphNode,
  showPaths,
  getAllUniqueNodeIds,
  areChildrenVisible
} from '../src/visible-graph.util';

describe('Expanded Graph', () => {
  it('path should be expanded', () => {
    // Arrange
    const parentPath = ['1', '2'];
    const childrenIds = ['3'];
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [
        new VisibleGraphNode('2', [new VisibleGraphNode('3')]),
      ]),
    ];

    // Act
    const result = areChildrenVisible(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual(true);
  });

  it('path should be expanded', () => {
    // Arrange
    const parentPath = ['1'];
    const childrenIds = ['2'];
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [
        new VisibleGraphNode('2', [new VisibleGraphNode('3')]),
      ]),
    ];

    // Act
    const result = areChildrenVisible(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual(true);
  });

  it("path should not be expanded when it's missing a node", () => {
    // Arrange
    const parentPath = ['1'];
    const childrenIds = ['3'];
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [
        new VisibleGraphNode('2', [new VisibleGraphNode('3')]),
      ]),
    ];

    // Act
    const result = areChildrenVisible(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual(false);
  });

  it('path should not be expanded when graph is empty', () => {
    // Arrange
    const parentPath: string[] = ['1'];
    const childrenIds = ['3'];
    const expandedGraph: VisibleGraphNode<string>[] = [];

    // Act
    const result = areChildrenVisible(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual(false);
  });

  it('invalid path should throw error', () => {
    // Arrange
    const parentPath: string[] = [];
    const childrenIds = ['2'];
    const expandedGraph: VisibleGraphNode<string>[] = [];

    // Act & Assert
    expect(() => {
      areChildrenVisible(parentPath, childrenIds, expandedGraph);
    }).toThrowError();
  });

  it('should expand path deeper than root', () => {
    // Arrange
    const parentPath: string[] = ['1'];
    const childrenIds = ['2'];
    const expandedGraph: VisibleGraphNode<string>[] = [];

    // Act
    const result = showPaths(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual([
      new VisibleGraphNode('1', [new VisibleGraphNode('2')]),
    ]);
  });

  it('should expand path when siblings exist', () => {
    // Arrange
    const parentPath: string[] = ['1'];
    const childrenIds = ['3'];
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [new VisibleGraphNode('2')]),
    ];

    // Act
    const result = showPaths(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual([
      new VisibleGraphNode('1', [
        new VisibleGraphNode('2'),
        new VisibleGraphNode('3'),
      ]),
    ]);
  });

  it('invalid path should throw error', () => {
    // Arrange
    const parentPath: string[] = [];
    const expandedGraph: VisibleGraphNode<string>[] = [];

    // Act & Assert
    expect(() => showPaths(parentPath, [], expandedGraph)).toThrowError();
  });

  it('should collapse path when graph is empty', () => {
    // Arrange
    const parentPath: string[] = ['1'];
    const expandedGraph: VisibleGraphNode<string>[] = [];

    // Act
    const result = hideLastNodeOfPaths(parentPath, [], expandedGraph);

    // Assert
    expect(result).toEqual([]);
  });

  it('should collapse path with no leaves and no siblings', () => {
    // Arrange
    const parentPath: string[] = ['1'];
    const childrenIds = ['2'];
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [new VisibleGraphNode('2')]),
    ];

    // Act
    const result = hideLastNodeOfPaths(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual([new VisibleGraphNode('1')]);
  });

  it('should collapse path with no leaves and siblings', () => {
    // Arrange
    const parentPath: string[] = ['1'];
    const childrenIds = ['2'];
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [
        new VisibleGraphNode('2'),
        new VisibleGraphNode('3'),
      ]),
    ];

    // Act
    const result = hideLastNodeOfPaths(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual([
      new VisibleGraphNode('1', [new VisibleGraphNode('3')]),
    ]);
  });

  it('should collapse deeper path', () => {
    // Arrange
    const parentPath: string[] = ['1', '2'];
    const childrenIds = ['4'];
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [
        new VisibleGraphNode('2', [new VisibleGraphNode('4')]),
        new VisibleGraphNode('3', [new VisibleGraphNode('5')]),
      ]),
    ];

    // Act
    const result = hideLastNodeOfPaths(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual([
      new VisibleGraphNode('1', [
        new VisibleGraphNode('2'),
        new VisibleGraphNode('3', [new VisibleGraphNode('5')]),
      ]),
    ]);
  });

  it('should collapse path with multiple leaves', () => {
    // Arrange
    const parentPath: string[] = ['1'];
    const childrenIds = ['2'];
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [
        new VisibleGraphNode('2', [
          new VisibleGraphNode('4'),
          new VisibleGraphNode('5'),
        ]),
        new VisibleGraphNode('3', [new VisibleGraphNode('6')]),
      ]),
    ];

    // Act
    const result = hideLastNodeOfPaths(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual([
      new VisibleGraphNode('1', [
        new VisibleGraphNode('3', [new VisibleGraphNode('6')]),
      ]),
    ]);
  });

  it('should not change graph when path was not previously expanded', () => {
    // Arrange
    const parentPath: string[] = ['1', '2'];
    const childrenIds = ['3'];
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [new VisibleGraphNode('4')]),
    ];

    // Act
    const result = hideLastNodeOfPaths(parentPath, childrenIds, expandedGraph);

    // Assert
    expect(result).toEqual(expandedGraph);
  });

  it('invalid path should throw error', () => {
    // Arrange
    const parentPath: string[] = [];
    const expandedGraph: VisibleGraphNode<string>[] = [];

    // Act & Assert
    expect(() => hideLastNodeOfPaths(parentPath, [], expandedGraph)).toThrowError();
  });

  it('should extract all unique ids', () => {
    // Arrange
    const expandedGraph: VisibleGraphNode<string>[] = [
      new VisibleGraphNode('1', [
        new VisibleGraphNode('2', [
          new VisibleGraphNode('3'),

          new VisibleGraphNode('4'),
        ]),
        new VisibleGraphNode('2', [new VisibleGraphNode('1')]),
      ]),
    ];
    // Act & Assert
    expect(getAllUniqueNodeIds(expandedGraph)).toEqual(['1', '2', '3', '4']);
  });
});
