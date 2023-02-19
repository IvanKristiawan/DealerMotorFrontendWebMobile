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
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const Posting = () => {
  const { user, setting } = useContext(AuthContext);
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

  const postingPeriode = async () => {
    let countNeracaSaldo = 0;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var lastday = function (y, m) {
      return new Date(y, m, 0).getDate();
    };

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
      let dariTgl =
        newDariTgl.getFullYear() +
        "-" +
        (newDariTgl.getMonth() + 1) +
        "-" +
        newDariTgl.getDate();
      let sampaiTgl =
        newSampaiTgl.getFullYear() +
        "-" +
        (newSampaiTgl.getMonth() + 1) +
        "-" +
        newSampaiTgl.getDate();

      // Jurnal Posting Pembelian
      if (user.ppnDipisah) {
        // Jurnal Pembelian dengan PPN
        await axios.post(`${tempUrl}/saveJurnalPostingPembelian`, {
          dariTgl,
          sampaiTgl,
          persediaanMotorBaru: setting.persediaanMotorBaru,
          ppnMasukkan: setting.ppnMasukkan,
          hutangDagang: setting.hutangDagang,
          persediaanMotorBekas: setting.persediaanMotorBekas,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
      } else {
        // Jurnal Pembelian PPN digabung dengan Persediaan Barang
        await axios.post(`${tempUrl}/saveJurnalPostingPembelianNoPpn`, {
          dariTgl,
          sampaiTgl,
          persediaanMotorBaru: setting.persediaanMotorBaru,
          ppnMasukkan: setting.ppnMasukkan,
          hutangDagang: setting.hutangDagang,
          persediaanMotorBekas: setting.persediaanMotorBekas,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
      }
      // Jurnal Posting Penjualan
      await axios.post(`${tempUrl}/saveJurnalPostingPenjualan`, {
        dariTgl,
        sampaiTgl,
        persediaanMotorBaru: setting.persediaanMotorBaru,
        uangTunaiKasir: setting.uangTunaiKasir,
        piutangDagang: setting.piutangDagang,
        penjualanMotor: setting.penjualanMotor,
        hppMotor: setting.hppMotor,
        persediaanMotorBekas: setting.persediaanMotorBekas,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Angsuran
      await axios.post(`${tempUrl}/saveJurnalPostingAngsuran`, {
        dariTgl,
        sampaiTgl,
        uangTunaiKasir: setting.uangTunaiKasir,
        piutangDagang: setting.piutangDagang,
        pendapatanBungaAngsuran: setting.pendapatanBungaAngsuran,
        pendapatanDenda: setting.pendapatanDenda,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Kas Masuk
      await axios.post(`${tempUrl}/saveJurnalPostingKasMasuk`, {
        dariTgl,
        sampaiTgl,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Kas Masuk Child
      await axios.post(`${tempUrl}/saveJurnalPostingKasMasukChild`, {
        dariTgl,
        sampaiTgl,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Kas Keluar
      await axios.post(`${tempUrl}/saveJurnalPostingKasKeluar`, {
        dariTgl,
        sampaiTgl,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Kas Keluar Child
      await axios.post(`${tempUrl}/saveJurnalPostingKasKeluarChild`, {
        dariTgl,
        sampaiTgl,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Bank Masuk
      await axios.post(`${tempUrl}/saveJurnalPostingBankMasuk`, {
        dariTgl,
        sampaiTgl,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Bank Masuk Child
      await axios.post(`${tempUrl}/saveJurnalPostingBankMasukChild`, {
        dariTgl,
        sampaiTgl,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Bank Keluar
      await axios.post(`${tempUrl}/saveJurnalPostingBankKeluar`, {
        dariTgl,
        sampaiTgl,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Bank Keluar Child
      await axios.post(`${tempUrl}/saveJurnalPostingBankKeluarChild`, {
        dariTgl,
        sampaiTgl,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      // Jurnal Posting Biaya Perawatan
      await axios.post(`${tempUrl}/saveJurnalPostingBiayaPerawatan`, {
        dariTgl,
        sampaiTgl,
        persediaanMotorBaru: setting.persediaanMotorBaru,
        persediaanMotorBekas: setting.persediaanMotorBekas,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });

      // Update Periode Lama
      newDariTgl = new Date(dariTgl);
      let tempDariTgl =
        newDariTgl.getFullYear() +
        "-" +
        (newDariTgl.getMonth() + 1) +
        "-" +
        "1";
      dariTgl = tempDariTgl;

      lastday = function (y, m) {
        return new Date(y, m, 0).getDate();
      };
      sampaiTgl =
        newDariTgl.getFullYear() +
        "-" +
        (newDariTgl.getMonth() + 1) +
        "-" +
        lastday("1", newDariTgl.getMonth() + 1);

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
        // Update Neraca Saldo Jurnal Posting
        await axios.post(`${tempUrl}/saveJurnalPostingNeracaSaldo`, {
          dariTgl,
          sampaiTgl,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.username,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });

        let tempDariTgl = new Date(dariTgl);
        let newDariTgl = new Date(
          tempDariTgl.setMonth(tempDariTgl.getMonth() + 1)
        );
        tempDariTgl =
          newDariTgl.getFullYear() +
          "-" +
          (newDariTgl.getMonth() + 1) +
          "-" +
          "1";
        dariTgl = tempDariTgl;

        sampaiTgl =
          newDariTgl.getFullYear() +
          "-" +
          (newDariTgl.getMonth() + 1) +
          "-" +
          lastday("1", newDariTgl.getMonth() + 1);
      }
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
        Posting
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
          startIcon={<DriveFileRenameOutlineIcon />}
          onClick={() => postingPeriode()}
        >
          POSTING
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
          Jurnal berhasil diposting!
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

export default Posting;

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
