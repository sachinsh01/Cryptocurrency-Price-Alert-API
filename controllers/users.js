if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;

        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const user = new User({ name, email, password: hashedPass })
        await user.save();

        res.status(201).send();
    }

    catch {
        res.status(500).send();
    }
}

module.exports.login = async (req, res) => {

    //Authenticate the user
    const user = await User.findOne({ email: req.body.email });

    if (user == null) {
        return res.status(400).send("Cannot find that user!!!");
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            payload = { email: user.email };

            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1800s" });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

            //user.rToken.push(refreshToken);

            user.rToken = refreshToken;
            user.save();


            res.json({ accessToken, refreshToken });
            //res.send(`Logged in as ${user.name}`);
        }

        else {
            res.send("Not Allowed!!!");
        }
    }

    catch {
        res.status(500).send();
    }
    //res.json(user);
}

module.exports.token = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (refreshToken == null) return res.sendStatus(401);

    //const user = await User.findOne({ rtoken: { $elemMatch: refreshToken } });
    const user = await User.findOne({ rtoken: refreshToken });

    if (!user) return res.sendStatus(400);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign({ email: payload.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1000s' });

        res.json({ accessToken });
    })
}

module.exports.logout = async (req, res) => {

    //const token = req.body.token;    
    //const user = await User.findOne({ rToken: token });

    const email = req.body.email;
    const user = await User.findOne({ email });

    if (user)
        await User.updateOne({ name: user.name }, { $unset: { rToken: 1 } });
    else
        return res.sendStatus(404);

    /* await User.updateOne({name: user.name}, {
        $pull: {
            rToken: {
                $eq: token
            }
        }
    }); */

    return res.sendStatus(200);
}