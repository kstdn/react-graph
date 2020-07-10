import React from 'react';
import styles from './../../styles.module.css';

type Props = {
  hasChildren?: boolean;
  isExpanded?: boolean;
};

const IndicatorsAfter = ({ hasChildren, isExpanded }: Props) => {
  return hasChildren ? (
    isExpanded ? (
      <div className={`${styles['link']} ${styles['to-children']}`}></div>
    ) : (
      <div className={`${styles['children-indicator']}`}></div>
    )
  ) : null;
};

export default IndicatorsAfter;
