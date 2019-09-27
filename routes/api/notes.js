var express = require("express");
var router_notes_api = express.Router();
var passport = require("passport");
const fs = require("fs");
var path = require("path");
const Sequelize = require("sequelize");
const models = require("../../models");
const notes_Model = models.notes;
const eventNotes_Model = models.google_cal_event_notes;

// const auth0_helpers = require('../middleware/auth_helpers')

console.log("ran notes");

// For auth0 backend api auth
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const authConfig = require("../../client/src/auth_config.json");
const proxy = require("../../client/src/setupProxy.js");

const app = express();

if (!authConfig.domain || !authConfig.audience) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}

// Define middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

router_notes_api.post("/api/event/add-note", function (req, res) {

  eventNotes_Model.findOne({
      where: {
        event_id: req.body.event_id,
        note_id: req.body.note_id
      }
    })
    .then((existingEventNote) => {
      if (existingEventNote == null) {
        eventNotes_Model
          .create({
            event_id: req.body.event_id,
            note_id: req.body.note_id
          })
          .then(newEventNote => {
            res.status(201).send({
              eventNote: newEventNote
            });
          });
      }
      else
      {
        res.status(200).send({
          eventNote: existingEventNote
        });
      }
    });

});

router_notes_api.post("/api/event/notes", (req, res) => {
  var eventIds = req.body;

  eventNotes_Model
    .findAll({
      where: {
        event_id: {
          [Sequelize.Op.in]: eventIds
        }
      }
    })
    .then(eventNotes => {
      var noteIds = eventNotes.map(function (item) {
        return item.note_id;
      });

      notes_Model
        .findAll({
          where: {
            id: {
              [Sequelize.Op.in]: noteIds
            }
          }
        })
        .then(notes => {
          res.status(200).send({
            eventNotes: eventNotes,
            notes: notes
          });
        });
    });
});

/////////////////////////
// Seed the notes table
/////////////////////////
router_notes_api.get("/api/seed/notes", checkJwt, (req, res) => {
  console.log("api/seed/notes");

  var notesSeed = [{
      note_text: "Complete MaintMax Design",
      note_type: "/Agenda",
      user_name: "Patrice",
      user_id: "google-oauth2|114577142554347012839",
      slack_user_id: getRandomInt(1111111, 99999999)
    },
    {
      note_text: "Complete Testing",
      note_type: "/Agenda",
      user_name: "Amanda",
      user_id: "google-oauth2|114577142554347012839",
      slack_user_id: getRandomInt(1111111, 99999999)
    },
    {
      note_text: "Try auth0",
      note_type: "/Agenda",
      user_name: "Jerry",
      user_id: "google-oauth2|114577142554347012839",
      slack_user_id: getRandomInt(1111111, 99999999)
    },
    {
      note_text: "Complete Data Capture",
      note_type: "/Agenda",
      user_name: "Darren",
      user_id: 789,
      slack_user_id: getRandomInt(1111111, 99999999)
    },
    {
      note_text: "Go Live/Launch",
      note_type: "/Agenda",
      user_name: "Darren",
      user_id: 158,
      slack_user_id: getRandomInt(1111111, 99999999)
    }
  ];

  notes_Model
    .bulkCreate(notesSeed, {
      updateOnDuplicate: ["id"]
    })
    .then(([affectedCount, affectedRows]) => {
      resolve(affectedCount);
    })
  // Reminder: get this to work
  /*     .catch(function(error) {
        console.error(data);
      }); */

  res.send({
    msg: "Notes seeded"
  });
});

/////////////////////////
// Get all notes for a given user
/////////////////////////
router_notes_api.get("/api/notes/get", checkJwt, (req, res) => {
  console.log("api/notes/get");

  notes_Model
    .findAll({
      where: {
        user_id: req.user.sub
      },
      order: [
        ["createdAt", "DESC"]
      ]
    })
    .then(notes => {
      res.status(200).send(notes);
    });
});

/////////////////////////
// Create a note
/////////////////////////
router_notes_api.post("/api/notes/add-note", checkJwt, (req, res) => {
  console.log("api/notes/add-note");

  var newData = req.body;

  const {
    note_text,
    note_type,
    user_name,
    user_id,
    slack_user_id
  } = req.body;

  notes_Model
    .create({
      note_text: newData.note_text,
      note_type: newData.note_type,
      user_name: newData.user_name,
      user_id: newData.user_id,
      slack_user_id: newData.slack_user_id
    })
    .then(newNote => {
      res.status(201).send(newNote);
    })
    .catch(err => {
      console.log("Error while creating note: ", err);
    });
});

/* 
router_slack.delete("/api/slack/delete-agenda", function(req, res) {
  slackMessages
    .destroy({
      where: {
        id: req.body.id
      }
    })
    .then(function(affectedRows) {
      res.sendStatus(200).send(affectedRows);
    });
});
 */

module.exports = router_notes_api;