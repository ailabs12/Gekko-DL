# simple-verify

* GENERATE SECRET AND HMAC VERIFY

## install

```
npm i @you21979/simple-verify
```

## usage

### create Key and Secret

```
var verify = require('@you21979/simple-verify')
verify.createKeyPair().then(function(res){
    // result data save
    console.log(res)
})
```

### sign and verify

```
var verify = require('@you21979/simple-verify')
var argo = 'sha256'
var pair = {
    key: '6b47121a-cfd5-4875-8345-da7517730afa',
    secret: 'b4d31b0d9be238da31a3fdb2afccd31d803341810c66d82d8b5ca53f35d41609'
}

var data = JSON.stringify({
    key : pair.key,
    message : "test desu",
    nonce : new Date().getTime(),
})

var signdata = verify.sign(argo, pair.secret, data)
if(verify.check(argo, signdata, pair.secret, data)){
    console.log("check ok");
}else{
    console.log("check ng");
}
```


