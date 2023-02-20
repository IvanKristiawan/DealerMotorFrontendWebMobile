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

const PenjualanPerCabang = () => {
  const { user, setting } = useContext(AuthContext);
  let date = new Date();
  let [inputDariTgl, setInputDariTgl] = useState(date);
  let [inputSampaiTgl, setInputSampaiTgl] = useState(date);
  const [error, setError] = useState(false);

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
    let getPenjualanPerCabang;
    const response = await axios.post(`${tempUrl}/cabangs`, {
      id: user._id,
      token: user.token
    });

    let y = 55;
    let total = 0;
    let totalAll = 0;
    let total1 = 0,
      total2 = 0,
      total3 = 0,
      total4 = 0;
    let total5 = 0,
      total6 = 0,
      total7 = 0,
      total8 = 0;
    let total9 = 0,
      total10 = 0,
      total11 = 0,
      total12 = 0;
    let total13 = 0,
      total14 = 0,
      total15 = 0,
      total16 = 0;
    let total17 = 0,
      total18 = 0,
      total19 = 0,
      total20 = 0;
    let total21 = 0,
      total22 = 0,
      total23 = 0,
      total24 = 0;
    let total25 = 0,
      total26 = 0,
      total27 = 0,
      total28 = 0;
    let total29 = 0,
      total30 = 0,
      total31 = 0;
    let yCount = 0;
    let yTenor = 0;

    let hal = 1;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("l", "mm", [540, 210]);
    doc.setFontSize(12);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      200
    );
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`Hal: ${hal}`, 500, 5);
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Laporan Rekap Penjualan Per Cabang`, 220, 30);
    doc.setFontSize(10);
    let tempDariTgl = new Date(dariTgl);
    let tempYearDariTgl = tempDariTgl.getFullYear();
    let tempMonthDariTgl = tempDariTgl.getMonth() + 1;
    let tempDayDariTgl = tempDariTgl.getDate();
    doc.text(
      `Dari Tanggal : ${`${tempYearDariTgl}-${tempMonthDariTgl}-${tempDayDariTgl}`} s/d ${sampaiTgl}`,
      15,
      40
    );
    doc.line(15, y, 530, y);
    y += 5;
    doc.text(`Cabang`, 38, y + 8);
    doc.text(`Tanggal`, 280, y);
    doc.text(`Total`, 497, y + 8);
    y += 10;
    doc.line(15, y, 530, y);
    yTenor = y;
    yCount = y;
    // Loop
    for (let i = 0; i < response.data.length; i++) {
      y += 8;
      getPenjualanPerCabang = await axios.post(
        `${tempUrl}/jualsForLaporanPerCabang`,
        {
          dariTgl,
          sampaiTgl,
          id: user._id,
          token: user.token,
          kodeCabang: response.data[i]._id
        }
      );

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 1) {
          total1 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 85.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 2) {
          total2 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 97.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 3) {
          total3 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 110.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 4) {
          total4 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 122.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 5) {
          total5 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 135.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 6) {
          total6 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 147.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 7) {
          total7 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 160.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 8) {
          total8 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 171.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 9) {
          total9 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 184.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 10) {
          total10 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 196.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 11) {
          total11 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 209.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 12) {
          total12 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 221.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 13) {
          total13 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 234.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 14) {
          total14 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 246.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 15) {
          total15 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 259.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 16) {
          total16 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 271.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 17) {
          total17 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 284.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 18) {
          total18 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 297.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 19) {
          total19 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 310.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 20) {
          total20 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 323.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 21) {
          total21 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 336.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 22) {
          total22 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 349.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 23) {
          total23 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 362.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 24) {
          total24 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 375.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 25) {
          total25 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 388.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 26) {
          total26 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 401.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 27) {
          total27 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 414.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 28) {
          total28 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 427.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 29) {
          total29 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 440.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 30) {
          total30 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 453.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        if (getPenjualanPerCabang.data[k].tanggalJual === 31) {
          total31 += getPenjualanPerCabang.data[k].count;
          doc.text(`${getPenjualanPerCabang.data[k].count}`, 466.5, y - 2);
        }
      }

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        total += getPenjualanPerCabang.data[k].count;
        totalAll += getPenjualanPerCabang.data[k].count;
      }
      doc.text(`${total}`, 497, y - 2);

      doc.text(`Cabang ${response.data[i]._id}`, 20, y - 2);
      doc.line(15, y, 530, y);
      if (y > 180) {
        doc.line(15, y, 530, y);
        doc.line(15, 55, 15, y);
        doc.line(80, 55, 80, y);
        doc.line(80, yTenor - 7, 530, yTenor - 7); // 1
        doc.text(`1`, 85.5, yTenor - 2);
        doc.line(92.5, yTenor - 7, 92.5, y); // 2
        doc.text(`2`, 97.5, yTenor - 2);
        doc.line(105, yTenor - 7, 105, y); // 3
        doc.text(`3`, 110.5, yTenor - 2);
        doc.line(117.5, yTenor - 7, 117.5, y); // 4
        doc.text(`4`, 122.5, yTenor - 2);
        doc.line(130, yTenor - 7, 130, y); // 5
        doc.text(`5`, 135.5, yTenor - 2);
        doc.line(142.5, yTenor - 7, 142.5, y); // 6
        doc.text(`6`, 147.5, yTenor - 2);
        doc.line(155, yTenor - 7, 155, y); // 7
        doc.text(`7`, 160.5, yTenor - 2);
        doc.line(167.5, yTenor - 7, 167.5, y); // 8
        doc.text(`8`, 171.5, yTenor - 2);
        doc.line(180, yTenor - 7, 180, y); // 9
        doc.text(`9`, 184.5, yTenor - 2);
        doc.line(192.5, yTenor - 7, 192.5, y); // 10
        doc.text(`10`, 196.5, yTenor - 2);
        doc.line(205, yTenor - 7, 205, y); // 11
        doc.text(`11`, 209.5, yTenor - 2);
        doc.line(217.5, yTenor - 7, 217.5, y); // 12
        doc.text(`12`, 221.5, yTenor - 2);
        doc.line(230, yTenor - 7, 230, y); // 13
        doc.text(`13`, 234.5, yTenor - 2);
        doc.line(242.5, yTenor - 7, 242.5, y); // 14
        doc.text(`14`, 246.5, yTenor - 2);
        doc.line(255, yTenor - 7, 255, y); // 15
        doc.text(`15`, 259.5, yTenor - 2);
        doc.line(267.5, yTenor - 7, 267.5, y); // 16
        doc.text(`16`, 271.5, yTenor - 2);
        doc.line(280, yTenor - 7, 280, y); // 17
        doc.text(`17`, 284, yTenor - 2);
        doc.line(293, yTenor - 7, 293, y); // 18
        doc.text(`18`, 297, yTenor - 2);
        doc.line(306, yTenor - 7, 306, y); // 19
        doc.text(`19`, 310, yTenor - 2);
        doc.line(319, yTenor - 7, 319, y); // 20
        doc.text(`20`, 323, yTenor - 2);
        doc.line(332, yTenor - 7, 332, y); // 21
        doc.text(`21`, 336, yTenor - 2);
        doc.line(345, yTenor - 7, 345, y); // 22
        doc.text(`22`, 349, yTenor - 2);
        doc.line(358, yTenor - 7, 358, y); // 23
        doc.text(`23`, 362, yTenor - 2);
        doc.line(371, yTenor - 7, 371, y); // 24
        doc.text(`24`, 375, yTenor - 2);
        doc.line(384, yTenor - 7, 384, y); // 25
        doc.text(`25`, 388, yTenor - 2);
        doc.line(397, yTenor - 7, 397, y); // 26
        doc.text(`26`, 401, yTenor - 2);
        doc.line(410, yTenor - 7, 410, y); // 27
        doc.text(`27`, 414, yTenor - 2);
        doc.line(423, yTenor - 7, 423, y); // 28
        doc.text(`28`, 427, yTenor - 2);
        doc.line(436, yTenor - 7, 436, y); // 29
        doc.text(`29`, 440, yTenor - 2);
        doc.line(449, yTenor - 7, 449, y); // 30
        doc.text(`30`, 453, yTenor - 2);
        doc.line(462, yTenor - 7, 462, y); // 31
        doc.text(`31`, 466, yTenor - 2);
        doc.line(474, 55, 474, y); // Last Vertical Line
        doc.line(530, 55, 530, y);
        doc.line(15, y, 530, y);
        doc.addPage();
        doc.text(
          `${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`,
          15,
          10
        );
        doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
        doc.setFontSize(16);
        doc.text(`Laporan Rekap Penjualan Per Cabang`, 220, 30);
        doc.setFontSize(10);
        doc.text(
          `Dari Tanggal : ${`${tempYearDariTgl}-${tempMonthDariTgl}-${tempDayDariTgl}`} s/d ${sampaiTgl}`,
          15,
          40
        );
        doc.text(`Periode : `, 15, 45);
        y = 55;
        doc.line(15, y, 530, y);
        y += 5;
        doc.text(`Cabang`, 38, y + 8);
        doc.text(`Tanggal`, 280, y);
        doc.text(`Total`, 497, y + 8);
        y += 10;
        doc.line(15, y, 530, y);
        hal++;
        doc.text(`Hal: ${hal}`, 500, 5);
        doc.text(
          `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
          10,
          200
        );
      }
    }
    y += 8;
    doc.setFont(undefined, "bold");
    doc.text(`TOTAL : `, 18, y - 2);
    doc.setFont(undefined, "normal");
    doc.text(`${totalAll}`, 497, y - 2);
    // Vertical Line
    doc.line(15, 55, 15, y);
    doc.line(80, 55, 80, y);
    doc.line(80, yTenor - 7, 530, yTenor - 7); // 1
    doc.text(`1`, 85.5, yTenor - 2);
    doc.text(`${total1}`, 85.5, y - 2);
    doc.line(92.5, yTenor - 7, 92.5, y); // 2
    doc.text(`2`, 97.5, yTenor - 2);
    doc.text(`${total2}`, 97.5, y - 2);
    doc.line(105, yTenor - 7, 105, y); // 3
    doc.text(`3`, 110.5, yTenor - 2);
    doc.text(`${total3}`, 110.5, y - 2);
    doc.line(117.5, yTenor - 7, 117.5, y); // 4
    doc.text(`4`, 122.5, yTenor - 2);
    doc.text(`${total4}`, 122.5, y - 2);
    doc.line(130, yTenor - 7, 130, y); // 5
    doc.text(`5`, 135.5, yTenor - 2);
    doc.text(`${total5}`, 135.5, y - 2);
    doc.line(142.5, yTenor - 7, 142.5, y); // 6
    doc.text(`6`, 147.5, yTenor - 2);
    doc.text(`${total6}`, 147.5, y - 2);
    doc.line(155, yTenor - 7, 155, y); // 7
    doc.text(`7`, 160.5, yTenor - 2);
    doc.text(`${total7}`, 160.5, y - 2);
    doc.line(167.5, yTenor - 7, 167.5, y); // 8
    doc.text(`8`, 171.5, yTenor - 2);
    doc.text(`${total8}`, 171.5, y - 2);
    doc.line(180, yTenor - 7, 180, y); // 9
    doc.text(`9`, 184.5, yTenor - 2);
    doc.text(`${total9}`, 184.5, y - 2);
    doc.line(192.5, yTenor - 7, 192.5, y); // 10
    doc.text(`10`, 196.5, yTenor - 2);
    doc.text(`${total10}`, 196.5, y - 2);
    doc.line(205, yTenor - 7, 205, y); // 11
    doc.text(`11`, 209.5, yTenor - 2);
    doc.text(`${total11}`, 209.5, y - 2);
    doc.line(217.5, yTenor - 7, 217.5, y); // 12
    doc.text(`12`, 221.5, yTenor - 2);
    doc.text(`${total12}`, 221.5, y - 2);
    doc.line(230, yTenor - 7, 230, y); // 13
    doc.text(`13`, 234.5, yTenor - 2);
    doc.text(`${total13}`, 234.5, y - 2);
    doc.line(242.5, yTenor - 7, 242.5, y); // 14
    doc.text(`14`, 246.5, yTenor - 2);
    doc.text(`${total14}`, 246.5, y - 2);
    doc.line(255, yTenor - 7, 255, y); // 15
    doc.text(`15`, 259.5, yTenor - 2);
    doc.text(`${total15}`, 259.5, y - 2);
    doc.line(267.5, yTenor - 7, 267.5, y); // 16
    doc.text(`16`, 271.5, yTenor - 2);
    doc.text(`${total16}`, 271.5, y - 2);
    doc.line(280, yTenor - 7, 280, y); // 17
    doc.text(`17`, 284, yTenor - 2);
    doc.text(`${total17}`, 284.5, y - 2);
    doc.line(293, yTenor - 7, 293, y); // 18
    doc.text(`18`, 297, yTenor - 2);
    doc.text(`${total18}`, 297.5, y - 2);
    doc.line(306, yTenor - 7, 306, y); // 19
    doc.text(`19`, 310, yTenor - 2);
    doc.text(`${total19}`, 310.5, y - 2);
    doc.line(319, yTenor - 7, 319, y); // 20
    doc.text(`20`, 323, yTenor - 2);
    doc.text(`${total20}`, 323.5, y - 2);
    doc.line(332, yTenor - 7, 332, y); // 21
    doc.text(`21`, 336, yTenor - 2);
    doc.text(`${total21}`, 336.5, y - 2);
    doc.line(345, yTenor - 7, 345, y); // 22
    doc.text(`22`, 349, yTenor - 2);
    doc.text(`${total22}`, 349.5, y - 2);
    doc.line(358, yTenor - 7, 358, y); // 23
    doc.text(`23`, 362, yTenor - 2);
    doc.text(`${total23}`, 362.5, y - 2);
    doc.line(371, yTenor - 7, 371, y); // 24
    doc.text(`24`, 375, yTenor - 2);
    doc.text(`${total24}`, 375.5, y - 2);
    doc.line(384, yTenor - 7, 384, y); // 25
    doc.text(`25`, 388, yTenor - 2);
    doc.text(`${total25}`, 388.5, y - 2);
    doc.line(397, yTenor - 7, 397, y); // 26
    doc.text(`26`, 401, yTenor - 2);
    doc.text(`${total26}`, 401.5, y - 2);
    doc.line(410, yTenor - 7, 410, y); // 27
    doc.text(`27`, 414, yTenor - 2);
    doc.text(`${total27}`, 414.5, y - 2);
    doc.line(423, yTenor - 7, 423, y); // 28
    doc.text(`28`, 427, yTenor - 2);
    doc.text(`${total28}`, 427.5, y - 2);
    doc.line(436, yTenor - 7, 436, y); // 29
    doc.text(`29`, 440, yTenor - 2);
    doc.text(`${total29}`, 440.5, y - 2);
    doc.line(449, yTenor - 7, 449, y); // 30
    doc.text(`30`, 453, yTenor - 2);
    doc.text(`${total30}`, 453.5, y - 2);
    doc.line(462, yTenor - 7, 462, y); // 31
    doc.text(`31`, 466, yTenor - 2);
    doc.text(`${total31}`, 466.5, y - 2);
    doc.line(474, 55, 474, y); // Last Vertical Line
    doc.line(530, 55, 530, y);
    doc.line(15, y, 530, y);
    doc.save(`laporanRekapPenjualanPerCabang.pdf`);
  };

  return (
    <Box sx={container}>
      <Typography color="#757575">Laporan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Laporan Penjualan Per Cabang
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

export default PenjualanPerCabang;

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
