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

const UbahSupplier = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [namaSupplier, setNamaSupplier] = useState("");
  const [alamatSupplier, setAlamatSupplier] = useState("");
  const [kotaSupplier, setKotaSupplier] = useState("");
  const [teleponSupplier, setTeleponSupplier] = useState("");
  const [picSupplier, setPicSupplier] = useState("");
  const [npwpSupplier, setNpwpSupplier] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getSupplierById();
  }, []);

  const getSupplierById = async () => {
    setLoading(true);
    const pickedSupplier = await axios.post(`${tempUrl}/suppliers/${id}`, {
      id: user._id,
      token: user.token
    });
    setKodeSupplier(pickedSupplier.data.kodeSupplier);
    setNamaSupplier(pickedSupplier.data.namaSupplier);
    setAlamatSupplier(pickedSupplier.data.alamatSupplier);
    setKotaSupplier(pickedSupplier.data.kotaSupplier);
    setTeleponSupplier(pickedSupplier.data.teleponSupplier);
    setPicSupplier(pickedSupplier.data.picSupplier);
    setNpwpSupplier(pickedSupplier.data.npwpSupplier);
    setLoading(false);
  };

  const updateSupplier = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      namaSupplier.length === 0 || picSupplier.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateSupplier/${id}`, {
          namaSupplier,
          alamatSupplier,
          kotaSupplier,
          teleponSupplier,
          picSupplier,
          npwpSupplier,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate(`/supplier/${id}`);
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
        Ubah Supplier
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Kode Supplier</Typography>
            <TextField
              size="small"
              error={error && kodeSupplier.length === 0 && true}
              helperText={
                error &&
                kodeSupplier.length === 0 &&
                "Kode Supplier harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={kodeSupplier}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Nama Supplier</Typography>
            <TextField
              size="small"
              error={error && namaSupplier.length === 0 && true}
              helperText={
                error &&
                namaSupplier.length === 0 &&
                "Nama Supplier harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaSupplier}
              onChange={(e) => setNamaSupplier(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Alamat Supplier
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={alamatSupplier}
              onChange={(e) => setAlamatSupplier(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Kota Supplier</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={kotaSupplier}
              onChange={(e) => setKotaSupplier(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Telepon</Typography>
            <TextField
              type="number"
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={teleponSupplier}
              onChange={(e) => setTeleponSupplier(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>PIC</Typography>
            <TextField
              size="small"
              error={error && picSupplier.length === 0 && true}
              helperText={
                error && picSupplier.length === 0 && "PIC Supplier harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={picSupplier}
              onChange={(e) => setPicSupplier(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>NPWP</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={npwpSupplier}
              onChange={(e) => setNpwpSupplier(e.target.value.toUpperCase())}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/supplier")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={updateSupplier}
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

export default UbahSupplier;

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

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};
