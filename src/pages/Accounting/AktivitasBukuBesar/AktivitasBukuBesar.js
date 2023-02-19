import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { Loader, SearchBar } from "../../../components";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PrintIcon from "@mui/icons-material/Print";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

const AktivitasBukuBesar = () => {
  const { user, setting } = useContext(AuthContext);
  let [inputDariTgl, setInputDariTgl] = useState(
    new Date(user.periode.periodeAwal)
  );
  let [inputSampaiTgl, setInputSampaiTgl] = useState(
    new Date(user.periode.periodeAkhir)
  );
  const [dariAccount, setDariAccount] = useState("");
  const [sampaiAccount, setSampaiAccount] = useState("");

  const [COAsData, setCOAsData] = useState([]);
  const [searchTermDariCoa, setSearchTermDariCoa] = useState("");
  const [searchTermSampaiCoa, setSearchTermSampaiCoa] = useState("");
  const [isFetchError, setIsFetchError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDariCoa, setOpenDariCoa] = useState(false);
  const [openSampaiCoa, setOpenSampaiCoa] = useState(false);

  const classes = useStyles();

  const handleClickOpenDariCoa = () => {
    setOpenDariCoa(true);
  };

  const handleCloseDariCoa = () => {
    setOpenDariCoa(false);
  };

  const handleClickOpenSampaiCoa = () => {
    setOpenSampaiCoa(true);
  };

  const handleCloseSampaiCoa = () => {
    setOpenSampaiCoa(false);
  };

  const tempPostsDariCoa = COAsData.filter((val) => {
    if (searchTermDariCoa === "") {
      return val;
    } else if (
      val.kodeCOA.toUpperCase().includes(searchTermDariCoa.toUpperCase()) ||
      val.namaCOA.toUpperCase().includes(searchTermDariCoa.toUpperCase())
    ) {
      return val;
    }
  });

  const tempPostsSampaiCoa = COAsData.filter((val) => {
    if (searchTermSampaiCoa === "") {
      return val;
    } else if (
      val.kodeCOA.toUpperCase().includes(searchTermSampaiCoa.toUpperCase()) ||
      val.namaCOA.toUpperCase().includes(searchTermSampaiCoa.toUpperCase())
    ) {
      return val;
    }
  });

  useEffect(() => {
    getCOAsData();
  }, []);

  const getCOAsData = async () => {
    setLoading(true);
    try {
      const allCOAs = await axios.post(`${tempUrl}/COAsForDoc`, {
        id: user._id,
        token: user.token
      });
      setCOAsData(allCOAs.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const downloadPdf = async () => {
    let dariTgl =
      inputDariTgl?.getFullYear() +
      "-" +
      (inputDariTgl?.getMonth() + 1) +
      "-" +
      inputDariTgl?.getDate();
    let sampaiTgl =
      inputSampaiTgl?.getFullYear() +
      "-" +
      (inputSampaiTgl?.getMonth() + 1) +
      "-" +
      inputSampaiTgl?.getDate();

    let aktivitasBukuBesars = await axios.post(
      `${tempUrl}/aktivitasBukuBesars`,
      {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    let hal = 1;
    let totalDebet = 0;
    let totalKredit = 0;
    let totalSaldo = 0;
    let makeDariTgl = new Date(dariTgl);
    let makeSampaiTgl = new Date(sampaiTgl);
    let tempDariTgl =
      makeDariTgl.getDate() +
      "-" +
      (makeDariTgl.getMonth() + 1) +
      "-" +
      makeDariTgl.getFullYear();
    let tempSampaiTgl =
      makeSampaiTgl.getDate() +
      "-" +
      (makeSampaiTgl.getMonth() + 1) +
      "-" +
      makeSampaiTgl.getFullYear();

    let tempY = 5;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("p", "mm", [240, 300]);
    doc.setFontSize(9);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      10,
      290
    );
    doc.text(
      `${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`,
      10,
      tempY
    );
    doc.text(`Hal: ${hal}`, 220, 5);
    tempY += 5;
    doc.text(`${setting.lokasiPerusahaan}`, 10, tempY);
    tempY += 5;
    doc.text(`${setting.lokasiSP}`, 10, tempY);
    tempY += 5;
    doc.text(`${setting.kotaPerusahaan}`, 10, tempY);
    tempY += 10;
    doc.text(`Laporan Aktivitas Buku Besar`, 10, tempY);
    tempY += 5;
    doc.text(`Periode`, 10, tempY);
    tempY += 5;
    doc.text(`Dari Tanggal : ${tempDariTgl} S/D : ${tempSampaiTgl}`, 10, tempY);
    tempY += 5;
    doc.line(10, tempY, 230, tempY);
    doc.line(30, tempY, 30, tempY + 8);
    doc.line(70, tempY, 70, tempY + 8);
    doc.line(130, tempY, 130, tempY + 8);
    doc.line(165, tempY, 165, tempY + 8);
    doc.line(200, tempY, 200, tempY + 8);
    tempY += 5.5;
    doc.text(`Tg.`, 12, tempY);
    doc.text(`No.Bukti`, 40, tempY);
    doc.text(`Keterangan Jurnal`, 85, tempY);
    doc.text(`Debet`, 140, tempY);
    doc.text(`Kredit`, 175, tempY);
    doc.text(`Saldo`, 210, tempY);
    tempY += 2.5;
    doc.line(10, tempY, 230, tempY);

    let keys = Object.keys(aktivitasBukuBesars.data);

    for (let j = 0; j < Object.keys(keys).length; j++) {
      if (
        parseInt(aktivitasBukuBesars.data[keys[j]][0].kodeCOA) >=
          parseInt(dariAccount) &&
        parseInt(aktivitasBukuBesars.data[keys[j]][0].kodeCOA) <=
          parseInt(sampaiAccount)
      ) {
        if (tempY > 270) {
          doc.addPage();
          tempY = 10;
          hal++;
          doc.text(`Hal: ${hal}`, 220, 5);
          doc.text(
            `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
            10,
            290
          );
        }
        let tempDebet = 0;
        let tempKredit = 0;
        let tempSaldo = 0;
        tempY += 10;
        doc.setFont(undefined, "bold");
        doc.text(
          `Account : ${aktivitasBukuBesars.data[keys[j]][0].kodeCOA} - ${
            aktivitasBukuBesars.data[keys[j]][0].namaCOA
          }`,
          10,
          tempY
        );
        doc.setFont(undefined, "normal");
        tempY += 5;
        doc.text(`01`, 12, tempY);
        doc.text(`S. AWAL`, 32, tempY);
        doc.text(`Saldo Awal Tanggal ${tempDariTgl}`, 72, tempY);
        for (let i = 0; i < aktivitasBukuBesars.data[keys[j]].length; i++) {
          if (tempY > 270) {
            doc.addPage();
            tempY = 10;
            hal++;
            doc.text(`Hal: ${hal}`, 220, 5);
            doc.text(
              `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
              10,
              290
            );
          }
          tempY += 5;
          doc.text(
            `${aktivitasBukuBesars.data[keys[j]][i].tglJurnal}`,
            12,
            tempY
          );
          doc.text(
            `${aktivitasBukuBesars.data[keys[j]][i].noBukti}`,
            32,
            tempY
          );
          doc.setFontSize(7);
          doc.text(
            `${aktivitasBukuBesars.data[keys[j]][i].keterangan.slice(0, 35)}`,
            72,
            tempY
          );
          doc.setFontSize(9);
          if (aktivitasBukuBesars.data[keys[j]][i].jenis === "D") {
            doc.text(
              `${aktivitasBukuBesars.data[keys[j]][i].jumlah.toLocaleString()}`,
              160,
              tempY,
              {
                align: "right"
              }
            );
            tempDebet += aktivitasBukuBesars.data[keys[j]][i].jumlah;
            totalDebet += aktivitasBukuBesars.data[keys[j]][i].jumlah;
            tempSaldo += aktivitasBukuBesars.data[keys[j]][i].jumlah;
            totalSaldo += aktivitasBukuBesars.data[keys[j]][i].jumlah;
            doc.text(`${tempSaldo.toLocaleString()}`, 225, tempY, {
              align: "right"
            });
          } else {
            doc.text(
              `${aktivitasBukuBesars.data[keys[j]][i].jumlah.toLocaleString()}`,
              195,
              tempY,
              {
                align: "right"
              }
            );
            tempKredit += aktivitasBukuBesars.data[keys[j]][i].jumlah;
            totalKredit += aktivitasBukuBesars.data[keys[j]][i].jumlah;
            tempSaldo -= aktivitasBukuBesars.data[keys[j]][i].jumlah;
            totalSaldo -= aktivitasBukuBesars.data[keys[j]][i].jumlah;
            doc.text(`${tempSaldo.toLocaleString()}`, 225, tempY, {
              align: "right"
            });
          }
        }
        tempY += 5;
        doc.text(
          `---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`,
          10,
          tempY
        );
        tempY += 5;
        doc.setFont(undefined, "bold");
        doc.text(
          `SubTotal Account : ${
            aktivitasBukuBesars.data[keys[j]][0].kodeCOA
          } - ${aktivitasBukuBesars.data[keys[j]][0].namaCOA}`,
          10,
          tempY
        );
        doc.setFont(undefined, "normal");
        doc.text(`${tempDebet.toLocaleString()}`, 160, tempY, {
          align: "right"
        });
        doc.text(`${tempKredit.toLocaleString()}`, 195, tempY, {
          align: "right"
        });
        doc.text(`${tempSaldo.toLocaleString()}`, 225, tempY, {
          align: "right"
        });
      }
    }

    tempY += 10;
    doc.text(
      `---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`,
      10,
      tempY
    );
    tempY += 5;
    doc.setFont(undefined, "bold");
    doc.text(`BALANCE :`, 10, tempY);
    doc.setFont(undefined, "normal");
    doc.text(`${totalDebet.toLocaleString()}`, 160, tempY, {
      align: "right"
    });
    doc.text(`${totalKredit.toLocaleString()}`, 195, tempY, {
      align: "right"
    });
    doc.text(`${totalSaldo.toLocaleString()}`, 225, tempY, {
      align: "right"
    });
    doc.save(`aktivitasBukuBesar.pdf`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Accounting</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Aktivitas Buku Besar
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={showDataWrapper}>
        <Typography sx={[labelInput, spacingTop]}>Dari Tanggal</Typography>
        <DatePicker
          dateFormat="dd/MM/yyyy"
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

        <Typography sx={[labelInput, spacingTop]}>Dari Account</Typography>
        <TextField
          size="small"
          id="outlined-basic"
          error={error && dariAccount.length === 0 && true}
          helperText={
            error && dariAccount.length === 0 && "Dari Account harus diisi!"
          }
          variant="outlined"
          value={dariAccount}
          InputProps={{
            readOnly: true
          }}
          onClick={() => handleClickOpenDariCoa()}
          placeholder="Pilih..."
        />
        <Typography sx={[labelInput, spacingTop]}>Sampai Account</Typography>
        <TextField
          size="small"
          id="outlined-basic"
          error={error && sampaiAccount.length === 0 && true}
          helperText={
            error && sampaiAccount.length === 0 && "Sampai Account harus diisi!"
          }
          variant="outlined"
          value={sampaiAccount}
          InputProps={{
            readOnly: true
          }}
          onClick={() => handleClickOpenSampaiCoa()}
          placeholder="Pilih..."
        />
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => downloadPdf()}
        >
          CETAK
        </Button>
      </Box>

      <Dialog
        open={openDariCoa}
        onClose={handleCloseDariCoa}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Pilih Data Account`}</DialogTitle>
        <DialogActions>
          <Box sx={dialogContainer}>
            <SearchBar setSearchTerm={setSearchTermDariCoa} />
            <TableContainer component={Paper} sx={dialogWrapper}>
              <Table aria-label="simple table">
                <TableHead className={classes.root}>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Kode
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempPostsDariCoa
                    .filter((val) => {
                      if (searchTermDariCoa === "") {
                        return val;
                      } else if (
                        val.kodeCOA
                          .toUpperCase()
                          .includes(searchTermDariCoa.toUpperCase()) ||
                        val.namaCOA
                          .toUpperCase()
                          .includes(searchTermDariCoa.toUpperCase())
                      ) {
                        return val;
                      }
                    })
                    .map((user, index) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { bgcolor: Colors.grey300 },
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setDariAccount(user.kodeCOA);
                          handleCloseDariCoa();
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.kodeCOA}
                        </TableCell>
                        <TableCell>{user.namaCOA}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSampaiCoa}
        onClose={handleCloseSampaiCoa}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Pilih Data Account`}</DialogTitle>
        <DialogActions>
          <Box sx={dialogContainer}>
            <SearchBar setSearchTerm={setSearchTermSampaiCoa} />
            <TableContainer component={Paper} sx={dialogWrapper}>
              <Table aria-label="simple table">
                <TableHead className={classes.root}>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Kode
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempPostsSampaiCoa
                    .filter((val) => {
                      if (searchTermSampaiCoa === "") {
                        return val;
                      } else if (
                        val.kodeCOA
                          .toUpperCase()
                          .includes(searchTermSampaiCoa.toUpperCase()) ||
                        val.namaCOA
                          .toUpperCase()
                          .includes(searchTermSampaiCoa.toUpperCase())
                      ) {
                        return val;
                      }
                    })
                    .map((user, index) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { bgcolor: Colors.grey300 },
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setSampaiAccount(user.kodeCOA);
                          handleCloseSampaiCoa();
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.kodeCOA}
                        </TableCell>
                        <TableCell>{user.namaCOA}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AktivitasBukuBesar;

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
  mt: 4
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

const dialogContainer = {
  display: "flex",
  flexDirection: "column",
  padding: 4,
  width: "800px"
};

const dialogWrapper = {
  width: "100%",
  marginTop: 2
};
