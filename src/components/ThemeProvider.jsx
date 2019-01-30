import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';

class ThemeProvider extends Component {
  render() {
    const { theme } = this.props;
    const { Theme } = theme;
    return (
      <MuiThemeProvider theme={Theme}>
        <App />
      </MuiThemeProvider>
    );
  }
}

ThemeProvider.propTypes = {
  theme: PropTypes.objectOf(PropTypes.any).isRequired,
};


// Get the specific data from the store
const mapStateToProps = state => ({
  theme: state.theme,
});

// connect the container with data and actions
export default connect(mapStateToProps)(ThemeProvider);
