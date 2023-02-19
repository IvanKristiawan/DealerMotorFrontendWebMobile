import React, { useState, useContext } from "react";
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
import jsPDF from "jspdf";
import PrintIcon from "@mui/icons-material/Print";

const LabaRugi = () => {
  const { user, setting } = useContext(AuthContext);
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

  const postingLabaRugiPeriodeBerjalan = async (jumlah) => {
    let countNeracaSaldo = 0;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    var newDariTgl = new Date(user.periode.periodeAwal);
    var newSampaiTgl = new Date(user.periode.periodeAkhir);
    try {
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

      // Jurnal Posting Laba Rugi Periode Berjalan
      await axios.post(`${tempUrl}/saveJurnalPostingLabaRugiPeriodeBerjalan`, {
        dariTgl,
        sampaiTgl,
        labaRugiPeriodeBerjalan: setting.labaRugiPeriodeBerjalan,
        accountPembalance: setting.accountPembalance,
        jumlah,
        periodeAwal: user.periode.periodeAwal,
        namaPeriode: user.periode.namaPeriode,
        tglInput: current_date,
        jamInput: current_time,
        userInput: user.username,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });

      // Update Periode Lama
      let tempDariTgl =
        newDariTgl.getFullYear() +
        "-" +
        (newDariTgl.getMonth() + 1) +
        "-" +
        "1";
      dariTgl = tempDariTgl;

      let lastday = function (y, m) {
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
    } catch (e) {
      alert(e);
    }
  };

  const downloadPdf = async () => {
    let labaRugis = await axios.post(`${tempUrl}/labaRugis`, {
      groupPendapatan: setting.groupPendapatan,
      groupBiayaOperasional: setting.groupBiayaOperasional,
      dariTgl: user.periode.periodeAwal,
      sampaiTgl: user.periode.periodeAkhir,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });

    let isTotalPendapatan = true;
    let hal = 1;
    let tempSampaiTgl = user.periode.periodeAkhir;

    let labaRugiOperasional = 0;
    let tempY = 5;
    let tempYStart;
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
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`LABA / RUGI`, 110, tempY);
    doc.setFontSize(9);
    tempY += 5;
    let dateParts = tempSampaiTgl.split("-");
    doc.text(`Per ${dateParts[2]} ${user.periode.namaPeriode}`, 105, tempY);
    doc.setFont(undefined, "normal");
    tempY += 5;
    tempYStart = tempY;
    doc.line(10, tempY, 230, tempY);

    let keys = Object.keys(labaRugis.data);

    for (let j = 0; j < Object.keys(keys).length; j++) {
      if (tempY > 270) {
        doc.addPage();
        tempY = tempYStart;
        hal++;
        doc.text(`Hal: ${hal}`, 220, 5);
        doc.text(
          `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
          10,
          290
        );
      }
      let tempTotalSaldo = 0;
      let tempSaldo;
      tempY += 8;
      doc.setFont(undefined, "bold");
      doc.text(`${labaRugis.data[keys[j]][0].namaGroupCOA} :`, 12, tempY);

      let groupByKodeSubGroupCOA = labaRugis.data[keys[j]].reduce(
        (group, labaRugi) => {
          const { namaSubGroupCOA } = labaRugi;
          group[namaSubGroupCOA] = group[namaSubGroupCOA] ?? [];
          group[namaSubGroupCOA].push(labaRugi);
          return group;
        },
        {}
      );

      let keysSubGroup = Object.keys(groupByKodeSubGroupCOA);

      for (let j = 0; j < Object.keys(keysSubGroup).length; j++) {
        if (tempY > 270) {
          doc.addPage();
          tempY = tempYStart;
          hal++;
          doc.text(`Hal: ${hal}`, 220, 5);
          doc.text(
            `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
            10,
            290
          );
        }
        tempSaldo = 0;
        tempY += 10;
        doc.setFont(undefined, "bold");
        doc.text(
          `${groupByKodeSubGroupCOA[keysSubGroup[j]][0].namaSubGroupCOA} :`,
          15,
          tempY
        );
        tempY += 2;

        doc.setFont(undefined, "normal");
        for (
          let k = 0;
          k < groupByKodeSubGroupCOA[keysSubGroup[j]].length;
          k++
        ) {
          if (tempY > 270) {
            doc.addPage();
            tempY = tempYStart;
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
            `${groupByKodeSubGroupCOA[keysSubGroup[j]][k].namaCOA}`,
            20,
            tempY
          );
          if (groupByKodeSubGroupCOA[keysSubGroup[j]][k].jumlah > 0) {
            // Positive
            doc.text(
              `${groupByKodeSubGroupCOA[keysSubGroup[j]][
                k
              ].jumlah.toLocaleString()}`,
              160,
              tempY,
              {
                align: "right"
              }
            );
          } else {
            // Negative
            doc.text(
              `(${groupByKodeSubGroupCOA[keysSubGroup[j]][k].jumlah
                .toLocaleString()
                .slice(1)})`,
              160,
              tempY,
              {
                align: "right"
              }
            );
          }
          tempSaldo += groupByKodeSubGroupCOA[keysSubGroup[j]][k].jumlah;
          tempY += 2;
        }
        tempTotalSaldo += tempSaldo;
        tempY += 1;
        doc.line(130, tempY, 160, tempY);
        tempY += 4;
        doc.setFont(undefined, "bold");
        doc.text(
          `SUBTOTAL ${
            groupByKodeSubGroupCOA[keysSubGroup[j]][0].namaSubGroupCOA
          } :`,
          15,
          tempY
        );
        if (tempSaldo > 0) {
          // Postive
          doc.text(`${tempSaldo.toLocaleString()}`, 160, tempY, {
            align: "right"
          });
        } else {
          // Negative
          doc.text(`(${tempSaldo.toLocaleString().slice(1)})`, 160, tempY, {
            align: "right"
          });
        }
        doc.setFont(undefined, "normal");
      }
      tempY += 4;
      tempY += 5;
      doc.setFont(undefined, "bold");
      doc.text(`TOTAL ${labaRugis.data[keys[j]][0].namaGroupCOA} :`, 12, tempY);
      if (tempTotalSaldo > 0) {
        // Positive
        doc.text(`${tempTotalSaldo.toLocaleString()}`, 225, tempY, {
          align: "right"
        });
      } else {
        // Negative
        doc.text(`(${tempTotalSaldo.toLocaleString().slice(1)})`, 225, tempY, {
          align: "right"
        });
      }
      if (isTotalPendapatan) {
        // Jumlahkan Laba Rugi Operasional
        labaRugiOperasional += tempTotalSaldo;
      } else {
        // Kurang Laba Rugi Operasional
        labaRugiOperasional -= tempTotalSaldo;
      }
      isTotalPendapatan = false;
      tempY += 1;
      doc.line(190, tempY, 225, tempY);
      doc.setFont(undefined, "normal");
    }
    tempY += 4;
    doc.line(10, tempY, 230, tempY);
    tempY += 8;
    doc.setFont(undefined, "bold");
    doc.text(`LABA RUGI OPERASIONAL :`, 12, tempY);
    if (labaRugiOperasional > 0) {
      // Positive
      doc.text(`${labaRugiOperasional.toLocaleString()}`, 225, tempY, {
        align: "right"
      });
    } else {
      // Negative
      doc.text(
        `(${labaRugiOperasional.toLocaleString().slice(1)})`,
        225,
        tempY,
        {
          align: "right"
        }
      );
    }
    tempY += 1;
    doc.line(190, tempY, 225, tempY);
    doc.save(`labaRugi.pdf`);
    postingLabaRugiPeriodeBerjalan(labaRugiOperasional);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Accounting</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Laba Rugi
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => downloadPdf()}
        >
          CETAK
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
          Jurnal Laba Rugi Periode Berjalan berhasil diposting!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LabaRugi;

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
