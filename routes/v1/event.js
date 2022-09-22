require("../../config")
const express = require("express");
const userModel = require("../../models/userModel");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { hash } = require("bcrypt");
const { decode } = require("jsonwebtoken");
const Event = require("../../models/eventModel");
const { sign } = require("jsonwebtoken");
const mongoose = require("mongoose");
const helperEmail = require("../../helper/email");


router.post("/createEvent", async function (req, res, next) {
    try {
        const {
            eventName,
            eventDescription,
            eventCategory,
            eventDate

        } = req.body;


        const decodeToken = req.decode;
        console.log(JSON.stringify({ decodeToken }));
        if (decodeToken.role === "vendor") {
            await Event.create({ user: decodeToken.userid, eventName, eventDescription, eventCategory, eventDate });

            const htmlMessage = `hi <b>you have an event permission</b>, <br />event name : ${eventName},  </br> event desc : ${eventDescription} <br/> event category: ${eventCategory}  <br/> event date : ${eventDate}  <br/> vendor : ${decodeToken.userid} <br/>
        <p>please click the link bellow to approved it</p> <p>${process.env.CLIENT_URL}/approveEvent/</p> <p>`;
            helperEmail.send(process.env.MASTEREMAIL, "booking health event - 'event permission by vendor'", htmlMessage);
            res.status(200).json({
                success: true,
                message: "success to create event and waiting for the admin to approve it!",
            })

        } else {
            res.status(200).json({
                message: "access denied you are not vendor!!"
            })
        }

    } catch (error) {
        next(error)

    }
})

router.get("/", async function (req, res, next) {
    try {
        const getEvent = await Event.find().populate("user");

        res.status(200).json({
            success: true,
            data: getEvent,
            message: "data has been retrieved successfully!"
        })
    } catch (error) {
        next(error)
    }
})

router.put("/:idEvent/updateEvent", async function (req, res, next) {
    try {
        const {
            eventName,
            eventDescription,
            eventCategory,
            eventDate

        } = req.body;
        const decodeToken = req.decode;
        getEventStatus = await Event.findOne({ eventStatus: "approve" })
        if (!getEventStatus) {
            throw new Error("your event is not yet approve or maybe rejected!")
        }
        await Event.findByIdAndUpdate(req.params.idEvent, { user: decodeToken.userid, eventName, eventDescription, eventCategory, eventDate, eventStatus: "pending" })
        const htmlMessage = `hi <b>you have an event permission</b>, <br />event name : ${eventName},  </br> event desc : ${eventDescription} <br/> event category: ${eventCategory}  <br/> event date : ${eventDate}  <br/> vendor : ${decodeToken.userid} <br/>
        <p>please click the link bellow to approved it</p> <p>${process.env.CLIENTURL}/approveEvent/</p> <p>`;
        helperEmail.send(process.env.MASTEREMAIL, "booking health event - 'event update permission by vendor'", htmlMessage);
        res.status(200).json({
            success: true,
            message: "success to update event and waiting for the admin to approve it!",
        })


    } catch (error) {
        next(error)
    }
})

router.post("/:idEvent/approveEvent", async function (req, res, next) {
    try {

        const decodeToken = req.decode;
        if (decodeToken.role === "master") {

            await Event.findByIdAndUpdate(req.params.idEvent, { eventStatus: "approve" })

            res.status(200).json({
                success: true,
                message: "event has been approved!",
            })

        } else {
            res.status(200).json({
                message: "access denied you are not a master!!"
            })
        }
    } catch (error) {
        next(error)
    }
})

router.put("/:idEvent/cancelEvent", async function (req, res, next) {
    try {

        const decodeToken = req.decode;
        if (decodeToken.role === "master") {

            await Event.findByIdAndUpdate(req.params.idEvent, { eventStatus: "cancel" })

            res.status(200).json({
                success: true,
                message: "event has been cancel!",
            })

        } else {
            res.status(200).json({
                message: "access denied you are not a master!!"
            })
        }
    } catch (error) {
        next(error)
    }
})

router.delete("/:idEvent/deleteEvent", async function (req, res, next) {
    try {

        const decodeToken = req.decode;
        if (decodeToken.role === "vendor") {
            await Event.findByIdAndDelete(req.params.idEvent, { user: decodeToken.userid });

            res.status(200).json({
                success: true,
                message: "topic has been delete!",
            })
        } else {
            res.status(200).json({
                message: "you cant delete other's event!"
            })
        }

    } catch (error) {
        next(error)

    }
})

router.post("/:id/attendEvent", async function (req, res, next) {

    try {
        const decodeToken = req.decode;
        if (decodeToken.role !== "user") {
            res.status(404).json({
                success: false,
                message: "access denied this access is for user only!"
            })
            const event = await Event.findById(req.params.id)
            if (!event.attendant.includes(decodeToken.userid)) {
                await Event.findByIdAndUpdate(req.params.id, { $push: { attendant: decodeToken.userid } })
                res.status(200).json({
                    success: true,
                    message: "event has been attend!"
                })

                if (decodeToken.role !== "user") {
                    res.status(404).json({
                        success: false,
                        message: "access denied this access is for user only!"
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: "you are already attend this event before!"
                    })
                }
            }
        }

    } catch (error) {
        next(error)
    }
})

router.post("/:id/unattendEvent", async function (req, res, next) {

    try {
        const decodeToken = req.decode;
        const event = await Event.findById(req.params.id)
        if (event.attendant.includes(decodeToken.userid)) {
            await Event.findByIdAndUpdate(req.params.id, { $pull: { attendant: decodeToken.userid } })
            res.status(200).json({
                success: true,
                message: "event has been attend!"
            })

            if (decodeToken.role !== "user") {
                res.status(404).json({
                    success: false,
                    message: "access denied this access is for user only!"
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: "you are already attend this event before!"
                })
            }
        }


    } catch (error) {
        next(error)
    }
})
module.exports = router;