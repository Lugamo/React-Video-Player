const styles = theme => ({
  separateTop: {
    marginTop: theme.spacing.unit * 4,
  },
  inline: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  rootChip: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

export default styles;
