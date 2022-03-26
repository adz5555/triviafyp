import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import grey from "@material-ui/core/colors/grey";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  icon: {
    color: grey[500]
  }
}));

const Option = ({ option, index }) => {
  const classes = useStyles();
  let backcolour = '#fff';

  if (index == 0) {
    backcolour = '#0088FE'
  } else if (index == 1) {
    backcolour = '#00C49F'
  } else if (index == 2) {
    backcolour = '#FFBB28'
  } else if (index == 3) {
    backcolour = '#FF8042'
  }

  return (
    <Paper variant="outlined" className={classes.root} style={{background: backcolour}}>
      <Typography variant="h4">{option}</Typography>
    </Paper>
  );
};

export default Option;
