const sleep = require('..');
sleep(1000, "test data").
  then( res => sleep(2000, res)).
  then( res => sleep(3000, res)).
  then( res => sleep(4000, res)).
  then( res => console.log(res))
