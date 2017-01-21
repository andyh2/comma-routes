import {join} from 'path'
function getRouteFile(routeFileName, callback) {
  var xhr = new XMLHttpRequest()
  const routePath = join(__dirname, `./routes/${routeFileName}`);
  xhr.open("GET", routePath)
  xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE) {
      const route = JSON.parse(xhr.responseText)
      callback(route)
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

