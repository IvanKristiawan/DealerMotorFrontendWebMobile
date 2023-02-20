import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { Loader, SearchBar } from "../../../components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SaveIcon from "@mui/icons-material/Save";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

const TambahBiayaPerawatan = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [noBukti, setNoBukti] = useState("");
  const [nopol, setNopol] = useState("");
  const [inputTglPerawatan, setInputTglPerawatan] = useState(
    new Date(user.periode.periodeAwal)
  );
  const [keterangan, setKeterangan] = useState("");
  const [biayaPerawatan, setBiayaPerawatan] = useState("");
  const [kodeCOA, setKodeCOA] = useState("");
  const [jenisBeli, setJenisBeli] = useState("");

  const [openCOA, setOpenCOA] = useState(false);
  const [searchTermCOA, setSearchTermCOA] = useState("");
  const [COAsData, setCOAsData] = useState([]);

  // Data Motor -> Dari Stok
  const [noRangka, setNoRangka] = useState("");
  const [noMesin, setNoMesin] = useState("");
  const [tipe, setTipe] = useState("");
  const [namaWarna, setNamaWarna] = useState("");
  const [tahun, setTahun] = useState("");
  const [minDate, setMinDate] = useState(new Date(user.periode.periodeAwal));
  const [stoks, setStoks] = useState([]);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const handleClickOpenCOA = () => {
    setOpenCOA(true);
  };

  const handleCloseCOA = () => {
    setOpenCOA(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const nopolOptions = stoks.map((stok) => ({
    label: `${stok.nopol}`
  }));

  const tempPostsCOA = COAsData.filter((val) => {
    if (searchTermCOA === "") {
      return val;
    } else if (
      val.kodeCOA.toUpperCase().includes(searchTermCOA.toUpperCase()) ||
      val.namaCOA.toUpperCase().includes(searchTermCOA.toUpperCase())
    ) {
      return val;
    }
  });

  useEffect(() => {
    getCOAsData();
    findDefaultDate();
    getStok();
    getBiayaPerawatanNextKode();
  }, []);

  const getCOAsData = async () => {
    setLoading(true);
    const allCOAs = await axios.post(`${tempUrl}/COAsKasBank`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setCOAsData(allCOAs.data);
    setLoading(false);
  };

  const findDefaultDate = async () => {
    let newPeriodeAwal = new Date(user.periode.periodeAwal);
    let newPeriodeAkhir = new Date(user.periode.periodeAkhir);
    let newToday = new Date();

    let isDateBetween =
      newToday >= newPeriodeAwal && newToday <= newPeriodeAkhir;

    if (isDateBetween) {
      // Default Date Today
      if (user.tipeUser === "ADM") {
        setMinDate(new Date());
      }
      setInputTglPerawatan(new Date());
    }
  };

  const getStoksByNopol = async (nopol) => {
    const allDaftarStoksByNopol = await axios.post(
      `${tempUrl}/daftarStoksByNopol`,
      {
        nopol,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    if (allDaftarStoksByNopol.data) {
      setNoRangka(allDaftarStoksByNopol.data.noRangka);
      setNoMesin(allDaftarStoksByNopol.data.noMesin);
      setTipe(allDaftarStoksByNopol.data.tipe);
      setNamaWarna(allDaftarStoksByNopol.data.namaWarna);
      setTahun(allDaftarStoksByNopol.data.tahun);
      setJenisBeli(allDaftarStoksByNopol.data.jenisBeli);
    }
    setNopol(nopol);
  };

  const getStok = async () => {
    setLoading(true);
    const allDaftarStokHasNopol = await axios.post(
      `${tempUrl}/daftarStoksNopolAllBlmTerjual`,
      {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    setStoks(allDaftarStokHasNopol.data);
    setLoading(false);
  };

  const getBiayaPerawatanNextKode = async () => {
    setLoading(true);
    const nextBiayaPerawatanKode = await axios.post(
      `${tempUrl}/biayaPerawatansNextKode`,
      {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    setNoBukti(nextBiayaPerawatanKode.data);
    setLoading(false);
  };

  const saveBiayaPerawatan = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let tglPerawatan =
      inputTglPerawatan?.getFullYear() +
      "-" +
      (inputTglPerawatan?.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      inputTglPerawatan?.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });

    let tempTotalBiayaPerawatan = 0;
    let isFailedValidation =
      nopol.length === 0 ||
      inputTglPerawatan === null ||
      biayaPerawatan.length === 0 ||
      kodeCOA.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        let tempCOA = await axios.post(`${tempUrl}/COAByKode`, {
          kodeCOA,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        let findDaftarStok = await axios.post(`${tempUrl}/daftarStoksByNopol`, {
          nopol,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        tempTotalBiayaPerawatan =
          parseInt(findDaftarStok.data.totalBiayaPerawatan) +
          parseInt(biayaPerawatan);
        await axios.post(
          `${tempUrl}/updateDaftarStok/${findDaftarStok.data._id}`,
          {
            totalBiayaPerawatan: tempTotalBiayaPerawatan,
            id: user._id,
            token: user.token,
            kodeCabang: user.cabang._id
          }
        );
        await axios.post(`${tempUrl}/saveBiayaPerawatan`, {
          COA: tempCOA.data._id,
          nopol,
          tglPerawatan,
          keterangan,
          biayaPerawatan,
          jenisBeli,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/biayaPerawatan");
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
      <Typography color="#757575">Perawatan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Biaya Perawatan
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        {/* Data Motor */}
        <Paper elevation={6} sx={mainContainer}>
          <Typography variant="h5" sx={titleStyle} color="primary">
            DATA MOTOR
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Nopol</Typography>
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                options={nopolOptions}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    error={error && nopol.length === 0 && true}
                    helperText={
                      error && nopol.length === 0 && "Nopol harus diisi!"
                    }
                    {...params}
                  />
                )}
                onInputChange={(e, value) => {
                  if (value) {
                    getStoksByNopol(value);
                  } else {
                    setNoRangka("");
                    setNoMesin("");
                    setTipe("");
                    setNamaWarna("");
                    setTahun("");
                    setJenisBeli("");
                  }
                }}
              />
              <Typography sx={[labelInput, spacingTop]}>No. Rangka</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={noRangka}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>No. Mesin</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={noMesin}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Tipe</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={tipe}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>Nama Warna</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={namaWarna}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Tahun Perakitan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={tahun}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Biaya Perawatan (Input) */}
        <Paper elevation={6} sx={mainContainer}>
          <Typography variant="h5" sx={titleStyle} color="primary">
            RINCIAN BIAYA PERAWATAN
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>No Bukti</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={noBukti}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Tanggal Perawatan
              </Typography>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                minDate={minDate}
                maxDate={new Date(user.periode.periodeAkhir)}
                selected={inputTglPerawatan}
                onChange={(e) => setInputTglPerawatan(e)}
                customInput={
                  <TextField
                    error={error && inputTglPerawatan === null && true}
                    helperText={
                      error &&
                      inputTglPerawatan === null &&
                      "Tanggal Perawatan harus diisi!"
                    }
                    sx={{ width: "100%" }}
                    size="small"
                  />
                }
              />
              <Typography sx={[labelInput, spacingTop]}>
                Biaya Perawatan
                {biayaPerawatan !== 0 &&
                  !isNaN(parseInt(biayaPerawatan)) &&
                  ` : Rp ${parseInt(biayaPerawatan).toLocaleString()}`}
              </Typography>
              <TextField
                type="number"
                size="small"
                id="outlined-basic"
                error={error && biayaPerawatan.length === 0 && true}
                helperText={
                  error &&
                  biayaPerawatan.length === 0 &&
                  "Biaya Perawatan harus diisi!"
                }
                variant="outlined"
                value={biayaPerawatan}
                onChange={(e) => {
                  setBiayaPerawatan(e.target.value);
                }}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Kode COA</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                error={error && kodeCOA.length === 0 && true}
                helperText={
                  error && kodeCOA.length === 0 && "Kode COA harus diisi!"
                }
                variant="outlined"
                value={kodeCOA}
                InputProps={{
                  readOnly: true
                }}
                onClick={() => handleClickOpenCOA()}
                placeholder="Pilih..."
              />
              <Typography sx={[labelInput, spacingTop]}>Keterangan</Typography>
              <TextareaAutosize
                maxRows={1}
                aria-label="maximum height"
                style={{ height: 230 }}
                value={keterangan}
                onChange={(e) => {
                  setKeterangan(e.target.value);
                }}
              />
            </Box>
          </Box>
        </Paper>

        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/biayaPerawatan")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveBiayaPerawatan}
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
      <Dialog
        open={openCOA}
        onClose={handleCloseCOA}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Pilih Data COA`}</DialogTitle>
        <DialogActions>
          <Box sx={dialogContainer}>
            <SearchBar setSearchTerm={setSearchTermCOA} />
            <TableContainer component={Paper} sx={dialogWrapper}>
              <Table aria-label="simple table">
                <TableHead className={classes.root}>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Kode COA
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Nama
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempPostsCOA
                    .filter((val) => {
                      if (searchTermCOA === "") {
                        return val;
                      } else if (
                        val.kodeCOA
                          .toUpperCase()
                          .includes(searchTermCOA.toUpperCase()) ||
                        val.namaCOA
                          .toUpperCase()
                          .includes(searchTermCOA.toUpperCase())
                      ) {
                        return val;
                      }
                    })
                    .map((user, index) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { bgcolor: Colors.grey300 },
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setKodeCOA(user.kodeCOA);
                          handleCloseCOA();
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.kodeCOA}
                        </TableCell>
                        <TableCell>{user.namaCOA}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TambahBiayaPerawatan;

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
  p: {
    sm: 0,
    md: 3
  },
  pt: {
    sm: 0,
    md: 1
  },
  mt: {
    sm: 0,
    md: 2
  },
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

const mainContainer = {
  padding: 3,
  borderRadius: "20px",
  margin: {
    sm: 0,
    md: 4
  },
  marginTop: {
    xs: 4,
    md: 0
  }
};

const titleStyle = {
  textAlign: "center",
  fontWeight: "600"
};

const dialogContainer = {
  display: "flex",
  flexDirection: "column",
  padding: 4,
  width: "800px"
};

const dialogWrapper = {
  width: "100%",
  marginTop: 2
};
