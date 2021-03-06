import React, {
  Fragment,
  useState,
  useEffect 
} from "react";

import Axios from 'axios';

import Columns from "../components/Columns/index";
import {
  useAuth0
} from "../react-auth0-spa";

const Dashboard = () => {

  const [showResult, setShowResult] = useState(false);
  const [userNotes, setUserNotes] = useState("");
  const [userEvents, setUserEvents] = useState("");
  const [userEventNotes, setUserEventNotes] = useState("");

  const {
    getTokenSilently, user
  } = useAuth0();

  const loadUserData = (userToken) => {

    console.log("Dashboard loading...");
    const initGetUserData = async () => {

      let token = await getTokenSilently();
      console.log(`User Token - ${token.substring(0, 15) + '...'}`);

      /// NOTES /// 
      console.log(`Getting User Notes - ${token.substring(0, 15) + '...'}`);

      let notesDataResponse = await fetch("/api/notes/get", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let notesDataJson = await  notesDataResponse.json()
      console.log(`Obtained ${notesDataJson.length} User Notes`);
      setUserNotes(notesDataJson);

       /// EVENTS /// 
      console.log(`Getting User Events - ${token.substring(0, 15) + '...'}`);
      const eventsDataResponse = await fetch("/api/fetch_google_calendar_events", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let eventsDataJson = await  eventsDataResponse.json()
      console.log(`Obtained ${eventsDataJson.length} User Events`);
      eventsDataJson.sort(function(a,b){
        return - (new Date(b.event_start) - new Date(a.event_start));
      });
      setUserEvents(eventsDataJson);

      var eventIdsItems = eventsDataJson.map((item, index) =>{ 
        return item.id 
      });
      var eventIdsItemsJson = JSON.stringify(eventIdsItems);
      // EVENT NOTES // 
      console.log(`Getting Event Notes - ${token.substring(0, 15) + '...'}`);
     
      const eventNotesDataResponse = await fetch("/api/event/notes", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: eventIdsItemsJson
      });

      let eventNotesDataJson = await  eventNotesDataResponse.json()
      console.log(`Obtained ${eventNotesDataJson.eventNotes.length} User Event Notes`);
      setUserEventNotes(eventNotesDataJson);

      console.log(eventNotesDataJson);

      setShowResult(true);
     
    };

    initGetUserData();

  };

  const addEventNoteToDB = async (eventNote) => {
    try {
      const token = await getTokenSilently();
      console.log(`Add Note to Event - ${token.substring(0, 15) + '...'}`);

      const response = await fetch("/api/event/add-note", {
        method: "post",
        headers: {
          'Authorization': `Bearer ${token}`
          , 'Content-Type': 'application/json'
          , 'Accept': 'application/json',
        },
        body: JSON.stringify(eventNote)
      });

      const responseData = await response.json();
      console.log(responseData);

      if(response.status == 201)
      {

        var note_id = responseData.eventNote.note_id;
        var addedNote = userNotes.filter((item, index) => 
        {
          return item.id == note_id;
        })[0];

        var en = [...userEventNotes.eventNotes];
        var n = [...userEventNotes.notes];

        en.push(responseData.eventNote);

        if(n.filter((item, index) => {
            return item.id == note_id
        }).length == 0)
        {
          n.push(addedNote);
        }

        setUserEventNotes({
          eventNotes: en, 
          notes: n}
        );

        //setShowResult(true);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const addNoteToDB = async (newNote) => {
    try {
      const token = await getTokenSilently();
      console.log(`Add Note - ${token.substring(0, 15) + '...'}`);

      const response = await fetch("/api/notes/add-note", {
        method: "post",
        headers: {
          'Authorization': `Bearer ${token}`
          , 'Content-Type': 'application/json'
          , 'Accept': 'application/json',
        },
        body: JSON.stringify(newNote)
      });

      const responseData = await response.json();

      console.log(responseData);

      var existingNotes = [...userNotes];
      existingNotes.push(responseData);
  
      existingNotes.sort(function(a,b){
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setUserNotes(existingNotes);

    } catch (error) {
      console.error(error);
    }
  };

  const deleteNoteInDB = async (note_id) => {

    try {
      const token = await getTokenSilently();
      console.log(`Delete Note - ${token.substring(0, 15) + '...'}`);

      /*const response = await fetch("/api/note/delete", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          , 'Content-Type': 'application/json'
          , 'Accept': 'application/json',
        },
        body: note_id
      });*/

      const response = await Axios.post('/api/note/delete', 
      {
        note_id: note_id
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const responseData = await response;

      console.log(responseData);

      if(response.status == 200)
      {
        var existingNotes = [...userNotes];
        existingNotes = existingNotes.filter((item, index) => {
          return item.id != note_id
        });
    
        existingNotes.sort(function(a,b){
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setUserNotes(existingNotes);
      }
    } catch (error) {
      console.error(error);
    }

  }

  const noteAddedToEvent = async (note_id, event_id) => {
    
      var addedNote = userNotes.filter(n => { return n.id == note_id });
      var targetEvent = userEvents.filter(e => { return e.id == event_id });

      var newEventNote = {
        event_id: event_id,
        note_id: note_id
      }

      addEventNoteToDB(newEventNote);

      //var existingEventNotes = [...userEventNotes];
      //existingEventNotes.push(responseData);

  }

  const noteDeleted = (event, noteId) => {


    console.log('NOTE_ID:' + noteId);

    deleteNoteInDB(noteId);

  }

  const noteAdded = (event) => {
   
    if(event.key != 'Enter' || event.target.value == '') 
    {
        return;
    }

    var noteMessage = event.target.value;

    var newNote = {
      note_text: noteMessage,
      note_type: 'Manual',
      command: '',
      user_name: user.given_name,
      user_id: user.sub
    };

    addNoteToDB(newNote);

  }

  useEffect(() => loadUserData(user.sub), []);
  
  return (
  <Fragment>
    {showResult && <Columns 
        addNote={noteAdded} 
        addNoteToEvent={noteAddedToEvent} 
        deleteNote={noteDeleted}
        notes={userNotes} 
        events={userEvents} 
        eventNotesBundle={userEventNotes} 
    />}
  </Fragment>
)};

export default Dashboard;