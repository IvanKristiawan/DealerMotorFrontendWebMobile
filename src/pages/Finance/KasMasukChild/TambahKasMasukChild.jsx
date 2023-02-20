import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const TambahKasMasukChild = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [noBukti, setNoBukti] = useState("");
  const [tglKasMasuk, setTglKasMasuk] = useState("");
  const [kodeCOA, setKodeCOA] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [COAsData, setCOAsData] = useState([]);
  const [searchTermCOA, setSearchTermCOA] = useState("");
  const [openCOA, setOpenCOA] = useState(false);

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
    getKasMasukChild();
    getCOAsData();
  }, []);

  const getKasMasukChild = async () => {
    setLoading(true);
    const pickedKasMasuk = await axios.post(`${tempUrl}/kasMasuks/${id}`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setNoBukti(pickedKasMasuk.data.noBukti);
    setTglKasMasuk(pickedKasMasuk.data.tglKasMasuk);
    setLoading(false);
  };

  const getCOAsData = async () => {
    setLoading(true);
    const allCOAs = await axios.post(`${tempUrl}/COAs`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setCOAsData(allCOAs.data);
    setLoading(false);
  };

  const saveKasMasukChild = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation = kodeCOA.length === 0 || jumlah.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        const pickedKasMasuk = await axios.post(`${tempUrl}/kasMasuks/${id}`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        let tempJumlahKasMasuk =
          parseInt(pickedKasMasuk.data.jumlah) + parseInt(jumlah);
        await axios.post(`${tempUrl}/updateKasMasuk/${id}`, {
          jumlah: tempJumlahKasMasuk,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        let tempCOA = await axios.post(`${tempUrl}/COAByKode`, {
          kodeCOA,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        await axios.post(`${tempUrl}/saveKasMasukChild`, {
          noBukti,
          tglKasMasuk,
          COA: tempCOA.data._id,
          keterangan,
          jumlah,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate(`/daftarKasMasuk/kasMasuk/${id}`);
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
        Detail Kas Masuk
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
              error={error && noBukti.length === 0 && true}
              helperText={
                error && noBukti.length === 0 && "No. Bukti harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={noBukti}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Tanggal</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={tglKasMasuk}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Jumlah
              {jumlah !== 0 &&
                !isNaN(parseInt(jumlah)) &&
                ` : Rp ${parseInt(jumlah).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && jumlah.length === 0 && true}
              helperText={error && jumlah.length === 0 && "Jumlah harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[textFieldWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Keterangan</Typography>
            <TextareaAutosize
              maxRows={1}
              aria-label="maximum height"
              style={{ height: 330 }}
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
            onClick={() => navigate(`/daftarKasMasuk/kasMasuk/${id}`)}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveKasMasukChild}
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

export default TambahKasMasukChild;

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
