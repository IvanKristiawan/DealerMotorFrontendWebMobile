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

const RekapPenerimaan = () => {
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

    let hal = 1;
    let y = 55;
    let total = 0;
    let totalAll = 0;
    let totalPenjualanTunai = 0,
      totalUangMuka = 0,
      totalAngModal = 0,
      totalAngBunga = 0;
    let totalDenda = 0,
      totalBiayaTarik = 0;
    let yCount = 0;
    let yTenor = 0;

    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("l", "mm", [380, 210]);
    doc.setFontSize(12);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      200
    );
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`Hal: ${hal}`, 350, 5);
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Laporan Rekap Penerimaan`, 160, 30);
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
    doc.line(15, y, 360, y);
    y += 5;
    doc.text(`Cabang`, 38, y + 8);
    doc.text(`Penerimaan`, 190, y);
    doc.text(`Total`, 330, y + 8);
    y += 10;
    doc.line(15, y, 360, y);
    yTenor = y;
    yCount = y;
    // Loop
    for (let i = 0; i < response.data.length; i++) {
      y += 8;
      getPenjualanPerCabang = await axios.post(
        `${tempUrl}/angsuransForRekapPenerimaan`,
        {
          dariTgl,
          sampaiTgl,
          id: user._id,
          token: user.token,
          kodeCabang: response.data[i]._id
        }
      );

      totalPenjualanTunai += getPenjualanPerCabang.data[0].penjualanTunai;
      doc.text(
        `${getPenjualanPerCabang.data[0].penjualanTunaiDoc}`,
        115,
        y - 2,
        {
          align: "right"
        }
      );

      totalUangMuka += getPenjualanPerCabang.data[0].uangMuka;
      doc.text(`${getPenjualanPerCabang.data[0].uangMukaDoc}`, 155, y - 2, {
        align: "right"
      });

      totalAngModal += getPenjualanPerCabang.data[0].angModal;
      doc.text(`${getPenjualanPerCabang.data[0].angModalDoc}`, 195, y - 2, {
        align: "right"
      });

      totalAngBunga += getPenjualanPerCabang.data[0].angBunga;
      doc.text(`${getPenjualanPerCabang.data[0].angBungaDoc}`, 235, y - 2, {
        align: "right"
      });

      totalDenda += getPenjualanPerCabang.data[0].denda;
      doc.text(`${getPenjualanPerCabang.data[0].dendaDoc}`, 275, y - 2, {
        align: "right"
      });

      totalBiayaTarik += getPenjualanPerCabang.data[0].biayaTarik;
      doc.text(`${getPenjualanPerCabang.data[0].biayaTarikDoc}`, 315, y - 2, {
        align: "right"
      });

      for (let k = 0; k < getPenjualanPerCabang.data.length; k++) {
        total +=
          getPenjualanPerCabang.data[k].penjualanTunai +
          getPenjualanPerCabang.data[k].uangMuka +
          getPenjualanPerCabang.data[k].angModal +
          getPenjualanPerCabang.data[k].angBunga +
          getPenjualanPerCabang.data[k].denda +
          getPenjualanPerCabang.data[k].biayaTarik;
        totalAll +=
          getPenjualanPerCabang.data[k].penjualanTunai +
          getPenjualanPerCabang.data[k].uangMuka +
          getPenjualanPerCabang.data[k].angModal +
          getPenjualanPerCabang.data[k].angBunga +
          getPenjualanPerCabang.data[k].denda +
          getPenjualanPerCabang.data[k].biayaTarik;
      }
      doc.text(`${total.toLocaleString()}`, 355, y - 2, {
        align: "right"
      });

      doc.text(`Cabang ${response.data[i]._id}`, 20, y - 2);
      doc.line(15, y, 360, y);
      total = 0;
      if (y > 180) {
        doc.line(15, 55, 15, y);
        doc.line(80, 55, 80, y);
        doc.line(80, yTenor - 7, 360, yTenor - 7); // 1
        doc.text(`Penjualan Tunai`, 87.5, yTenor - 2);
        doc.line(120.5, yTenor - 7, 120.5, y); // 2
        doc.text(`Uang Muka`, 130.5, yTenor - 2);
        doc.line(160, yTenor - 7, 160, y); // 3
        doc.text(`Angsuran Pokok`, 167.5, yTenor - 2);
        doc.line(200.5, yTenor - 7, 200.5, y); // 4
        doc.text(`Bunga`, 213.5, yTenor - 2);
        doc.line(240, yTenor - 7, 240, y); // 5
        doc.text(`Denda`, 253.5, yTenor - 2);
        doc.line(280.5, yTenor - 7, 280.5, y); // 6
        doc.text(`Biaya Tarik`, 290.5, yTenor - 2);
        doc.line(320, 55, 320, y); // Last Vertical Line
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
        doc.text(`Laporan Rekap Penerimaan`, 160, 30);
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
        doc.text(`Periode : `, 15, 45);
        y = 55;
        doc.line(15, y, 360, y);
        y += 5;
        doc.text(`Cabang`, 38, y + 8);
        doc.text(`Penerimaan`, 190, y);
        doc.text(`Total`, 330, y + 8);
        y += 10;
        doc.line(15, y, 360, y);
        hal++;
        doc.text(`Hal: ${hal}`, 350, 5);
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
    doc.text(`${totalAll.toLocaleString()}`, 355, y - 2, {
      align: "right"
    });
    // Vertical Line
    doc.line(15, 55, 15, y);
    doc.line(80, 55, 80, y);
    doc.line(80, yTenor - 7, 360, yTenor - 7); // 1
    doc.text(`Penjualan Tunai`, 87.5, yTenor - 2);
    doc.text(`${totalPenjualanTunai.toLocaleString()}`, 115, y - 2, {
      align: "right"
    });
    doc.line(120.5, yTenor - 7, 120.5, y); // 2
    doc.text(`Uang Muka`, 130.5, yTenor - 2);
    doc.text(`${totalUangMuka.toLocaleString()}`, 155, y - 2, {
      align: "right"
    });
    doc.line(160, yTenor - 7, 160, y); // 3
    doc.text(`Angsuran Pokok`, 167.5, yTenor - 2);
    doc.text(`${totalAngModal.toLocaleString()}`, 195, y - 2, {
      align: "right"
    });
    doc.line(200.5, yTenor - 7, 200.5, y); // 4
    doc.text(`Bunga`, 213.5, yTenor - 2);
    doc.text(`${totalAngBunga.toLocaleString()}`, 235, y - 2, {
      align: "right"
    });
    doc.line(240, yTenor - 7, 240, y); // 5
    doc.text(`Denda`, 253.5, yTenor - 2);
    doc.text(`${totalDenda.toLocaleString()}`, 275, y - 2, {
      align: "right"
    });
    doc.line(280.5, yTenor - 7, 280.5, y); // 6
    doc.text(`Biaya Tarik`, 290.5, yTenor - 2);
    doc.text(`${totalBiayaTarik.toLocaleString()}`, 315, y - 2, {
      align: "right"
    });
    doc.line(320, 55, 320, y); // Last Vertical Line
    doc.line(360, 55, 360, y);
    doc.line(15, y, 360, y);
    doc.save(`laporanRekapPenerimaan.pdf`);
  };

  return (
    <Box sx={container}>
      <Typography color="#757575">Laporan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Laporan Rekap Penerimaan
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

export default RekapPenerimaan;

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
