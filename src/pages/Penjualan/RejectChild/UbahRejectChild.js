import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Colors } from "../../../constants/styles";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const UbahRejectChild = () => {
  const { user } = useContext(AuthContext);
  const { id, idRejectChild } = useParams();
  const navigate = useNavigate();
  const [noKKRejectAnak, setNoKKRejectAnak] = useState("");
  const [noKTPRejectAnak, setNoKTPRejectAnak] = useState("");
  const [namaRejectAnak, setNamaRejectAnak] = useState("");
  const [tlpRejectAnak, setTlpRejectAnak] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
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

  const updateRejectChild = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      noKKRejectAnak.length === 0 ||
      noKTPRejectAnak.length === 0 ||
      namaRejectAnak.length === 0 ||
      tlpRejectAnak.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateAnakReject/${idRejectChild}`, {
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
        navigate(`/daftarReject/reject/${id}/${idRejectChild}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Box sx={container}>
        <Typography color="#757575">Penjualan</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Terkait Reject
        </Typography>
        <Divider sx={dividerStyle} />
        <Paper sx={contentContainer} elevation={12}>
          <Box sx={[textFieldContainer, spacingTop]}>
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
                onChange={(e) =>
                  setNamaRejectAnak(e.target.value.toUpperCase())
                }
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
              <Typography sx={[labelInput, spacingTop]}>
                No. KK Reject
              </Typography>
              <TextField
                size="small"
                error={error && noKKRejectAnak.length === 0 && true}
                helperText={
                  error &&
                  noKKRejectAnak.length === 0 &&
                  "No. KK Reject harus diisi!"
                }
                id="outlined-basic"
                variant="outlined"
                value={noKKRejectAnak}
                onChange={(e) =>
                  setNoKKRejectAnak(e.target.value.toUpperCase())
                }
              />
              <Typography sx={[labelInput, spacingTop]}>
                No. KTP Reject
              </Typography>
              <TextField
                size="small"
                error={error && noKTPRejectAnak.length === 0 && true}
                helperText={
                  error &&
                  noKTPRejectAnak.length === 0 &&
                  "No. KTP Reject harus diisi!"
                }
                id="outlined-basic"
                variant="outlined"
                value={noKTPRejectAnak}
                onChange={(e) =>
                  setNoKTPRejectAnak(e.target.value.toUpperCase())
                }
              />
            </Box>
          </Box>
          <Box sx={spacingTop}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() =>
                navigate(`/daftarReject/reject/${id}/${idRejectChild}`)
              }
              sx={{ marginRight: 2 }}
            >
              {"< Kembali"}
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={updateRejectChild}
            >
              Simpan
            </Button>
          </Box>
        </Paper>
        <Divider sx={spacingTop} />
        {error && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={alertBox}>
              Data belum terisi semua!
            </Alert>
          </Snackbar>
        )}
      </Box>
    </>
  );
};

export default UbahRejectChild;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
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

const contentContainer = {
  p: 3,
  pt: 1,
  mt: 2,
  backgroundColor: Colors.grey100
};

const alertBox = {
  width: "100%"
};
