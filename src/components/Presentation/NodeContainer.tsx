import React, { ReactNode, SyntheticEvent } from 'react';
import styles from './../../styles.module.css';

type Props = {
  onInteraction?: (e: SyntheticEvent) => any;
  isLeaf?: boolean;
  isSelected?: boolean;
  children?: ReactNode;
};

const NodeContainer = ({
  onInteraction,
  isLeaf,
  isSelected,
  children,
}: Props) => {
  return (
    <div
      tabIndex={0}
      onClick={onInteraction}
      onKeyDown={onInteraction}
      className={`${styles['node-container']}${isLeaf ? ` ${styles['leaf']}` : ''}${
        isSelected ? ` ${styles['selected']}` : ''
      }`}
    >
      {children}
    </div>
  );
};

export default NodeContainer;
