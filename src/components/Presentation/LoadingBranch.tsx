import React, { ReactNode } from 'react';
import Branch from './Branch';
import IndicatorsAfter from './IndicatorsAfter';
import IndicatorsBefore from './IndicatorsBefore';
import Node from './Node';
import NodeContainer from './NodeContainer';

type Props = {
  loadingIndicator?: ReactNode;
};

const LoadingLevel = ({ loadingIndicator }: Props) => {
  return (
    <Branch isRoot={false}>
      <NodeContainer>
        <IndicatorsBefore />
        <Node>{loadingIndicator || 'Loading...'}</Node>
        <IndicatorsAfter />
      </NodeContainer>
    </Branch>
  );
};

export default LoadingLevel;
