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
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

const UbahWarna = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [namaWarna, setNamaWarna] = useState("");
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
    getWarnaById();
  }, []);

  const getWarnaById = async () => {
    setLoading(true);
    const pickedWarna = await axios.post(`${tempUrl}/warnas/${id}`, {
      id: user._id,
      token: user.token
    });
    setNamaWarna(pickedWarna.data.namaWarna);
    setLoading(false);
  };

  const updateWarna = async (e) => {
    navigate(`/warna/${id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Ubah Warna
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3">
                    Nama Warna
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={namaWarna}
                      onChange={(e) => setNamaWarna(e.target.value.toUpperCase())}
                      readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                    Nama Warna harus diisi!
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
          </Col>
          {/* <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Nama Warna</Typography>
            <TextField
              size="small"
              error={error && namaWarna.length === 0 && true}
              helperText={
                error && namaWarna.length === 0 && "Nama Warna harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaWarna}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
          </Box> */}
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/warna")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={updateWarna}
          >
            Ubah
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
    </Box>
  );
};

export default UbahWarna;

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
  display: "flex",
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
