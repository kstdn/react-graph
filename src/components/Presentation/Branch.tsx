import React, { ReactNode } from 'react';
import styles from './../../styles.module.css';

type Props = {
  children: ReactNode;
  isRoot: boolean;
};

const Branch = ({ children, isRoot }: Props) => {
  return (
    <div className={`${styles['branch']}${isRoot ? ` ${styles['root']}` : ''}`}>
      {children}
    </div>
  );
};

export default Branch;
