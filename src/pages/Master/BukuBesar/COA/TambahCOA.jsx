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
  Paper,
  Autocomplete
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const TambahCOA = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeCOA, setKodeCOA] = useState("");
  const [namaCOA, setNamaCOA] = useState("");
  const [jenisSaldo, setJenisSaldo] = useState("");
  const [kasBank, setKasBank] = useState("");
  const [kodeJenisCOA, setKodeJenisCOA] = useState("");
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");
  const [kodeSubGroupCOA, setKodeSubGroupCOA] = useState("");
  const [jenisCOAsData, setJenisCOAsData] = useState([]);
  const [groupCOAsData, setGroupCOAsData] = useState([]);
  const [subGroupCOAsData, setSubGroupCOAsData] = useState([]);

  const [validated, setValidated] = useState(false);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const jenisCOAOptions = jenisCOAsData.map((jenisCOA) => ({
    label: `${jenisCOA.kodeJenisCOA} - ${jenisCOA.namaJenisCOA}`
  }));

  const groupCOAOptions = groupCOAsData.map((groupCOA) => ({
    label: `${groupCOA.kodeGroupCOA} - ${groupCOA.namaGroupCOA}`
  }));

  const subGroupCOAOptions = subGroupCOAsData.map((subGroupCOA) => ({
    label: `${subGroupCOA.kodeSubGroupCOA} - ${subGroupCOA.namaSubGroupCOA}`
  }));

  const jenisSaldoOptions = [{ label: "DEBET" }, { label: "KREDIT" }];

  const kasBankOptions = [
    { label: "KAS" },
    { label: "BANK" },
    { label: "NON KAS BANK" }
  ];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getSubGroupCOAsData();
    getGroupCOAsData();
    getJenisCOAsData();
  }, []);

  const getNextKodeCOA = async (tempKodeSubGroupCOA) => {
    const nextKodeCOA = await axios.post(`${tempUrl}/COAsNextKode`, {
      kodeSubGroupCOA: tempKodeSubGroupCOA,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setKodeCOA(nextKodeCOA.data);
  };

  const getSubGroupCOAsData = async () => {
    setLoading(true);
    const allSubGroupCOAs = await axios.post(`${tempUrl}/subGroupCOAs`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setSubGroupCOAsData(allSubGroupCOAs.data);
    setKodeSubGroupCOA(allSubGroupCOAs.data[0].kodeSubGroupCOA);
    getNextKodeCOA(allSubGroupCOAs.data[0].kodeSubGroupCOA);
    setLoading(false);
  };

  const getGroupCOAsData = async () => {
    setLoading(true);
    const allGroupCOAs = await axios.post(`${tempUrl}/groupCOAs`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setGroupCOAsData(allGroupCOAs.data);
    setKodeGroupCOA(allGroupCOAs.data[0].kodeGroupCOA);
    setLoading(false);
  };

  const getJenisCOAsData = async () => {
    setLoading(true);
    const allJenisCOAs = await axios.post(`${tempUrl}/jenisCOAs`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setJenisCOAsData(allJenisCOAs.data);
    setKodeJenisCOA(allJenisCOAs.data[0].kodeJenisCOA);
    setLoading(false);
  };

  const saveTipe = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      kodeCOA.length === 0 ||
      namaCOA.length === 0 ||
      kodeJenisCOA.length === 0 ||
      kodeGroupCOA.length === 0 ||
      kodeSubGroupCOA.length === 0 ||
      jenisSaldo.length === 0 ||
      kasBank.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        let tempJenisCOA = await axios.post(`${tempUrl}/jenisCOAByKode`, {
          kodeJenisCOA,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        let tempGroupCOA = await axios.post(`${tempUrl}/groupCOAByKode`, {
          kodeGroupCOA,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        let tempSubGroupCOA = await axios.post(`${tempUrl}/subGroupCOAByKode`, {
          kodeSubGroupCOA,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(true);
        await axios.post(`${tempUrl}/saveCOA`, {
          namaCOA,
          kodeCOA,
          kodeSubGroupCOA,
          subGroupCOA: tempSubGroupCOA.data._id,
          groupCOA: tempGroupCOA.data._id,
          jenisCOA: tempJenisCOA.data._id,
          jenisSaldo,
          kasBank,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/COA");
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
        Tambah COA
      </Typography>
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
                    Kode Jenis COA
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      onChange={(e) => {
                        setKodeJenisCOA(e.target.value.split(" ", 1)[0]);
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
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                  Nama COA
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={namaCOA}
                      onChange={(e) => setNamaCOA(e.target.value.toUpperCase())}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                    Nama COA harus diisi!
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
                    <Form.Select
                      required
                      onChange={(e) => {
                        setKodeGroupCOA(e.target.value.split(" ", 1)[0]);
                      }}
                    >
                    {
                      groupCOAOptions.map((groupCOAOptions) => {
                          return (<option value={groupCOAOptions.label}>{groupCOAOptions.label}</option>)
                      })
                    }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                    Kode Group COA harus diisi!
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
                    Jenis Saldo
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      onChange={(e) => {
                        setJenisSaldo(e.target.value.split(" ", 1)[0]);
                      }}
                    >
                    {
                      jenisSaldoOptions.map((jenisSaldoOptions) => {
                          return (<option value={jenisSaldoOptions.label}>{jenisSaldoOptions.label}</option>)
                      })
                    }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                    Jenis Saldo harus diisi!
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
                    Kode Sub-Group COA
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      onChange={(e) => {
                        setKodeSubGroupCOA(e.target.value.split(" ", 1)[0]);
                        getNextKodeCOA(e.target.value.split(" ", 1)[0]);
                      }}
                    >
                    {
                      subGroupCOAOptions.map((subGroupCOAOptions) => {
                          return (<option value={subGroupCOAOptions.label}>{subGroupCOAOptions.label}</option>)
                      })
                    }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                    Kode Sub-Group COA harus diisi!
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
                    Kas/Bank
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      onChange={(e) => {
                        setKasBank(e.target.value);
                      }}
                    >
                    {
                      kasBankOptions.map((kasBankOptions) => {
                          return (<option value={kasBankOptions.label}>{kasBankOptions.label}</option>)
                      })
                    }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                    Kas/Bank harus diisi!
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
                  Kode COA
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={kodeCOA}
                      onChange={(e) => setKodeCOA(e.target.value.toUpperCase())}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                    Kode COA harus diisi!
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
              }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Kode Group COA
            </Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={groupCOAOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kodeGroupCOA.length === 0 && true}
                  helperText={
                    error &&
                    kodeGroupCOA.length === 0 &&
                    "Kode Group harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => {
                setKodeGroupCOA(value.split(" ", 1)[0]);
              }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Kode Sub Group COA
            </Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={subGroupCOAOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kodeSubGroupCOA.length === 0 && true}
                  helperText={
                    error &&
                    kodeSubGroupCOA.length === 0 &&
                    "Kode Sub Group harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => {
                setKodeSubGroupCOA(value.split(" ", 1)[0]);
                getNextKodeCOA(value.split(" ", 1)[0]);
              }}
            />
            <Typography sx={[labelInput, spacingTop]}>Kode COA</Typography>
            <TextField
              size="small"
              error={error && kodeCOA.length === 0 && true}
              helperText={error && kodeCOA.length === 0 && "Kode harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={kodeCOA}
              onChange={(e) => setKodeCOA(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Nama COA</Typography>
            <TextField
              size="small"
              error={error && namaCOA.length === 0 && true}
              helperText={
                error && namaCOA.length === 0 && "Nama COA harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaCOA}
              onChange={(e) => setNamaCOA(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Jenis Saldo</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={jenisSaldoOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && jenisSaldo.length === 0 && true}
                  helperText={
                    error &&
                    jenisSaldo.length === 0 &&
                    "Jenis Saldo harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setJenisSaldo(value)}
            />
            <Typography sx={[labelInput, spacingTop]}>Kas/Bank</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={kasBankOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kasBank.length === 0 && true}
                  helperText={
                    error && kasBank.length === 0 && "Kas/Bank harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setKasBank(value)}
            />
          </Box> */}
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/COA")}
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

export default TambahCOA;

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
