import { createMuiTheme } from '@material-ui/core/styles';

const light = createMuiTheme({
  palette: {
    primary: {
      main: '#ff0000',
      dark: '#B71C1C',
    },
    secondary: {
      main: '#ff0000',
      light: '#FFEB3B',
    },
  },
  typography: { useNextVariants: true },
});

export default light;
