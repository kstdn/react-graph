import { CSSProperties } from "react";
import { GraphStyleProps } from "./models/GraphStyleProps";

export const mapPropsToStyle = (props: GraphStyleProps = {}): CSSProperties => {
  return {
    ["--graph-space" as any]: props.graphSpace,
    ["--text-color" as any]: props.textColor,
    ["--node-padding" as any]: props.nodePadding,
    ["--node-stroke-color" as any]: props.nodeStrokeColor,
    ["--node-background" as any]: props.nodeBackground,
    ["--focused-node-stroke-color" as any]: props.focusedNodeStrokeColor,
    ["--focused-node-background" as any]: props.focusedNodeBackground,
    ["--selected-node-stroke-color" as any]: props.selectedNodeStrokeColor,
    ["--selected-node-background" as any]: props.selectedNodeBackground,
    ["--node-content-width" as any]: props.nodeContentWidth,
    ["--node-content-height" as any]: props.nodeContentHeight,
    ["--node-width" as any]: props.nodeWidth,
    ["--node-height" as any]: props.nodeHeight,
    ["--branch-stroke-color" as any]: props.branchStrokeColor,
    ["--stroke-width" as any]: props.strokeWidth,
    ["--border-radius" as any]: props.borderRadius,
    ["--children-indicator-min-height" as any]: props.childrenIndicatorMinHeight,
    ["--children-indicator-offset" as any]: props.childrenIndicatorOffset,
  };
};

export enum LoadingStatus {
  Idle = 'Idle',
  Loading = 'Loading',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
}

export function hasUnloadedNodes<TId>(ids: TId[], nodeIds: TId[]) {
  return ids.some(id => !nodeIds.includes(id));
}
