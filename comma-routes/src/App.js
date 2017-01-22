import React, { Component } from 'react';
import DeckGL from 'deck.gl/react';
import {getRoutes} from './routes'
import Map from './map'
import TripsLayer from './trips-layer'
import TWEEN from 'tween.js'

class DeckGLRoutes extends Component {
  constructor() {
    super()

    this.state = {
      trips: [],
      time: 0
    }
    const that = this

    this.tween = new TWEEN.Tween({time: 0})
          .to({time: 3600}, 120000)
          .onUpdate(function() { that.setState(this) })
          .repeat(Infinity);

    getRoutes((trip) => {
      this.setState({trips: this.state.trips.concat([trip])})
    })
  }

  tweenAnimate() {
    TWEEN.update();
    requestAnimationFrame(this.tweenAnimate.bind(this));
  }

  componentDidMount() {
    const that = this;
    this.tween.start();
    this.tweenAnimate();
  }

  componentWillUnmount() {
    this.tween.stop();
  }

  render() {
    const tripsLayers = this.state.trips.map((trip, index) => new TripsLayer({
      strokeWidth: 30,
      data: [trip],
      id: `routes-${index}`,
      trailLength: 180,
      currentTime: this.state.time,
      getPath: d => d.segments,
      getColor: d => [253,128,93], // : [23,184,190],
      opacity: 1
    }))

    return (
      <DeckGL {...this.props.viewport} layers={tripsLayers} />
    );
  }
}

DeckGLRoutes.propTypes = {
  viewport: React.PropTypes.object.isRequired
}

class App extends Component {
  updateMap(viewport) {

  }

  render() {
    const viewport = {
      width: 1440,
      height: 900
    }

    return (
      <Map viewport={viewport} overlay={<DeckGLRoutes viewport={viewport} />} />
    );
  }
}

App.propTypes = {
  routes: React.PropTypes.array
}

export default App;
