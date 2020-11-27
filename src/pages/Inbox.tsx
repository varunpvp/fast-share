import React, { useCallback, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import PrintIcon from "@material-ui/icons/Print";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import ImageIcon from "@material-ui/icons/Image";
import Collapse from "@material-ui/core/Collapse";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import FolderIcon from "@material-ui/icons/Folder";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { useAppState } from "../store";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { isImageFile, isPdfFile, isPrintable, print } from "../config/Print";

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
    list: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

const Inbox: React.FC = () => {
  const { buckets } = useAppState();
  const classes = useStyles();
  const [open, setOpen] = useState<any>({});
  const [progress, setProgress] = useState<boolean>(false);

  const handleProgressClose = useCallback(() => {
    setProgress(false);
  }, []);

  const handlePrint = useCallback(async (fileUrl: string) => {
    setProgress(true);
    await print(fileUrl);
    setProgress(false);
  }, []);

  return (
    <Container maxWidth="sm" className={classes.container}>
      <List
        subheader={<ListSubheader component="div">Shares</ListSubheader>}
        className={classes.list}
      >
        {buckets.map(({ id, files, name, status }) => (
          <React.Fragment key={id}>
            <ListItem button onClick={() => setOpen({ [id]: !open[id] })}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary={status === "sharing" ? `${name} (receiving...)` : name}
              />
              {status === "done" && (
                <React.Fragment>
                  {open[id] ? <ExpandLess /> : <ExpandMore />}
                </React.Fragment>
              )}
            </ListItem>
            {status === "done" && (
              <Collapse in={open[id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {files.map((file) => (
                    <ListItem button className={classes.nested} key={file.url}>
                      <ListItemIcon>
                        {(isPdfFile(file.name) && <PictureAsPdfIcon />) ||
                          (isImageFile(file.name) && <ImageIcon />) || (
                            <InsertDriveFileIcon />
                          )}
                      </ListItemIcon>
                      <ListItemText primary={file.name} />
                      <ListItemSecondaryAction>
                        {isPrintable(file.name) && (
                          <IconButton
                            edge="end"
                            aria-label="print"
                            title="Print"
                            onClick={() => handlePrint(file.url)}
                          >
                            <PrintIcon />
                          </IconButton>
                        )}
                        <IconButton
                          className="download-link"
                          edge="end"
                          aria-label="download"
                          title="Download"
                          href={file.url}
                          download={file.name}
                        >
                          <CloudDownloadIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Dialog open={progress} onClose={handleProgressClose}>
        <DialogTitle>Printing...</DialogTitle>
        <DialogContent style={{ width: 300 }}>
          <LinearProgress />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleProgressClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Inbox;
