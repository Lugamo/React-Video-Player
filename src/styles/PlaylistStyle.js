const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  sideIcon: {
    marginLeft: 'auto',
    marginRight: `${theme.spacing.unit * 1}px`,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
});

export default styles;
