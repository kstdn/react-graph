import React, { ReactNode } from 'react';
import styles from './../../styles.module.css';

type Props = {
  children: ReactNode;
};

const Node = ({ children }: Props) => {
  return <div className={styles['node']}>{children}</div>;
};

export default Node;
