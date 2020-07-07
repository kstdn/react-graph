import React, { ReactNode } from 'react';
import styles from './../../styles.module.css';
import { LoadingStatus } from './../../util';

type Props = {
  childrenCount: number;
  childrenStatus: LoadingStatus;
  childrenLoadingIndicator: ReactNode;
  expanded: boolean;
};

const Indicators = ({
  childrenCount,
  childrenStatus,
  childrenLoadingIndicator,
  expanded,
}: Props) => {
  return (
    <>
      {childrenCount > 0 &&
        (childrenStatus === LoadingStatus.Loading ? (
          <div className={styles['children-loading-indicator']}>
            {childrenLoadingIndicator ? childrenLoadingIndicator : 'Loading...'}
          </div>
        ) : expanded ? (
          <div className={`${styles['link']} ${styles['to-children']}`}></div>
        ) : (
          <div className={`${styles['children-indicator']}`}></div>
        ))}
    </>
  );
};

export default Indicators;
