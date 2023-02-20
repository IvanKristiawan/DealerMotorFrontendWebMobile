import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Box, Typography, Button, Divider, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import "jspdf-autotable";

const KasHarian = () => {
  const { user, setting } = useContext(AuthContext);
  let date = new Date();
  let [inputSampaiTgl, setInputSampaiTgl] = useState(date);
  const [error, setError] = useState(false);

  const downloadPdf = async () => {
    let sampaiTgl =
      inputSampaiTgl?.getFullYear() +
      "-" +
      (inputSampaiTgl?.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      inputSampaiTgl?.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    let sampaiTglMinOne =
      inputSampaiTgl?.getFullYear() +
      "-" +
      (inputSampaiTgl?.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      (inputSampaiTgl?.getDate() - 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    let jurnalPostingsTotalKas = await axios.post(
      `${tempUrl}/jurnalPostingsTotalKas`,
      {
        coaKas: setting.coaKas,
        sampaiTgl: sampaiTglMinOne,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    let jurnalPostingsTotalBank = await axios.post(
      `${tempUrl}/jurnalPostingsTotalBank`,
      {
        coaBank: setting.coaBank,
        sampaiTgl: sampaiTglMinOne,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    let jurnalPostingsPenerimaanKas = await axios.post(
      `${tempUrl}/jurnalPostingsPenerimaanKas`,
      {
        coaKas: setting.coaKas,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    let jurnalPostingsPenerimaanBank = await axios.post(
      `${tempUrl}/jurnalPostingsPenerimaanBank`,
      {
        coaBank: setting.coaBank,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    let jurnalPostingsPengeluaranKas = await axios.post(
      `${tempUrl}/jurnalPostingsPengeluaranKas`,
      {
        coaKas: setting.coaKas,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    let jurnalPostingsPengeluaranBank = await axios.post(
      `${tempUrl}/jurnalPostingsPengeluaranBank`,
      {
        coaBank: setting.coaBank,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    let tempSisa = 0;
    let tempSaldoAwalUangTunai = 0;
    let tempSaldoAwalBank = 0;
    let tempTotalPenerimaan = 0;
    let tempPenerimaanUangTunai = 0;
    let tempPenerimaanBank = 0;
    let tempTotalPengeluaran = 0;
    let tempPengeluaranUangTunai = 0;
    let tempPengeluaranBank = 0;
    let hal = 1;
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
    tempYStart = tempY;
    tempY += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`LAPORAN KAS HARIAN`, 100, tempY);
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    tempY += 5;
    doc.text(`Per Tanggal : ${sampaiTgl}`, 10, tempY);
    tempY += 5;
    doc.line(10, tempY, 230, tempY);
    doc.line(20, tempY, 20, tempY + 8);
    doc.line(50, tempY, 50, tempY + 8);
    doc.line(130, tempY, 130, tempY + 8);
    doc.line(165, tempY, 165, tempY + 8);
    doc.line(200, tempY, 200, tempY + 8);
    tempY += 5;
    doc.setFont(undefined, "bold");
    doc.text(`NO.`, 12, tempY);
    doc.text(`BUKTI`, 30, tempY);
    doc.text(`KETERANGAN`, 80, tempY);
    doc.text(`MASUK`, 143, tempY);
    doc.text(`KELUAR`, 175, tempY);
    doc.text(`SISA`, 210, tempY);
    doc.setFont(undefined, "normal");
    tempY += 3;
    doc.line(10, tempY, 230, tempY);
    tempY += 5;
    doc.setFont(undefined, "bold");
    doc.text(`Saldo Awal :`, 12, tempY);
    doc.setFont(undefined, "normal");

    let keysTotalKas = Object.keys(jurnalPostingsTotalKas.data);
    for (let j = 0; j < keysTotalKas.length; j++) {
      tempY += 5;
      doc.setFont(undefined, "bold");
      doc.text(
        `Saldo Awal : ${
          jurnalPostingsTotalKas.data[keysTotalKas[j]][0].namaCOA
        }`,
        14,
        tempY
      );
      doc.setFont(undefined, "normal");
      tempY += 3;
      doc.line(10, tempY, 230, tempY);
      doc.line(20, tempY, 20, tempY + 6);
      doc.line(50, tempY, 50, tempY + 6);
      doc.line(130, tempY, 130, tempY + 6);
      doc.line(165, tempY, 165, tempY + 6);
      doc.line(200, tempY, 200, tempY + 6);
      tempY += 4;
      doc.text(`1`, 15, tempY);
      doc.text(`S.AWAL`, 22, tempY);
      doc.text(`Saldo Kas Per Tanggal ${sampaiTglMinOne}`, 53, tempY);
      doc.text(
        `${jurnalPostingsTotalKas.data[
          keysTotalKas[j]
        ][0].jumlah.toLocaleString()}`,
        160,
        tempY,
        {
          align: "right"
        }
      );
      tempSisa += jurnalPostingsTotalKas.data[keysTotalKas[j]][0].jumlah;
      tempSaldoAwalUangTunai +=
        jurnalPostingsTotalKas.data[keysTotalKas[j]][0].jumlah;
      doc.text(`${tempSisa.toLocaleString()}`, 225, tempY, {
        align: "right"
      });
      tempY += 2;
      doc.line(10, tempY, 230, tempY);
      doc.line(130, tempY, 130, tempY + 6);
      doc.line(165, tempY, 165, tempY + 6);
      tempY += 4;
      doc.setFont(undefined, "bold");
      doc.text(
        `Total Saldo Awal : ${
          jurnalPostingsTotalKas.data[keysTotalKas[j]][0].namaCOA
        }`,
        14,
        tempY
      );
      doc.text(`${tempSaldoAwalUangTunai.toLocaleString()}`, 160, tempY, {
        align: "right"
      });
      doc.setFont(undefined, "normal");
      tempY += 2;
      doc.line(130, tempY, 165, tempY);
    }

    let keysTotalBank = Object.keys(jurnalPostingsTotalBank.data);
    for (let j = 0; j < keysTotalBank.length; j++) {
      tempY += 5;
      doc.setFont(undefined, "bold");
      doc.text(
        `Saldo Awal : ${
          jurnalPostingsTotalBank.data[keysTotalBank[j]][0].namaCOA
        }`,
        14,
        tempY
      );
      doc.setFont(undefined, "normal");
      tempY += 3;
      doc.line(10, tempY, 230, tempY);
      doc.line(20, tempY, 20, tempY + 6);
      doc.line(50, tempY, 50, tempY + 6);
      doc.line(130, tempY, 130, tempY + 6);
      doc.line(165, tempY, 165, tempY + 6);
      doc.line(200, tempY, 200, tempY + 6);
      tempY += 4;
      doc.text(`1`, 15, tempY);
      doc.text(`S.AWAL`, 22, tempY);
      doc.text(`Saldo Kas Per Tanggal ${sampaiTglMinOne}`, 53, tempY);
      doc.text(
        `${jurnalPostingsTotalBank.data[
          keysTotalBank[j]
        ][0].jumlah.toLocaleString()}`,
        160,
        tempY,
        {
          align: "right"
        }
      );
      tempSisa += jurnalPostingsTotalBank.data[keysTotalBank[j]][0].jumlah;
      tempSaldoAwalBank +=
        jurnalPostingsTotalBank.data[keysTotalBank[j]][0].jumlah;
      doc.text(`${tempSisa.toLocaleString()}`, 225, tempY, {
        align: "right"
      });
      tempY += 2;
      doc.line(10, tempY, 230, tempY);
      doc.line(130, tempY, 130, tempY + 6);
      doc.line(165, tempY, 165, tempY + 6);
      tempY += 4;
      doc.setFont(undefined, "bold");
      doc.text(
        `Total Saldo Awal : ${
          jurnalPostingsTotalBank.data[keysTotalBank[j]][0].namaCOA
        }`,
        14,
        tempY
      );
      doc.text(`${tempSaldoAwalBank.toLocaleString()}`, 160, tempY, {
        align: "right"
      });
      doc.setFont(undefined, "normal");
      tempY += 2;
      doc.line(130, tempY, 165, tempY);
    }

    doc.line(130, tempY, 130, tempY + 6);
    doc.line(165, tempY, 165, tempY + 6);
    tempY += 4;
    doc.setFont(undefined, "bold");
    doc.text(`Total Saldo Awal :`, 12, tempY);
    doc.text(`${tempSisa.toLocaleString()}`, 160, tempY, {
      align: "right"
    });
    doc.setFont(undefined, "normal");
    tempY += 2;
    doc.line(130, tempY, 165, tempY);

    if (
      Object.keys(jurnalPostingsPenerimaanKas.data).length > 0 ||
      Object.keys(jurnalPostingsPenerimaanBank.data).length > 0
    ) {
      tempY += 8;
      let noPenerimaanKas = 1;
      doc.setFont(undefined, "bold");
      doc.text(`Penerimaan :`, 12, tempY);
      doc.setFont(undefined, "normal");
      let keysPenerimaanKas = Object.keys(jurnalPostingsPenerimaanKas.data);
      for (let j = 0; j < keysPenerimaanKas.length; j++) {
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
        doc.setFont(undefined, "bold");
        doc.text(
          `Penerimaan : ${
            jurnalPostingsPenerimaanKas.data[keysPenerimaanKas[j]][0].namaCOA
          }`,
          14,
          tempY
        );
        doc.setFont(undefined, "normal");
        for (
          let i = 0;
          i < jurnalPostingsPenerimaanKas.data[keysPenerimaanKas[j]].length;
          i++
        ) {
          tempY += 3;
          doc.line(10, tempY, 230, tempY);
          doc.line(20, tempY, 20, tempY + 6);
          doc.line(50, tempY, 50, tempY + 6);
          doc.line(130, tempY, 130, tempY + 6);
          doc.line(165, tempY, 165, tempY + 6);
          doc.line(200, tempY, 200, tempY + 6);
          tempY += 4;
          doc.text(`${noPenerimaanKas}`, 15, tempY);
          noPenerimaanKas++;
          doc.text(
            `${
              jurnalPostingsPenerimaanKas.data[keysPenerimaanKas[j]][i].noBukti
            }`,
            22,
            tempY
          );
          doc.text(
            `${jurnalPostingsPenerimaanKas.data[keysPenerimaanKas[j]][
              i
            ].keterangan.slice(0, 40)}`,
            53,
            tempY
          );
          doc.text(
            `${jurnalPostingsPenerimaanKas.data[keysPenerimaanKas[j]][
              i
            ].jumlah.toLocaleString()}`,
            160,
            tempY,
            {
              align: "right"
            }
          );
          tempSisa +=
            jurnalPostingsPenerimaanKas.data[keysPenerimaanKas[j]][i].jumlah;
          tempPenerimaanUangTunai +=
            jurnalPostingsPenerimaanKas.data[keysPenerimaanKas[j]][i].jumlah;
          tempTotalPenerimaan +=
            jurnalPostingsPenerimaanKas.data[keysPenerimaanKas[j]][i].jumlah;
          doc.text(`${tempSisa.toLocaleString()}`, 225, tempY, {
            align: "right"
          });
        }
        tempY += 2;
        doc.line(10, tempY, 230, tempY);
        doc.line(130, tempY, 130, tempY + 6);
        doc.line(165, tempY, 165, tempY + 6);
        tempY += 4;
        doc.setFont(undefined, "bold");
        doc.text(
          `Total Penerimaan : ${
            jurnalPostingsPenerimaanKas.data[keysPenerimaanKas[j]][0].namaCOA
          }`,
          14,
          tempY
        );
        doc.text(`${tempPenerimaanUangTunai.toLocaleString()}`, 160, tempY, {
          align: "right"
        });
        doc.setFont(undefined, "normal");
        tempY += 2;
        doc.line(130, tempY, 165, tempY);
      }

      let noPenerimaanBank = 1;
      let keysPenerimaanBank = Object.keys(jurnalPostingsPenerimaanBank.data);
      for (let j = 0; j < keysPenerimaanBank.length; j++) {
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
        doc.setFont(undefined, "bold");
        doc.text(
          `Penerimaan : ${
            jurnalPostingsPenerimaanBank.data[keysPenerimaanBank[j]][0].namaCOA
          }`,
          14,
          tempY
        );
        doc.setFont(undefined, "normal");
        for (
          let i = 0;
          i < jurnalPostingsPenerimaanBank.data[keysPenerimaanBank[j]].length;
          i++
        ) {
          tempY += 3;
          doc.line(10, tempY, 230, tempY);
          doc.line(20, tempY, 20, tempY + 6);
          doc.line(50, tempY, 50, tempY + 6);
          doc.line(130, tempY, 130, tempY + 6);
          doc.line(165, tempY, 165, tempY + 6);
          doc.line(200, tempY, 200, tempY + 6);
          tempY += 4;
          doc.text(`${noPenerimaanBank}`, 15, tempY);
          noPenerimaanBank++;
          doc.text(
            `${
              jurnalPostingsPenerimaanBank.data[keysPenerimaanBank[j]][i]
                .noBukti
            }`,
            22,
            tempY
          );
          doc.text(
            `${jurnalPostingsPenerimaanBank.data[keysPenerimaanBank[j]][
              i
            ].keterangan.slice(0, 40)}`,
            53,
            tempY
          );
          doc.text(
            `${jurnalPostingsPenerimaanBank.data[keysPenerimaanBank[j]][
              i
            ].jumlah.toLocaleString()}`,
            160,
            tempY,
            {
              align: "right"
            }
          );
          tempSisa +=
            jurnalPostingsPenerimaanBank.data[keysPenerimaanBank[j]][i].jumlah;
          tempPenerimaanBank +=
            jurnalPostingsPenerimaanBank.data[keysPenerimaanBank[j]][i].jumlah;
          tempTotalPenerimaan +=
            jurnalPostingsPenerimaanBank.data[keysPenerimaanBank[j]][i].jumlah;
          doc.text(`${tempSisa.toLocaleString()}`, 225, tempY, {
            align: "right"
          });
        }
        tempY += 2;
        doc.line(10, tempY, 230, tempY);
        doc.line(130, tempY, 130, tempY + 6);
        doc.line(165, tempY, 165, tempY + 6);
        tempY += 4;
        doc.setFont(undefined, "bold");
        doc.text(
          `Total Penerimaan : ${
            jurnalPostingsPenerimaanBank.data[keysPenerimaanBank[j]][0].namaCOA
          }`,
          14,
          tempY
        );
        doc.text(`${tempPenerimaanBank.toLocaleString()}`, 160, tempY, {
          align: "right"
        });
        doc.setFont(undefined, "normal");
        tempY += 2;
        doc.line(130, tempY, 165, tempY);
      }

      doc.line(130, tempY, 130, tempY + 6);
      doc.line(165, tempY, 165, tempY + 6);
      tempY += 4;
      doc.setFont(undefined, "bold");
      doc.text(`Total Penerimaan :`, 12, tempY);
      doc.text(`${tempTotalPenerimaan.toLocaleString()}`, 160, tempY, {
        align: "right"
      });
      doc.setFont(undefined, "normal");
      tempY += 2;
      doc.line(130, tempY, 165, tempY);
    }

    if (
      Object.keys(jurnalPostingsPengeluaranKas.data).length > 0 ||
      Object.keys(jurnalPostingsPengeluaranBank.data).length > 0
    ) {
      tempY += 8;
      let noPengeluaranKas = 1;
      doc.setFont(undefined, "bold");
      doc.text(`Pengeluaran :`, 12, tempY);
      doc.setFont(undefined, "normal");
      let keysPengeluaranKas = Object.keys(jurnalPostingsPengeluaranKas.data);
      for (let j = 0; j < keysPengeluaranKas.length; j++) {
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
        doc.setFont(undefined, "bold");
        doc.text(
          `Pengeluaran : ${
            jurnalPostingsPengeluaranKas.data[keysPengeluaranKas[j]][0].namaCOA
          }`,
          14,
          tempY
        );
        doc.setFont(undefined, "normal");
        for (
          let i = 0;
          i < jurnalPostingsPengeluaranKas.data[keysPengeluaranKas[j]].length;
          i++
        ) {
          tempY += 3;
          doc.line(10, tempY, 230, tempY);
          doc.line(20, tempY, 20, tempY + 6);
          doc.line(50, tempY, 50, tempY + 6);
          doc.line(130, tempY, 130, tempY + 6);
          doc.line(165, tempY, 165, tempY + 6);
          doc.line(200, tempY, 200, tempY + 6);
          tempY += 4;
          doc.text(`${noPengeluaranKas}`, 15, tempY);
          noPengeluaranKas++;
          doc.text(
            `${
              jurnalPostingsPengeluaranKas.data[keysPengeluaranKas[j]][i]
                .noBukti
            }`,
            22,
            tempY
          );
          doc.text(
            `${jurnalPostingsPengeluaranKas.data[keysPengeluaranKas[j]][
              i
            ].keterangan.slice(0, 40)}`,
            53,
            tempY
          );
          doc.text(
            `${jurnalPostingsPengeluaranKas.data[keysPengeluaranKas[j]][
              i
            ].jumlah.toLocaleString()}`,
            195,
            tempY,
            {
              align: "right"
            }
          );
          tempSisa -=
            jurnalPostingsPengeluaranKas.data[keysPengeluaranKas[j]][i].jumlah;
          tempPengeluaranUangTunai +=
            jurnalPostingsPengeluaranKas.data[keysPengeluaranKas[j]][i].jumlah;
          tempTotalPengeluaran +=
            jurnalPostingsPengeluaranKas.data[keysPengeluaranKas[j]][i].jumlah;
          doc.text(`${tempSisa.toLocaleString()}`, 225, tempY, {
            align: "right"
          });
        }
        tempY += 2;
        doc.line(10, tempY, 230, tempY);
        doc.line(165, tempY, 165, tempY + 6);
        doc.line(200, tempY, 200, tempY + 6);
        tempY += 4;
        doc.setFont(undefined, "bold");
        doc.text(
          `Total Pengeluaran : ${
            jurnalPostingsPengeluaranKas.data[keysPengeluaranKas[j]][0].namaCOA
          }`,
          14,
          tempY
        );
        doc.text(`${tempPengeluaranUangTunai.toLocaleString()}`, 195, tempY, {
          align: "right"
        });
        doc.setFont(undefined, "normal");
        tempY += 2;
        doc.line(165, tempY, 200, tempY);
      }

      let noPengeluaranBank = 1;
      let keysPengeluaranBank = Object.keys(jurnalPostingsPengeluaranBank.data);
      for (let j = 0; j < keysPengeluaranBank.length; j++) {
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
        doc.setFont(undefined, "bold");
        doc.text(
          `Pengeluaran : ${
            jurnalPostingsPengeluaranBank.data[keysPengeluaranBank[j]][0]
              .namaCOA
          }`,
          14,
          tempY
        );
        doc.setFont(undefined, "normal");
        for (
          let i = 0;
          i < jurnalPostingsPengeluaranBank.data[keysPengeluaranBank[j]].length;
          i++
        ) {
          tempY += 3;
          doc.line(10, tempY, 230, tempY);
          doc.line(20, tempY, 20, tempY + 6);
          doc.line(50, tempY, 50, tempY + 6);
          doc.line(130, tempY, 130, tempY + 6);
          doc.line(165, tempY, 165, tempY + 6);
          doc.line(200, tempY, 200, tempY + 6);
          tempY += 4;
          doc.text(`${noPengeluaranBank}`, 15, tempY);
          noPengeluaranBank++;
          doc.text(
            `${
              jurnalPostingsPengeluaranBank.data[keysPengeluaranBank[j]][i]
                .noBukti
            }`,
            22,
            tempY
          );
          doc.text(
            `${jurnalPostingsPengeluaranBank.data[keysPengeluaranBank[j]][
              i
            ].keterangan.slice(0, 40)}`,
            53,
            tempY
          );
          doc.text(
            `${jurnalPostingsPengeluaranBank.data[keysPengeluaranBank[j]][
              i
            ].jumlah.toLocaleString()}`,
            195,
            tempY,
            {
              align: "right"
            }
          );
          tempSisa -=
            jurnalPostingsPengeluaranBank.data[keysPengeluaranBank[j]][i]
              .jumlah;
          tempPengeluaranBank +=
            jurnalPostingsPengeluaranBank.data[keysPengeluaranBank[j]][i]
              .jumlah;
          tempTotalPengeluaran +=
            jurnalPostingsPengeluaranBank.data[keysPengeluaranBank[j]][i]
              .jumlah;
          doc.text(`${tempSisa.toLocaleString()}`, 225, tempY, {
            align: "right"
          });
        }
        tempY += 2;
        doc.line(10, tempY, 230, tempY);
        doc.line(165, tempY, 165, tempY + 6);
        doc.line(200, tempY, 200, tempY + 6);
        tempY += 4;
        doc.setFont(undefined, "bold");
        doc.text(
          `Total Pengeluaran : ${
            jurnalPostingsPengeluaranBank.data[keysPengeluaranBank[j]][0]
              .namaCOA
          }`,
          14,
          tempY
        );
        doc.text(`${tempPengeluaranBank.toLocaleString()}`, 195, tempY, {
          align: "right"
        });
        doc.setFont(undefined, "normal");
        tempY += 2;
        doc.line(165, tempY, 200, tempY);
      }

      if (tempY > 255) {
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
      doc.line(165, tempY, 165, tempY + 6);
      doc.line(200, tempY, 200, tempY + 6);
      tempY += 4;
      doc.setFont(undefined, "bold");
      doc.text(`Total Pengeluaran :`, 12, tempY);
      doc.text(`${tempTotalPengeluaran.toLocaleString()}`, 195, tempY, {
        align: "right"
      });
      doc.setFont(undefined, "normal");
      tempY += 2;
      doc.line(165, tempY, 200, tempY);
    }

    tempY += 3;
    doc.line(10, tempY, 230, tempY);
    tempY += 6;
    doc.setFont(undefined, "bold");
    doc.text(`SALDO AKHIR UANG TUNAI TANGGAL : ${sampaiTgl}`, 12, tempY);
    doc.text(
      `${(
        tempSaldoAwalUangTunai +
        tempPenerimaanUangTunai -
        tempPengeluaranUangTunai
      ).toLocaleString()}`,
      225,
      tempY,
      {
        align: "right"
      }
    );
    tempY += 6;
    doc.text(`SALDO AKHIR BANK TANGGAL : ${sampaiTgl}`, 12, tempY);
    doc.text(
      `${(
        tempSaldoAwalBank +
        tempPenerimaanBank -
        tempPengeluaranBank
      ).toLocaleString()}`,
      225,
      tempY,
      {
        align: "right"
      }
    );
    tempY += 1;
    doc.line(200, tempY, 230, tempY);
    tempY += 6;
    doc.text(`SALDO AKHIR KAS TANGGAL : ${sampaiTgl}`, 12, tempY);
    doc.text(`${tempSisa.toLocaleString()}`, 225, tempY, {
      align: "right"
    });
    doc.setFont(undefined, "normal");
    tempY += 3;
    doc.line(200, tempY, 230, tempY);
    tempY += 0.5;
    doc.line(200, tempY, 230, tempY);

    doc.save(`kasHarian.pdf`);
  };

  return (
    <Box sx={container}>
      <Typography color="#757575">Laporan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Laporan Kas Harian
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={showDataWrapper}>
        <Typography sx={[labelInput, spacingTop]}>Per Tanggal</Typography>
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
      </Box>
      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => downloadPdf()}
        >
          CETAK
        </Button>
      </Box>
    </Box>
  );
};

export default KasHarian;

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
