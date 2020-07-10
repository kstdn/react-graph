import React, { ReactNode, SyntheticEvent } from 'react';
import { preventUndesiredEventHandling } from '../GraphNode/util';
import Branch from './Branch';
import IndicatorsAfter from './IndicatorsAfter';
import IndicatorsBefore from './IndicatorsBefore';
import Node from './Node';
import NodeContainer from './NodeContainer';

type Props = {
  /**
   * Content to be displayed inside the node
   */
  nodeContent?: ReactNode;

  /**
   * Is this node a root node
   */
  isRoot: boolean;

  /**
   * Is this node a leaf node
   */
  isLeaf: boolean;

  /**
   * Is this node selected
   */
  isSelected?: boolean;

  /**
   * Is this node expanded
   */
  isExpanded?: boolean;

  /**
   * Node click callback
   */
  onNodeClick?: () => any;

  /**
   * Does this node have children
   */
  hasChildren?: boolean;

  /**
   * Content to be displayed as node children
   */
  nodeChildren?: ReactNode;
};

function Level({
  nodeContent,
  isRoot,
  isLeaf,
  isSelected,
  isExpanded,
  onNodeClick,
  hasChildren,
  nodeChildren,
}: Props) {
  
  const handleNodeInteraction = (e: SyntheticEvent) => {
    preventUndesiredEventHandling(e, () => {
      onNodeClick && onNodeClick();
    });
  };

  return (
    <Branch isRoot={isRoot}>
      <NodeContainer
        onInteraction={handleNodeInteraction}
        isLeaf={isLeaf}
        isSelected={isSelected}
      >
        <IndicatorsBefore />
        <Node>{nodeContent}</Node>
        <IndicatorsAfter hasChildren={hasChildren} isExpanded={isExpanded} />
      </NodeContainer>
      {isExpanded && nodeChildren}
    </Branch>
  );
}

export default Level;
