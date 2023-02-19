import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  Autocomplete,
  Paper
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahSurveyor = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeSurveyor, setKodeSurveyor] = useState("");
  const [namaSurveyor, setNamaSurveyor] = useState("");
  const [jenisSurveyor, setJenisSurveyor] = useState("");
  const [teleponSurveyor, setTeleponSurveyor] = useState("");
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
    getNextKodeSurveyor();
  }, []);

  const getNextKodeSurveyor = async () => {
    setLoading(true);
    const nextKodeSurveyor = await axios.post(`${tempUrl}/surveyorsNextKode`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setKodeSurveyor(`${user.cabang._id}${nextKodeSurveyor.data}`);
    setLoading(false);
  };

  const saveSurveyor = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      namaSurveyor.length === 0 || jenisSurveyor.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveSurveyor`, {
          namaSurveyor,
          jenisSurveyor,
          teleponSurveyor,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/surveyor");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const jenisSurveyorOption = [{ label: "CMO" }, { label: "SURVEYOR" }];

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Surveyor
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Kode Surveyor</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={kodeSurveyor}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Nama Surveyor</Typography>
            <TextField
              size="small"
              error={error && namaSurveyor.length === 0 && true}
              helperText={
                error &&
                namaSurveyor.length === 0 &&
                "Nama Surveyor harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaSurveyor}
              onChange={(e) => setNamaSurveyor(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Telepon</Typography>
            <TextField
              type="number"
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={teleponSurveyor}
              onChange={(e) => setTeleponSurveyor(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Jenis Surveyor</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={jenisSurveyorOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && jenisSurveyor.length === 0 && true}
                  helperText={
                    error && jenisSurveyor.length === 0 && "Jenis harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setJenisSurveyor(value)}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/surveyor")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveSurveyor}
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
  );
};

export default TambahSurveyor;

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

const contentContainer = {
  p: 3,
  pt: 1,
  mt: 2,
  backgroundColor: Colors.grey100
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
