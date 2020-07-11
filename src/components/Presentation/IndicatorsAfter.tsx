import React from 'react';
import styles from './../../styles.module.css';

type Props = {
  hasChildren?: boolean;
  areChildrenVisible?: boolean;
};

const IndicatorsAfter = ({ hasChildren, areChildrenVisible }: Props) => {
  return hasChildren ? (
    areChildrenVisible ? (
      <div className={`${styles['link']} ${styles['to-children']}`}></div>
    ) : (
      <div className={`${styles['children-indicator']}`}></div>
    )
  ) : null;
};

export default IndicatorsAfter;
