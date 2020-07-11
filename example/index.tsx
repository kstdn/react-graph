import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { Graph, GraphNodeDef } from './..';
import { getNodes } from './mock-backend';

let nodes = new Map<string, GraphNodeDef<string>>();
nodes.set('1', new GraphNodeDef('Node 1', '1', ['2', '3', '5']));

const App = () => {
  return (
    <Graph
      rootNodeId={'1'}
      nodes={nodes}
      persistVisibleState={true}
      loadNodesAsyncFunc={getNodes}
      onNodeClicked={node => console.log('Clicked', node)}
      onNodeSelected={node => console.log('Selected', node)}
    />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
