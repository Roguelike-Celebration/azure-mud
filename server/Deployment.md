1. Deploy the `server` folder as a Function App. Use VS Code.
2. Set up an Azure SignalR Service instance. Grab the connection string and add it to a Function App Application Setting (in "Configuration")called `AzureSignalRConnectionString`
3. Set up an Azure Cache for Redis instance. Grab a key, the hostname, and the port, and add them as Application settings with the keys `RedisKey` and `RedisHostname`, `RedisPort`
4. Set up Twitter auth. In the Function App, go to "Authentication"
5. Set up CORS.
6. Set up Twitter app. Go to https://developer.twitter.com/apps. Callback URL is `https://your-function-app.azurewebsites.net/.auth/login/twitter/callback`. Paste the consumer key and secret from Twitter into the Authentication tab.
