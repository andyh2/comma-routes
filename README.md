# Comma.ai route visualization

## Running locally

```sh
git clone https://github.com/andyh2/comma-routes.git
cd comma-routes/comma-routes
npm install
node scripts/start.js
```

This will run a demo on localhost:3000 visualizing 20 sample routes.

## Using your own comma data

To visualize your own comma routes, you need to obtain your comma access token.

1. Log in on [beta.comma.ai](https://beta.comma.ai/explorer.php)
2. Open chrome JS console to obtain your comma access token: `getCookie("comma_access_token")`
3. replace YOUR_COMMA_ACCESS_TOKEN below:

```
cd comma-routes/routefetcher
export COMMA_AUTH=YOUR_COMMA_ACCESS_TOKEN
python3 routefetcher.py
mv *.json ../comma-routes/public/routes/ # this will overwrite sample data
```

Finally, follow the "running locally" steps above.

## References

- Facebook [create-react-app](https://github.com/facebookincubator/create-react-app) for react environment boilerplate
- [Deck.gl](https://github.com/uber/deck.gl/)
