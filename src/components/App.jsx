import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './Header/Header';
import Content from './Content/Content';
import SideBar from './SideBar/SideBar';
import styles from '../styles/AppStyle';

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.myWrapper}>
        <CssBaseline />
        <Header />
        <Content />
        <SideBar />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withTheme()(withStyles(styles)(App));
