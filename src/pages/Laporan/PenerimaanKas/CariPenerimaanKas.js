import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Colors } from "../../../constants/styles";
import {
  Box,
  Typography,
  TextField,
  ButtonGroup,
  Button,
  Divider,
  Autocomplete
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const CariPenerimaanKas = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  let date = new Date();
  const [userInput, setUserInput] = useState(user.username);
  const [cabangInput, setCabangInput] = useState(user.cabang._id);
  let [inputDariTgl, setInputDariTgl] = useState(date);
  let [inputSampaiTgl, setInputSampaiTgl] = useState(date);
  const [totalUMuka, setTotalUMuka] = useState(0);
  const [totalAModal, setTotalAModal] = useState(0);
  const [totalABunga, setTotalABunga] = useState(0);
  const [totalDenda, setTotalDenda] = useState(0);
  const [totalJemputan, setTotalJemputan] = useState(0);
  const [totalBiTarik, setTotalBiTarik] = useState(0);
  const [total, setTotal] = useState(0);
  const [allUser, setAllUser] = useState([]);
  const [allCabang, setAllCabang] = useState([]);
  const [penerimaanKas, setPenerimaanKas] = useState([]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "No", field: "no" },
    { title: "Kwitansi", field: "noKwitansi" },
    { title: "Keterangan", field: "keterangan" },
    { title: "U.Muka", field: "uangMukaDoc" },
    { title: "A.Modal", field: "angModalDoc" },
    { title: "A.Bunga", field: "angBungaDoc" },
    { title: "Denda", field: "dendaDoc" },
    { title: "Jemputan", field: "jemputanDoc" },
    { title: "BI.Tarik", field: "biayaTarikDoc" },
    { title: "Total", field: "bayarDoc" }
  ];

  const userOptions = allUser.map((user) => ({
    label: `${user.username}`
  }));

  const cabangOptions = allCabang.map((user) => ({
    label: `${user._id} - ${user.namaCabang}`
  }));

  useEffect(() => {
    if (user.tipeUser !== "ADM") {
      getAllCabang();
    }
  }, []);

  const getAllUser = async (cabang) => {
    const allUsersPerCabang = await axios.post(`${tempUrl}/usersPerCabang`, {
      id: user._id,
      token: user.token,
      kodeCabang: cabang
    });
    setAllUser(allUsersPerCabang.data);
    setCabangInput(cabang);
    setUserInput("");
  };

  const getAllCabang = async () => {
    setLoading(true);
    const allCabang = await axios.post(`${tempUrl}/cabangs`, {
      id: user._id,
      token: user.token
    });
    setAllCabang(allCabang.data);
    setUserInput("");
    setCabangInput("");
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
    const response = await axios.post(`${tempUrl}/angsuransForPenerimaanKas`, {
      userInput,
      dariTgl,
      sampaiTgl,
      id: user._id,
      token: user.token,
      kodeCabang: cabangInput
    });

    let tempTotalUMuka = 0;
    let tempTotalAModal = 0;
    let tempTotalABunga = 0;
    let tempTotalDenda = 0;
    let tempTotalJemputan = 0;
    let tempTotalBiTarik = 0;
    let tempTotal = 0;
    let tempHeight = 50;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("l", "mm", [400, 210]);
    doc.setFontSize(12);
    let tempYStart = 10;
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Laporan Penerimaan Kas`, 180, 30);
    doc.setFontSize(10);
    doc.text(`Dari Tanggal : ${dariTgl} s/d ${sampaiTgl}`, 15, 35);
    doc.setFontSize(12);
    function alignCol(data) {
      var col = data.column.index;
      if (col >= 3 && col <= 9) {
        data.cell.styles.halign = "right";
      }
    }
    doc.autoTable({
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 50,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: response.data,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      },
      didDrawPage: (d) => {
        tempHeight = d.cursor.y;
      },
      didParseCell: function (cell, data) {
        alignCol(cell, data);
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 120 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
        7: { cellWidth: 30 },
        8: { cellWidth: 30 },
        9: { cellWidth: 30 },
        10: { cellWidth: 30 }
        // etc
      }
    });
    response.data.map((val) => {
      tempTotalUMuka += val.uangMuka;
      tempTotalAModal += val.angModal;
      tempTotalABunga += val.angBunga;
      tempTotalDenda += val.denda;
      tempTotalJemputan += val.jemputan;
      tempTotalBiTarik += val.biayaTarik;
      tempTotal += val.bayar;
    });
    doc.setDrawColor(0, 0, 0);
    doc.setFontSize(10);
    tempHeight += 2;
    if (tempHeight > 151) {
      doc.addPage();
      tempHeight = tempYStart;
    }
    doc.line(15, tempHeight, 380, tempHeight);
    tempHeight += 6;
    doc.text(`TOTAL : `, 15, tempHeight);
    doc.text(`${tempTotalUMuka.toLocaleString()}`, 197, tempHeight, {
      align: "right"
    });
    doc.text(`${tempTotalAModal.toLocaleString()}`, 227, tempHeight, {
      align: "right"
    });
    doc.text(`${tempTotalABunga.toLocaleString()}`, 257, tempHeight, {
      align: "right"
    });
    doc.text(`${tempTotalDenda.toLocaleString()}`, 287, tempHeight, {
      align: "right"
    });
    doc.text(`${tempTotalJemputan.toLocaleString()}`, 317, tempHeight, {
      align: "right"
    });
    doc.text(`${tempTotalBiTarik.toLocaleString()}`, 347, tempHeight, {
      align: "right"
    });
    doc.text(`${tempTotal.toLocaleString()}`, 377, tempHeight, {
      align: "right"
    });
    tempHeight += 4;
    doc.line(15, tempHeight, 380, tempHeight);
    tempHeight += 12;
    doc.text(`Mengetahui,`, 80, tempHeight);
    doc.text(`${setting.lokasiSP}, ${current_date}`, 290, tempHeight);
    doc.text(`Dibuat Oleh,`, 300, tempHeight + 6);
    tempHeight += 30;
    doc.line(60, tempHeight, 120, tempHeight);
    doc.line(280, tempHeight, 340, tempHeight);
    tempHeight += 6;
    doc.text(`${user.username}`, 80, tempHeight);
    doc.text(`SPV`, 307, tempHeight);
    doc.save(`laporanPenerimaanKas.pdf`);
  };

  const getPenerimaanKas = async () => {
    let tempUMuka = 0;
    let tempAModal = 0;
    let tempABunga = 0;
    let tempDenda = 0;
    let tempJemputan = 0;
    let tempBiTarik = 0;
    let tempTotal = 0;
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
    const response = await axios.post(`${tempUrl}/angsuransForPenerimaanKas`, {
      userInput,
      dariTgl,
      sampaiTgl,
      id: user._id,
      token: user.token,
      kodeCabang: cabangInput
    });
    setPenerimaanKas(response.data);
    response.data.map((val) => {
      tempUMuka += val.uangMuka;
      tempAModal += val.angModal;
      tempABunga += val.angBunga;
      tempDenda += val.denda;
      tempJemputan += val.jemputan;
      tempBiTarik += val.biayaTarik;
      tempTotal +=
        val.uangMuka +
        val.angModal +
        val.angBunga +
        val.denda +
        val.jemputan +
        val.biayaTarik;
    });
    setTotalUMuka(tempUMuka);
    setTotalAModal(tempAModal);
    setTotalABunga(tempABunga);
    setTotalDenda(tempDenda);
    setTotalJemputan(tempJemputan);
    setTotalBiTarik(tempBiTarik);
    setTotal(tempTotal);
    setTimeout(() => {
      onDownload();
    }, 2000);
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Penerimaan Kas",
    sheet: "PenerimaanKas"
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Laporan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Cari Penerimaan Kas
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={showDataWrapper}>
        <Typography sx={[labelInput, spacingTop]}>Cabang</Typography>
        {user.tipeUser === "ADM" ? (
          <TextField
            size="small"
            id="outlined-basic"
            variant="outlined"
            value={cabangInput}
            InputProps={{
              readOnly: true
            }}
            sx={{ backgroundColor: Colors.grey400 }}
          />
        ) : (
          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={cabangOptions}
            renderInput={(params) => (
              <TextField
                size="small"
                error={error && cabangInput.length === 0 && true}
                helperText={
                  error && cabangInput.length === 0 && "Cabang harus diisi!"
                }
                placeholder="SEMUA CABANG"
                {...params}
              />
            )}
            onInputChange={(e, value) => {
              getAllUser(value.split(" ", 1)[0]);
            }}
          />
        )}
        <Typography sx={[labelInput, spacingTop]}>Kasir</Typography>
        {user.tipeUser === "ADM" ? (
          <TextField
            size="small"
            id="outlined-basic"
            variant="outlined"
            value={userInput}
            InputProps={{
              readOnly: true
            }}
            sx={{ backgroundColor: Colors.grey400 }}
          />
        ) : (
          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={userOptions}
            renderInput={(params) => (
              <TextField
                size="small"
                error={error && userInput.length === 0 && true}
                helperText={
                  error && userInput.length === 0 && "Username harus diisi!"
                }
                placeholder="SEMUA USER"
                {...params}
              />
            )}
            onInputChange={(e, value) => setUserInput(value)}
            value={userInput}
          />
        )}
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
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => downloadPdf()}
          >
            CETAK
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => {
              getPenerimaanKas();
            }}
          >
            EXCEL
          </Button>
        </ButtonGroup>
      </Box>
      <table ref={tableRef} style={{ visibility: "hidden" }}>
        <tbody>
          <tr>
            <th>Laporan Penerimaan Kas</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th>No</th>
            <th>Kwitansi</th>
            <th>Keterangan</th>
            <th>U.Muka</th>
            <th>A.Modal</th>
            <th>A.Bunga</th>
            <th>Denda</th>
            <th>Jemputan</th>
            <th>Bi.Tarik</th>
            <th>Total</th>
          </tr>
          {penerimaanKas.map((item, i) => (
            <tr>
              <th>{item.no}</th>
              <th>{item.noKwitansi}</th>
              <th>{item.keterangan}</th>
              <th>{item.uangMuka}</th>
              <th>{item.angModal}</th>
              <th>{item.angBunga}</th>
              <th>{item.denda}</th>
              <th>{item.jemputan}</th>
              <th>{item.biayaTarik}</th>
              <th>
                {item.uangMuka +
                  item.angModal +
                  item.angBunga +
                  item.denda +
                  item.jemputan +
                  item.biayaTarik}
              </th>
            </tr>
          ))}
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th>{totalUMuka}</th>
            <th>{totalAModal}</th>
            <th>{totalABunga}</th>
            <th>{totalDenda}</th>
            <th>{totalJemputan}</th>
            <th>{totalBiTarik}</th>
            <th>{total}</th>
          </tr>
        </tbody>
      </table>
    </Box>
  );
};

export default CariPenerimaanKas;

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
