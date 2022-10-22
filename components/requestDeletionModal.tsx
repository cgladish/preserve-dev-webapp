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
  snippetId,
  onClose,
}: {
  open: boolean;
  snippetId: string;
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
    setIsSubmitting(false);
  }, [open]);

  const isSubmitDisabled = !reasonText.length || reasonText.length > 1000;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/v1/snippets/${snippetId}/deletionRequest`,
        {
          method: "post",
          body: JSON.stringify({ reasonText }),
        }
      );
      if (response.status !== 201) {
        throw new Error(response.statusText);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
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
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <LoadingButton
              style={{ marginLeft: 5 }}
              variant="contained"
              disabled={isSubmitDisabled || isSubmitting}
              loading={isSubmitting}
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
