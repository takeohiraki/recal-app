var express = require("express");
var path = require("path");

var router_project = express.Router();

const models = require('../models');
const projects = models.projects;
const projectsEvents = models.projects_events;
const googleCalEventsDB = models.google_cal_events;
const Sequelize = require('sequelize');

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

router_project.get('/project/seed', (req, res) => {

  projects.create({
    name: 'MaintMax Migration',
    description: 'The MaintMax Project will be implemented in Ace Corp.’s Maintenance Division to replace the existing maintenance tracking system which is inadequate for expanding operations. The implementation of this database is a deliberately planned and highly technical effort. This description of the implementation will provide all stakeholders with a detailed understanding of how the implementation will occur.',
    start_date: randomDate(new Date(2012, 0, 1), new Date()),
    end_date: randomDate(new Date(2012, 0, 1), new Date())
  });

  projects.create({
    name: 'Baptist Hospital - EHR Go-Live',
    description: 'The launch of an Electronic Health Record (EHR) may mark the end of a large technology initiative to modernize a hospital’s IT system, but it can also mark the launch of a disruptive period for staff, clinicians and patients. After significant investment of time, money and effort, it is time to drive user adoption of the EHR to enhance patient care and provide financial return on investment.',
    start_date: randomDate(new Date(2012, 0, 1), new Date()),
    end_date: randomDate(new Date(2012, 0, 1), new Date())
  });

  /*slackMessages.create({
      message_text: 'Staff member, Jackson Browne, and Swanson attended the National Practitioner Network meeting in Atlanta last month and gave a brief extemporaneous presentation. Both are invited back next year to give a longer presentation about our organization. After brief discussion, Board congratulated Swanson and asked her to pass on their congratulations to Browne as well.',
      user_name: 'Johny',
      command: '/Agenda',
      slack_user_id: getRandomInt(1111111, 99999999)
    });
  
    slackMessages.create({
      message_text: 'Drucker asserts that our organization must ensure its name is associated with whatever materials are distributed at that practitioner meeting next year. The organization should generate revenues where possible from the materials, too.',
      user_name: 'Darren',
      command: '/Agenda',
      slack_user_id: getRandomInt(1111111, 99999999)
    });*/

  res.status(200).redirect('/home');

});

router_project.post('/project/events', (req, res) => {

  var projectIds = req.body.projectIds;

  projectsEvents.findAll({
    where: {
      project_id: {
        [Sequelize.Op.in]: projectIds
      }
    }
  }).then(projectsEvents => {
    var eventIds = projectsEvents.map(function (item) {
      return item.event_id;
    });

    googleCalEventsDB.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: eventIds
        }
      }
    }).then(googleCalEventsDB => {
      res.status(200).send({
        events: googleCalEventsDB,
        project_events: projectsEvents
      });
    });
  });
});

router_project.get("/api/projects", function (req, res) {
  // pulls in all messages
  projects.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(projects => {
    res.status(200).send(projects);
  });

  /*model_slack.all(function (data) {
    // console.log(data)
    res.status(200).send(data.rows);  
  })*/
});

router_project.post("/api/project/add-event", function (req, res) {

  projectsEvents.create({
    event_id: req.body.event_id,
    project_id: req.body.project_id,
  }).then(function (affectedRows) {
    res.sendStatus(200).send(affectedRows);
  });

});


router_project.delete("/api/project/delete-project", function (req, res) {

  projects.destroy({
    where: {
      id: req.body.id
    }
  }).then(function (affectedRows) {
    res.sendStatus(200).send(affectedRows);
  });
});

// Export routes for server.js to use.
module.exports = router_project;