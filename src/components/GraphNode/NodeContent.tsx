import React, { ReactNode } from 'react';
import styles from './../../styles.module.css';

type Props = {
  children?: ReactNode;
};

function NodeContent({ children }: Props) {
  return <div className={styles['node-content']}>{children}</div>;
}

export default NodeContent;
