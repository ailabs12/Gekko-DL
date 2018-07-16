Node Coingi
===========

NodeJS Client Library for the Coingi (coingi.com) API

This is an asynchronous node js client for the coingi.com API. It exposes all the API methods found here: https://coingi.docs.apiary.io through the ```api``` method:

Example Usage:

```javascript
const key          = '...'; // API Key
const secret       = '...'; // API Private Key
const CoingiClient = require('coingi');
const coingi       = new CoingiClient(key, secret);

(async () => {
	// Display user's balance
	console.log(await coingi.api('balance', { currencies: "btc,usd" }));

	// Get Ticker Info
	console.log(await coingi.api('order-book', "/btc-usd/1/1/1" ));
})();
```

Credit:
I used the kraken.js implementation as a reference. 
