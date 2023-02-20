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
  DialogContent,
  DialogContentText,
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

const TambahSuratPemberitahuan = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  var date = new Date();

  const [juals, setJuals] = useState([]);
  const [noJual, setNoJual] = useState("");
  const [namaRegister, setNamaRegister] = useState("");
  const [almRegister, setAlmRegister] = useState("");
  const [tglAng, setTglAng] = useState("");
  const [tenor, setTenor] = useState("");
  const [bulan, setBulan] = useState("");
  const [sisaBulan, setSisaBulan] = useState("");
  const [inputTglSp, setInputTglSp] = useState(date);
  const [spKe, setSpKe] = useState("");

  const [kodeKolektor, setKodeKolektor] = useState("");
  const [tipe, setTipe] = useState("");
  const [noRangka, setNoRangka] = useState("");
  const [tahun, setTahun] = useState("");
  const [namaWarna, setNamaWarna] = useState("");
  const [nopol, setNopol] = useState("");
  const [tglMdTerakhir, setTglMdTerakhir] = useState("");
  const [tglJatuhTempo, setTglJatuhTempo] = useState("");
  const [kolektors, setKolektors] = useState([]);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTermJual, setSearchTermJual] = useState("");
  const [openJual, setOpenJual] = useState(false);
  const [openMd, setOpenMd] = useState(false);
  const [openJt, setOpenJt] = useState(false);
  const [openSpLebih, setOpenSpLebih] = useState(false);

  const classes = useStyles();

  const handleClickOpenJual = () => {
    setOpenJual(true);
  };

  const handleCloseJual = () => {
    setOpenJual(false);
  };

  const handleClickOpenMd = () => {
    setOpenMd(true);
  };

  const handleCloseMd = () => {
    setOpenMd(false);
  };

  const handleClickOpenJt = () => {
    setOpenJt(true);
  };

  const handleCloseJt = () => {
    setOpenJt(false);
  };

  const handleClickOpenSpLebih = () => {
    setOpenSpLebih(true);
  };

  const handleCloseSpLebih = () => {
    setOpenSpLebih(false);
  };

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
    getJual();
    getKolektor();
  }, []);

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

  const saveSp = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let tglSp =
      inputTglSp.getFullYear() +
      "-" +
      (inputTglSp.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      inputTglSp.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });

    let isFailedValidation =
      noJual.length === 0 || kodeKolektor.length === 0 || inputTglSp === null;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      var tempTglSp = new Date(tglSp);
      var tempTglAng = new Date(tglAng);
      if (tempTglSp < tempTglAng) {
        handleClickOpenSpLebih();
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
            spKe,
            tglSpTerakhir: tglSp,
            kodeCabang: user.cabang._id,
            id: user._id,
            token: user.token
          });
          // Update Angsuran
          await axios.post(`${tempUrl}/saveSp`, {
            noJual,
            tglSp,
            spKe,
            kodeKolektor: tempKolektor.data._id,
            idJual: response.data._id,
            tglInput: current_date,
            jamInput: current_time,
            userInput: user.username,
            kodeCabang: user.cabang._id,
            id: user._id,
            token: user.token
          });
          setLoading(false);
          navigate("/suratPemberitahuan");
        } catch (error) {
          console.log(error);
        }
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
        Entry Surat Pemberitahuan
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>No Jual</Typography>
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
            <Typography sx={[labelInput, spacingTop]}>Nama</Typography>
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
            <Typography sx={[labelInput, spacingTop]}>Tgl. Angsuran</Typography>
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
            <Typography sx={[labelInput, spacingTop]}>
              Angs. / Bulan / Sisa
            </Typography>
            <Box sx={{ display: "flex" }}>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                InputProps={{
                  readOnly: true
                }}
                value={tenor}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                InputProps={{
                  readOnly: true
                }}
                value={bulan}
                sx={{ ml: 2, backgroundColor: Colors.grey400 }}
              />
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                InputProps={{
                  readOnly: true
                }}
                value={sisaBulan}
                sx={{ ml: 2, backgroundColor: Colors.grey400 }}
              />
            </Box>
            <Typography sx={[labelInput, spacingTop]}>Tgl. SP / Ke</Typography>
            <Box sx={{ display: "flex" }}>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={inputTglSp}
                onChange={(e) => setInputTglSp(e)}
                customInput={
                  <TextField
                    error={error && inputTglSp === null && true}
                    helperText={
                      error &&
                      inputTglSp === null &&
                      "Tgl. SP / Ke harus diisi!"
                    }
                    sx={{ width: "100%" }}
                    size="small"
                  />
                }
              />
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                InputProps={{
                  readOnly: true
                }}
                value={spKe}
                sx={{ ml: 2, backgroundColor: Colors.grey400 }}
              />
            </Box>
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Kode Kolektor</Typography>
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
            <Typography sx={[labelInput, spacingTop]}>
              Tgl. Minta Waktu Terakhir
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={tglMdTerakhir}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Tipe</Typography>
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
            <Typography sx={[labelInput, spacingTop]}>Nopol</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
              value={nopol}
            />
            <Typography sx={[labelInput, spacingTop]}>Tahun / Warna</Typography>
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
          </Box>
        </Box>

        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/suratPemberitahuan")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveSp}
            disabled={
              inputTglSp < tglMdTerakhir && inputTglSp < tglAng ? true : false
            }
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
                          setTenor(user.tenor);
                          setBulan(user.tenor - user.sisaBulan);
                          setSisaBulan(user.sisaBulan);
                          setSpKe(user.spKe + 1);
                          setTipe(user.tipe);
                          setNoRangka(user.noRangka);
                          setNamaWarna(user.namaWarna);
                          setTahun(user.tahun);
                          setNopol(user.nopol);
                          setTglMdTerakhir(user.tglMdTerakhir);
                          setTglJatuhTempo(user.tglJatuhTempo);
                          user.tglMdTerakhir.length > 0 && handleClickOpenMd();
                          date < new Date(user.tglJatuhTempo) &&
                            handleClickOpenJt();
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
      <Dialog
        open={openMd}
        onClose={handleCloseMd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Konsumen Minta Waktu`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Ada Minta Waktu ya, Tanggal ${tglMdTerakhir}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMd}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openJt}
        onClose={handleCloseJt}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Belum Jatuh Tempo`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`No. Jual ${noJual} ini blm ada yang Jatuh Tempo`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJt}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSpLebih}
        onClose={handleCloseSpLebih}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Tgl. SP Lebih Kecil dari Tgl. Angsuran`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`${inputTglSp.getFullYear()}-${
              inputTglSp.getMonth() + 1
            }-${inputTglSp.getDate()} < ${tglAng}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSpLebih}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TambahSuratPemberitahuan;

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
