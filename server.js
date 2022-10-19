const server = require('express');                                              //import webserver module
const pigpio = require('pigpio');                                               //import pigpio module
const GPIO = pigpio.Gpio;                                                       //use pgio module from pigpio
const app = server();                                                           //create app with express webserver

pigpio.initialize();                                                            //init the pigpio library

let SW_R = new GPIO(18, { mode: GPIO.INPUT,  edge: GPIO.RISING_EDGE });         //set GPIO 18 as input with interrupt on rising edge
let SW_G = new GPIO(23, { mode: GPIO.INPUT,  edge: GPIO.RISING_EDGE });         //set GPIO 23 as input with interrupt on rising edge
let SW_B = new GPIO(24, { mode: GPIO.INPUT,  edge: GPIO.RISING_EDGE });         //set GPIO 24 as input with interrupt on rising edge
let LED_R = new GPIO(17, { mode: GPIO.OUTPUT });                                //set GPIO 17 as output             
let LED_G = new GPIO(22, { mode: GPIO.OUTPUT });                                //set GPIO 27 as output
let LED_B = new GPIO(27, { mode: GPIO.OUTPUT });                                //set GPIO 22 as output

SW_R.glitchFilter(10000);                                                       //set debounce filter for GPIO 18
SW_G.glitchFilter(10000);                                                       //set debounce filter for GPIO 23
SW_B.glitchFilter(10000);                                                       //set debounce filter for GPIO 24

let tmp_R = 0;                                                                  //create temp variable for red led current state
let tmp_G = 0;                                                                  //create temp variable for green led current state
let tmp_B = 0;                                                                  //create temp variable for blue led current state

app.use(server.text());                                                         //set request format type of webserver to text

app.get('/', (req, res) => {                                                    //set request response for get on '/'
    res.sendFile(__dirname + '/index.html')                                     //send back html website file
})

SW_R.on('interrupt', (level) =>{                                                //interrupt for red button
    if(tmp_R == 0){                                                             //checks current state of red led
        tmp_R = 1;                                                              //set current state of red led on
        LED_R.digitalWrite(1);                                                  //set red led on
    }
    else{
        tmp_R = 0;                                                              //set current state of red led off
        LED_R.digitalWrite(0);                                                  //set red led off
    }
});

SW_G.on('interrupt', (level) =>{                                                //interrupt for green button
    if(tmp_G == 0){                                                             //checks current state of green led
        tmp_G = 1;                                                              //set current state of green led on
        LED_G.digitalWrite(1);                                                  //set green led off
    }
    else{
        tmp_G = 0;                                                              //set current state of green led off
        LED_G.digitalWrite(0);                                                  //set green led off
    }
});

SW_B.on('interrupt', (level) =>{                                                //interrupt for blue button
    if(tmp_B == 0){                                                             //checks current state of blue led
        tmp_B = 1;                                                              //set current state of blue led on
        LED_B.digitalWrite(1);                                                  //set blue led on
    }
    else{
        tmp_B = 0;                                                              //set current state of blue led off
        LED_B.digitalWrite(0);                                                  //set blue led off
    }
});

app.post('/r', (req, res) => {                                                  //set response method for post on '/r'
    let item = JSON.parse(req.body);                                            //parse content of body to JSON object
    if (item.item == 1 && tmp_R == 0) {                                         //checks current state of red led
        LED_R.digitalWrite(1);                                                  //set red led on
        tmp_R = 1;                                                              //set current state of red led on
        res.send(JSON.stringify({ rep: 1 }));                                   //send response to html-->frontend
    } else {
        LED_R.digitalWrite(0);                                                  //set red led off
        tmp_R = 0;                                                              //set current state of red led off
        res.send(JSON.stringify({ rep: 0 }));                                   //send response to html-->backend
    }
});
app.post('/g', (req, res) => {                                                  //set response method for post on '/r'
    let item = JSON.parse(req.body);                                            //parse content of body to JSON object
    if (item.item == 1 && tmp_G == 0) {                                         //checks current state of green led
        LED_G.digitalWrite(1);                                                  //set green led on
        tmp_G = 1;                                                              //set current state of green led on
        res.send(JSON.stringify({ rep: 1 }));                                   //send response to html-->frontend
    } else {
        LED_G.digitalWrite(0);                                                  //set green led off
        tmp_G = 0;                                                              //set current state of green led off
        res.send(JSON.stringify({ rep: 0 }));                                   //send response to html-->backend
    }
});
app.post('/b', (req, res) => {                                                  //set response method for post on '/r'
    let item = JSON.parse(req.body);                                            //parse content of body to JSON object
    if (item.item == 1 && tmp_B == 0) {                                         //checks current state of blue led
        LED_B.digitalWrite(1);                                                  //set blue led on
        tmp_B = 1;                                                              //set current state of blue led on
        res.send(JSON.stringify({ rep: 1 }));                                   //send response to html-->frontend
    } else {
        LED_B.digitalWrite(0);                                                  //set blue led off
        tmp_B = 0;                                                              //set current state of blue led off
        res.send(JSON.stringify({ rep: 0 }));                                   //send response to html-->backend
    }
});

app.listen(5000);                                                               //set server port to port 5000 and start listening for post or get