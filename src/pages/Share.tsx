import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import { useHistory } from "react-router-dom";
import { useAppState } from "../store";
import { LinearProgress } from "@material-ui/core";
import { Database } from "../config/Firebase";
import { uploadFile } from "../utils/Firebase";
import { UAParser } from "ua-parser-js";
import * as uuid from "uuid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    content: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      flex: 1,
    },
  })
);

const Share: React.FC = () => {
  const { files, receiverId, setFiles, setReceiverId } = useAppState();
  const classes = useStyles();
  const history = useHistory();
  const [status, setStatus] = useState<"sharing" | "done">("sharing");

  const doShare = async () => {
    const ua = new UAParser();
    const ref = await Database.ref("content")
      .child(receiverId)
      .push({
        status: "sharing",
        name: `${ua.getDevice().model ?? "Device"} (${
          ua.getOS().name ?? "Platform"
        })`,
      });
    const fileUrls = await Promise.all(
      files.map((file) =>
        uploadFile({
          path: `files/${uuid.v4()}`,
          file,
          onProgressChange: console.log,
        })
      )
    );

    const filesData = fileUrls.map((url, index) => ({
      url,
      name: files[index].name,
    }));
    await ref.update({ files: filesData, status: "done" });
    setStatus("done");
    setFiles([]);
    setReceiverId("");
    setTimeout(() => history.push("/"), 500);
  };

  useEffect(() => {
    doShare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="sm" className={classes.container}>
      {status === "sharing" && (
        <Box className={classes.content}>
          <LinearProgress />
          <Typography variant="body1">Sharing...</Typography>
        </Box>
      )}
      {status === "done" && (
        <Box className={classes.content}>
          <DoneIcon />
          <Typography variant="h6">Done.</Typography>
        </Box>
      )}
      <Box pt={4} pb={2}>
        <Typography align="center" variant="h5">
          Sharing {files.length} files.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            history.push("/");
            setFiles([]);
          }}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default Share;
