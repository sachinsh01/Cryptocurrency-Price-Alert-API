const Alert = require("../models/alert");
const User = require("../models/user");
const {currentPrice} = require("../utilities/currentPrice");
const {errorObject} = require("../utilities/error");
const axios = require("axios");


module.exports.alerts = async (req, res) => {
    var price = await currentPrice();

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
}

module.exports.create = async (req, res) => {
    const user = await User.findOne({email: req.user.email});

    if(!user)
        res.sendStatus(404);

    const alert = new Alert({status: "Created", price: req.query.price, email: req.user.email});;
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