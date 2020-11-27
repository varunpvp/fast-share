import Box from "@material-ui/core/Box";
import React from "react";
import ReactResizeDetector from "react-resize-detector";
import { useAuth } from "../utils/Firebase";
const QRCode = require("qrcode.react");

export default function MyQrCode() {
  const auth = useAuth();
  return (
    <ReactResizeDetector handleWidth handleHeight>
      {({ width, height }: any) => {
        const minValue = Math.min(width, height) * 0.77;
        const size = minValue || 100;
        return (
          <div style={{ display: "flex", flex: 1 }}>
            <Box m="auto" width={size} height={size}>
              <QRCode value={auth?.uid!} size={size} />
            </Box>
          </div>
        );
      }}
    </ReactResizeDetector>
  );
}
