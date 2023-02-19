import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl } from "../../../../contexts/ContextProvider";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  ButtonGroup
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CariLapPenjualanKreditTunai = () => {
  const { user, setting } = useContext(AuthContext);
  let date = new Date();
  let [inputDariTgl, setInputDariTgl] = useState(date);
  let [inputSampaiTgl, setInputSampaiTgl] = useState(date);
  const [error, setError] = useState(false);

  const downloadPdfRinci = async () => {
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
    const response = await axios.post(
      `${tempUrl}/jualsForLaporanPenjualanKreditTunai`,
      {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    let hal = 1;
    let y = 55;
    let total = 0;
    let totalValue = 0;
    let total0 = 0;
    let total3 = 0;
    let total4 = 0;
    let total5 = 0;
    let total6 = 0;
    let total7 = 0;
    let total8 = 0;
    let total9 = 0;
    let total10 = 0;
    let total11 = 0;
    let total12 = 0;
    let total15 = 0;
    let total16 = 0;
    let total17 = 0;
    let total18 = 0;
    let total21 = 0;
    let total24 = 0;
    let yCount = 0;
    let yTenor = 0;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("l", "mm", [370, 210]);
    doc.setFontSize(12);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      200
    );
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`Hal: ${hal}`, 330, 5);
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Laporan Penjualan Kredit & Tunai`, 155, 30);
    doc.setFontSize(10);
    doc.text(`Dari Tanggal : ${dariTgl} s/d ${sampaiTgl}`, 15, 40);
    doc.line(15, y, 360, y);
    y += 5;
    doc.text(`No`, 18, y + 8);
    doc.text(`Tgl / No. Kredit / Customer`, 43, y + 8);
    doc.text(`Tenor (Bulan)`, 210, y);
    doc.text(`Surveyor`, 335, y + 8);
    y += 10;
    doc.line(15, y, 360, y);
    yTenor = y;
    yCount = y;
    for (let i = 0; i < response.data.length; i++) {
      y += 8;
      totalValue += response.data[i].hargaTunai;
      total += response.data[i].total;
      doc.text(`${response.data[i].no}`, 18, y - 2);
      doc.text(
        `${response.data[i].tanggalJual} - ${response.data[i].noRegister} - ${response.data[i].namaRegister}`,
        28,
        y - 2
      );
      doc.text(
        `${response.data[i].kodeSurveyor} - ${response.data[i].namaSurveyor}`,
        325,
        y - 2
      );
      doc.line(15, y, 360, y);

      if (y > 180) {
        doc.line(24, 55, 24, y - 8);
        doc.line(15, 55, 15, y);
        doc.line(110, 55, 110, y);
        doc.line(110, yTenor - 7, 322.5, yTenor - 7); // 1
        doc.text(`0`, 115.5, yTenor - 2);
        doc.line(122.5, yTenor - 7, 122.5, y); // 2
        doc.text(`3`, 127.5, yTenor - 2);
        doc.line(135, yTenor - 7, 135, y); // 3
        doc.text(`4`, 140.5, yTenor - 2);
        doc.line(147.5, yTenor - 7, 147.5, y); // 4
        doc.text(`5`, 152.5, yTenor - 2);
        doc.line(160, yTenor - 7, 160, y); // 5
        doc.text(`6`, 165.5, yTenor - 2);
        doc.line(172.5, yTenor - 7, 172.5, y); // 6
        doc.text(`7`, 177.5, yTenor - 2);
        doc.line(185, yTenor - 7, 185, y); // 7
        doc.text(`8`, 190.5, yTenor - 2);
        doc.line(197.5, yTenor - 7, 197.5, y); // 8
        doc.text(`9`, 201.5, yTenor - 2);
        doc.line(210, yTenor - 7, 210, y); // 9
        doc.text(`10`, 214.5, yTenor - 2);
        doc.line(222.5, yTenor - 7, 222.5, y); // 10
        doc.text(`11`, 226.5, yTenor - 2);
        doc.line(235, yTenor - 7, 235, y); // 11
        doc.text(`12`, 239.5, yTenor - 2);
        doc.line(247.5, yTenor - 7, 247.5, y); // 12
        doc.text(`15`, 251.5, yTenor - 2);
        doc.line(260, yTenor - 7, 260, y); // 13
        doc.text(`16`, 264.5, yTenor - 2);
        doc.line(272.5, yTenor - 7, 272.5, y); // 14
        doc.text(`17`, 276.5, yTenor - 2);
        doc.line(285, yTenor - 7, 285, y); // 15
        doc.text(`18`, 289.5, yTenor - 2);
        doc.line(297.5, yTenor - 7, 297.5, y); // 16
        doc.text(`21`, 301.5, yTenor - 2);
        doc.line(310, yTenor - 7, 310, y); // 17
        doc.text(`24`, 314, yTenor - 2);
        doc.line(322.5, 55, 322.5, y); // 18
        doc.line(360, 55, 360, y);
        doc.line(15, y, 360, y);
        doc.addPage();
        doc.text(
          `${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`,
          15,
          10
        );
        doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
        doc.setFontSize(16);
        doc.text(`Laporan Penjualan Kredit & Tunai`, 155, 30);
        doc.setFontSize(10);
        doc.text(`Dari Tanggal : ${dariTgl} s/d ${sampaiTgl}`, 15, 40);
        doc.text(`Periode : `, 15, 45);
        y = 55;
        doc.line(15, y, 360, y);
        y += 5;
        doc.text(`No`, 18, y + 8);
        doc.text(`Tgl / No. Kredit / Customer`, 43, y + 8);
        doc.text(`Tenor (Bulan)`, 210, y);
        doc.text(`Surveyor`, 335, y + 8);
        y += 10;
        doc.line(15, y, 360, y);
        hal++;
        doc.text(`Hal: ${hal}`, 220, 5);
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
    // Vertical Line
    doc.line(24, 55, 24, y - 8);
    doc.line(15, 55, 15, y);
    doc.line(110, 55, 110, y);
    doc.line(110, yTenor - 7, 322.5, yTenor - 7); // 1
    doc.text(`0`, 115.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 0) {
        yCount += 8;
        total0 += 1;
        doc.text(`1`, 115.5, yCount - 2);
      }
    }
    doc.text(`${total0}`, 115.5, y - 2);
    doc.line(122.5, yTenor - 7, 122.5, y); // 2
    doc.text(`3`, 127.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 3) {
        yCount += 8;
        total3 += 1;
        doc.text(`1`, 127.5, yCount - 2);
      }
    }
    doc.text(`${total3}`, 127.5, y - 2);
    doc.line(135, yTenor - 7, 135, y); // 3
    doc.text(`4`, 140.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 4) {
        yCount += 8;
        total4 += 1;
        doc.text(`1`, 140.5, yCount - 2);
      }
    }
    doc.text(`${total4}`, 140.5, y - 2);
    doc.line(147.5, yTenor - 7, 147.5, y); // 4
    doc.text(`5`, 152.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 5) {
        yCount += 8;
        total5 += 1;
        doc.text(`1`, 152.5, yCount - 2);
      }
    }
    doc.text(`${total5}`, 152.5, y - 2);
    doc.line(160, yTenor - 7, 160, y); // 5
    doc.text(`6`, 165.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 6) {
        yCount += 8;
        total6 += 1;
        doc.text(`1`, 165.5, yCount - 2);
      }
    }
    doc.text(`${total6}`, 165.5, y - 2);
    doc.line(172.5, yTenor - 7, 172.5, y); // 6
    doc.text(`7`, 177.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 7) {
        yCount += 8;
        total7 += 1;
        doc.text(`1`, 177.5, yCount - 2);
      }
    }
    doc.text(`${total7}`, 177.5, y - 2);
    doc.line(185, yTenor - 7, 185, y); // 7
    doc.text(`8`, 190.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 8) {
        yCount += 8;
        total8 += 1;
        doc.text(`1`, 190.5, yCount - 2);
      }
    }
    doc.text(`${total8}`, 190.5, y - 2);
    doc.line(197.5, yTenor - 7, 197.5, y); // 8
    doc.text(`9`, 201.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 9) {
        yCount += 8;
        total9 += 1;
        doc.text(`1`, 201.5, yCount - 2);
      }
    }
    doc.text(`${total9}`, 201.5, y - 2);
    doc.line(210, yTenor - 7, 210, y); // 9
    doc.text(`10`, 214.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 10) {
        yCount += 8;
        total10 += 1;
        doc.text(`1`, 214.5, yCount - 2);
      }
    }
    doc.text(`${total10}`, 214.5, y - 2);
    doc.line(222.5, yTenor - 7, 222.5, y); // 10
    doc.text(`11`, 226.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 11) {
        yCount += 8;
        total11 += 1;
        doc.text(`1`, 226.5, yCount - 2);
      }
    }
    doc.text(`${total11}`, 226.5, y - 2);
    doc.line(235, yTenor - 7, 235, y); // 11
    doc.text(`12`, 239.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 12) {
        yCount += 8;
        total12 += 1;
        doc.text(`1`, 239.5, yCount - 2);
      }
    }
    doc.text(`${total12}`, 239.5, y - 2);
    doc.line(247.5, yTenor - 7, 247.5, y); // 12
    doc.text(`15`, 251.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 15) {
        yCount += 8;
        total15 += 1;
        doc.text(`1`, 251.5, yCount - 2);
      }
    }
    doc.text(`${total15}`, 251.5, y - 2);
    doc.line(260, yTenor - 7, 260, y); // 13
    doc.text(`16`, 264.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 16) {
        yCount += 8;
        total16 += 1;
        doc.text(`1`, 264.5, yCount - 2);
      }
    }
    doc.text(`${total16}`, 264.5, y - 2);
    doc.line(272.5, yTenor - 7, 272.5, y); // 14
    doc.text(`17`, 276.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 17) {
        yCount += 8;
        total17 += 1;
        doc.text(`1`, 276.5, yCount - 2);
      }
    }
    doc.text(`${total17}`, 276.5, y - 2);
    doc.line(285, yTenor - 7, 285, y); // 15
    doc.text(`18`, 289.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 18) {
        yCount += 8;
        total18 += 1;
        doc.text(`1`, 289.5, yCount - 2);
      }
    }
    doc.text(`${total18}`, 289.5, y - 2);
    doc.line(297.5, yTenor - 7, 297.5, y); // 16
    doc.text(`21`, 301.5, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 21) {
        yCount += 8;
        total21 += 1;
        doc.text(`1`, 301.5, yCount - 2);
      }
    }
    doc.text(`${total21}`, 301.5, y - 2);
    doc.line(310, yTenor - 7, 310, y); // 17
    doc.text(`24`, 314, yTenor - 2);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].tenor === 24) {
        yCount += 8;
        total24 += 1;
        doc.text(`1`, 314.5, yCount - 2);
      }
    }
    doc.text(`${total24}`, 314.5, y - 2);
    doc.line(322.5, 55, 322.5, y); // 18
    doc.line(360, 55, 360, y);
    doc.line(15, y, 360, y);
    doc.save(`laporanPenjualanKreditTunai.pdf`);
  };

  return (
    <Box sx={container}>
      <Typography color="#757575">Laporan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Cari Penjualan Kredit & Tunai
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
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            color="secondary"
            startIcon={<PrintIcon />}
            onClick={() => downloadPdfRinci()}
          >
            Pdf
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default CariLapPenjualanKreditTunai;

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
