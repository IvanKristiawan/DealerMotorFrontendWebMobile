import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const ButtonModifierJual = ({
  id,
  kode,
  addLink,
  editLink,
  deleteUser,
  nameUser,
  tambahBaru,
  addTambahText,
  editable
}) => {
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ButtonGroup variant="contained">
        <Button
          color="success"
          sx={{ bgcolor: "success.light", textTransform: "none" }}
          startIcon={<AddCircleOutlineIcon />}
          size="small"
          onClick={() => {
            navigate(addLink);
          }}
        >
          Tambah {addTambahText && addTambahText}
        </Button>
        {tambahBaru && (
          <Button
            color="secondary"
            sx={{ bgcolor: "secondary.light", textTransform: "none" }}
            startIcon={<AddCircleOutlineIcon />}
            size="small"
            onClick={() => {
              navigate(tambahBaru);
            }}
          >
            Tambah Baru
          </Button>
        )}
        {kode && (
          <>
            {editLink && editable && (
              <Button
                color="primary"
                startIcon={<EditIcon />}
                sx={{ textTransform: "none" }}
                onClick={() => {
                  navigate(editLink);
                }}
              >
                Ubah
              </Button>
            )}
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              sx={{ textTransform: "none" }}
              onClick={handleClickOpen}
            >
              Hapus
            </Button>
          </>
        )}
      </ButtonGroup>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Hapus Data`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Yakin ingin menghapus data ${nameUser}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteUser(id)}>Ok</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ButtonModifierJual;
