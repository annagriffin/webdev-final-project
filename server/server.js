const connectSocket = require('spotify-connect-ws')
const socketio = require('socket.io')

require('dotenv').config
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi.refreshAccessToken()
  .then(data => {
    res.json({
      accessToken: data.body.accessToken,
      expiresIn: data.body.expiresIn,
    })
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

app.post('/login', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: 'a9fef7a2a0734ac5bd9a6f827573ed78',
    clientSecret: '286b51b5aedd47a9be829c4bb1e59e60'
  });

  spotifyApi.authorizationCodeGrant(code).then(data => {
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    })
  }).catch(() => {
    res.sendStatus(400);
  })
})

const port = process.env.PORT || 3001
const server = app.listen(port, () => {console.log('Listening on port: ' + port)})
const io = socketio(server);
io.of('connect').on('connection', function(connectSocket){
  console.log('a user connected');
});