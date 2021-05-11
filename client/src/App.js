import 'bootstrap/dist/css/bootstrap.min.css'
import React, { Component } from 'react';
import { Container } from 'react-bootstrap'
// import Login from './Login'
// import Dashboard from './Dashboard'
import MainView from './MainView'
import { getToken, checkToken, login} from './useAuth';
import openSocket from 'socket.io-client'

const code_global = new URLSearchParams(window.location.search).get('code')

class App extends Component {
  state = {
    authenticated: checkToken(),
    eventsLog: [],
    code: null,
    socket: null,
  };
  
  componentDidMount(){
    if (checkToken()){
      console.log("check?");
      this.setState({ authenticated: true })
      this.setUpSocket();
    }
  }

  authenticate(){
    login()
      .then(() => this.setState({ authenticated: true }))
      .then(() => console.log("authenticated: ", this.state.authenticated))
      
  };

  socketEventHandler(socket, event, handler){
    socket.on(event, (data) => {
      console.info(event, data);
      this.setState({
        eventLog: [...this.state.eventLog, { event, data }],
      });
      handler(data);
    });
  };

  setUpSocket(){
    var socket = openSocket('/connect');
    this.setState({socket: socket});
    this.state.socket.emit('initiate', { accessToken: getToken() });
    // handle initial state event
    this.socketEventHandler(this.state.socket, 'initial_state', (data) => {
        this.setVolume(data.device.volume_percent);
        this.setDevice(data.device);
        this.setPlaybackState(data.is_playing);
        this.setTrack(data.item);
        this.setProgress(data.progress_ms);
        this.setState({ playerReady: true });
        this.progressTimer = window.setInterval(() => {
          if (this.state.isPlaying) {
            this.setProgress(this.state.progress + 1000);
          }
        }, 1000);
      });

      // handle other play event
      this.socketEventHandler(this.state.socket, 'track_change', this.setTrack);
      this.socketEventHandler(this.state.socket, 'seek', this.setProgress);
      this.socketEventHandler(this.state.socket, 'playback_started', () => this.setPlaybackState(true));
      this.socketEventHandler(this.state.socket, 'playback_paused', () => this.setPlaybackState(false));
      this.socketEventHandler(this.state.socket, 'device_change', this.setDevice);
      this.socketEventHandler(this.state.socket, 'volume_change', this.setVolume);
      this.socketEventHandler(this.state.socket, 'track_end', () => { });
      this.socketEventHandler(this.state.socket, 'connect_error', this.onError);

  }

  setProgress = (progress) => {
    const trackLength = this.state.activeTrack.duration_ms;
    this.setState({
      progress: progress,
      progressPercent: (progress / trackLength) * 100,
    });
  };

  setPlaybackState = (isPlaying) => {
    this.setState({isPlaying});
  };

  setDevice = (device) => {
    this.setState({device});
  };

  setVolume = (volume) => {
    this.setState({volume});
  };
  
  setTrack = (activeTrack) => {
    this.setState({activeTrack});
  };

  onError = (error) => {
    this.setState({ error: error.message || error });
  };

  render(){
    const {
      authenticated,
      playerReady,
      code,
      error,
    } = this.state;
    return code_global ? <MainView code={new URLSearchParams(window.location.search).get('code')} /> : <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <button className="btn btn-success btn-lg" onClick={this.authenticate}>Login with Spotify</button> </Container>

  }


}

export default App;
