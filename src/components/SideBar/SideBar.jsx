import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import formActions from '../../redux/form/formRedux';
import MyClips from './MyClips';
import Playlist from './Playlist';
import Form from './Form';
import styles from '../../styles/SideBarStyle';

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      embed: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  // Check if the app is embed or not
  componentDidMount() {
    const parsed = queryString.parse(window.location.search);
    if (parsed.embed === 'true') {
      this.setState({ embed: true });
    }
  }

  // value for the tabs
  handleChange = (event, value) => {
    this.setState({ value });
  };

  // value for tabs in swipes
  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme, openForm } = this.props;
    const { value, embed } = this.state;
    const fabs = [
      {
        color: 'primary',
        className: classes.fab,
        icon: <AddIcon />,
      },
      {
        color: 'primary',
        className: classes.fab,
        icon: <AddIcon />,
      },
    ];
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    return (
      <div className={classes.drawer}>
        <Tabs value={value} onChange={this.handleChange} fullWidth>
          <Tab label="Playlist" />
          <Tab label="My Clips" disabled={embed === true} />
        </Tabs>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <Playlist />
          <MyClips dir={theme.direction} />
        </SwipeableViews>
        {fabs.map((fab, index) => (
          <Zoom
            key={`${index}${fab.color}`}
            in={this.state.value === index}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${this.state.value === index ? transitionDuration.exit : 0}ms`,
            }}
            unmountOnExit
          >
            <Fab className={fab.className} color={fab.color} onClick={() => openForm('create')}>
              {fab.icon}
            </Fab>
          </Zoom>
        ))}
        <Form />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  form: state.form,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(formActions, dispatch);
}

SideBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  theme: PropTypes.objectOf(PropTypes.any),
  openForm: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(SideBar));
