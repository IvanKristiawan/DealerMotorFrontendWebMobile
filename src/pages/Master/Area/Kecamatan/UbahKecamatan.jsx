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
  Autocomplete,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const UbahKecamatan = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeWilayah, setKodeWilayah] = useState("");
  const [kodeWilayahLama, setKodeWilayahLama] = useState("");
  const [namaKecamatan, setNamaKecamatan] = useState("");
  const [wilayahsData, setWilayahsData] = useState([]);
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
    getKecamatanById();
    getWilayahsData();
  }, []);

  const getWilayahsData = async () => {
    setLoading(true);
    const allWilayahs = await axios.post(`${tempUrl}/wilayahs`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setWilayahsData(allWilayahs.data);
    setLoading(false);
  };

  const getKecamatanById = async () => {
    setLoading(true);
    const pickedKecamatan = await axios.post(`${tempUrl}/kecamatans/${id}`, {
      id: user._id,
      token: user.token
    });
    setKodeWilayah(
      `${pickedKecamatan.data.kodeWilayah} - ${pickedKecamatan.data.namaWilayah}`
    );
    setKodeWilayahLama(
      `${pickedKecamatan.data.kodeWilayah} - ${pickedKecamatan.data.namaWilayah}`
    );
    setNamaKecamatan(pickedKecamatan.data.namaKecamatan);
    setLoading(false);
  };

  const updateKecamatan = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailValidation =
      kodeWilayah.length === 0 || namaKecamatan.length === 0;
    if (isFailValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateKecamatan/${id}`, {
          kodeWilayah: kodeWilayah.split(" ", 1)[0],
          namaWilayah: kodeWilayah.split("- ")[1],
          namaKecamatan,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate(`/kecamatan/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
    setValidated(true);
  };

  const wilayahOptions = wilayahsData.map((wil) => ({
    label: `${wil.kodeWilayah} - ${wil.namaWilayah}`
  }));

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Ubah Kecamatan
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
      <Form noValidate validated={validated} onSubmit={updateKecamatan}>
        <Box sx={showDataContainer}>
          <Row>
          <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                    Kode Wilayah
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      inputValue={kodeWilayah}
                      value={kodeWilayahLama}
                      onChange={(e) => {
                        setKodeWilayah(e.target.value.toUpperCase());
                        setKodeWilayahLama(kodeWilayahLama.toUpperCase());
                      }}
                    >
                    {
                      wilayahOptions.map((wilayahOptions) => {
                          return (<option key={wilayahOptions.id} value={wilayahOptions.label}>{wilayahOptions.label}</option>)
                      })
                    }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                    Kode Wilayah harus diisi!
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
                    Nama Kecamatan
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={namaKecamatan}
                      onChange={(e) => setNamaKecamatan(e.target.value.toUpperCase())}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                    Nama Wilayah harus diisi!
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
          </Row> 
          {/* <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Kode Wilayah</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={wilayahOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kodeWilayah.length === 0 && true}
                  helperText={
                    error &&
                    kodeWilayah.length === 0 &&
                    "Kode Wilayah harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setKodeWilayah(value)}
              inputValue={kodeWilayah}
              onChange={(e, value) => setKodeWilayahLama(value)}
              value={kodeWilayahLama}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Nama Kecamatan
            </Typography>
            <TextField
              size="small"
              error={error && namaKecamatan.length === 0 && true}
              helperText={
                error &&
                namaKecamatan.length === 0 &&
                "Nama Kecamatan harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaKecamatan}
              onChange={(e) => setNamaKecamatan(e.target.value.toUpperCase())}
            />
          </Box> */}
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/kecamatan")}
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

export default UbahKecamatan;

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
