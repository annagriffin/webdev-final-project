# Spotify Playlist Web Sharing 
Anna Griffin(agriffin@olin.edu), Sherrie Shen(xshen@olin.edu) <br>

To run this project, first run
```
cd server/
npm start
```

then in a new terminal window, run
```
cd client/
npm start
```

Once the client page finishes loading, log in with your spotify credentials.

## Tech Stack
* [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
* [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
* [React Bootstrap](https://react-bootstrap.netlify.app/)
* [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd)
* [React Spotify Web Playback](https://github.com/gilbarbara/react-spotify-web-playback)
* [Spotify Web API Node](https://github.com/thelinmichael/spotify-web-api-node)
* [Socket.io](https://socket.io/)

## Reflection
Our initial plan for the Spotify Playlist Web Sharing Project was to use Socket to create a shared Spotify music session where only one person would need to log in. We encountered many difficulties with trying to get Spotify authentication system to work with the socket. Everytime we open another instance of the page, the user would have to log in again. It was also hard to debug which function call is on the stack when the authentication and initiating sockets are all done asynchronously. If there were more time, we would need to investigate more of the different workflow of Spotify authentication to have it work with sockets. But nonetheless we learned a lot about working with Spotify Web API, the convoluted Spotify Authentication process and how to potentially to integrate socket with it :)


<br>

## Socket.io Attempted Integration
Found in `sherrie-socket` branch