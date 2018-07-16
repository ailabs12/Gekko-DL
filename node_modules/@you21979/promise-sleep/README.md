# node-promise-sleep

very simple implementation.

## install

```
npm i @you21979/promise-sleep
```

# usage

## simple

```
const sleep = require('@you21979/promise-sleep');
sleep(1000, "test data").
  then( res => sleep(2000, res)).
  then( res => sleep(3000, res)).
  then( res => sleep(4000, res)).
  then( res => console.log(res))
```

## loop

```
const sleep = require('@you21979/promise-sleep');

const update = (msec, x) => {

    if(x >= 10){
        return;
    }

    console.log(x);

    sleep(msec, x).then((x) => update(msec, x + 1))
}

const main = () => {
    update(1000, 0)
}

main();
```


