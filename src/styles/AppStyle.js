const style = theme => ({
  myWrapper: {
    display: 'grid',
    overflow: 'hidden',
    value: theme.mixins.toolbar.minHeight,

    '@media screen and (min-width: 1200px)': {
      gridTemplateColumns: 'auto 413px',
      gridTemplateRows: '64px auto',
      gridTemplateAreas: '"header header""main drawer"',
    },
    '@media screen and (max-width: 1200px)': {
      gridTemplateRows: `${theme.mixins.toolbar.minHeight}px auto auto`,
      gridTemplateColumns: '100%',
      gridTemplateAreas: '"header""main""drawer"',
    },
  },
});

export default style;
