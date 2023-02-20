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
  Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahPekerjaan = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodePekerjaan, setKodePekerjaan] = useState("");
  const [namaPekerjaan, setNamaPekerjaan] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getPekerjaanById();
  }, []);

  const getPekerjaanById = async () => {
    setLoading(true);
    const allPekerjaans = await axios.post(`${tempUrl}/pekerjaans/${id}`, {
      id: user._id,
      token: user.token
    });
    setKodePekerjaan(allPekerjaans.data.kodePekerjaan);
    setNamaPekerjaan(allPekerjaans.data.namaPekerjaan);
    setLoading(false);
  };

  const updatePekerjaan = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      kodePekerjaan.length === 0 || namaPekerjaan.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updatePekerjaan/${id}`, {
          namaPekerjaan,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate(`/pekerjaan/${id}`);
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
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Ubah Pekerjaan
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={showDataContainer}>
        <Box sx={showDataWrapper}>
          <Typography sx={labelInput}>Kode Pekerjaan</Typography>
          <TextField
            size="small"
            error={error && kodePekerjaan.length === 0 && true}
            helperText={
              error && kodePekerjaan.length === 0 && "Kode harus diisi!"
            }
            id="outlined-basic"
            variant="outlined"
            value={kodePekerjaan}
            InputProps={{
              readOnly: true
            }}
            sx={{ backgroundColor: Colors.grey400 }}
          />
          <Typography sx={[labelInput, spacingTop]}>Nama Pekerjaan</Typography>
          <TextField
            size="small"
            error={error && namaPekerjaan.length === 0 && true}
            helperText={
              error &&
              namaPekerjaan.length === 0 &&
              "Nama Pekerjaan harus diisi!"
            }
            id="outlined-basic"
            variant="outlined"
            value={namaPekerjaan}
            onChange={(e) => setNamaPekerjaan(e.target.value.toUpperCase())}
          />
        </Box>
      </Box>
      <Box sx={spacingTop}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/pekerjaan")}
          sx={{ marginRight: 2 }}
        >
          {"< Kembali"}
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={updatePekerjaan}
        >
          Ubah
        </Button>
      </Box>
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

export default UbahPekerjaan;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};
