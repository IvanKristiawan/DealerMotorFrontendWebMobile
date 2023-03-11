import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import SaveIcon from "@mui/icons-material/Save";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const TambahGroupCOA = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeJenisCOA, setKodeJenisCOA] = useState("");
  const [namaJenisCOA, setNamaJenisCOA] = useState("");
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");
  const [namaGroupCOA, setNamaGroupCOA] = useState("");
  const [jenisCOAsData, setJenisCOAsData] = useState([]);

  const [validated, setValidated] = useState(false);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getJenisCOAsData();
  }, []);

  const getJenisCOAsData = async () => {
    setLoading(true);
    const allJenisCOAs = await axios.post(`${tempUrl}/jenisCOAs`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setJenisCOAsData(allJenisCOAs.data);
    setKodeJenisCOA(allJenisCOAs.data[0].kodeJenisCOA);
    setNamaJenisCOA(allJenisCOAs.data[0].namaJenisCOA);
    setKodeGroupCOA(getGroupCOAsNextKode(allJenisCOAs.data[0].kodeJenisCOA));
    setLoading(false);
  };

  const getGroupCOAsNextKode = async (kodeJenisCOA) => {
    const groupCOAsNextKode = await axios.post(`${tempUrl}/groupCOAsNextKode`, {
      kodeJenisCOA,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setKodeGroupCOA(groupCOAsNextKode.data);
  };

  const saveGroupCOA = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailValidation =
      kodeJenisCOA.length === 0 || namaGroupCOA.length === 0;
    if (isFailValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveGroupCOA`, {
          kodeJenisCOA,
          namaJenisCOA,
          namaGroupCOA,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/groupCOA");
      } catch (error) {
        console.log(error);
      }
    }
    setValidated(true);
  };

  const jenisCOAOptions = jenisCOAsData.map((groupCOA) => ({
    label: `${groupCOA.kodeJenisCOA} - ${groupCOA.namaJenisCOA}`
  }));

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Group COA
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
      <Form noValidate validated={validated} onSubmit={saveGroupCOA}>
        <Box sx={showDataContainer}>
        <Row>
          <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                    Kode Jenis COA
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      onChange={(e) => {
                        setKodeJenisCOA(e.target.value.split(" ", 1)[0]);
                        setNamaJenisCOA(e.target.value.split("- ")[1]);
                        getGroupCOAsNextKode(e.target.value.split(" ", 1)[0]);
                      }}
                    >
                    {
                      jenisCOAOptions.map((jenisCOAOptions) => {
                          return (<option value={jenisCOAOptions.label}>{jenisCOAOptions.label}</option>)
                      })
                    }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                    Kode Jenis COA harus diisi!
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
                    Kode Group COA
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={kodeGroupCOA}
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
                  Nama Group COA
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={namaGroupCOA}
                      onChange={(e) => setNamaGroupCOA(e.target.value.toUpperCase())}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                    Nama Group COA harus diisi!
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
          </Row>
          {/* <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Kode Jenis COA</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={jenisCOAOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kodeJenisCOA.length === 0 && true}
                  helperText={
                    error &&
                    kodeJenisCOA.length === 0 &&
                    "Kode Jenis harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => {
                setKodeJenisCOA(value.split(" ", 1)[0]);
                setNamaJenisCOA(value.split("- ")[1]);
                getGroupCOAsNextKode(value.split(" ", 1)[0]);
              }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Kode Group COA
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              value={kodeGroupCOA}
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Nama Group COA
            </Typography>
            <TextField
              size="small"
              error={error && namaGroupCOA.length === 0 && true}
              helperText={
                error && namaGroupCOA.length === 0 && "Nama Group harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaGroupCOA}
              onChange={(e) => setNamaGroupCOA(e.target.value.toUpperCase())}
            />
          </Box> */}
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/groupCOA")}
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

export default TambahGroupCOA;

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
