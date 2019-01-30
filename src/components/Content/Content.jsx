import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromEvent } from 'rxjs';
import Mousetrap from 'mousetrap';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import ToogleIcon from 'material-ui-toggle-icon';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import SkipNext from 'mdi-material-ui/SkipNext';
import SkipPrevious from 'mdi-material-ui/SkipPrevious';
import Replay from '@material-ui/icons/Replay';
import playlistActions from '../../redux/playlist/playlistRedux';
import styles from '../../styles/ContentStyle';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      replayBtn: false,
      completed: 0,
      buffer: 0,
      videoLoading: false,
    };
    this.video = React.createRef();
    this.onPlayPause = this.onPlayPause.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onReplay = this.onReplay.bind(this);
    this.listOfClips = this.listOfClips.bind(this);
    this.goMarker = this.goMarker.bind(this);
  }

  componentDidMount() {
    // Binding the shortcut to the functions
    Mousetrap.bind('alt+n', this.onNext);
    Mousetrap.bind('alt+b', this.onPrevious);
    Mousetrap.bind('alt+p', this.onPlayPause);

    this.initializeStream();
  }

  componentWillReceiveProps(nextProps) {
    const { playlist } = this.props;
    const { now, autoplay } = playlist;
    const { replayBtn } = this.state;
    const video = this.video.current;

    // When the video changes load the new video and show the loading circle
    if (now !== nextProps.playlist.now) {
      video.load();
      if (autoplay) {
        if (replayBtn === true) {
          this.setState({ videoLoading: false }, () => video.pause());
        } else {
          setTimeout(() => {
            this.setState({ videoLoading: false }, () => video.play());
          }, 3000);
        }
      } else {
        this.setState({
          videoLoading: false,
          isPlaying: false,
          replayBtn: false,
          completed: 0,
          buffer: 0,
        }, () => video.pause());
      }
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind('alt+n', this.onNext);
    Mousetrap.unbind('alt+b', this.onPrevious);
    Mousetrap.unbind('alt+p', this.onPlayPause);
  }

  // When Play/Pause button is clicked
  onPlayPause() {
    const { isPlaying } = this.state;
    const video = this.video.current;
    const videoStatus = (isPlaying === true) ? video.pause() : video.play();
    this.setState({
      isPlaying: !isPlaying,
    }, () => videoStatus);
  }

  // When the user click on Next video or go automatically to next video
  onNext() {
    const { playlist, changeVideo, nextVideo } = this.props;
    const {
      repeat, now, list, autoplay,
    } = playlist;

    // repeat option active and the video is the last one of the playlist
    if (now === list.length - 1) {
      if (repeat === true) {
        this.setState({
          replayBtn: false,
          isPlaying: !!autoplay,
          completed: 0,
          buffer: 0,
          videoLoading: false,
        }, () => changeVideo(0));
      }
    } else {
      this.setState({
        replayBtn: false,
        isPlaying: !!autoplay,
        completed: 0,
        buffer: 0,
        videoLoading: true,
      }, () => nextVideo());
    }
  }

  // When the user click on Previous video
  onPrevious() {
    const { previousVideo, playlist } = this.props;
    const { now, autoplay } = playlist;

    if (now !== 0) {
      this.setState({
        completed: 0,
        buffer: 0,
        replayBtn: false,
        isPlaying: !!autoplay,
      }, () => previousVideo());
    }
  }

  // When click on replay video button
  onReplay() {
    const { playlist } = this.props;
    const { now, list } = playlist;
    const start = list[now].start;
    const video = this.video.current;

    video.currentTime = start;

    this.setState({
      completed: 0,
      replayBtn: false,
      isPlaying: true,
    }, () => video.play());
  }

  // Markers in the video progress Bars
  listOfClips(clip, index, videoEnd) {
    const { classes } = this.props;
    const position = (clip.start * 100) / videoEnd;
    return (
      <div
        className={classes.clipMarker}
        onClick={() => this.goMarker(index + 1)}
        style={{ marginLeft: `${position}%` }}
        key={index}
      />
    );
  }

  initializeStream() {
    fromEvent(this.video.current, 'timeupdate')
      .subscribe(
        () => {
          const stateCopy = { ...this.state };
          const video = this.video.current;
          const { playlist } = this.props;
          const {
            now, list, autoplay, repeat,
          } = playlist;
          const videoEnd = list[now].end;

          // When the buffer load
          if (video.buffered.length > 0) {
            const duration = list[now].end - list[now].start;

            stateCopy.completed = ((video.currentTime - list[now].start) * 100) / duration;
            stateCopy.buffer = (video.buffered.end(video.buffered.length - 1) * 100) / duration;

            // When the video ends
            if (video.currentTime > videoEnd) {
            // If autoplay option is active
              if (autoplay) {
                stateCopy.isPlaying = true;
                stateCopy.videoLoading = true;
                // Check if is the last video
                if (now === list.length - 1) {
                  if (repeat === false) {
                    stateCopy.videoLoading = false;
                    stateCopy.replayBtn = true;
                    stateCopy.isPlaying = false;
                    video.pause();
                  }
                }
                this.onNext();
              } else {
                video.pause();
                stateCopy.replayBtn = true;
                stateCopy.isPlaying = false;
              }
            }
            this.setState({ ...stateCopy });
          }
        },
      );
  }

  // When the user click on one of the markers in the progress Bar
  goMarker(index) {
    const { changeVideo, playlist } = this.props;
    const { autoplay } = playlist;

    this.setState({
      completed: 0,
      buffer: 0,
      replayBtn: false,
      isPlaying: !!autoplay,
    }, () => changeVideo(index));
  }

  render() {
    const { classes, playlist } = this.props;
    const { list, now } = playlist;
    const {
      isPlaying, replayBtn, completed, buffer, videoLoading,
    } = this.state;
    const start = list[now].start;
    const end = list[now].end;
    const src = list[now].src;

    return (
      <main className={classes.content}>
        <div className={classes.videoContainer}>
          {videoLoading
          && (
            <CircularProgress size={70} className={classes.circularProgress} />
          )
        }
          <video className={classes.video} type="video/mp4" ref={this.video}>
            <source src={`${src}#t=${start},${end}`} />
          </video>
        </div>
        <div className={classes.progressBar}>
          {list[now].type === 'video'
          && [
            (list.filter(video => video.type === 'clip').map((video, index) => (
              this.listOfClips(video, index, end)
            ))),
          ]
        }
          <LinearProgress variant="buffer" value={completed} valueBuffer={buffer} className={classes.progress} />
        </div>
        <AppBar position="static" className={classes.playBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton aria-haspopup="true" color="inherit" onClick={this.onPrevious}>
              <SkipPrevious />
            </IconButton>
            {replayBtn
              ? (
                <IconButton aria-haspopup="true" color="inherit" onClick={this.onReplay}>
                  <Replay />
                </IconButton>
              ) : (
                <IconButton aria-haspopup="true" color="inherit" onClick={this.onPlayPause}>
                  <ToogleIcon
                    on={isPlaying}
                    onIcon={<Pause />}
                    offIcon={<PlayArrow />}
                  />
                </IconButton>
              )}

            <IconButton aria-haspopup="true" color="inherit" onClick={this.onNext}>
              <SkipNext />
            </IconButton>
          </Toolbar>
        </AppBar>
      </main>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  playlist: PropTypes.objectOf(PropTypes.any).isRequired,
  changeVideo: PropTypes.func,
  nextVideo: PropTypes.func,
  previousVideo: PropTypes.func,
};

// Get the specific data from the store
const mapStateToProps = state => ({
  playlist: state.playlist,
});

// get the actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(playlistActions, dispatch);
}

// connect the container with data and actions
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Content));
