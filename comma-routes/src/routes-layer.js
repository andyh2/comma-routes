import TripsLayer from './trips-layer';
import React from 'react';

function isoDateDiff(d1, d2) {
  return (Date.parse(d1) - Date.parse(d2)) / 1000
}

function segmentsFromRoute(route, duration) {
  const routeMaxIndex = route['coords'][route['coords'].length - 1]['index']

  return route.coords.map((coords) =>
      [ coords['lat'],
        coords['lng'],
        duration * (coords['index'] / routeMaxIndex)
      ]
  );
}

function routesToTripData(routes) {
  return routes.map((route) => {
    const routeDuration = isoDateDiff(route['end_time'], route['start_time'])

    return {
      segments: segmentsFromRoute(route, routeDuration),
      startTime: 0,
      endTime: routeDuration
    }
  })
}

class RoutesLayer extends TripsLayer {
	constructor(opts) {
		const {routes} = opts
		super({
	        ...opts,
	        data: routesToTripData(routes)
      	})
	}
}

RoutesLayer.PropTypes = {
	routes: React.PropTypes.array
}

export default RoutesLayer
