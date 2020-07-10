import React, { ReactNode } from 'react';
import Branch from './Branch';
import IndicatorsAfter from './IndicatorsAfter';
import Node from './Node';
import NodeContainer from './NodeContainer';

type Props = {
  loadingIndicator?: ReactNode;
};

const LoadingRoot = ({ loadingIndicator }: Props) => {
  return (
    <Branch isRoot={true}>
      <NodeContainer>
        <Node>{loadingIndicator || 'Loading...'}</Node>
        <IndicatorsAfter />
      </NodeContainer>
    </Branch>
  );
};

export default LoadingRoot;
