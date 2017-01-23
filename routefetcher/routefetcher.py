"""
Usage:
export COMMA_AUTH=your_comma_auth_token
your_comma_auth_token can be obtained in your browser console
on beta.comma.ai: getCookie("comma_access_token")

"""
import requests
import os
import json

ROUTES_ENDPOINT = 'https://api.comma.ai/v1/me/routes/'

def fetch_routes(auth_token):
	headers = {
		'Authorization': 'JWT {}'.format(auth_token)
	}
	resp = requests.get(ROUTES_ENDPOINT, headers=headers)
	routes = resp.json()
	return routes['routes']

def coords_for_route(route):
	coords_url = os.path.join(route['url'], 'route.coords')
	resp = requests.get(coords_url)
	return resp.json()


if __name__ == '__main__':
	routes = fetch_routes(os.environ['COMMA_AUTH'])
	route_files = []

	for route_time, route in routes.items():
		route['coords'] = coords_for_route(route)
		route_file = route_time + '.json'
		with open(route_file, 'w') as f:
			json.dump(route, f)
			route_files.append(route_file)

	with open('listing.json', 'w') as f:
		json.dump(route_files, f)




