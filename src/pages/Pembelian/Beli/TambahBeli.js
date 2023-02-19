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
  Autocomplete,
  Snackbar,
  Alert,
  Paper
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

let getNowDate = () => {
  let date = new Date();
  return (
    date.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) +
    "-" +
    (date.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) +
    "-" +
    date.getFullYear()
  );
};

const TambahBeli = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openTgl, setOpenTgl] = useState(false);
  const [kodeBeli, setKodeBeli] = useState("");
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [jumlahBeli, setJumlahBeli] = useState(0);
  const [ppnBeli, setPpnBeli] = useState(0);
  const [potongan, setPotongan] = useState(0);
  const [lama, setLama] = useState("");
  const [jenisBeli, setJenisBeli] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");
  const [error, setError] = useState(false);
  const [errorTgl, setErrorTgl] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  let nowDate = getNowDate();
  const [tanggalBeli, setTanggalBeli] = useState(`${nowDate}`);

  const supplierOptions = suppliers.map((supplier) => ({
    label: `${supplier.kodeSupplier} - ${supplier.namaSupplier}`
  }));

  const jenisBeliOption = [{ label: "BARU" }, { label: "BEKAS" }];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleCloseTgl = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenTgl(false);
  };

  useEffect(() => {
    getSuppliersData();
    getNextKodeBeli();
  }, []);

  const getNextKodeBeli = async () => {
    setLoading(true);
    const nextKodeBeli = await axios.post(`${tempUrl}/belisNextKode`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setKodeBeli(nextKodeBeli.data);
    setLoading(false);
  };

  const getSuppliersData = async () => {
    setLoading(true);
    const allSuppliers = await axios.post(`${tempUrl}/suppliers`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setSuppliers(allSuppliers.data);
    setLoading(false);
  };

  const saveBeli = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    var dateParts = tanggalBeli.split("-");
    let tempTglBeli = new Date(
      +dateParts[2],
      dateParts[1] - 1,
      +dateParts[0] + 1
    );

    let tempDariTglInput = new Date(user.periode.periodeAwal);
    let tempSampaiTglInput = new Date(user.periode.periodeAkhir);
    let newToday = new Date();

    let isDateBetween =
      newToday >= tempDariTglInput && newToday <= tempSampaiTglInput;
    if (isDateBetween && user.tipeUser === "ADM") {
      // Default Date Today
      tempDariTglInput = new Date();
    }

    let tglAntara =
      tempTglBeli >= tempDariTglInput && tempTglBeli <= tempSampaiTglInput;

    let isFailedValidation =
      tanggalBeli.length === 0 ||
      kodeSupplier.length === 0 ||
      jenisBeli.length === 0 ||
      lama.length === 0 ||
      jatuhTempo.length === 0;

    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else if (tglAntara) {
      try {
        setLoading(true);
        let tempSupplier = await axios.post(`${tempUrl}/supplierByKode`, {
          kodeSupplier,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        await axios.post(`${tempUrl}/saveBeli`, {
          kodeSupplier: tempSupplier.data._id,
          tanggalBeli,
          jumlahBeli,
          ppnBeli,
          potongan,
          lama,
          jenisBeli,
          jatuhTempo,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/daftarBeli");
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrorTgl(true);
      setOpenTgl(!openTgl);
    }
  };

  const countDateDuration = (e, value) => {
    var splitedDay = tanggalBeli.toString().split("-", 1)[0];
    var splitedMonth = tanggalBeli.toString().split("-")[1];
    var splitedYear = tanggalBeli.toString().split("-")[2];
    var combineDate = `${splitedYear}-${splitedMonth}-${splitedDay}`;
    var tempDate = new Date(combineDate);
    var numberOfDaysToAdd =
      e.target.value !== "" ? parseInt(e.target.value) : 0;
    var result = tempDate.setDate(tempDate.getDate() + numberOfDaysToAdd);
    var finalDate = new Date(result);
    var calculatedDateResult =
      finalDate.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      (finalDate.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      finalDate.getFullYear();
    setJatuhTempo(calculatedDateResult);
    setLama(e.target.value.toUpperCase());
  };

  const jatuhTempoFunction = (e) => {
    var splitedDayTanggalBeli = tanggalBeli.toString().split("-", 1)[0];
    var splitedMonthTanggalBeli = tanggalBeli.toString().split("-")[1];
    var splitedYearTanggalBeli = tanggalBeli.toString().split("-")[2];
    var combineDateTanggalBeli = `${splitedYearTanggalBeli}-${splitedMonthTanggalBeli}-${splitedDayTanggalBeli}`;
    var tempDateTanggalBeli = new Date(combineDateTanggalBeli);
    var splitedDayInputDate = e.target.value.toString().split("-", 1)[0];
    var splitedMonthInputDate = e.target.value.toString().split("-")[1];
    var splitedYearInputDate = e.target.value.toString().split("-")[2];
    var combineDateInput = `${splitedYearInputDate}-${splitedMonthInputDate}-${splitedDayInputDate}`;
    var tempDateInput = new Date(combineDateInput);

    const diffTime = Math.abs(tempDateInput - tempDateTanggalBeli);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setLama(diffDays);
    setJatuhTempo(e.target.value.toUpperCase());
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Pembelian</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Beli
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={textFieldContainer}>
          <Box sx={textFieldWrapper}>
            <Typography sx={labelInput}>Kode Beli</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={kodeBeli}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Tanggal (hari-bulan-tahun)
            </Typography>
            <TextField
              size="small"
              error={error && tanggalBeli.length === 0 && true}
              helperText={
                error && tanggalBeli.length === 0 && "Tanggal harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={tanggalBeli}
              onChange={(e) => setTanggalBeli(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Kode Supplier</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={supplierOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kodeSupplier.length === 0 && true}
                  helperText={
                    error &&
                    kodeSupplier.length === 0 &&
                    "Kode Supplier harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) =>
                setKodeSupplier(value.split(" ", 1)[0])
              }
            />
            <Typography sx={[labelInput, spacingTop]}>Jenis Motor</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={jenisBeliOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && jenisBeli.length === 0 && true}
                  helperText={
                    error &&
                    jenisBeli.length === 0 &&
                    "Jenis Motor harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setJenisBeli(value)}
            />
            <Typography sx={[labelInput, spacingTop]}>Jumlah</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={jumlahBeli}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
          </Box>
          <Box sx={[textFieldWrapper, secondWrapper]}>
            <Typography sx={labelInput}>PPN</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={ppnBeli}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Potongan</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={potongan}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Lama (Hari)</Typography>
            <TextField
              error={error && lama.length === 0 && true}
              helperText={error && lama.length === 0 && "Lama harus diisi!"}
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={lama}
              onChange={(e, value) => countDateDuration(e, value)}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Jatuh Tempo (hari-bulan-tahun)
            </Typography>
            <TextField
              error={error && jatuhTempo.length === 0 && true}
              helperText={
                error && jatuhTempo.length === 0 && "Jatuh Tempo harus diisi!"
              }
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={jatuhTempo}
              onChange={(e) => jatuhTempoFunction(e)}
            />
          </Box>
        </Box>
        <Box sx={textFieldStyle}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/daftarBeli")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveBeli}
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
      {errorTgl && (
        <Snackbar
          open={openTgl}
          autoHideDuration={6000}
          onClose={handleCloseTgl}
        >
          <Alert onClose={handleCloseTgl} severity="error" sx={alertBox}>
            Periode yang aktif {user.periode.namaPeriode}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default TambahBeli;

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

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};
