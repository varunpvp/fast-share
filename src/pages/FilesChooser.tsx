import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { DropzoneArea } from "material-ui-dropzone";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAppState } from "../store";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    dropzone: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
  })
);

const FilesChooser = () => {
  const history = useHistory();
  const classes = useStyles();
  const { setFiles } = useAppState();

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Box pb={2}>
        <Typography align="center" variant="h5">
          Choose files to share
        </Typography>
      </Box>

      <DropzoneArea
        dropzoneClass={classes.dropzone}
        useChipsForPreview
        onChange={(files) => {
          if (files.length > 0) {
            setFiles(files);
            history.push("/share");
          }
        }}
      />

      <Box py={2}>
        <Typography align="center" variant="body1">
          or
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/receive"
        >
          Receive Files
        </Button>
      </Box>
    </Container>
  );
};

export default FilesChooser;
