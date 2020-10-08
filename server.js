const express = require('express');
const app = express();

const webpush = require('web-push');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var cors = require('cors');

app.use(cors({
    origin: "https://anselmesdr.github.io"
}));

const vapidKeys = {
    "publicKey": "BG8BD1RO8ClN6z_LraL6aF2s263rOwbIgEgSEDt1s59EQsHIOqSA46paHYN5iBEtv5CrVy7esYnGeSrkrDy5cBA",
    "privateKey": "yHmaA2WSsm9LQM6jtqgxBl7mSm-kktRm5fSAh0bSW4E"
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const subscribe = express.Router();
subscribe.post('/', (req, res) => {
    const subscription = req.body;
    const payload = JSON.stringify({
        "notification": {
            "title": "Angular News",
            "body": "Newsletter Available!",
            "icon": "assets/main-page-logo-small-hat.png",
            "vibrate": [100, 50, 100],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    });
    console.log(subscription);
    webpush.sendNotification(subscription, payload).then(result => {
        console.log(result);
        res.send(result);
    }).catch(error => {
        res.send(error.stack);
    });
    res.send(payload);
})

app.use('/subscribe', subscribe);

const port = process.env.PORT || 80;

app.listen(port, () => console.log('server started'));
