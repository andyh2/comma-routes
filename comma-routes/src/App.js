import React, { Component } from 'react';
import {getRoutes} from './routes'
import Map from './map'
import TripsLayer from './trips-layer'
import TWEEN from 'tween.js'
import geoViewport from 'geo-viewport'
import DeckGLRoutes from './deck-gl-routes'

class App extends Component {
  constructor() {
    super()

    const initialViewport = {
      width: 1440,
      height: 900,
      longitude: -122.3976141621346,
      latitude: 37.762534623904656,
      zoom: 11,
      maxZoom: 16,
      pitch: 45,
      bearing: 0
    }

    this.state = {
      maxTime: 0,
      trips: [],
      viewport: initialViewport,
      tripBounds: {
        west: Number.MAX_SAFE_INTEGER,
        south: Number.MAX_SAFE_INTEGER,
        east: -Number.MAX_SAFE_INTEGER,
        north: -Number.MAX_SAFE_INTEGER
      }
    }

    getRoutes((trip) => {
      this.addTrip(trip)
    })
  }

  addTrip(trip) {
    const newState = {trips: this.state.trips.concat([trip])}

    if (trip.duration > this.state.maxTime) {
      newState.maxTime = trip.duration;
    }

    this.setState(newState, () => {
      this.updateTripBounds(trip)
    });
  }

  updateTripBounds(trip) {
    let tripBounds = this.state.tripBounds;
    var {west, south, east, north} = tripBounds;

    for(let segment of trip.segments) {
      const long = segment[0], lat = segment[1];
      if (long < west) {
        west = long
      }
      if (lat < south) {
        south = lat
      }
      if (long > east) {
        east = long
      }
      if (lat > north) {
        north = lat
      }
    }
    tripBounds = {west, south, east, north}

    this.setState({tripBounds}, this.updateViewport)
  }

  updateViewport() {
    /*
    Sets viewport to contain all trips
    */
    const {west, south, east, north} = this.state.tripBounds
    const viewport = this.state.viewport

    const boundedViewport = geoViewport.viewport(
      [west, south, east, north],
      [viewport.width, viewport.height])

    viewport.longitude = boundedViewport.center[0]
    viewport.latitude = boundedViewport.center[1]
    viewport.zoom = boundedViewport.zoom

    this.setState({viewport})
  }

  updateDimensions() {
     const w = window,
         d = document,
         documentElement = d.documentElement,
         body = d.getElementsByTagName('body')[0],
         width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
         height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
    const viewport = this.state.viewport
    viewport.width = width;
    viewport.height = height;
    this.setState({viewport});
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  _viewportChanged(newViewport) {
    // Called when user drags or zooms map
    const viewport = this.state.viewport
    Object.assign(viewport, newViewport)
    this.setState({viewport})
  }

  render() {
    const deckGlOverlay = (<DeckGLRoutes
          viewport={this.state.viewport}
          maxTime={this.state.maxTime}
          tweenDuration={10000}
          trips={this.state.trips}
        />)
    return (
      <Map viewport={this.state.viewport}
        viewportChanged={this._viewportChanged.bind(this)}
        overlay={deckGlOverlay} />
    );
  }
}

App.propTypes = {
  routes: React.PropTypes.array
}

export default App;
