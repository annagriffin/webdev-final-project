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

## Reflection
Our initial plan for the Spotify Playlist Web Sharing Project was to use Socket to create a shared Spotify music session where only one person would need to log in. We encountered many difficulties with trying to get Spotify authentification system to work with the socket. Everytime we open another instance of the page, the user would have to log in again. 