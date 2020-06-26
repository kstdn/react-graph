import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { Graph, GraphNodeDef } from './..';

let nodes = new Map<string, GraphNodeDef<string>>();
nodes.set('1', new GraphNodeDef('Node 1', '1', ['2', '3', '5']));
nodes.set('2', new GraphNodeDef('Node 2', '2', ['4', '6']));
nodes.set('3', new GraphNodeDef('Node 3', '3', ['4']));
nodes.set('4', new GraphNodeDef('Node 4', '4', []));
nodes.set('5', new GraphNodeDef('Node 5', '5', ['4']));
nodes.set('6', new GraphNodeDef('Node 6', '6', []));

const App = () => {
  return (
    <Graph
      rootNodeId={'1'}
      nodes={nodes}
      persistExpandedState={true}
      onNodeClicked={node => console.log('Clicked', node)}
      onNodeSelected={node => console.log('Selected', node)}
    />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
