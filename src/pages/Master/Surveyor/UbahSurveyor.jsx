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
  Autocomplete,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const UbahSurveyor = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeSurveyor, setKodeSurveyor] = useState("");
  const [namaSurveyor, setNamaSurveyor] = useState("");
  const [jenisSurveyor, setJenisSurveyor] = useState("");
  const [jenisSurveyorLama, setJenisSurveyorLama] = useState("");
  const [teleponSurveyor, setTeleponSurveyor] = useState("");
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
    getSurveyorById();
  }, []);

  const getSurveyorById = async () => {
    setLoading(true);
    const pickedSurveyor = await axios.post(`${tempUrl}/surveyors/${id}`, {
      id: user._id,
      token: user.token
    });
    setKodeSurveyor(pickedSurveyor.data.kodeSurveyor);
    setNamaSurveyor(pickedSurveyor.data.namaSurveyor);
    setJenisSurveyor(pickedSurveyor.data.jenisSurveyor);
    setJenisSurveyorLama(pickedSurveyor.data.jenisSurveyor);
    setTeleponSurveyor(pickedSurveyor.data.teleponSurveyor);
    setLoading(false);
  };

  const updateSurveyor = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      namaSurveyor.length === 0 || jenisSurveyor.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateSurveyor/${id}`, {
          namaSurveyor,
          jenisSurveyor,
          teleponSurveyor,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate(`/surveyor/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
    setValidated(true);
  };

  const jenisSurveyorOption = [{ label: "CMO" }, { label: "SURVEYOR" }];

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Ubah Surveyor
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
      <Form noValidate validated={validated} onSubmit={updateSurveyor}>
        <Box sx={showDataContainer}>
        <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                  Kode Surveyor
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={kodeSurveyor}
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
                      value={teleponSurveyor}
                      type="number"
                      onChange={(e) => setTeleponSurveyor(e.target.value.toUpperCase())}
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
                  Nama Surveyor
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={namaSurveyor}
                      required
                      onChange={(e) => setNamaSurveyor(e.target.value.toUpperCase())}
                    />
                    <Form.Control.Feedback type="invalid">
                    Nama Surveyor harus diisi!
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
                    Jenis Surveyor
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      inputValue={jenisSurveyor}
                      value={jenisSurveyorLama}
                      onChange={(e) => {
                        setJenisSurveyor(e.target.value);
                        setJenisSurveyorLama(e.target.value);
                      }}
                    >
                    {
                      jenisSurveyorOption.map((jenisSurveyorOption) => {
                          return (<option value={jenisSurveyorOption.label}>{jenisSurveyorOption.label}</option>)
                      })
                    }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                    Jenis Surveyor harus diisi!
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
          </Row>
          {/* <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Kode Surveyor</Typography>
            <TextField
              size="small"
              error={error && kodeSurveyor.length === 0 && true}
              helperText={
                error && kodeSurveyor.length === 0 && "Kode harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={kodeSurveyor}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Nama Surveyor</Typography>
            <TextField
              size="small"
              error={error && namaSurveyor.length === 0 && true}
              helperText={
                error &&
                namaSurveyor.length === 0 &&
                "Nama Surveyor harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaSurveyor}
              onChange={(e) => setNamaSurveyor(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Telepon</Typography>
            <TextField
              type="number"
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={teleponSurveyor}
              onChange={(e) => setTeleponSurveyor(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Jenis Surveyor
            </Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={jenisSurveyorOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && jenisSurveyor.length === 0 && true}
                  helperText={
                    error && jenisSurveyor.length === 0 && "Jenis harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setJenisSurveyor(value)}
              inputValue={jenisSurveyor}
              onChange={(e, value) => setJenisSurveyorLama(value)}
              value={jenisSurveyorLama}
            />
          </Box> */}
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/surveyor")}
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

export default UbahSurveyor;

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
