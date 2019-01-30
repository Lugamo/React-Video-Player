/* eslint-disable no-nested-ternary */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import ClipIcon from 'mdi-material-ui/ContentCut';
import LocalMovieIcon from '@material-ui/icons/LocalMovies';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import RepeatIcon from '@material-ui/icons/Repeat';
import playlistActions from '../../redux/playlist/playlistRedux';
import clipActions from '../../redux/clip/clipRedux';
import styles from '../../styles/PlaylistStyle';

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.listItems = this.listItems.bind(this);
    this.onVideoSelect = this.onVideoSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  // When click the clip in the playlist, play the clip
  onVideoSelect(isSelected, index) {
    const { changeVideo } = this.props;
    if (!isSelected) {
      changeVideo(index);
    }
  }

  // Remove the clip from the playlist
  onRemove(id, index) {
    const { removeVideo, removeClipFromPlaylist, playlist } = this.props;

    // if the clip is playing can not be removed
    if (playlist.now === index + 1) {
      removeVideo(id, true);
    } else {
      removeVideo(id, false);
    }
    removeClipFromPlaylist(id);
  }

  // For each element in the playlist.list
  listItems(video, index) {
    const { playlist, theme } = this.props;
    let selected = null;

    // Color the item in the playlist which is playing
    if (playlist.now === index) {
      selected = theme.palette.primary.light;
    }

    return (
      <Fragment key={index}>
        <ListItem
          button
          style={{ backgroundColor: selected }}
          onClick={() => this.onVideoSelect(selected, index)}
        >
          <ListItemIcon>

            {selected
              ? (
                <PlayCircleFilled fontSize="large" />
              ) : (
                (index === 0
                  ? (
                    <LocalMovieIcon fontSize="large" />
                  ) : (
                    <ClipIcon />
                  ))
              )}
          </ListItemIcon>
          <ListItemText
            primary={video.title}
            secondary={video.duration}
          />
          {!selected && index !== 0
        && (
          <ListItemSecondaryAction>
            <IconButton aria-label="Remove" onClick={() => this.onRemove(video.id, index)}>
              <RemoveIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
        </ListItem>
        <Divider />
      </Fragment>
    );
  }

  render() {
    const {
      classes, playlist, autoPlay, repeatPlaylist,
    } = this.props;

    return (
      <Fragment>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap>
            Clip Playlist
          </Typography>
          <IconButton className={classes.sideIcon} color={playlist.autoplay ? 'primary' : 'default'} onClick={() => autoPlay()}>
            <PlaylistPlayIcon />
          </IconButton>
          <IconButton color={playlist.repeat ? 'primary' : 'default'} onClick={() => repeatPlaylist()}>
            <RepeatIcon fontSize="small" />
          </IconButton>
        </Toolbar>
        <Divider />
        <div className={classes.demo}>
          <List>
            {playlist.list.map((video, index) => (
              this.listItems(video, index)
            ))}
          </List>
        </div>
      </Fragment>
    );
  }
}

Playlist.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  playlist: PropTypes.objectOf(PropTypes.any).isRequired,
  theme: PropTypes.objectOf(PropTypes.any).isRequired,
  changeVideo: PropTypes.func,
  removeVideo: PropTypes.func,
  removeClipFromPlaylist: PropTypes.func,
  autoPlay: PropTypes.func,
  repeatPlaylist: PropTypes.func,
};

const mapStateToProps = state => ({
  playlist: state.playlist,
  clip: state.clip,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...clipActions, ...playlistActions }, dispatch);
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Playlist));
