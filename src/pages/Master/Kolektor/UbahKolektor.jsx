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
  Snackbar,
  Alert,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const UbahKolektor = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeKolektor, setKodeKolektor] = useState("");
  const [namaKolektor, setNamaKolektor] = useState("");
  const [teleponKolektor, setTeleponKolektor] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getKolektorById();
  }, []);

  const getKolektorById = async () => {
    setLoading(true);
    const pickedKolektor = await axios.post(`${tempUrl}/kolektors/${id}`, {
      id: user._id,
      token: user.token
    });
    setKodeKolektor(pickedKolektor.data.kodeKolektor);
    setNamaKolektor(pickedKolektor.data.namaKolektor);
    setTeleponKolektor(pickedKolektor.data.teleponKolektor);
    setLoading(false);
  };

  const updateKolektor = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation = namaKolektor.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateKolektor/${id}`, {
          namaKolektor,
          teleponKolektor,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate(`/kolektor/${id}`);
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
        Ubah Kolektor
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
      <Form noValidate validated={validated} onSubmit={updateKolektor}>
        <Box sx={showDataContainer}>
        <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                  Kode Kolektor
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={kodeKolektor}
                      disabled
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
                  Telepon
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={teleponKolektor}
                      type="number"
                      onChange={(e) => setTeleponKolektor(e.target.value.toUpperCase())}
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
                  Nama Kolektor
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={namaKolektor}
                      required
                      onChange={(e) => setNamaKolektor(e.target.value.toUpperCase())}
                    />
                    <Form.Control.Feedback type="invalid">
                    Nama Kolektor harus diisi!
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
          </Row>
          {/* <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Kode Kolektor</Typography>
            <TextField
              size="small"
              error={error && kodeKolektor.length === 0 && true}
              helperText={
                error && kodeKolektor.length === 0 && "Kode harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={kodeKolektor}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Nama Kolektor</Typography>
            <TextField
              size="small"
              error={error && namaKolektor.length === 0 && true}
              helperText={
                error &&
                namaKolektor.length === 0 &&
                "Nama Kolektor harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaKolektor}
              onChange={(e) => setNamaKolektor(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Telepon</Typography>
            <TextField
              type="number"
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={teleponKolektor}
              onChange={(e) => setTeleponKolektor(e.target.value.toUpperCase())}
            />
          </Box> */}
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/kolektor")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            type="submit"
          >
            Ubah
          </Button>
        </Box>
        </Form>
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

export default UbahKolektor;

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
