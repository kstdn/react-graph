import React, { ReactNode } from 'react';
import styles from './../../styles.module.css';

type Props = {
  children: ReactNode;
};

const NodeChildren = ({ children }: Props) => (
  <div className={styles['node-children']}>{children}</div>
);

export default NodeChildren;
