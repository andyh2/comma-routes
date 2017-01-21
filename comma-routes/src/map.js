import React, { Component } from 'react';
import MapGL from 'react-map-gl';
const MAPBOX_API_TOKEN = "pk.eyJ1IjoiYW5keWgyIiwiYSI6ImNpeTdyajZlZjAwN24zMm94em9sMjF5dWwifQ._ai_A54M5FuzsRDxnnPhdg"

class Map extends Component {
    render() {
        return (<MapGL
        mapboxApiAccessToken={MAPBOX_API_TOKEN}
        perspectiveEnabled={true}
        onChangeViewPort={this.updateMap}
        mapStyle={'mapbox://styles/mapbox/dark-v9'}
        longitude={-122.3976141621346}
        latitude={37.762534623904656}
        zoom={13}
        maxZoom={16}
        pitch={45}
        bearing={0}
        >
        {this.props.overlay}
      </MapGL>);
    }
}

Map.PropTypes = {
    overlay: React.PropTypes.element
}

export default Map
