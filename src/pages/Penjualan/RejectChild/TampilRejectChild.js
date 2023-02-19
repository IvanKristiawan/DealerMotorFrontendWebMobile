import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const TampilRejectChild = () => {
  const { user } = useContext(AuthContext);
  const { id, idRejectChild } = useParams();
  const navigate = useNavigate();
  const [noKKRejectAnak, setNoKKRejectAnak] = useState("");
  const [noKTPRejectAnak, setNoKTPRejectAnak] = useState("");
  const [namaRejectAnak, setNamaRejectAnak] = useState("");
  const [tlpRejectAnak, setTlpRejectAnak] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getRejectChildById();
  }, []);

  const getRejectChildById = async () => {
    if (id) {
      const response = await axios.post(
        `${tempUrl}/findAnakRejects/${idRejectChild}`,
        {
          id: user._id,
          token: user.token
        }
      );
      setNoKKRejectAnak(response.data.noKKRejectAnak);
      setNoKTPRejectAnak(response.data.noKTPRejectAnak);
      setNamaRejectAnak(response.data.namaRejectAnak);
      setTlpRejectAnak(response.data.tlpRejectAnak);
    }
  };

  const deleteRejectChild = async (id) => {
    try {
      setLoading(true);
      // Delete Reject Child
      await axios.post(`${tempUrl}/deleteAnakReject/${id}/${idRejectChild}`, {
        id: user._id,
        token: user.token
      });
      setNoKKRejectAnak("");
      setNoKTPRejectAnak("");
      setNamaRejectAnak("");
      setTlpRejectAnak("");
      setLoading(false);
      navigate(`/daftarReject/reject/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(`/daftarReject/reject/${id}`)}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={container}>
        <Typography color="#757575">Penjualan</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Terkait Reject
        </Typography>
        <Box sx={deleteButtonContainer}>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{`Hapus Data`}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {`Yakin ingin menghapus data ${namaRejectAnak}?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => deleteRejectChild(id)}>Ok</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
          <ButtonGroup variant="contained">
            <Button
              color="primary"
              startIcon={<EditIcon />}
              sx={{ textTransform: "none" }}
              onClick={() => {
                navigate(`/daftarReject/reject/${id}/${idRejectChild}/edit`);
              }}
            >
              Ubah
            </Button>
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              sx={{ textTransform: "none" }}
              onClick={handleClickOpen}
            >
              Hapus
            </Button>
          </ButtonGroup>
        </Box>
        <Divider sx={dividerStyle} />
        <Box sx={[textFieldContainer, spacingTop]}>
          <Box sx={textFieldWrapper}>
            <Typography sx={labelInput}>Nama Reject</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={namaRejectAnak}
            />
            <Typography sx={[labelInput, spacingTop]}>Telepon</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tlpRejectAnak}
            />
            <Typography sx={[labelInput, spacingTop]}>No. KK Reject</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={noKKRejectAnak}
            />
            <Typography sx={[labelInput, spacingTop]}>
              No. KTP Reject
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={noKTPRejectAnak}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TampilRejectChild;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const deleteButtonContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const dividerStyle = {
  pt: 4
};

const textFieldContainer = {
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const textFieldWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const spacingTop = {
  mt: 4
};
