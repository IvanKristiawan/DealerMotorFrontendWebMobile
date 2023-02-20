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
  Paper,
  Autocomplete,
  TextareaAutosize
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SaveIcon from "@mui/icons-material/Save";

const TambahReject = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [tglReject, setTglReject] = useState(new Date());
  const [alamatReject, setAlamatReject] = useState("");
  const [noKKReject, setNoKKReject] = useState("");
  const [noKTPReject, setNoKTPReject] = useState("");
  const [nopolReject, setNopolReject] = useState("");
  const [tlpReject, setTlpReject] = useState("");
  const [namaReject, setNamaReject] = useState("");
  const [catatanReject, setCatatanReject] = useState("");
  const [kodeMarketing, setKodeMarketing] = useState("");
  const [kodeSurveyor, setKodeSurveyor] = useState("");
  const [marketings, setMarketings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const marketingOptions = marketings.map((marketing) => ({
    label: `${marketing.kodeMarketing} - ${marketing.namaMarketing}`
  }));

  const surveyorOptions = surveyors.map((surveyor) => ({
    label: `${surveyor.kodeSurveyor} - ${surveyor.namaSurveyor}`
  }));

  useEffect(() => {
    getMarketing();
    getSurveyor();
  }, []);

  const getMarketing = async () => {
    setLoading(true);
    const allMarketings = await axios.post(`${tempUrl}/marketings`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setMarketings(allMarketings.data);
    setLoading(false);
  };

  const getSurveyor = async () => {
    setLoading(true);
    const allSurveyors = await axios.post(`${tempUrl}/surveyors`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setSurveyors(allSurveyors.data);
    setLoading(false);
  };

  const saveReject = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      tglReject.length === 0 ||
      alamatReject.length === 0 ||
      noKKReject.length === 0 ||
      noKTPReject.length === 0 ||
      nopolReject.length === 0 ||
      tlpReject.length === 0 ||
      kodeMarketing.length === 0 ||
      kodeSurveyor.length === 0 ||
      namaReject.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        let tempTglReject =
          tglReject.getFullYear() +
          "-" +
          (tglReject.getMonth() + 1).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false
          }) +
          "-" +
          tglReject.getDate().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false
          });
        const tempMarketing = await axios.post(`${tempUrl}/marketingByKode`, {
          kodeMarketing,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        const tempSurveyor = await axios.post(`${tempUrl}/surveyorByKode`, {
          kodeSurveyor,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        await axios.post(`${tempUrl}/saveReject`, {
          kodeMarketing: tempMarketing.data._id,
          kodeSurveyor: tempSurveyor.data._id,
          tglReject: tempTglReject,
          alamatReject,
          noKKReject,
          noKTPReject,
          nopolReject,
          namaReject,
          tlpReject,
          catatanReject,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/daftarReject");
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
        Tambah Reject
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Tanggal Reject</Typography>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={tglReject}
              onChange={(e) => setTglReject(e)}
              customInput={
                <TextField
                  error={error && tglReject === null && true}
                  helperText={
                    error && tglReject === null && "Tanggal Reject harus diisi!"
                  }
                  sx={{ width: "100%" }}
                  size="small"
                />
              }
            />
            <Typography sx={[labelInput, spacingTop]}>Nama</Typography>
            <TextField
              size="small"
              error={error && namaReject.length === 0 && true}
              helperText={
                error && namaReject.length === 0 && "Nama harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaReject}
              onChange={(e) => setNamaReject(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Alamat</Typography>
            <TextField
              size="small"
              error={error && alamatReject.length === 0 && true}
              helperText={
                error && alamatReject.length === 0 && "Alamat harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={alamatReject}
              onChange={(e) => setAlamatReject(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>No. KK</Typography>
            <TextField
              size="small"
              error={error && noKKReject.length === 0 && true}
              helperText={
                error && noKKReject.length === 0 && "No. KK harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={noKKReject}
              onChange={(e) => setNoKKReject(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>No. KTP</Typography>
            <TextField
              size="small"
              error={error && noKTPReject.length === 0 && true}
              helperText={
                error && noKTPReject.length === 0 && "No. KTP harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={noKTPReject}
              onChange={(e) => setNoKTPReject(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Nopol</Typography>
            <TextField
              size="small"
              error={error && nopolReject.length === 0 && true}
              helperText={
                error && nopolReject.length === 0 && "Nopol harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={nopolReject}
              onChange={(e) => setNopolReject(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Telepon</Typography>
            <TextField
              type="number"
              size="small"
              error={error && tlpReject.length === 0 && true}
              helperText={
                error && tlpReject.length === 0 && "Telepon harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={tlpReject}
              onChange={(e) => setTlpReject(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Kode Marketing
            </Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={marketingOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kodeMarketing.length === 0 && true}
                  helperText={
                    error &&
                    kodeMarketing.length === 0 &&
                    "Kode Marketing harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) =>
                setKodeMarketing(value.split(" ", 1)[0])
              }
            />
            <Typography sx={[labelInput, spacingTop]}>Kode Surveyor</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={surveyorOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kodeSurveyor.length === 0 && true}
                  helperText={
                    error &&
                    kodeSurveyor.length === 0 &&
                    "Kode Surveyor harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) =>
                setKodeSurveyor(value.split(" ", 1)[0])
              }
            />
            <Typography sx={[labelInput, spacingTop]}>Catatan</Typography>
            <TextareaAutosize
              maxRows={1}
              aria-label="maximum height"
              style={{ height: 180 }}
              value={catatanReject}
              onChange={(e) => {
                setCatatanReject(e.target.value.toUpperCase());
              }}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/daftarReject")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveReject}
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

export default TambahReject;

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
