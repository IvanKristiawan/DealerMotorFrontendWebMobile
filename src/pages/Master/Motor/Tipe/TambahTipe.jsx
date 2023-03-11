import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl } from "../../../../contexts/ContextProvider";
import { Colors } from "../../../../constants/styles";
import { Loader } from "../../../../components";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const TambahTipe = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeTipe, setKodeTipe] = useState("");
  const [namaTipe, setNamaTipe] = useState("");
  const [noRangka, setNoRangka] = useState("");
  const [noMesin, setNoMesin] = useState("");
  const [isi, setIsi] = useState("");
  const [merk, setMerk] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openAlertRangka, setOpenAlertRangka] = useState(false);
  const [openAlertMesin, setOpenAlertMesin] = useState(false);
  const [openAlertNama, setOpenAlertNama] = useState(false);
  const [openAlertKode, setOpenAlertKode] = useState(false);

  const [validated, setValidated] = useState(false);

  const handleClickOpenAlertRangka = () => {
    setOpenAlertRangka(true);
  };

  const handleCloseAlertRangka = () => {
    setOpenAlertRangka(false);
  };

  const handleClickOpenAlertMesin = () => {
    setOpenAlertMesin(true);
  };

  const handleCloseAlertMesin = () => {
    setOpenAlertMesin(false);
  };

  const handleClickOpenAlertNama = () => {
    setOpenAlertNama(true);
  };

  const handleCloseAlertNama = () => {
    setOpenAlertNama(false);
  };

  const handleClickOpenAlertKode = () => {
    setOpenAlertKode(true);
  };

  const handleCloseAlertKode = () => {
    setOpenAlertKode(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const saveTipe = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      kodeTipe.length === 0 || namaTipe.length === 0 || merk.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        let tempKode = await axios.post(`${tempUrl}/tipesKode`, {
          kodeTipe,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        if (tempKode.data.length > 0) {
          handleClickOpenAlertKode();
        } else {
          setLoading(true);
          await axios.post(`${tempUrl}/saveTipe`, {
            kodeTipe,
            namaTipe,
            noRangka,
            noMesin,
            isi,
            merk,
            tglInput: current_date,
            jamInput: current_time,
            userInput: user.username,
            kodeCabang: user.cabang._id,
            id: user._id,
            token: user.token
          });
          setLoading(false);
          navigate("/tipe");
        }
      } catch (error) {
        console.log(error);
      }
    }
    setValidated(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Tipe
      </Typography>
      <Dialog
        open={openAlertRangka}
        onClose={handleCloseAlertRangka}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`No Rangka Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`No Rangka ${noRangka} sudah ada, ganti No Rangka!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertRangka}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAlertMesin}
        onClose={handleCloseAlertMesin}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`No Mesin Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`No Mesin ${noMesin} sudah ada, ganti No Mesin!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertMesin}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAlertNama}
        onClose={handleCloseAlertNama}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Nama Tipe Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Nama Tipe ${namaTipe} sudah ada, ganti Nama Tipe!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertNama}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAlertKode}
        onClose={handleCloseAlertKode}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Kode Tipe Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Kode Tipe ${kodeTipe} sudah ada, ganti Kode Tipe!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertKode}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Form noValidate validated={validated} onSubmit={saveTipe}>
        <Box sx={showDataContainer}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                    Kode
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={kodeTipe}
                      required
                      onChange={(e) => setKodeTipe(e.target.value.toUpperCase())}
                    />
                    <Form.Control.Feedback type="invalid">
                    Kode harus diisi!
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                    No. Mesin
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={noMesin}
                      required
                      onChange={(e) => setNoMesin(e.target.value.toUpperCase())}
                    />
                    <Form.Control.Feedback type="invalid">
                    No. Mesin harus diisi!
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                    Nama Tipe
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={namaTipe}
                      required
                      onChange={(e) => setNamaTipe(e.target.value.toUpperCase())}
                    />
                    <Form.Control.Feedback type="invalid">
                    Nama Tipe harus diisi!
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                    Isi
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={isi}
                      onChange={(e) => setIsi(e.target.value.toUpperCase())}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                    No. Rangka
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={noRangka}
                      onChange={(e) => setNoRangka(e.target.value.toUpperCase())}
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                    Merk
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={merk}
                      required
                      onChange={(e) => setMerk(e.target.value.toUpperCase())}
                    />
                    <Form.Control.Feedback type="invalid">
                    Merk harus diisi!
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          {/* <Box sx={showDataWrapper}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Typography sx={labelInput}>Kode</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                <TextField
                  size="small"
                  error={error && kodeTipe.length === 0 && true}
                  helperText={error && kodeTipe.length === 0 && "Kode harus diisi!"}
                  id="outlined-basic"
                  variant="outlined"
                  value={kodeTipe}
                  onChange={(e) => setKodeTipe(e.target.value.toUpperCase())}
                />
              </Grid>
            </Grid>
            <Typography sx={[labelInput, spacingTop]}>Nama Tipe</Typography>
            <TextField
              size="small"
              error={error && namaTipe.length === 0 && true}
              helperText={
                error && namaTipe.length === 0 && "Nama Tipe harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaTipe}
              onChange={(e) => setNamaTipe(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>No. Rangka</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={noRangka}
              onChange={(e) => setNoRangka(e.target.value.toUpperCase())}
            /> */}
          {/* </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>No. Mesin</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={noMesin}
              onChange={(e) => setNoMesin(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Isi</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={isi}
              onChange={(e) => setIsi(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Merk</Typography>
            <TextField
              size="small"
              error={error && merk.length === 0 && true}
              helperText={error && merk.length === 0 && "Merk harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={merk}
              onChange={(e) => setMerk(e.target.value.toUpperCase())}
            />
          </Box> */}
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/tipe")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            type="submit"
          >
            Simpan
          </Button>
        </Box>
        </Form>
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

export default TambahTipe;

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
