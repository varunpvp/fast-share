import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MyQrCode from "../components/MyQrCode";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
  })
);

const PrintMyCode = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Box id="printable" display="flex" flex={1} flexDirection="column">
        <Box pt={4} pb={2}>
          <Typography align="center" variant="h2">
            To Share Files
          </Typography>
        </Box>
        <MyQrCode />
        <Box pt={4} pb={2}>
          <Typography align="center" variant="h4">
            1. Visit fastshare.netlify.app
          </Typography>
          <Box height={8} />
          <Typography align="center" variant="h4">
            2. Choose Files and Scan QR Code
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" pb={2} className="no-print">
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.print()}
        >
          Print
        </Button>
      </Box>
    </Container>
  );
};

export default PrintMyCode;
