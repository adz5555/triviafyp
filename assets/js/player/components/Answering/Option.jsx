import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button'
import { selectOption } from '../../actions'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
    marginBottom: theme.spacing(2),
  }
}));

const Option = ({ option, index, dispatch, channel, current_question }) => {
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
    <Button
      key={option}
      variant="contained"
      size="large"
      className={classes.button}
      style={{background: backcolour}}
      onClick={() => dispatch(selectOption(channel, option))}
    >
      {option}
    </Button>
  );
};

export default Option;
