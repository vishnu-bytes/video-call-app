const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

dotenv.config();

const zoopEndPoint = "https://api.zoom.us/v2/";

const APICall = async (method, url, data = {}) => {
  try {
    let response = await axios({
      method: method,
      url: zoopEndPoint + "/" + url,
      data: data,
      headers: {
        "Content-Type": "application/json",
        authorization: bearToken,
      },
    });
    return { status: 200, data: response.data, message: "" };
  } catch (e) {
    if (e.response)
      return {
        status: e.response.status,
        data: e.response.data,
        message: e.message,
      };
    if (e.request) return { status: 400, data: [], message: e.message };
    return { status: 400, data: [], message: e.message };
  }
};

const payload = {
  iss: process.env.ZOOM_API_KEY,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, process.env.ZOOM_SECRET_KEY);
const bearToken = "Bearer " + token;

app.get("/", async (req, res) => {
  res.send("zoom api");
});

app.post("/call/create", async (req, res) => {
  try {
    let data = {
      topic: req.body.topic,
      type: 2,
      start_time: req.body.start_time,
      timezone: "Asia/Calcutta",
      password: req.body.password,
      agenda: "Meeting",
      tracking_fields: [
        {
          field: "mollit magna ea",
          value: "ullamco id magna aliqua amet",
        },
        {
          field: "enim et aliqua",
          value: "irure esse sit ipsum consequat",
        },
      ],
      settings: {
        host_video: false,
        participant_video: false,
        cn_meeting: false,
        in_meeting: false,
        join_before_host: false,
        mute_upon_entry: false,
        watermark: false,
        use_pmi: false,
        approval_type: 2,
        registration_type: 1,
        audio: "both",
        auto_recording: "none",
        enforce_login: true,
        enforce_login_domains: "cupidatat sit",
        alternative_hosts: "",
        close_registration: false,
        waiting_room: false,
        registrants_confirmation_email: false,
      },
    };
    let apires = await APICall("POST", "users/me/meetings", data);
    res.status(apires.status);
    res.send(apires.data);
  } catch (e) {
    res.status(500);
    res.send();
  }
});

app.listen(process.env.PORT, () => {
  console.log("express running");
});
