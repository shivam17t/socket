// const http = require("http");
// const express = require("express");
// const app = express();
// const { Server } = require("socket.io");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const webrtc = require("wrtc");
// const { log } = require("console");

import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();


// app.use(express.static(__dirname + "/public"));
app.use(cors());
// app.use(bodyParser.json);
// app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


let broadcaster_id; // host page id
// let v_id; // viewer page id
let i =0,j=0,k=0,l=0,m=0,n=0; // using these variable for tracking occurrences of socket events.

io.on("connection", (socket) => {

  socket.on('broadcast', ()=>{
    broadcaster_id = socket.id;
    console.log('broadcast', ++i);
    // socket.broadcast.emit('broadcast');
  });

  socket.on('viewer',(RID)=>{
    console.log('viewer', ++j);
    socket.to(broadcaster_id).emit('viewer', socket.id, RID);
  });

  socket.on("offer", (id, data) =>{ // from host page
    console.log('offer', ++k);
    socket.to(id).emit('offer', socket.id, data); //to viewer page.
  });

  socket.on('answer', (id, data)=>{ //from viewer page
    console.log('answer', ++l);
    socket.to(broadcaster_id).emit('answer', socket.id, data); // to host page
  });

  socket.on('candidateh', (id, data)=>{
    socket.to(broadcaster_id).emit('candidateh', socket.id, data);
    console.log('candidateh', ++n);
  });

  socket.on('candidatev', (id, data)=>{
    socket.to(id).emit('candidatev', socket.id, data);
    console.log('candidatev', ++m);
  });

  socket.on('deleteConnection', ()=>{
    socket.to(broadcaster_id).emit('deleteConnection', socket.id);
    console.log(`User disconnected : ${socket.id}`);
  });

  socket.on('noBroadcast', id =>{
    socket.to(id).emit('Nobroadcast');
  })

  console.log(`User connected : ${socket.id}`);
});


server.listen(process.env.PORT || 8000, () => {
  console.log("server is runnig");
});
