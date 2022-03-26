import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Option from "../components/Answering/Option";

const useStyles = makeStyles(theme => ({
  centerText: {
    textAlign: "center",
    paddingTop: theme.spacing(6)
  },
  optionList: {
    marginTop: theme.spacing(4)
  }
}));



const Answering = ({ current_question }) => {
  const classes = useStyles();
  const option_list = current_question.options.map((option, index) => (
    <Option option={option} index={index} key={option} />
  ));

  return (
    <Grid item className={classes.centerText} xs={12}>
      <Typography variant="h4" gutterBottom>
        {current_question.prompt}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Answer the question on your devices
      </Typography>

      <Grid
        container
        justify="center"
        alignItems="flex-start"
        className={classes.optionList}
      >
        <Grid item xs={8} sm={6} md={5} lg={4}>
          {option_list}
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = state => {
  const { chooser, current_question } = state;

  return {
    chooser,
    current_question
  };
};

export default connect(mapStateToProps)(Answering);
