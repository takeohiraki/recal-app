var express = require("express");
var router_email = express.Router();

var nodemailer = require('../../middleware/nodemailer');
// Basic routes between the main pages

router_email.get("/api/email/read", function (req, res) {
    console.log("/api/email/read")
    
    res.send(nodemailer.readEmail());
});

router_email.get("/api/email/send/:toEmailAddress", function (req, res) {

    var toEmailAddress = req.params.toEmailAddress;
    nodemailer.sendEmail(toEmailAddress)
    /* res.redirect('/home'); */
});


router_email.get("/meeting-details/:requesterid/:attendeeid/:meetingid", async function (req, res) {
    var requesterId = req.params.requesterid;
    var attendeeId = req.params.attendeeId;
    var meetingId = req.params.meetingid;


    let googleCalEvents = await agoogleCalEventsDB.findAll({
        where: {
            organizer_email: requesterId
        }
    });

    var meetingArr = []
    googleCalEvents.forEach(function (element) {
        var meetingObj = {
            meetingName: element.description,
            meetingDate: element.start_date,
            meetingId: element.google_cal_event_id
        }
        meetingArr.push(meetingObj)
    })

    res.render("add-agenda", {
        meetings: meetingArr,
        title: "Agenda",
        name: "Recal"
    });

});

// Export routes for server.js to use.
module.exports = router_email;