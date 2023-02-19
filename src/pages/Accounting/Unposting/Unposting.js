import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

const Unposting = () => {
  const { user } = useContext(AuthContext);
  let [inputDariTgl, setInputDariTgl] = useState(
    new Date(user.periode.periodeAwal)
  );
  let [inputSampaiTgl, setInputSampaiTgl] = useState(
    new Date(user.periode.periodeAkhir)
  );

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openErrorInput, setOpenErrorInput] = useState(false);
  const [vertical] = useState("bottom");
  const [horizontal] = useState("center");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleCloseErrorInput = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorInput(false);
  };

  const unposting = async () => {
    let countNeracaSaldo = 0;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    var newDariTgl = new Date(inputDariTgl);
    var newSampaiTgl = new Date(inputSampaiTgl);
    let isFailedValidation = inputDariTgl === null || inputSampaiTgl === null;
    let isDariTglBiggerThanSampaiTgl = newDariTgl > newSampaiTgl;
    if (isFailedValidation) {
      setError(true);
    } else if (isDariTglBiggerThanSampaiTgl) {
      setOpenErrorInput(true);
    } else {
      setLoading(true);
      let dariTgl = inputDariTgl.toISOString().substring(0, 10);
      let sampaiTgl = inputSampaiTgl.toISOString().substring(0, 10);

      setLoading(true);
      // Delete Neraca Saldo
      const allNeracaSaldo = await axios.post(`${tempUrl}/neracaSaldos`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      for (let i = 0; i < allNeracaSaldo.data.length; i++) {
        var dateParts = allNeracaSaldo.data[i].bulan.split("-");
        let tempTglNeracaSaldo = new Date(
          +dateParts[2],
          dateParts[1] - 1,
          +dateParts[0] + 1
        );
        let tempDariTgl = new Date(dariTgl);
        let tglBigger = tempTglNeracaSaldo >= tempDariTgl;
        if (tglBigger) {
          // Delete tglBigger Neraca Saldo
          await axios.post(
            `${tempUrl}/deleteNeracaSaldo/${allNeracaSaldo.data[i]._id}`,
            {
              id: user._id,
              token: user.token,
              kodeCabang: user.cabang._id
            }
          );
          countNeracaSaldo++;
        }
      }

      // Save New Neraca Saldo
      for (let i = 0; i < countNeracaSaldo; i++) {
        // Make Last Neraca Saldo
        await axios.post(`${tempUrl}/saveLastNeracaSaldo`, {
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
      }

      // Jurnal Unposting Pembelian
      await axios.post(`${tempUrl}/jurnalUnposting`, {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setLoading(false);
      setOpen(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Accounting</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Unposting
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={showDataWrapper}>
        <Typography sx={[labelInput, spacingTop]}>Dari Tanggal</Typography>
        <DatePicker
          dateFormat="dd/MM/yyyy"
          minDate={new Date(user.periode.periodeAwal)}
          maxDate={new Date(user.periode.periodeAkhir)}
          selected={inputDariTgl}
          onChange={(e) => setInputDariTgl(e)}
          customInput={
            <TextField
              error={error && inputDariTgl === null && true}
              helperText={
                error && inputDariTgl === null && "Dari Tanggal harus diisi!"
              }
              sx={{ width: "100%" }}
              size="small"
            />
          }
        />
        <Typography sx={[labelInput, spacingTop]}>Sampai Tanggal</Typography>
        <DatePicker
          dateFormat="dd/MM/yyyy"
          minDate={new Date(user.periode.periodeAwal)}
          maxDate={new Date(user.periode.periodeAkhir)}
          selected={inputSampaiTgl}
          onChange={(e) => setInputSampaiTgl(e)}
          customInput={
            <TextField
              error={error && inputSampaiTgl === null && true}
              helperText={
                error &&
                inputSampaiTgl === null &&
                "Sampai Tanggal harus diisi!"
              }
              sx={{ width: "100%" }}
              size="small"
            />
          }
        />
      </Box>
      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<DeleteSweepIcon />}
          onClick={() => unposting()}
        >
          UNPOSTING
        </Button>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Jurnal berhasil diunposting!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorInput}
        autoHideDuration={6000}
        onClose={handleCloseErrorInput}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleCloseErrorInput}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Sampai Tanggal tidak boleh lebih besar Dari Tanggal
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Unposting;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
};

const spacingTop = {
  mt: 4,
  mb: 2
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};
