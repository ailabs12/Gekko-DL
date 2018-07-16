var assert = require('power-assert');
var verify = require('..')
describe('simple-test', function() {
    it('createKeyPair', function(done) {
        verify.createKeyPair().then(function(res){
            done()
        }).catch(function(e){
            done(e)
        })
    })
    it('sign and check - ok', function() {
        var argo = 'sha256'
        var pair = {
            key: '6b47121a-cfd5-4875-8345-da7517730afa',
            secret: 'b4d31b0d9be238da31a3fdb2afccd31d803341810c66d82d8b5ca53f35d41609'
        }
        var data = JSON.stringify({
            key : pair.key,
            message : "test desu",
            timestamp : new Date() / 1000 | 0
        })
        var signdata = verify.sign(argo, pair.secret, data)
        assert(verify.check(argo, signdata, pair.secret, data))
    })
    it('sign and check - ng(different secret)', function() {
        var argo = 'sha256'
        var pair = {
            key: '6b47121a-cfd5-4875-8345-da7517730afa',
            secret: 'b4d31b0d9be238da31a3fdb2afccd31d803341810c66d82d8b5ca53f35d41609'
        }
        var data = JSON.stringify({
            key : pair.key,
            message : "test desu",
            timestamp : new Date() / 1000 | 0
        })
        var unmatchsecret = "ff1f7a20f8ffd9dc812d715f7374ba6b60b35a11e739a2fdb1fe88b83cfa7244"
        var signdata = verify.sign(argo, pair.secret, data)
        assert(verify.check(argo, signdata, unmatchsecret, data) === false)
    })
    it('sign and check - ng(alter data)', function() {
        var argo = 'sha256'
        var pair = {
            key: '6b47121a-cfd5-4875-8345-da7517730afa',
            secret: 'b4d31b0d9be238da31a3fdb2afccd31d803341810c66d82d8b5ca53f35d41609'
        }
        var data = JSON.stringify({
            key : pair.key,
            message : "test desu",
            timestamp : new Date() / 1000 | 0
        })
        var signdata = verify.sign(argo, pair.secret, data)
        var data2 = JSON.parse(data);
        data2.timestamp += 1;
        assert(verify.check(argo, signdata, pair.secret, JSON.stringify(data2)) === false)
    })
})


