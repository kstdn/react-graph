import { useRef, useEffect } from 'react';

export const useBeforeFirstRender = (callback: (isCanceled: { value : boolean }) => any) => {
  const hasRendered = useRef(false);
  const isCanceled = useRef({ value: false });

  useEffect(() => {
    return () => {
      isCanceled.current.value = true;
    };
  });

  if (!hasRendered.current) {
    callback(isCanceled.current);
    hasRendered.current = true;
  }
};
