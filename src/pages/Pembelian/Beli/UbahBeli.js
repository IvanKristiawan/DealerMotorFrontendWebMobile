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
  Autocomplete,
  Snackbar,
  Alert,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahBeli = () => {
  const { user, setting } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeBeli, setKodeBeli] = useState("");
  const [tanggalBeli, setTanggalBeli] = useState("");
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [kodeSupplierLama, setKodeSupplierLama] = useState("");
  const [jumlahBeli, setJumlahBeli] = useState("");
  const [ppnBeli, setPpnBeli] = useState("");
  const [isPpnBeli, setIsPpnBeli] = useState();
  const [potongan, setPotongan] = useState(0);
  const [lama, setLama] = useState("");
  const [jenisBeli, setJenisBeli] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");
  const [error, setError] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const supplierOptions = suppliers.map((supplier) => ({
    label: `${supplier.kodeSupplier} - ${supplier.namaSupplier}`
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getSuppliersData();
    getBeliById();
  }, []);

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

  const getBeliById = async () => {
    setLoading(true);
    const pickedBeli = await axios.post(`${tempUrl}/belis/${id}`, {
      id: user._id,
      token: user.token
    });
    setKodeBeli(pickedBeli.data.noBeli);
    setTanggalBeli(pickedBeli.data.tanggalBeli);
    setJumlahBeli(pickedBeli.data.jumlahBeli);
    setKodeSupplier(pickedBeli.data.supplier.kodeSupplier);
    setKodeSupplierLama(pickedBeli.data.supplier.kodeSupplier);
    setPpnBeli(pickedBeli.data.ppnBeli);
    setIsPpnBeli(pickedBeli.data.isPpnBeli);
    setPotongan(pickedBeli.data.potongan);
    setLama(pickedBeli.data.lama);
    setJenisBeli(pickedBeli.data.jenisBeli);
    setJatuhTempo(pickedBeli.data.jatuhTempo);
    setLoading(false);
  };

  const updateBeli = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      kodeSupplier.length === 0 || jumlahBeli.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        let tempSupplier = await axios.post(`${tempUrl}/supplierByKode`, {
          kodeSupplier: kodeSupplier.split(" ", 1)[0],
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        await axios.post(`${tempUrl}/updateBeli/${id}`, {
          kodeSupplier: tempSupplier.data._id,
          jumlahBeli,
          potongan,
          lama,
          jenisBeli,
          jatuhTempo,
          ppnBeli,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate(`/daftarBeli/beli/${id}`);
      } catch (error) {
        console.log(error);
      }
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
        Ubah Beli
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
            <Typography sx={[labelInput, spacingTop]}>Jenis Motor</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={jenisBeli}
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
              id="outlined-basic"
              variant="outlined"
              value={tanggalBeli}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
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
              onInputChange={(e, value) => setKodeSupplier(value)}
              inputValue={kodeSupplier}
              onChange={(e, value) => setKodeSupplierLama(value)}
              value={kodeSupplierLama}
            />
            <Typography sx={[labelInput, spacingTop]}>Lama (Hari)</Typography>
            <TextField
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
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={jatuhTempo}
              onChange={(e) => jatuhTempoFunction(e)}
            />
          </Box>
          <Box sx={[textFieldWrapper, secondWrapper]}>
            <Box sx={[jumlahContainer, { marginTop: 0 }]}>
              <Typography sx={jumlahText}>
                Jumlah
                {jumlahBeli !== 0 &&
                  !isNaN(parseInt(jumlahBeli)) &&
                  ` : Rp ${parseInt(jumlahBeli).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                error={error && jumlahBeli.length === 0 && true}
                helperText={
                  error && jumlahBeli.length === 0 && "Jumlah harus diisi!"
                }
                id="outlined-basic"
                variant="outlined"
                value={jumlahBeli}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
            <Box sx={jumlahContainer}>
              <Typography sx={jumlahText}>
                Potongan
                {potongan !== 0 &&
                  !isNaN(parseInt(potongan)) &&
                  ` : Rp ${parseInt(potongan).toLocaleString()}`}
              </Typography>
              <TextField
                type="number"
                size="small"
                error={error && potongan.length === 0 && true}
                helperText={
                  error && potongan.length === 0 && "Potongan harus diisi!"
                }
                id="outlined-basic"
                variant="outlined"
                value={potongan}
                onChange={(e) => {
                  setPpnBeli((jumlahBeli - e.target.value) * setting.PPN);
                  setPotongan(e.target.value);
                }}
              />
            </Box>
            {isPpnBeli && (
              <Box sx={jumlahContainer}>
                <Typography sx={jumlahText}>
                  PPN
                  {ppnBeli !== 0 &&
                    !isNaN(parseInt(ppnBeli)) &&
                    ` : Rp ${parseInt(ppnBeli).toLocaleString()}`}
                </Typography>
                <TextField
                  size="small"
                  error={error && ppnBeli.length === 0 && true}
                  helperText={
                    error && ppnBeli.length === 0 && "PPN harus diisi!"
                  }
                  id="outlined-basic"
                  variant="outlined"
                  value={ppnBeli}
                  InputProps={{
                    readOnly: true
                  }}
                  sx={{ backgroundColor: Colors.grey400 }}
                />
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={textFieldStyle}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/daftarBeli/beli/${id}`)}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={updateBeli}
          >
            Ubah
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

export default UbahBeli;

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

const jumlahContainer = {
  marginTop: 2.5,
  display: "flex",
  flexDirection: "column"
};

const jumlahText = {
  fontWeight: "500",
  color: "gray"
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
