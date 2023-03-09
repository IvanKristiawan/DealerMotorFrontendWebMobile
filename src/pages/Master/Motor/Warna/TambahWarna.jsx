import React, { useState, useContext } from "react";
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
  Divider,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper
} from "@mui/material";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import SaveIcon from "@mui/icons-material/Save";

const TambahWarna = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [namaWarna, setNamaWarna] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const saveWarna = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation = namaWarna.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        let tempNamaWarna = await axios.post(`${tempUrl}/getNamaWarna`, {
          namaWarna,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        if (tempNamaWarna.data.length > 0) {
          handleClickOpenAlert();
        } else {
          setLoading(true);
          await axios.post(`${tempUrl}/saveWarna`, {
            namaWarna,
            tglInput: current_date,
            jamInput: current_time,
            userInput: user.username,
            kodeCabang: user.cabang._id,
            id: user._id,
            token: user.token
          });
          setLoading(false);
          navigate("/warna");
        }
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
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Warna
      </Typography>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Nama Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Nama Warna ${namaWarna} sudah ada, ganti Nama Warna!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
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
              onChange={(e) => setNamaWarna(e.target.value.toUpperCase())}
            />
          </Box> */}
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
                      error={error && namaWarna.length === 0 && true}
                      onChange={(e) => setNamaWarna(e.target.value.toUpperCase())}
                    />
                  </Col>
                </Form.Group>
            </Col>
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
            startIcon={<SaveIcon />}
            onClick={saveWarna}
          >
            Simpan
          </Button>
        </Box>
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

export default TambahWarna;

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
