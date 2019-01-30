import { createMuiTheme } from '@material-ui/core/styles';

const dark = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#B71C1C',
      light: '#B71C1C',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#B71C1C',
      light: '#FFEB3B',
    },
    background: {
      paper: '#212121',
      contrastText: '#fff',
    },
    text: {
      primary: '#ffffff'
    }
  },
  typography: { useNextVariants: true },
});

export default dark;
