require('dotenv').config({ path: require("find-config")(".env") });

const Alert = require("../models/alert");
const User = require("../models/user");

const redis = require("redis");

const client = redis.createClient();

/* const client = redis.createClient({
    socket: {
        host: "redis-15490.c264.ap-south-1-1.ec2.cloud.redislabs.com",
        port: 15490
    },
    password: "Pm7EJEdLc5pgq73RdEkY1YCGup8CDJL3"
}); */

client.on('error', err => {
    console.log('Error ' + err);
});



module.exports.cache = async (req, res, next) => {
    await client.connect();

    const email = req.user.email;

    let alerts = await client.get(email);
    console.log(alerts);

    if (alerts != null) {

        alerts = JSON.parse(alerts);

        if (req.query.status) {
            alerts = alerts.filter((alert) => {
                return alert.status == req.query.status;
            })
        }

        let page = parseInt(req.query.page);
        let perPage = 2;
        const pageCount = Math.ceil(alerts.length / perPage);

        if (page < 1 || !req.query.page)
            page = 1;

        else if (page > pageCount)
            page = pageCount;

        const skipVal = (page - 1) * perPage;

        let response = [];

        for (let i = skipVal; i < skipVal + perPage; i++) {
            if (i < alerts.length)
                response.push(alerts[i]);
        }
        client.quit();
        res.send(response);
    }

    else {
        next();
    }
}


module.exports.alerts = async (req, res) => {

    let alerts = await Alert.find({ email: req.user.email });

    await client.set(req.user.email, JSON.stringify(alerts), {
        EX: 120
    })

    if (req.query.status) {
        alerts = alerts.filter((alert) => {
            return alert.status == req.query.status;
        })
    }

    let page = parseInt(req.query.page);
    let perPage = 2;
    const pageCount = Math.ceil(alerts.length / perPage);

    if (page < 1)
        page = 1;

    else if (page > pageCount || !req.query.page)
        page = pageCount;

    const skipVal = (page - 1) * perPage;

    let response = [];

    for (let i = skipVal; i < skipVal + perPage; i++) {
        if (i < alerts.length)
            response.push(alerts[i]);
    }

    client.quit();

    res.send(response);
}


module.exports.create = async (req, res) => {
    const user = await User.findOne({ email: req.user.email });

    if (!user)
        res.sendStatus(404);

    const alert = new Alert({ status: "Created", price: req.query.price, email: req.user.email });;
    alert.author = user._id;
    alert.save();

    res.send(`Alert Created by ${user.name}`);
}

module.exports.del = async (req, res) => {

    const id = req.query.id;
    const alert = await Alert.findById(id);

    alert.status = "Deleted";
    await alert.save();

    res.send(alert);
}

/* module.exports.alerts = async (req, res) => {

    //const status = req.query.status;
    //const user = await User.findOne({email: req.user.email});

    let statusArr;
    
    if(req.query.status)
        statusArr = [req.query.status];
        
    else
        statusArr = ["Created", "Deleted", "Triggered"];

    let alerts = await Alert.find({email: req.user.email, status: {$in: statusArr}});

    let page = parseInt(req.query.page);
    const perPage = 2;
    const pageCount = Math.ceil(alerts.length/perPage);

    if(page < 1)
        page = 1;
    
    else if(page > pageCount)
        page = pageCount;

    
    const skipVal = (page - 1)*perPage; 

    alerts = await Alert.find({email: req.user.email, status: {$in: statusArr}}).limit(perPage).skip(skipVal);

    res.json(alerts);
} */