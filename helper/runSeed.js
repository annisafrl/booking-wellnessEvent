const mongoose = require('mongoose');
const UserModel = require("../models/userModel");
const helperBcrypt = require("./bcrypt");
const helperEmail = require("./email");
const helperGeneral = require("./general");


exports.runSeed = async function () {
    console.log("run seed ...")
    const userSeeds = [
        {
            name: "annisafirlia",
            email: "annisafirlia1@gmail.com",
            role: "master"
        }
    ]

    for (const userSeed of userSeeds) {
        const findMaster = await UserModel.findOne({email: userSeed.email});
        if(!findMaster){
            //generate random 10 char for password
            var randomstring = "Jw9673!2022";//Math.random().toString(36).slice(-10);
            const hashPass = helperBcrypt.hash(helperGeneral.toSHA256(randomstring));
            const createdUserDoc = {
                name: userSeed.name,
                email: userSeed.email,
                role: userSeed.role,
                password: hashPass,
                bypassOtp: true,
            }
            const resultUserCreated = await UserModel.create(createdUserDoc);
            console.log("create user: ", resultUserCreated);

            const htmlMessage = `hi <b>${userSeed.name}</b>, <br />Your auto generated password is: ${randomstring}. use it for login to booking-wellnessEvent apps.`;
            helperEmail.send(userSeed.email, "Booking-wellnessEvent- Auto Generated Password", htmlMessage);
        }
    }
    console.log("seed finish!")
}