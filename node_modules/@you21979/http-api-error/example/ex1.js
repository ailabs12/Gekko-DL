var HttpApiError = require('..')

console.log(new HttpApiError("Timeout", 'GENERIC', 0))

console.log(new HttpApiError("not found", 'HTTP', 404))

console.log(new HttpApiError("APIKEY", 'API', 1))
