import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import QrReader from "react-qr-reader";
import ReactResizeDetector from "react-resize-detector";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { useAppState } from "../store";

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
      flex: 1,
    },
    qrCode: {
      margin: "auto",
    },
  })
);

const QrCodeScanner: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { files, setFiles, setReceiverId } = useAppState();

  const handleScan = async (value: string | null) => {
    if (value) {
      setReceiverId(value);
      history.push("/sharing");
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <ReactResizeDetector handleWidth handleHeight>
        {({ width, height }: any) => {
          const minValue = Math.min(width, height);
          const size = minValue || 100;
          return (
            <div className={classes.content}>
              <QrReader
                className={classes.qrCode}
                style={{ width: size, height: size }}
                onScan={handleScan}
                onError={console.log}
              />
            </div>
          );
        }}
      </ReactResizeDetector>
      <Box pt={4} pb={2}>
        <Typography align="center" variant="h5">
          {files.length} files selected. Scan QR Code to share files
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

export default QrCodeScanner;
