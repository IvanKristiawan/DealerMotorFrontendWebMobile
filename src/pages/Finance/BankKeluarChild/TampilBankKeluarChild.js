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

const TampilBankKeluarChild = () => {
  const { user } = useContext(AuthContext);
  const { id, idBankKeluarChild } = useParams();
  const navigate = useNavigate();
  const [tempIdBankKeluarChild, setTempIdBankKeluarChild] = useState("");
  const [noBukti, setNoBukti] = useState("");
  const [tglBankKeluar, setTglBankKeluar] = useState("");
  const [tglBankKeluarDate, setTglBankKeluarDate] = useState();
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
    tglBankKeluarDate?.getFullYear() === today.getFullYear() &&
    tglBankKeluarDate?.getMonth() === today.getMonth() &&
    tglBankKeluarDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getBankKeluarChildById();
  }, []);

  const getBankKeluarChildById = async () => {
    if (id) {
      const response = await axios.post(
        `${tempUrl}/bankKeluarsChild/${idBankKeluarChild}`,
        {
          id: user._id,
          token: user.token
        }
      );
      setTempIdBankKeluarChild(response.data._id);
      setNoBukti(response.data.noBukti);
      setTglBankKeluar(response.data.tglBankKeluar);
      setTglBankKeluarDate(new Date(response.data.tglBankKeluar));
      setKodeCOA(response.data.COA);
      setKeterangan(response.data.keterangan);
      setIsPost(response.data.isPost);
      setJumlah(response.data.jumlah);
    }
  };

  const deleteBankKeluarChild = async (id) => {
    try {
      setLoading(true);
      const pickedBankKeluar = await axios.post(
        `${tempUrl}/bankKeluars/${id}`,
        {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        }
      );
      let tempJumlahBankKeluar =
        parseInt(pickedBankKeluar.data.jumlah) - parseInt(jumlah);
      await axios.post(`${tempUrl}/updateBankKeluar/${id}`, {
        jumlah: tempJumlahBankKeluar,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Delete Kas Keluar
      await axios.post(
        `${tempUrl}/deleteBankKeluarChild/${tempIdBankKeluarChild}`,
        {
          id: user._id,
          token: user.token
        }
      );
      setNoBukti("");
      setTglBankKeluar("");
      setKodeCOA("");
      setKeterangan("");
      setJumlah("");
      setLoading(false);
      navigate(`/daftarBankKeluar/bankKeluar/${id}`);
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
        onClick={() => navigate(`/daftarBankKeluar/bankKeluar/${id}`)}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={container}>
        <Typography color="#757575">Finance</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Detail Bank Keluar
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
              <Button onClick={() => deleteBankKeluarChild(id)}>Ok</Button>
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
                    `/daftarBankKeluar/bankKeluar/${id}/${idBankKeluarChild}/edit`
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
              Tgl. Kas Keluar
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tglBankKeluar}
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

export default TampilBankKeluarChild;

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
