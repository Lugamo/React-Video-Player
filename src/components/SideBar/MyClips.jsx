/* eslint-disable no-nested-ternary */
import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ClipIcon from 'mdi-material-ui/ContentCut';
import PlaylistRemoveIcon from 'mdi-material-ui/PlaylistRemove';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import clipActions from '../../redux/clip/clipRedux';
import playlistActions from '../../redux/playlist/playlistRedux';
import formActions from '../../redux/form/formRedux';
import styles from '../../styles/MyClipStyle';

class MyClips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: '',
      openDialog: false,
      idToDelete: null,
      persistToDelete: null,
    };
    this.listClips = this.listClips.bind(this);
    this.onChangeFilterValue = this.onChangeFilterValue.bind(this);
    this.onAddToPlaylist = this.onAddToPlaylist.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
  }

  componentDidMount() {
    const sessionClips = JSON.parse(sessionStorage.getItem('persistClips'));
    const { newClip } = this.props;
    if (sessionClips) {
      for (let i = 0; i < sessionClips.length; i += 1) {
        newClip(sessionClips[i]);
      }
    }
  }

  // Add one clip to playlist
  onAddToPlaylist(index) {
    const { addToPlaylist, addClipToPlaylist, clip } = this.props;

    // Add the clip to playlist.list
    addToPlaylist(clip.list[index]);

    // Set in the clip that is part of the playlist
    addClipToPlaylist(clip.list[index].id);
  }

  // When the value of the search filter change
  onChangeFilterValue(e) {
    this.setState({
      filterValue: `${e.target.value.toLowerCase()}`,
    });
  }

  // Remove clip from the playlist
  onRemove(id) {
    const { removeVideo, removeClipFromPlaylist, playlist } = this.props;

    // find the index of the clip to remove by its ID
    const index = playlist.list.map(e => e.id).indexOf(id);

    // Check if the next clip in the list is playing
    if (playlist.now === index + 1) {
      removeVideo(id, true);
    } else {
      removeVideo(id, false);
    }
    // Set in the clip.list that the actual clip is not in the playlist
    removeClipFromPlaylist(id);
  }

  // Delete/Erase the clip
  onDelete(id, persist) {
    const { deleteClip } = this.props;
    this.setState({
      openDialog: false,
    }, () => deleteClip(id, persist));
  }

  // return the list of clip
  listClips(clip, index) {
    const {
      playlist, openForm, addPersistClip, removePersistClip,
    } = this.props;
    const { list, now } = playlist;
    let playingNow = false;
    let tags = '';

    // Check what clip is playing in the moment
    if ((list[now].id) === clip.id) {
      playingNow = true;
    }

    // Show the tags as on string
    for (let i = 0; i < clip.tags.length; i += 1) {
      tags += ` #${clip.tags[i].charAt(0).toUpperCase() + clip.tags[i].slice(1)}`;
    }

    return (
      <Fragment key={clip.id}>
        <ListItem style={{ paddingRight: 6 }}>
          <Avatar>
            {clip.persist
              ? (
                <IconButton onClick={() => removePersistClip(clip)}>
                  <SaveIcon />
                </IconButton>
              ) : (
                <IconButton onClick={() => addPersistClip(clip)}>
                  <ClipIcon />
                </IconButton>
              )
          }
          </Avatar>
          <ListItemText primary={clip.title} secondary={tags} />
          {clip.playlist
          // If the clip is in the playlist can not be edited or deleted
            ? (
              (playingNow
              // If the player if playing the clip can not be removed from the playlist
                ? (
                  <Fragment>
                    <IconButton disabled>
                      <PlaylistRemoveIcon />
                    </IconButton>
                    <IconButton disabled>
                      <EditIcon />
                    </IconButton>
                    <IconButton disabled>
                      <DeleteIcon />
                    </IconButton>
                  </Fragment>
                ) : (
                  <Fragment>
                    <IconButton onClick={() => this.onRemove(clip.id)}>
                      <PlaylistRemoveIcon />
                    </IconButton>
                    <IconButton disabled>
                      <EditIcon />
                    </IconButton>
                    <IconButton disabled>
                      <DeleteIcon />
                    </IconButton>
                  </Fragment>
                )
              )
            ) : (
              <Fragment>
                <IconButton onClick={() => this.onAddToPlaylist(index)}>
                  <PlaylistAddIcon />
                </IconButton>
                <IconButton>
                  <EditIcon onClick={() => openForm('edit', clip)} />
                </IconButton>
                <IconButton aria-label="Delete" onClick={() => this.handleOpenDialog(clip.id, clip.persist)}>
                  <DeleteIcon />
                </IconButton>
              </Fragment>
            )}
        </ListItem>
        <Divider />
      </Fragment>
    );
  }

  // When the Dialog to delete a clip is open
  handleOpenDialog(id, persist) {
    this.setState({
      openDialog: true,
      idToDelete: id,
      persistToDelete: persist,
    });
  }

  // Close the Dialog to delete a clip
  handleCloseDialog() {
    this.setState({ openDialog: false });
  }

  render() {
    const { classes, clip } = this.props;
    const {
      filterValue, openDialog, idToDelete, persistToDelete,
    } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <Input
            placeholder="Search by Tag"
            onChange={this.onChangeFilterValue}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
        <List className={classes.list}>
          {
            clip.list.filter((clipData) => {
              // if one of the tags of the clip match with the filter value
              let tagMatch = 0;
              for (let i = 0; i < clipData.tags.length; i += 1) {
                if (clipData.tags[i].includes(filterValue)) {
                  tagMatch = 1 + tagMatch;
                }
              }
              if (tagMatch > 0) {
                return true;
              }
              return false;
            }).map((clipData, index) => (
              this.listClips(clipData, index)
            ))
          }
        </List>
        <Dialog
          open={openDialog}
          onClose={this.handleClose}
        >
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this clip?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={() => this.onDelete(idToDelete, persistToDelete)} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MyClips.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  playlist: PropTypes.objectOf(PropTypes.any).isRequired,
  clip: PropTypes.objectOf(PropTypes.any).isRequired,
  openForm: PropTypes.func,
  addPersistClip: PropTypes.func,
  removePersistClip: PropTypes.func,
  newClip: PropTypes.func,
  deleteClip: PropTypes.func,
  addToPlaylist: PropTypes.func,
  addClipToPlaylist: PropTypes.func,
  removeVideo: PropTypes.func,
  removeClipFromPlaylist: PropTypes.func,
};

const mapStateToProps = state => ({
  clip: state.clip,
  playlist: state.playlist,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...clipActions, ...playlistActions, ...formActions }, dispatch);
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(MyClips));
