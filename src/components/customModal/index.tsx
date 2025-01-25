import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { FC } from "react";
import newStyled from "@emotion/styled";
import { Close } from "@mui/icons-material";

interface ModalProps {
  open?: boolean;
  title?: string;
  onClick?: () => void;
  handleClose?: () => void;
  children?: React.ReactNode;
  headerBgColor?: string;
  headerTextColor?: string;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  closeIcon?: boolean;
  actionButton?: boolean;
}

const StyledDialogTitle = newStyled(DialogTitle)<{
  headerBgColor?: string;
  headerTextColor?: string;
}>(({ headerBgColor = "#1e1e2d", headerTextColor = "white" }) => ({
  backgroundColor: headerBgColor,
  color: headerTextColor,
  padding: "16px 24px 10px",
  fontSize: "15px",
  fontWeight: 600,
  textTransform: "uppercase",
}));

const CustomModal: FC<ModalProps> = ({
  open = false,
  title,
  onClick,
  handleClose,
  children,
  fullWidth = true,
  maxWidth = "sm",
  closeIcon = false,
  actionButton = false,
}) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <StyledDialogTitle>{title}</StyledDialogTitle>
        {closeIcon && (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <Close />
          </IconButton>
        )}
        <DialogContent>{children}</DialogContent>
        {actionButton && (
          <DialogActions sx={{ display: "flex", justifyContent: "left" }}>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={onClick} type="submit">
              Submit
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default CustomModal;
