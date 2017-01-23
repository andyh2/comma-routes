import React, { Component } from 'react';
import MapGL from 'react-map-gl';
const MAPBOX_API_TOKEN = "pk.eyJ1IjoiYW5keWgyIiwiYSI6ImNpeTdyajZlZjAwN24zMm94em9sMjF5dWwifQ._ai_A54M5FuzsRDxnnPhdg"

class Map extends Component {
    render() {
        return (<MapGL
        mapboxApiAccessToken={MAPBOX_API_TOKEN}
        perspectiveEnabled={true}
        onChangeViewport={this.props.viewportChanged}
        mapStyle={'mapbox://styles/mapbox/dark-v9'}
        {...this.props.viewport}
        >
        {this.props.overlay}
      </MapGL>);
    }
}


Map.PropTypes = {
    overlay: React.PropTypes.element,
    viewport: React.PropTypes.object.isRequired,
    viewportChanged: React.PropTypes.func
}

export default Map
