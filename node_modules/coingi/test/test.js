var expect = require('chai').expect;
var coingi = require('../coingi');

describe('getMessageSignature("key", "secret", "nonce"))', function () {
    it('should generate a signature', function () {
        const key = 'key';
        const secret = 'secret';
        const nonce = '1520420964000';

        const actualSignature = new coingi(key, secret, nonce).getMessageSignature(nonce);
        const expectedSignature = 'd9c93ebbabbc66fdcf16f4600f60a9115260f81e09de1a7aeabfb2601f30ecaa';
        expect(actualSignature).to.be.equal(expectedSignature);
    });
});

describe('handleErrorResponse(response)', function () {
    it('should turn an error response into Error', function () {
        const response = {
            "errors": [
                {
                    "code": 100001,
                    "message": "Parameter \"currencyPair\" value is missing. Expecting currency pair definition."
                },
                {
                    "code": 100011,
                    "message": "Parameter \"maxAskCount\" value is missing. Expecting integer."
                },
                {
                    "code": 100021,
                    "message": "Parameter \"maxBidCount\" value is missing. Expecting integer."
                },
                {
                    "code": 100031,
                    "message": "Parameter \"maxDepthRangeCount\" value is missing. Expecting integer."
                }
            ]
        };

        const expectedException = 'Parameter "currencyPair" value is missing. Expecting currency pair definition. Parameter "maxAskCount" value is missing. Expecting integer. Parameter "maxBidCount" value is missing. Expecting integer. Parameter "maxDepthRangeCount" value is missing. Expecting integer.';
        const coingiApi = new coingi("key", "secret", "nonce");
        expect(() => coingiApi.handleErrorResponse(response)).to.throw(expectedException);
    });
});
