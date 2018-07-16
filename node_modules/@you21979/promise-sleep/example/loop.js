const sleep = require('..');

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
