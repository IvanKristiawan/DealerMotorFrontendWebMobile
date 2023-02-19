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
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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

const TambahSuratPenarikan = () => {
  const { user, setting } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  var date = new Date();

  const [kolektors, setKolektors] = useState([]);
  const [juals, setJuals] = useState([]);
  // Customer
  const [noSt, setNoSt] = useState(""); // I
  const [inputTglSt, setInputTglSt] = useState(date); // I
  const [noJual, setNoJual] = useState(""); // I
  const [kodeKolektor, setKodeKolektor] = useState(""); // I
  const [namaRegister, setNamaRegister] = useState("");
  const [almRegister, setAlmRegister] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [tglAng, setTglAng] = useState("");
  const [tlpRegister, setTlpRegister] = useState("");
  // Motor
  const [tipe, setTipe] = useState("");
  const [noRangka, setNoRangka] = useState("");
  const [tahun, setTahun] = useState("");
  const [namaWarna, setNamaWarna] = useState("");
  const [nopol, setNopol] = useState("");
  // Biaya
  const [tglJatuhTempo, setTglJatuhTempo] = useState("");
  const [angPerBulan, setAngPerBulan] = useState(""); // I
  const [jmlBlnTelat, setJmlBlnTelat] = useState(""); // I
  const [dendaTunggak, setDendaTunggak] = useState("");
  const [totalDenda, setTotalDenda] = useState(""); // I
  const [biayaTarik, setBiayaTarik] = useState(""); // I
  const [total, setTotal] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTermJual, setSearchTermJual] = useState("");
  const [openJual, setOpenJual] = useState(false);

  const classes = useStyles();

  const handleClickOpenJual = () => {
    setOpenJual(true);
  };

  const handleCloseJual = () => {
    setOpenJual(false);
  };

  function dhm(t) {
    var cd = 24 * 60 * 60 * 1000,
      ch = 60 * 60 * 1000,
      d = Math.floor(t / cd),
      h = Math.floor((t - d * cd) / ch),
      m = Math.round((t - d * cd - h * ch) / 60000),
      pad = function (n) {
        return n < 10 ? "0" + n : n;
      };
    if (m === 60) {
      h++;
      m = 0;
    }
    if (h === 24) {
      d++;
      h = 0;
    }
    return d;
  }

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  const kolektorOptions = kolektors.map((kolektor) => ({
    label: `${kolektor.kodeKolektor} - ${kolektor.namaKolektor}`
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const tempPostsJual = juals.filter((val) => {
    if (setSearchTermJual === "") {
      return val;
    } else if (
      val.noRegister.toUpperCase().includes(searchTermJual.toUpperCase()) ||
      val.namaRegister.toUpperCase().includes(searchTermJual.toUpperCase()) ||
      val.tglAng.toUpperCase().includes(searchTermJual.toUpperCase()) ||
      val.nopol.toUpperCase().includes(searchTermJual.toUpperCase()) ||
      val.almRegister.toUpperCase().includes(searchTermJual.toUpperCase())
    ) {
      return val;
    }
  });

  useEffect(() => {
    getStNextKode();
    getJual();
    getKolektor();
  }, []);

  const getStNextKode = async () => {
    setLoading(true);
    const nextKodeSt = await axios.post(`${tempUrl}/stsNextKode`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setNoSt(nextKodeSt.data);
    setLoading(false);
  };

  const getKolektor = async () => {
    setLoading(true);
    const allKolektors = await axios.post(`${tempUrl}/kolektors`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setKolektors(allKolektors.data);
    setLoading(false);
  };

  const getJual = async () => {
    setLoading(true);
    const allJualsForAngsuran = await axios.post(
      `${tempUrl}/jualsForAngsuran`,
      {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    setJuals(allJualsForAngsuran.data);
    setLoading(false);
  };

  const saveSt = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let tglSt =
      inputTglSt.getFullYear() +
      "-" +
      (inputTglSt.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      inputTglSt.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });

    let isFailedValidation =
      noSt.length === 0 ||
      inputTglSt === null ||
      noJual.length === 0 ||
      kodeKolektor.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        const tempKolektor = await axios.post(`${tempUrl}/kolektorByKode`, {
          kodeKolektor,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        // Find Jual
        const response = await axios.post(`${tempUrl}/jualByNoJual`, {
          noJual,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        await axios.post(`${tempUrl}/updateJual/${response.data._id}`, {
          tglStTerakhir: tglSt,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        // Update Surat Penarikan
        await axios.post(`${tempUrl}/saveSt`, {
          noSt,
          tglSt,
          noJual,
          idJual: response.data._id,
          kodeKolektor: tempKolektor.data._id,
          angPerBulan,
          jmlBlnTelat,
          totalDenda,
          biayaTarik,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/suratPenarikan");
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
      <Typography color="#757575">Piutang</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Entry Surat Penarikan
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        {/* Data Customer */}
        <Paper elevation={6} sx={mainContainer}>
          <Typography variant="h5" sx={titleStyle} color="primary">
            DATA CUSTOMER
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>No. Surat Penarikan</Typography>
              <TextField
                size="small"
                error={error && noSt.length === 0 && true}
                helperText={error && noSt.length === 0 && "No. ST harus diisi!"}
                id="outlined-basic"
                variant="outlined"
                value={noSt}
                onChange={(e) => setNoSt(e.target.value.toUpperCase())}
              />
              {user.tipeUser === "ADM" ? (
                <>
                  <Typography sx={[labelInput, spacingTop]}>
                    Tgl. Surat Penarikan
                  </Typography>
                  <TextField
                    type="date"
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    value={inputTglSt}
                    InputProps={{
                      readOnly: true
                    }}
                    sx={{ backgroundColor: Colors.grey400 }}
                  />
                </>
              ) : (
                <>
                  <Typography sx={[labelInput, spacingTop]}>
                    Tgl. Surat Penarikan
                  </Typography>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={inputTglSt}
                    onChange={(e) => {
                      setInputTglSt(e);
                      var d1 = new Date(tglJatuhTempo); //"now"
                      var d2 = new Date(e); // some date
                      var diff = Math.abs(d2 - d1); // difference in milliseconds
                      var total = dhm(diff);
                      if (d2 > d1) {
                        setDendaTunggak(total * setting.dendaSetting);
                      }
                      setJmlBlnTelat(
                        monthDiff(new Date(tglJatuhTempo), new Date(e))
                      );
                      setTotalDenda(
                        monthDiff(new Date(tglJatuhTempo), new Date(e)) *
                          angPerBulan +
                          total * setting.dendaSetting
                      );
                      setTotal(
                        setting.biayaTarikSetting +
                          monthDiff(new Date(tglJatuhTempo), new Date(e)) *
                            angPerBulan +
                          total * setting.dendaSetting
                      );
                    }}
                    customInput={
                      <TextField
                        error={error && inputTglSt === null && true}
                        helperText={
                          error &&
                          inputTglSt === null &&
                          "Tgl. Surat Penarikan harus diisi!"
                        }
                        sx={{ width: "100%" }}
                        size="small"
                      />
                    }
                  />
                </>
              )}
              <Typography sx={[labelInput, spacingTop]}>No Jual</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                error={error && noJual.length === 0 && true}
                helperText={
                  error && noJual.length === 0 && "No. Jual harus diisi!"
                }
                variant="outlined"
                value={noJual}
                InputProps={{
                  readOnly: true
                }}
                onClick={() => handleClickOpenJual()}
                placeholder="Pilih..."
              />
              <Typography sx={[labelInput, spacingTop]}>
                Kode Kolektor
              </Typography>
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                options={kolektorOptions}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    error={error && kodeKolektor.length === 0 && true}
                    helperText={
                      error &&
                      kodeKolektor.length === 0 &&
                      "Kode Kolektor harus diisi!"
                    }
                    {...params}
                  />
                )}
                onInputChange={(e, value) =>
                  setKodeKolektor(value.split(" ", 1)[0])
                }
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Nama</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={namaRegister}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>Alamat</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={almRegister}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>Kecamatan</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={kodeKecamatan}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Tgl. Angsuran
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={tglAng}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>Telepon</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={tlpRegister}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Data Motor */}
        <Paper elevation={6} sx={mainContainer}>
          <Typography variant="h5" sx={titleStyle} color="primary">
            DATA MOTOR
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
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
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Tahun / Warna</Typography>
              <Box sx={{ display: "flex" }}>
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    readOnly: true
                  }}
                  value={tahun}
                  sx={{ backgroundColor: Colors.grey400 }}
                />
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    readOnly: true
                  }}
                  value={namaWarna}
                  sx={{ ml: 2, backgroundColor: Colors.grey400 }}
                />
              </Box>
              <Typography sx={[labelInput, spacingTop]}>Nopol</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={nopol}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Data Penarikan */}
        <Paper elevation={6} sx={mainContainer}>
          <Typography variant="h5" sx={titleStyle} color="primary">
            DATA PENARIKAN
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Tgl. Jatuh Tempo</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={tglJatuhTempo}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Masa Tunggakan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={`${jmlBlnTelat} bulan`}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>Ang. / Bln</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={angPerBulan.toLocaleString()}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Denda Tunggakan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={dendaTunggak.toLocaleString()}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Jumlah Tunggakan</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={totalDenda.toLocaleString()}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>Biaya Tarik</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={biayaTarik.toLocaleString()}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>Total</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={total.toLocaleString()}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
          </Box>
        </Paper>

        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/suratPenarikan")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={saveSt}>
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
        open={openJual}
        onClose={handleCloseJual}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">{`Pilih Data Jual`}</DialogTitle>
        <DialogActions>
          <Box sx={dialogContainer}>
            <SearchBar setSearchTerm={setSearchTermJual} />
            <TableContainer component={Paper} sx={dialogWrapper}>
              <Table aria-label="simple table">
                <TableHead className={classes.root}>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      No. Jual
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Nama Register
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Tanggal</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>No. Plat</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Alamat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempPostsJual
                    .filter((val) => {
                      if (searchTermJual === "") {
                        return val;
                      } else if (
                        val.noRegister
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase()) ||
                        val.namaRegister
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase()) ||
                        val.tglAng
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase()) ||
                        val.nopol
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase()) ||
                        val.almRegister
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase())
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
                          setNoJual(user.noJual);
                          setNamaRegister(user.namaRegister);
                          setAlmRegister(user.almRegister);
                          setTglAng(user.tglJatuhTempo);
                          setKodeKecamatan(
                            `${user.kodeKecamatan.kodeKecamatan} - ${user.kodeKecamatan.namaKecamatan}`
                          );
                          setAngPerBulan(user.angPerBulan);
                          setTlpRegister(user.tlpRegister);
                          setTipe(user.tipe);
                          setNoRangka(user.noRangka);
                          setNamaWarna(user.namaWarna);
                          setTahun(user.tahun);
                          setNopol(user.nopol);
                          setTglJatuhTempo(user.tglJatuhTempo);
                          setJmlBlnTelat(
                            monthDiff(
                              new Date(user.tglJatuhTempo),
                              new Date(inputTglSt)
                            )
                          );
                          setBiayaTarik(setting.biayaTarikSetting);

                          var d1 = new Date(user.tglJatuhTempo); //"now"
                          var d2 = new Date(inputTglSt); // some date
                          var diff = Math.abs(d2 - d1); // difference in milliseconds
                          var total = dhm(diff);
                          if (d2 > d1) {
                            setDendaTunggak(total * setting.dendaSetting);
                          }

                          setTotalDenda(
                            monthDiff(
                              new Date(user.tglJatuhTempo),
                              new Date(inputTglSt)
                            ) *
                              user.angPerBulan +
                              total * setting.dendaSetting
                          );
                          setTotal(
                            setting.biayaTarikSetting +
                              monthDiff(
                                new Date(user.tglJatuhTempo),
                                new Date(inputTglSt)
                              ) *
                                user.angPerBulan +
                              total * setting.dendaSetting
                          );

                          handleCloseJual();
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.noRegister}
                        </TableCell>
                        <TableCell>
                          {user.tenor - user.bayarKe !== 0
                            ? "MASIH"
                            : "SELESAI"}
                        </TableCell>
                        <TableCell>{user.namaRegister}</TableCell>
                        <TableCell>{user.tglAng}</TableCell>
                        <TableCell>{user.nopol}</TableCell>
                        <TableCell>{user.almRegister}</TableCell>
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

export default TambahSuratPenarikan;

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

const dialogContainer = {
  display: "flex",
  flexDirection: "column",
  padding: 4,
  width: "1000px"
};

const dialogWrapper = {
  width: "100%",
  marginTop: 2
};

const titleStyle = {
  textAlign: "center",
  fontWeight: "600"
};
