const playBarHeight = '45px';

const styles = theme => ({
  progressBar: {
    backgroundColor: '#E0E0E0',
    position: 'relative',
    marginTop: theme.spacing.unit * -1,
  },
  progress: {
    height: theme.spacing.unit * 2,
    minHeight: theme.spacing.unit * 2,
  },
  clipMarker: {
    backgroundColor: theme.palette.secondary.light,
    width: theme.spacing.unit,
    height: theme.spacing.unit * 2,
    zIndex: 2,
    position: 'absolute',
    cursor: 'pointer',
    borderRadius: '3.5px',
  },
  playBar: {
    top: 'auto',
    bottom: 0,
    backgroundColor: '#212121',
    minHeight: playBarHeight,
    height: playBarHeight,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: playBarHeight,
    height: playBarHeight,
  },
  content: {
    gridArea: 'main',
    backgroundColor: theme.palette.background.default,
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: '#000000',
  },
  circularProgress: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  video: {
    width: '100%',
    height: 'auto',
  },
});

export default styles;
