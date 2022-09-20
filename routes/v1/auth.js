require("../../config");
const express = require("express");
const userModel = require("../../models/userModel");
const router = express.Router();
const helperBcrypt = require("../../helper/bcrypt")
const bcrypt= require("bcrypt")
const saltRounds = 10;
const jwt = require('jsonwebtoken');



router.post("/register", async function (req, res, next) {
    try {
        const {
            username,
            email,
            password,
            name
        } = req.body;

        const getSameUsername = await userModel.findOne({ username })
        if (getSameUsername) {
            throw new Error("duplicate username");
        }
        const getSameEmail = await userModel.findOne({ email })
        if (getSameEmail) {
            throw new Error("duplicate email")
        }

        const hashPassword = bcrypt.hashSync(password, saltRounds)
        await userModel.create({
            username,
            email,
            password: hashPassword,
            name
        });

        res.status(200).json({
            success: true,
            message: "successfully registered!"
        })

    } catch (err) {
        next(err);
    }
})

router.post("/login", async function (req, res, next) {
    try {
        const {
            email,
            password,
        } = req.body;

        await userModel.findOne({ email })
            .then(dataUser => {
                let passwordMatched = false
                if (dataUser !== null) {
                    passwordMatched = helperBcrypt.compare(password, dataUser.password);
     
                }
                if (passwordMatched) {
                    const token = jwt.sign({ email, password, userid: dataUser._id }, process.env.SECRETJWT, { expiresIn: '1h' })
                    res.status(400).json({
                        message: "login success!",
                        data: { token }
                    })
                } else {
                    res.status(200).json({
                        message: "password or email is not match!!"
                    })
                }
            }).catch(err => console.log(err));
    } catch (error) {
        next(error);
    }
})

module.exports = router;