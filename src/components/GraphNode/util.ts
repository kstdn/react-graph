import { SyntheticEvent } from "react";

export const preventUndesiredEventHandling = (
  e: SyntheticEvent,
  callback?: Function
) => {
  e.stopPropagation();
  if (e.nativeEvent instanceof KeyboardEvent) {
    if (e.nativeEvent.key !== "Enter") return;
    e.preventDefault();
  }
  callback && callback();
};
