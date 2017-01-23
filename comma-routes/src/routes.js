import {join} from 'path'

function isoDateDiff(d1, d2) {
  return (Date.parse(d1) - Date.parse(d2)) / 1000
}

function segmentsFromRoute(route, duration) {
  const routeMaxIndex = route['coords'][route['coords'].length - 1]['index']

  return route.coords.map((coords) =>
      [ coords['lng'],
        coords['lat'],
        duration * (coords['index'] / routeMaxIndex)
      ]
  );
}

function routeToTrip(route) {
  const routeDuration = isoDateDiff(route['end_time'], route['start_time'])
  return {
    segments: segmentsFromRoute(route, routeDuration),
    startTime: 0,
    endTime: routeDuration,
    duration: routeDuration
  }
}

function getRouteFile(routeFileName, callback) {
  var xhr = new XMLHttpRequest()
  const routePath = join(__dirname, `./routes/${routeFileName}`);
  xhr.open("GET", routePath)
  xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE) {
      const route = JSON.parse(xhr.responseText)

      callback(routeToTrip(route))
    }
  }
  xhr.send()
}

export function getRoutes(callback) {
  /*
  Callback will be called once per route
  */
  var xhr = new XMLHttpRequest()
  xhr.open("GET", join(__dirname, "./routes/listing.json"))
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const routeFileNames = JSON.parse(xhr.responseText)
      for(var filename of routeFileNames) {
        getRouteFile(filename, callback);
      }
    }
  }
  xhr.send()
}

