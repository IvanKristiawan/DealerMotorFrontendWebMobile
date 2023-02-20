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

const TambahSubGroupCOA = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");
  const [namaGroupCOA, setNamaGroupCOA] = useState("");
  const [kodeSubGroupCOA, setKodeSubGroupCOA] = useState("");
  const [namaSubGroupCOA, setNamaSubGroupCOA] = useState("");
  const [groupCOAsData, setGroupCOAsData] = useState([]);

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
    getGroupCOAsData();
  }, []);

  const getGroupCOAsData = async () => {
    setLoading(true);
    const allGroupCOAs = await axios.post(`${tempUrl}/groupCOAs`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setGroupCOAsData(allGroupCOAs.data);
    setLoading(false);
  };

  const getSubGroupCOAsNextKode = async (kodeGroupCOA) => {
    const subGroupCoa = await axios.post(`${tempUrl}/subGroupCOAsNextKode`, {
      kodeGroupCOA,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setKodeSubGroupCOA(subGroupCoa.data);
  };

  const saveSubGroupCOA = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailValidation =
      kodeGroupCOA.length === 0 || namaSubGroupCOA.length === 0;
    if (isFailValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveSubGroupCOA`, {
          kodeGroupCOA,
          namaGroupCOA,
          namaSubGroupCOA,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/subGroupCOA");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const groupCOAOptions = groupCOAsData.map((groupCOA) => ({
    label: `${groupCOA.kodeGroupCOA} - ${groupCOA.namaGroupCOA}`
  }));

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Sub Group COA
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Kode Group COA</Typography>
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
                setNamaGroupCOA(value.split("- ")[1]);
                getSubGroupCOAsNextKode(value.split(" ", 1)[0]);
              }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Kode Sub Group COA
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              value={kodeSubGroupCOA}
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Nama Sub Group COA
            </Typography>
            <TextField
              size="small"
              error={error && namaSubGroupCOA.length === 0 && true}
              helperText={
                error &&
                namaSubGroupCOA.length === 0 &&
                "Nama Sub Group harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaSubGroupCOA}
              onChange={(e) => setNamaSubGroupCOA(e.target.value.toUpperCase())}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/subGroupCOA")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveSubGroupCOA}
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

export default TambahSubGroupCOA;

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
