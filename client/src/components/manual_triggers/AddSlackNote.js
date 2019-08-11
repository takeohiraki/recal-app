import React, { useState } from "react";
import axios from "axios";

var data = JSON.stringify({
    token: "token",
    team_id: "team_id",
    team_domain: "team domain",
    enterprise_id: "enterprise_id",
    enterprise_name: "enterprise_name",
    channel_id: "channel_id",
    channel_name: "channel_name",
    user_id: "user_id",
    user_name: "user_name",
    command: "command",
    text: "text",
    response_url: "response_url",
    trigger_id: "trigger_id"
});

console.log(data)

const AddSlackNote = () => {

  const callApi = async () => {
    try {

      axios.post("/api/slack/add-agenda", data, {
        headers: {
            'Content-Type': 'application/json',
        }
      })

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={callApi}>Add Slack note</button>
    </>
  );
};

export default AddSlackNote;
