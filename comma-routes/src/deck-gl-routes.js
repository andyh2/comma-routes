import React, { Component } from 'react';
import DeckGL from 'deck.gl/react';
class DeckGLRoutes extends Component {
  constructor(props) {
    super(props)

    this.state = {time: 0}
    const that = this

    this.setTweenFromProps(props)
  }

  setTweenFromProps(props) {
    const that = this
    this.tween = new TWEEN.Tween({time: 0})
         .to({time: props.maxTime}, props.tweenDuration)
         .onUpdate(function() { that.setState(this) })
         .repeat(Infinity);
  }

  tweenAnimate() {
    TWEEN.update();
    requestAnimationFrame(this.tweenAnimate.bind(this));
  }

  componentWillUpdate(nextProps, nextState) {
    // If tween configuration changes, re-create tween.
    if(this.props.maxTime !== nextProps.maxTime
      || this.props.tweenDuration !== nextProps.tweenDuration) {
      this.tween.stop();
      this.setTweenFromProps(nextProps)
      this.tween.start();
    }
  }

  componentDidMount() {
    this.tween.start();
    this.tweenAnimate();
  }

  componentWillUnmount() {
    this.tween.stop();
  }

  render() {
    const tripsLayers = this.props.trips.map((trip, index) => new TripsLayer({
      strokeWidth: 30,
      data: [trip],
      id: `routes-${index}`,
      trailLength: 360,
      currentTime: this.state.time,
      getPath: d => d.segments,
      getColor: d => [253,128,93],
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

export default DeckGLRoutes
