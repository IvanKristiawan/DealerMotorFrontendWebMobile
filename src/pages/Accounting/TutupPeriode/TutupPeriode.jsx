import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import {
  Box,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const TutupPeriode = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [periode, setPeriode] = useState("");
  const [periodeSelanjutnya, setPeriodeSelanjutnya] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [vertical] = useState("bottom");
  const [horizontal] = useState("center");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getPeriode();
  }, []);

  const getPeriode = async () => {
    setLoading(true);
    let tempDateName;
    let tempDateNameSelanjutnya;
    try {
      const periode = await axios.post(`${tempUrl}/lastTutupPeriode`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      let dateParts = periode.data.periodeAwal.split("-");
      let tempTgl = new Date(periode.data.periodeAwal);
      let nextDateMonth = new Date(tempTgl.setMonth(tempTgl.getMonth() + 1));

      switch (parseInt(dateParts[1])) {
        case 1:
          tempDateName = "JANUARI";
          break;
        case 2:
          tempDateName = "FEBRUARI";
          break;
        case 3:
          tempDateName = "MARET";
          break;
        case 4:
          tempDateName = "APRIL";
          break;
        case 5:
          tempDateName = "MEI";
          break;
        case 6:
          tempDateName = "JUNI";
          break;
        case 7:
          tempDateName = "JULI";
          break;
        case 8:
          tempDateName = "AGUSTUS";
          break;
        case 9:
          tempDateName = "SEPTEMBER";
          break;
        case 10:
          tempDateName = "OKTOBER";
          break;
        case 11:
          tempDateName = "NOVEMBER";
          break;
        case 12:
          tempDateName = "DESEMBER";
          break;
        default:
          break;
      }

      switch (nextDateMonth.getMonth() + 1) {
        case 1:
          tempDateNameSelanjutnya = "JANUARI";
          break;
        case 2:
          tempDateNameSelanjutnya = "FEBRUARI";
          break;
        case 3:
          tempDateNameSelanjutnya = "MARET";
          break;
        case 4:
          tempDateNameSelanjutnya = "APRIL";
          break;
        case 5:
          tempDateNameSelanjutnya = "MEI";
          break;
        case 6:
          tempDateNameSelanjutnya = "JUNI";
          break;
        case 7:
          tempDateNameSelanjutnya = "JULI";
          break;
        case 8:
          tempDateNameSelanjutnya = "AGUSTUS";
          break;
        case 9:
          tempDateNameSelanjutnya = "SEPTEMBER";
          break;
        case 10:
          tempDateNameSelanjutnya = "OKTOBER";
          break;
        case 11:
          tempDateNameSelanjutnya = "NOVEMBER";
          break;
        case 12:
          tempDateNameSelanjutnya = "DESEMBER";
          break;
        default:
          break;
      }
      let tempPeriode = tempDateName + " " + dateParts[0];
      let tempPeriodeSelanjutnya =
        tempDateNameSelanjutnya + " " + nextDateMonth.getFullYear();

      setPeriode(tempPeriode);
      setPeriodeSelanjutnya(tempPeriodeSelanjutnya);
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  const tutupPeriode = async () => {
    setLoading(true);
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    try {
      await axios.post(`${tempUrl}/saveLastTutupPeriode`, {
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      await axios.post(`${tempUrl}/saveLastNeracaSaldo`, {
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });

      // Ganti Periode
      const periode = await axios.post(`${tempUrl}/lastTutupPeriode`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
        id: user._id,
        token: user.token
      });
      const gantiPeriodeUser = await axios.post(
        `${tempUrl}/updateUserThenLogin/${user._id}`,
        {
          periode: periode.data._id,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        }
      );
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: gantiPeriodeUser.data.details,
        setting: findSetting.data
      });
      setOpen(true);
      getPeriode();
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Accounting</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tutup Periode
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={showDataWrapper}>
        <Typography sx={[labelInput, spacingTop]}>
          Periode Sekarang : {periode}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Typography sx={[labelInput]}>Ke Periode</Typography>
          <Typography sx={[labelInput, { ml: 7 }]}>
            : {periodeSelanjutnya}
          </Typography>
        </Box>
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<DriveFileRenameOutlineIcon />}
          onClick={() => tutupPeriode()}
        >
          TUTUP PERIODE
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
          Periode Berhasil Ditutup!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TutupPeriode;

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
