import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { Loader } from "../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextareaAutosize
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

const TampilBankMasukChild = () => {
  const { user } = useContext(AuthContext);
  const { id, idBankMasukChild } = useParams();
  const navigate = useNavigate();
  const [tempIdBankMasukChild, setTempIdBankMasukChild] = useState("");
  const [noBukti, setNoBukti] = useState("");
  const [tglBankMasuk, setTglBankMasuk] = useState("");
  const [tglBankMasukDate, setTglBankMasukDate] = useState();
  const [kodeCOA, setKodeCOA] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isPost, setIsPost] = useState("");
  const [jumlah, setJumlah] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  let today = new Date();
  let isEditableManager = user.tipeUser !== "ADM" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADM" &&
    tglBankMasukDate?.getFullYear() === today.getFullYear() &&
    tglBankMasukDate?.getMonth() === today.getMonth() &&
    tglBankMasukDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getBankMasukChildById();
  }, []);

  const getBankMasukChildById = async () => {
    if (id) {
      const response = await axios.post(
        `${tempUrl}/bankMasuksChild/${idBankMasukChild}`,
        {
          id: user._id,
          token: user.token
        }
      );
      setTempIdBankMasukChild(response.data._id);
      setNoBukti(response.data.noBukti);
      setTglBankMasuk(response.data.tglBankMasuk);
      setTglBankMasukDate(new Date(response.data.tglBankMasuk));
      setKodeCOA(response.data.COA);
      setKeterangan(response.data.keterangan);
      setIsPost(response.data.isPost);
      setJumlah(response.data.jumlah);
    }
  };

  const deleteBankMasukChild = async (id) => {
    try {
      setLoading(true);
      const pickedBankMasuk = await axios.post(`${tempUrl}/bankMasuks/${id}`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      let tempJumlahBankMasuk =
        parseInt(pickedBankMasuk.data.jumlah) - parseInt(jumlah);
      await axios.post(`${tempUrl}/updateBankMasuk/${id}`, {
        jumlah: tempJumlahBankMasuk,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Delete Kas Masuk
      await axios.post(
        `${tempUrl}/deleteBankMasukChild/${tempIdBankMasukChild}`,
        {
          id: user._id,
          token: user.token
        }
      );
      setNoBukti("");
      setTglBankMasuk("");
      setKodeCOA("");
      setKeterangan("");
      setJumlah("");
      setLoading(false);
      navigate(`/daftarBankMasuk/bankMasuk/${id}`);
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
        onClick={() => navigate(`/daftarBankMasuk/bankMasuk/${id}`)}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={container}>
        <Typography color="#757575">Finance</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Detail Bank Masuk
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
                {`Yakin ingin menghapus data ${noBukti}?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => deleteBankMasukChild(id)}>Ok</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
          {isEditable && (
            <ButtonGroup variant="contained">
              <Button
                color="primary"
                startIcon={<EditIcon />}
                sx={{ textTransform: "none" }}
                onClick={() => {
                  navigate(
                    `/daftarBankMasuk/bankMasuk/${id}/${idBankMasukChild}/edit`
                  );
                }}
              >
                Ubah
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                sx={{ textTransform: "none" }}
                onClick={handleClickOpen}
              >
                Hapus
              </Button>
            </ButtonGroup>
          )}
        </Box>
        <Divider sx={dividerStyle} />
        <Box sx={[textFieldContainer, spacingTop]}>
          <Box sx={textFieldWrapper}>
            <Typography sx={labelInput}>No Bukti</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={noBukti}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Tgl. Kas Masuk
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tglBankMasuk}
            />
            <Typography sx={[labelInput, spacingTop]}>COA</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={`${kodeCOA.kodeCOA} - ${kodeCOA.namaCOA}`}
            />
            <Typography sx={[labelInput, spacingTop]}>Jumlah</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={jumlah.toLocaleString()}
            />
          </Box>
          <Box sx={[textFieldWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Keterangan</Typography>
            <TextareaAutosize
              maxRows={1}
              aria-label="maximum height"
              style={{ height: 360, backgroundColor: Colors.grey200 }}
              value={keterangan}
              disabled
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TampilBankMasukChild;

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

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};
