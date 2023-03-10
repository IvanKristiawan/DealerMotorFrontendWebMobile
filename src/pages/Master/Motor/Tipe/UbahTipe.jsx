import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl } from "../../../../contexts/ContextProvider";
import { Colors } from "../../../../constants/styles";
import { Loader } from "../../../../components";
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
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import EditIcon from "@mui/icons-material/Edit";

const UbahTipe = () => {
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
    getTipeById();
  }, []);

  const getTipeById = async () => {
    setLoading(true);
    const pickedTipe = await axios.post(`${tempUrl}/tipes/${id}`, {
      id: user._id,
      token: user.token
    });
    setKodeTipe(pickedTipe.data.kodeTipe);
    setNamaTipe(pickedTipe.data.namaTipe);
    setNoRangka(pickedTipe.data.noRangka);
    setNoMesin(pickedTipe.data.noMesin);
    setIsi(pickedTipe.data.isi);
    setMerk(pickedTipe.data.merk);
    setLoading(false);
  };

  const updateTipe = async (e) => {
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
        setLoading(true);
        await axios.post(`${tempUrl}/updateTipe/${id}`, {
          namaTipe,
          isi,
          merk,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate(`/tipe/${id}`);
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
        Ubah Tipe
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Form noValidate validated={validated} onSubmit={updateTipe}>
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
                      disabled
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
                      disabled
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
                      disabled
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
            <Typography sx={labelInput}>Kode</Typography>
            <TextField
              size="small"
              error={error && kodeTipe.length === 0 && true}
              helperText={error && kodeTipe.length === 0 && "Kode harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={kodeTipe}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
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
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>No. Mesin</Typography>
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

export default UbahTipe;

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
