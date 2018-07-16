var createLimitter = require('..');

var check = createLimitter(1, 5);
var cnt = 0;
setInterval(function(){
    ++cnt;
    if(check()){
        console.log(cnt);
    }
}, 0);

