var verify = require('..')
verify.createKeyPair().then(function(res){
    console.log(res)
})
