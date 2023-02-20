import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { Loader } from "../../../components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Paper
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahRejectChild = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [noKKRejectAnak, setNoKKRejectAnak] = useState("");
  const [noKTPRejectAnak, setNoKTPRejectAnak] = useState("");
  const [namaRejectAnak, setNamaRejectAnak] = useState("");
  const [tlpRejectAnak, setTlpRejectAnak] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    id && getRejectById();
  }, [id]);

  const getRejectById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/rejects/${id}`, {
        kodeCabang: user.cabang._id,
        id: user._id,
        token: user.token
      });
      setNoKKRejectAnak(response.data.noKKReject);
    }
  };

  const saveRejectChild = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      noKKRejectAnak.length === 0 ||
      noKTPRejectAnak.length === 0 ||
      tlpRejectAnak.length === 0 ||
      namaRejectAnak.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/addAnakReject/${id}`, {
          noKKRejectAnak,
          noKTPRejectAnak,
          namaRejectAnak,
          tlpRejectAnak,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate(`/daftarReject/reject/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Penjualan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Terkait Reject
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={textFieldContainer}>
          <Box sx={textFieldWrapper}>
            <Typography sx={labelInput}>Nama Reject</Typography>
            <TextField
              size="small"
              error={error && namaRejectAnak.length === 0 && true}
              helperText={
                error &&
                namaRejectAnak.length === 0 &&
                "Nama Reject harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaRejectAnak}
              onChange={(e) => setNamaRejectAnak(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Telepon</Typography>
            <TextField
              type="number"
              size="small"
              error={error && tlpRejectAnak.length === 0 && true}
              helperText={
                error && tlpRejectAnak.length === 0 && "Telepon harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={tlpRejectAnak}
              onChange={(e) => setTlpRejectAnak(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>No. KK Reject</Typography>
            <TextField
              size="small"
              error={error && noKKRejectAnak.length !== 4 && true}
              helperText={
                error &&
                noKKRejectAnak.length !== 4 &&
                "No. KK Reject harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={noKKRejectAnak}
              onChange={(e) => setNoKKRejectAnak(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>
              No. KTP Reject
            </Typography>
            <TextField
              size="small"
              error={error && noKTPRejectAnak.length !== 4 && true}
              helperText={
                error &&
                noKTPRejectAnak.length !== 4 &&
                "No. KTP Reject harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={noKTPRejectAnak}
              onChange={(e) => setNoKTPRejectAnak(e.target.value.toUpperCase())}
            />
          </Box>
        </Box>
        <Box sx={textFieldStyle}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/daftarReject/reject/${id}`)}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveRejectChild}
          >
            Simpan
          </Button>
        </Box>
      </Paper>
      <Divider sx={dividerStyle} />
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default TambahRejectChild;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
};

const textFieldContainer = {
  mt: 4,
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

const textFieldStyle = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const spacingTop = {
  mt: 4
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const contentContainer = {
  p: 3,
  pt: 1,
  mt: 2,
  backgroundColor: Colors.grey100
};
