import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import SaveIcon from "@mui/icons-material/Save";

const UbahReject = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [tglReject, setTglReject] = useState(new Date());
  const [alamatReject, setAlamatReject] = useState("");
  const [noKKReject, setNoKKReject] = useState("");
  const [noKTPReject, setNoKTPReject] = useState("");
  const [nopolReject, setNopolReject] = useState("");
  const [namaReject, setNamaReject] = useState("");
  const [tlpReject, setTlpReject] = useState("");
  const [catatanReject, setCatatanReject] = useState("");
  const [kodeMarketing, setKodeMarketing] = useState("");
  const [kodeMarketingLama, setKodeMarketingLama] = useState("");
  const [kodeSurveyor, setKodeSurveyor] = useState("");
  const [kodeSurveyorLama, setKodeSurveyorLama] = useState("");
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
    getRejectById();
    getMarketing();
    getSurveyor();
  }, []);

  const getRejectById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/rejects/${id}`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Data Register/Pembeli
      setTglReject(response.data.tglReject);
      setAlamatReject(response.data.alamatReject);
      setNoKKReject(response.data.noKKReject);
      setNoKTPReject(response.data.noKTPReject);
      setNopolReject(response.data.nopolReject);
      setNamaReject(response.data.namaReject);
      setTlpReject(response.data.tlpReject);
      setCatatanReject(response.data.catatanReject);
      setKodeMarketing(response.data.kodeMarketing.kodeMarketing);
      setKodeMarketingLama(response.data.kodeMarketing.kodeMarketing);
      setKodeSurveyor(response.data.kodeSurveyor.kodeSurveyor);
      setKodeSurveyorLama(response.data.kodeSurveyor.kodeSurveyor);
    }
  };

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

  const updateReject = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
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
        const tempMarketing = await axios.post(`${tempUrl}/marketingByKode`, {
          kodeMarketing: kodeMarketing.split(" -", 1)[0],
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        const tempSurveyor = await axios.post(`${tempUrl}/surveyorByKode`, {
          kodeSurveyor: kodeSurveyor.split(" -", 1)[0],
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        await axios.post(`${tempUrl}/updateReject/${id}`, {
          kodeMarketing: tempMarketing.data._id,
          kodeSurveyor: tempSurveyor.data._id,
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
        Ubah Reject
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Tanggal Reject</Typography>
            <TextField
              size="small"
              error={error && tglReject.length === 0 && true}
              helperText={
                error && tglReject.length === 0 && "Tanggal Reject harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={tglReject}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
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
              onInputChange={(e, value) => setKodeMarketing(value)}
              inputValue={kodeMarketing}
              onChange={(e, value) => setKodeMarketingLama(value)}
              value={kodeMarketingLama}
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
              onInputChange={(e, value) => setKodeSurveyor(value)}
              inputValue={kodeSurveyor}
              onChange={(e, value) => setKodeSurveyorLama(value)}
              value={kodeSurveyorLama}
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
            onClick={updateReject}
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

export default UbahReject;

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
