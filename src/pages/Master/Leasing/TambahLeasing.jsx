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
  Paper
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const TambahLeasing = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeLeasing, setKodeLeasing] = useState("");
  const [namaLeasing, setNamaLeasing] = useState("");
  const [alamatLeasing, setAlamatLeasing] = useState("");
  const [teleponLeasing, setTeleponLeasing] = useState("");
  const [picLeasing, setPicLeasing] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getNextKodeLeasing();
  }, []);

  const getNextKodeLeasing = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/leasingsNextKode`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setKodeLeasing(response.data);
    setLoading(false);
  };

  const saveLeasing = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      namaLeasing.length === 0 || picLeasing.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveLeasing`, {
          namaLeasing,
          alamatLeasing,
          teleponLeasing,
          picLeasing,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/leasing");
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
        Tambah Leasing
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
      <Form noValidate validated={validated} onSubmit={saveLeasing}>
        <Box sx={showDataContainer}>
        <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                  Kode Leasing
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={kodeLeasing}
                      disabled
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
                  Telepon
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={teleponLeasing}
                      type="number"
                      onChange={(e) => setTeleponLeasing(e.target.value.toUpperCase())}
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
                  Nama Leasing
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={namaLeasing}
                      required
                      onChange={(e) => setNamaLeasing(e.target.value.toUpperCase())}
                    />
                    <Form.Control.Feedback type="invalid">
                    Nama Leasing harus diisi!
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
                  PIC
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={picLeasing}
                      onChange={(e) => setPicLeasing(e.target.value.toUpperCase())}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                    PIC Leasing harus diisi!
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
                  Alamat
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={alamatLeasing}
                      onChange={(e) => setAlamatLeasing(e.target.value.toUpperCase())}
                    />
                  </Col>
                </Form.Group>
              </Col>
          </Row>
          {/* <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Kode Leasing</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={kodeLeasing}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Nama Leasing</Typography>
            <TextField
              size="small"
              error={error && namaLeasing.length === 0 && true}
              helperText={
                error && namaLeasing.length === 0 && "Nama Leasing harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaLeasing}
              onChange={(e) => setNamaLeasing(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Alamat</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={alamatLeasing}
              onChange={(e) => setAlamatLeasing(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Telepon</Typography>
            <TextField
              type="number"
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={teleponLeasing}
              onChange={(e) => setTeleponLeasing(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>PIC</Typography>
            <TextField
              size="small"
              error={error && picLeasing.length === 0 && true}
              helperText={
                error && picLeasing.length === 0 && "PIC Cabang harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={picLeasing}
              onChange={(e) => setPicLeasing(e.target.value.toUpperCase())}
            />
          </Box> */}
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/leasing")}
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

export default TambahLeasing;

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
  // display: "flex",
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
