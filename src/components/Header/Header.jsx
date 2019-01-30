import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import ToogleIcon from 'material-ui-toggle-icon';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MovieIcon from '@material-ui/icons/Movie';
import LightOffIcon from 'mdi-material-ui/LightbulbOutline';
import LightOnIcon from 'mdi-material-ui/Lightbulb';
import themeActions from '../../redux/theme/themeRedux';
import styles from '../../styles/HeaderStyle';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      OnOff: true,
    };
    this.handleTheme = this.handleTheme.bind(this);
  }

  // Change the theme of the App
  handleTheme() {
    const { changeTheme } = this.props;
    const { OnOff } = this.state;
    this.setState({
      OnOff: !OnOff,
    }, () => changeTheme(!OnOff));
  }

  render() {
    const { classes } = this.props;
    const { OnOff } = this.state;
    return (
      <div className={classes.appBar}>
        <AppBar position="static">
          <Toolbar>
            <MovieIcon className={classes.movieIcon} />
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Clip Maker
            </Typography>
            <IconButton
              aria-haspopup="true"
              onClick={this.handleTheme}
              color="inherit"
            >
              <ToogleIcon
                on={OnOff}
                onIcon={<LightOnIcon />}
                offIcon={<LightOffIcon />}
              />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  changeTheme: PropTypes.func,

};

// Get the specific data from the store
const mapStateToProps = state => ({
  theme: state.theme,
});

// get the actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(themeActions, dispatch);
}

// connect the container with data and actions
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header));
