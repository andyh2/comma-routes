import React, { Component } from 'react';
import DeckGL from 'deck.gl/react';
import {ExtrudedChoroplethLayer64, Viewport} from 'deck.gl';
import RoutesLayer from './routes-layer'
import {join} from 'path';
import {getRoutes} from './routes'
import Map from './map'

class DeckGLRoutes extends Component {
  constructor() {
    super()
    this.state = {
      routes: [],
      time: 0
    }

    getRoutes((route) => {
      this.setState({routes: this.state.routes.concat([route])})
    })
  }
  render() {
    const viewport = new Viewport();
    const routesLayer = new RoutesLayer({
      strokeWidth: 2,
      routes: this.state.routes,
      id: 'routes',
      trailLength: 180,
      currentTime: this.state.time,
      getPath: d => d.segments,
      getColor: d => [253,128,93], // : [23,184,190],
      opacity: 0.3
    })

    const layers = [routesLayer]
    return (
      <DeckGL width={1440} height={900} layers={layers} />
    );
  }
}

class App extends Component {
  updateMap(viewport) {

  }

  render() {
    return (
      <Map overlay={<DeckGLRoutes />} />
    );
  }
}

App.propTypes = {
  routes: React.PropTypes.array
}

export default App;
