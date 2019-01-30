import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Slider } from 'material-ui-slider';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import uuid from 'uuid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import TagPlusIcon from 'mdi-material-ui/TagPlus';
import url from '../../service/url';
import formActions from '../../redux/form/formRedux';
import clipActions from '../../redux/clip/clipRedux';
import playlistActions from '../../redux/playlist/playlistRedux';
import styles from '../../styles/FormStyle';

// Wrap momentjs to be able to use moment.duration().format()
momentDurationFormatSetup(moment);

// To convert the seconds value to hh:mm:ss format
function convertHHMMSS(value) {
  return (
    moment.duration(value, 'seconds').format('hh:mm:ss', { trim: false })
  );
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagField: '',
    };
    this.handleTag = this.handleTag.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleNewTag = this.handleNewTag.bind(this);
    this.onCreateClip = this.onCreateClip.bind(this);
    this.onEditClip = this.onEditClip.bind(this);
  }

  // When the user create a new clip is added to clip.list and the playlist.list
  onCreateClip() {
    const {
      form, newClip, closeForm, addToPlaylist,
    } = this.props;
    const { name, duration, tags } = form;
    const clip = {
      id: uuid(),
      type: 'clip',
      title: (name === '' ? 'Unnamed Clip' : name),
      src: url,
      start: duration.min,
      end: duration.max,
      duration: `${convertHHMMSS(duration.min)} - ${convertHHMMSS(duration.max)}`,
      tags,
      playlist: true,
      persist: false,
    };

    this.setState({
      tagField: '',
    },
    () => {
      // Adding the new clip to Clip.List
      newClip(clip);

      // Adding the new clip to Playlist.List
      addToPlaylist(clip);

      closeForm();
    });
  }

  // Edit on of the existing clips
  onEditClip() {
    const { form, editClip, closeForm } = this.props;
    const {
      name, id, duration, tags, persist,
    } = form;
    const clip = {
      id,
      type: 'clip',
      title: (name === '' ? 'Unnamed Clip' : name),
      src: url,
      start: duration.min,
      end: duration.max,
      duration: `${convertHHMMSS(duration.min)} - ${convertHHMMSS(duration.max)}`,
      tags,
      playlist: false,
      persist,
    };

    // New data of the clip to Redux
    editClip(clip);
    closeForm();
  }

  // Add the Tag to Redux and clear the tagField of this component
  handleNewTag() {
    const { tagField } = this.state;
    const { newTag } = this.props;
    if (tagField !== '') {
      newTag(tagField.toLowerCase());
      this.setState({
        tagField: '',
      });
    }
  }

  // The value of the Tagfield
  handleTag(e) {
    this.setState({
      tagField: e.target.value,
    });
  }

  // Update the name on redux
  handleName(e) {
    const { handleName } = this.props;
    handleName(e.target.value);
  }

  render() {
    const { tagField } = this.state;
    const {
      classes, form, deleteTag, clipDuration, closeForm,
    } = this.props;
    const {
      open, name, duration, tags, formType,
    } = form;
    return (
      <Dialog
        open={open}
        onClose={() => closeForm()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{formType === 'edit' ? 'Edit Clip' : 'New Clip'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {formType === 'edit'
              ? ('To Edit the clip you have to change the following fields')
              : ('To create a new clip you have to fill the following fields.')
            }
          </DialogContentText>
          <TextField
            autoFocus
            variant="outlined"
            value={name}
            onChange={this.handleName}
            margin="dense"
            label="Clip Name"
            fullWidth
            className={classes.separateTop}
          />
          <Typography gutterBottom variant="body1" className={classes.separateTop}>
              Select duration of the clip:
          </Typography>
          <div className={classes.inline}>
            <Typography variant="body2">
              {`Start: ${convertHHMMSS(duration.min)}`}
            </Typography>
            <Typography variant="body2">
              {`End: ${convertHHMMSS(duration.max)}`}
            </Typography>
          </div>
          <Slider
            min={0}
            max={52}
            value={[duration.min, duration.max]}
            range
            onChangeComplete={val => clipDuration(val[0], val[1])}
          />
          <TextField
            value={tagField}
            margin="dense"
            variant="outlined"
            label="Tag"
            fullWidth
            onChange={this.handleTag}
            InputProps={{
              startAdornment: <InputAdornment position="start">#</InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={this.handleNewTag}
                  >
                    <TagPlusIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {tags.length > 0
              && (
                <Fragment>
                  <Typography variant="body2" className={classes.separateTop}>
                    Clip Tags:
                  </Typography>
                  <div className={classes.rootChip}>
                    {tags.map((data, index) => (
                      <Chip
                        key={`${data}${index}`}
                        label={`#${data}`}
                        onDelete={() => deleteTag(data)}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                </Fragment>
              )
            }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeForm()}>
              Cancel
          </Button>
          {formType === 'create'
            ? (
              <Button onClick={() => this.onCreateClip()} color="primary">
                  Create Clip
              </Button>
            ) : (
              <Button onClick={() => this.onEditClip()} color="primary">
                  Edit Clip
              </Button>
            )}
        </DialogActions>
      </Dialog>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  form: PropTypes.objectOf(PropTypes.any).isRequired,
  newClip: PropTypes.func,
  closeForm: PropTypes.func,
  addToPlaylist: PropTypes.func,
  editClip: PropTypes.func,
  newTag: PropTypes.func,
  handleName: PropTypes.func,
  deleteTag: PropTypes.func,
  clipDuration: PropTypes.func,
};

const mapStateToProps = state => ({
  form: state.form,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...clipActions, ...formActions, ...playlistActions }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Form));
