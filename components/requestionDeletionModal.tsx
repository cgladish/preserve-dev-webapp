import { LoadingButton } from "@mui/lab";
import {
  Modal,
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function RequestDeletionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    palette: {
      background: { paper },
    },
  } = useTheme();

  const [reasonText, setReasonText] = useState<string>("");
  useEffect(() => {
    setReasonText("");
  }, [open]);

  const isSubmitDisabled = !reasonText.length || reasonText.length > 1000;

  const onSubmit = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          background: paper,
          border: "2px solid #000",
          boxShadow: "24px",
          padding: 20,
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            style={{ marginBottom: 10 }}
          >
            Request Deletion
          </Typography>
          <TextField
            multiline
            minRows={3}
            maxRows={3}
            value={reasonText}
            onChange={(event) => setReasonText(event.target.value)}
            style={{ width: "100%", marginBottom: 20, marginTop: 10 }}
            required
            label="Reason"
          />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <LoadingButton
              style={{ marginLeft: 5 }}
              variant="contained"
              disabled={isSubmitDisabled}
              type="submit"
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
