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

const TambahKasKeluar = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [noBukti, setNoBukti] = useState("");
  const [inputTglKasKeluar, setInputTglKasKeluar] = useState(
    new Date(user.periode.periodeAwal)
  );
  const [kodeCOA, setKodeCOA] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [minDate, setMinDate] = useState(new Date(user.periode.periodeAwal));

  const [openCOA, setOpenCOA] = useState(false);
  const [searchTermCOA, setSearchTermCOA] = useState("");
  const [error, setError] = useState(false);
  const [COAsData, setCOAsData] = useState([]);
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
    findDefaultDate();
    getNextKodeKasKeluar();
    getCOAsData();
  }, []);

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
      setInputTglKasKeluar(new Date());
    }
  };

  const getNextKodeKasKeluar = async () => {
    setLoading(true);
    const nextKodeKasMasuk = await axios.post(`${tempUrl}/kasKeluarsNextKode`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setNoBukti(nextKodeKasMasuk.data);
    setLoading(false);
  };

  const getCOAsData = async () => {
    setLoading(true);
    const allCOAs = await axios.post(`${tempUrl}/COAsKas`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setCOAsData(allCOAs.data);
    setLoading(false);
  };

  const saveKasKeluar = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let tglKasKeluar =
      inputTglKasKeluar?.getFullYear() +
      "-" +
      (inputTglKasKeluar?.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      inputTglKasKeluar?.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });

    let isFailedValidation = inputTglKasKeluar === null || kodeCOA.length === 0;
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
        await axios.post(`${tempUrl}/saveKasKeluar`, {
          tglKasKeluar,
          COA: tempCOA.data._id,
          keterangan,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/daftarKasKeluar");
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
      <Typography color="#757575">Finance</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Kas Keluar
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={textFieldContainer}>
          <Box sx={textFieldWrapper}>
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
            <Typography sx={[labelInput, spacingTop]}>No. Bukti</Typography>
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
            <Typography sx={[labelInput, spacingTop]}>Tanggal</Typography>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              minDate={minDate}
              maxDate={new Date(user.periode.periodeAkhir)}
              selected={inputTglKasKeluar}
              onChange={(e) => setInputTglKasKeluar(e)}
              customInput={
                <TextField
                  error={error && inputTglKasKeluar === null && true}
                  helperText={
                    error &&
                    inputTglKasKeluar === null &&
                    "Tanggal harus diisi!"
                  }
                  sx={{ width: "100%" }}
                  size="small"
                />
              }
            />
          </Box>
          <Box sx={[textFieldWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Keterangan</Typography>
            <TextareaAutosize
              maxRows={1}
              aria-label="maximum height"
              style={{ height: 230 }}
              value={keterangan}
              onChange={(e) => {
                setKeterangan(e.target.value.toUpperCase());
              }}
            />
          </Box>
        </Box>
        <Box sx={textFieldStyle}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/daftarKasKeluar")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveKasKeluar}
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

export default TambahKasKeluar;

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
