const styles = theme => ({
  drawer: {
    gridArea: 'drawer',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
  },
  toolbar: theme.mixins.toolbar,
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
});

export default styles;
