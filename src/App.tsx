import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { Route, BrowserRouter, Switch, Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FilesChooser from "./pages/FilesChooser";
import QrCodeScanner from "./pages/QrCodeScanner";
import QrCodeShower from "./pages/QrCodeShower";
import { AppStateContext } from "./store";
import Inbox from "./pages/Inbox";
import SendIcon from "@material-ui/icons/Send";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import { Auth, Database } from "./config/Firebase";
import Bucket from "./types/Bucket";
import Share from "./pages/Share";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import CropFreeIcon from "@material-ui/icons/CropFree";
import InboxIcon from "@material-ui/icons/Inbox";
import LoginDialog from "./components/LoginDialog";
import { useAuth } from "./utils/Firebase";
import PrintMyCode from "./pages/PrintMyCode";
import "./App.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "calc(100vh - 64px)",
    },
    icon: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

function App() {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const [receiverId, setReceiverId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const [buckets, setBuckets] = useState<Bucket[]>([]);

  const auth = useAuth();

  useEffect(() => {
    const ref = Database.ref("content").child(auth?.uid!);

    ref.on("child_added", (snapshot) => {
      setBuckets((buckets) => [
        ...buckets,
        { id: snapshot.key, ...snapshot.val() },
      ]);
    });

    ref.on("child_changed", (snapshot) => {
      setBuckets((buckets) =>
        buckets.map((bucket) =>
          bucket.id === snapshot.key
            ? { id: snapshot.key, ...snapshot.val() }
            : bucket
        )
      );
    });

    return () => {
      setBuckets([]);
      ref.off();
    };
  }, [auth]);

  return (
    <BrowserRouter>
      <AppStateContext.Provider
        value={{
          files,
          setFiles: (files) => setFiles(files),
          receiverId,
          setReceiverId: (id) => setReceiverId(id),
          buckets,
        }}
      >
        <div className={classes.root}>
          <AppBar position="static" classes={{ positionStatic: "no-print" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="icon"
                className={classes.icon}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Fast Share
              </Typography>
              {auth?.isAnonymous && (
                <Button
                  onClick={() => setLoginDialogOpen(true)}
                  color="inherit"
                >
                  Login
                </Button>
              )}
              {!auth?.isAnonymous && (
                <Button
                  onClick={() => Auth.signInAnonymously()}
                  color="inherit"
                >
                  Logout
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <List style={{ width: 250 }}>
              {[
                {
                  shouldRender: true,
                  icon: InboxIcon,
                  title: "Inbox",
                  path: "/inbox",
                },
                {
                  shouldRender: true,
                  icon: SendIcon,
                  title: "Share",
                  path: "/",
                },
                {
                  shouldRender: true,
                  icon: CallReceivedIcon,
                  title: "Receive",
                  path: "/receive",
                },
                {
                  shouldRender: !auth?.isAnonymous,
                  icon: CropFreeIcon,
                  title: "Print My Code",
                  path: "/print-code",
                },
              ]
                .filter((option) => option.shouldRender)
                .map(({ title, icon: Icon, path }) => (
                  <ListItem
                    key={title}
                    button
                    onClick={() => setDrawerOpen(false)}
                    component={Link}
                    to={path}
                  >
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={title} />
                  </ListItem>
                ))}
            </List>
          </Drawer>
          <Switch>
            <Route component={Share} path="/sharing" exact />
            <Route component={Inbox} path="/inbox" exact />
            <Route component={QrCodeScanner} path="/share" exact />
            <Route component={QrCodeShower} path="/receive" exact />
            <Route component={PrintMyCode} path="/print-code" exact />
            <Route component={FilesChooser} path="/" exact />
          </Switch>
          <LoginDialog
            visible={loginDialogOpen}
            onClose={() => setLoginDialogOpen(false)}
          />
        </div>
      </AppStateContext.Provider>
    </BrowserRouter>
  );
}

export default App;
