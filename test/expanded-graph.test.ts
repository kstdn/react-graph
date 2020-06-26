import {
  isExpanded,
  collapseLastNodeOfPath,
  ExpandedGraphNode,
  expandPath,
} from "../src/expanded-graph.util";

describe("Expanded Graph", () => {
  it("path should be expanded", () => {
    // Arrange
    const path = ["1", "2", "3"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1", [
        new ExpandedGraphNode("2", [new ExpandedGraphNode("3")]),
      ]),
    ];

    // Act
    const result = isExpanded(path, expandedGraph);

    // Assert
    expect(result).toEqual(true);
  });

  it("path should be expanded", () => {
    // Arrange
    const path = ["1", "2"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1", [
        new ExpandedGraphNode("2", [new ExpandedGraphNode("3")]),
      ]),
    ];

    // Act
    const result = isExpanded(path, expandedGraph);

    // Assert
    expect(result).toEqual(true);
  });

  it("path should not be expanded when it's missing a node", () => {
    // Arrange
    const path = ["1", "3"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1", [
        new ExpandedGraphNode("2", [new ExpandedGraphNode("3")]),
      ]),
    ];

    // Act
    const result = isExpanded(path, expandedGraph);

    // Assert
    expect(result).toEqual(false);
  });

  it("path should not be expanded when graph is empty", () => {
    // Arrange
    const path: string[] = ["1", "3"];
    const expandedGraph: ExpandedGraphNode<string>[] = [];

    // Act
    const result = isExpanded(path, expandedGraph);

    // Assert
    expect(result).toEqual(false);
  });

  it("invalid path should throw error", () => {
    // Arrange
    const path: string[] = [];
    const expandedGraph: ExpandedGraphNode<string>[] = [];

    // Act & Assert
    expect(() => {
      isExpanded(path, expandedGraph);
    }).toThrowError();
  });

  it("should expand root path", () => {
    // Arrange
    const path: string[] = ["1"];
    const expandedGraph: ExpandedGraphNode<string>[] = [];

    // Act
    const result = expandPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(JSON.stringify([new ExpandedGraphNode("1")]))
    );
  });

  it("should expand path deeper than root", () => {
    // Arrange
    const path: string[] = ["1", "2"];
    const expandedGraph: ExpandedGraphNode<string>[] = [];

    // Act
    const result = expandPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(
        JSON.stringify([
          new ExpandedGraphNode("1", [new ExpandedGraphNode("2")]),
        ])
      )
    );
  });

  it("should expand path when siblings exist", () => {
    // Arrange
    const path: string[] = ["1", "3"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1", [new ExpandedGraphNode("2")]),
    ];

    // Act
    const result = expandPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(
        JSON.stringify([
          new ExpandedGraphNode("1", [
            new ExpandedGraphNode("2"),
            new ExpandedGraphNode("3"),
          ]),
        ])
      )
    );
  });

  it("invalid path should throw error", () => {
    // Arrange
    const path: string[] = [];
    const expandedGraph: ExpandedGraphNode<string>[] = [];

    // Act & Assert
    expect(() => expandPath(path, expandedGraph)).toThrowError();
  });

  it("should collapse path when graph is empty", () => {
    // Arrange
    const path: string[] = ["1"];
    const expandedGraph: ExpandedGraphNode<string>[] = [];

    // Act
    const result = collapseLastNodeOfPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(JSON.stringify([]))
    );
  });

  it("should collapse path when graph has only one value", () => {
    // Arrange
    const path: string[] = ["1"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1"),
    ];

    // Act
    const result = collapseLastNodeOfPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(JSON.stringify([]))
    );
  });

  it("should collapse path with no leaves and no siblings", () => {
    // Arrange
    const path: string[] = ["1", "2"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1", [new ExpandedGraphNode("2")]),
    ];

    // Act
    const result = collapseLastNodeOfPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(JSON.stringify([new ExpandedGraphNode("1")]))
    );
  });

  it("should collapse path with no leaves and siblings", () => {
    // Arrange
    const path: string[] = ["1", "2"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1", [
        new ExpandedGraphNode("2"),
        new ExpandedGraphNode("3"),
      ]),
    ];

    // Act
    const result = collapseLastNodeOfPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(
        JSON.stringify([
          new ExpandedGraphNode("1", [new ExpandedGraphNode("3")]),
        ])
      )
    );
  });

  it("should collapse deeper path", () => {
    // Arrange
    const path: string[] = ["1", "2", "4"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1", [
        new ExpandedGraphNode("2", [new ExpandedGraphNode("4")]),
        new ExpandedGraphNode("3", [new ExpandedGraphNode("5")]),
      ]),
    ];

    // Act
    const result = collapseLastNodeOfPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(
        JSON.stringify([
          new ExpandedGraphNode("1", [
            new ExpandedGraphNode("2"),
            new ExpandedGraphNode("3", [new ExpandedGraphNode("5")]),
          ]),
        ])
      )
    );
  });

  it("should collapse path with multiple leaves", () => {
    // Arrange
    const path: string[] = ["1", "2"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1", [
        new ExpandedGraphNode("2", [
          new ExpandedGraphNode("4"),
          new ExpandedGraphNode("5"),
        ]),
        new ExpandedGraphNode("3", [new ExpandedGraphNode("6")]),
      ]),
    ];

    // Act
    const result = collapseLastNodeOfPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(
        JSON.stringify([
          new ExpandedGraphNode("1", [
            new ExpandedGraphNode("3", [new ExpandedGraphNode("6")]),
          ]),
        ])
      )
    );
  });

  it("should not change graph when path was not previously expanded", () => {
    // Arrange
    const path: string[] = ["1", "2", "3"];
    const expandedGraph: ExpandedGraphNode<string>[] = [
      new ExpandedGraphNode("1", [new ExpandedGraphNode("4")]),
    ];

    // Act
    const result = collapseLastNodeOfPath(path, expandedGraph);

    // Assert
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      JSON.parse(JSON.stringify(expandedGraph))
    );
  });

  it("invalid path should throw error", () => {
    // Arrange
    const path: string[] = [];
    const expandedGraph: ExpandedGraphNode<string>[] = [];

    // Act & Assert
    expect(() => collapseLastNodeOfPath(path, expandedGraph)).toThrowError();
  });
});

