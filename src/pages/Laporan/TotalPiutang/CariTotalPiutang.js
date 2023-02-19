import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import {
  Box,
  Typography,
  TextField,
  ButtonGroup,
  Button,
  Divider,
  Autocomplete
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const CariTotalPiutang = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const [cabangInput, setCabangInput] = useState("");
  const [sisaBulan, setSisaBulan] = useState("");
  const [kodeMarketing, setKodeMarketing] = useState("");
  const [kodeSurveyor, setKodeSurveyor] = useState("");
  const [totalPModal, setTotalPModal] = useState(0);
  const [totalPBunga, setTotalPBunga] = useState(0);
  const [total, setTotal] = useState(0);
  const [marketings, setMarketings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [totalPiutang, setTotalPiutang] = useState([]);
  const [allCabang, setAllCabang] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "No", field: "no" },
    { title: "Tanggal", field: "tglAng" },
    { title: "Nama", field: "namaRegister" },
    { title: "No. Jual", field: "noJual" },
    { title: "No. Telp", field: "tlpRegister" },
    { title: "Nopol", field: "nopol" },
    { title: "Tipe", field: "tipe" },
    { title: "Thn", field: "tahun" },
    { title: "P. Modal", field: "pModal" },
    { title: "P. Bunga", field: "pBunga" },
    { title: "Total", field: "total" },
    { title: "S. Bln", field: "sisaBulan" }
  ];

  const marketingOptions = marketings.map((marketing) => ({
    label: `${marketing.kodeMarketing} - ${marketing.namaMarketing}`
  }));

  const surveyorOptions = surveyors.map((surveyor) => ({
    label: `${surveyor.kodeSurveyor} - ${surveyor.namaSurveyor}`
  }));

  const cabangOptions = allCabang.map((user) => ({
    label: `${user._id} - ${user.namaCabang}`
  }));

  useEffect(() => {
    getMarketing();
    getSurveyor();
    getAllCabang();
  }, []);

  const getMarketing = async () => {
    setLoading(true);
    const allMarketings = await axios.post(`${tempUrl}/marketings`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setMarketings(allMarketings.data);
    setLoading(false);
  };

  const getSurveyor = async () => {
    setLoading(true);
    const allSurveyors = await axios.post(`${tempUrl}/surveyors`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setSurveyors(allSurveyors.data);
    setLoading(false);
  };

  const getAllCabang = async () => {
    setLoading(true);
    const allCabang = await axios.post(`${tempUrl}/cabangs`, {
      id: user._id,
      token: user.token
    });
    setAllCabang(allCabang.data);
    setLoading(false);
  };

  const downloadPdf = async () => {
    const tempMarketing = await axios.post(`${tempUrl}/marketingByKode`, {
      kodeMarketing,
      id: user._id,
      token: user.token
    });
    const tempSurveyor = await axios.post(`${tempUrl}/surveyorByKode`, {
      kodeSurveyor,
      id: user._id,
      token: user.token
    });
    const responseForDoc = await axios.post(`${tempUrl}/totalPiutangsForDoc`, {
      sisaBulan,
      kodeMarketing: tempMarketing.data ? tempMarketing.data._id : null,
      kodeSurveyor: tempSurveyor.data ? tempSurveyor.data._id : null,
      id: user._id,
      token: user.token,
      kodeCabang: cabangInput
    });

    let tempTotal = 0;
    let tempPModal = 0;
    let tempPBunga = 0;
    let tempSubGroupHeight = 35;
    let tempHeight = 35;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("l", "mm", [330, 210]);
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Total Piutang`, 150, 30);
    doc.setFontSize(10);
    doc.text(
      `Marketing : ${kodeMarketing === "" ? "SEMUA MARKETING" : kodeMarketing}`,
      15,
      35
    );
    doc.text(
      `Surveyor : ${kodeSurveyor === "" ? "SEMUA SURVEYOR" : kodeSurveyor}`,
      15,
      40
    );
    doc.text(`Sisa Bulan : ${sisaBulan}`, 15, 45);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      200
    );
    doc.setFontSize(12);
    function alignCol(data) {
      var col = data.column.index;
      if (col == 8 || col == 9 || col == 10 || col == 11) {
        data.cell.styles.halign = "right";
      }
    }
    doc.autoTable({
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 50,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: responseForDoc.data,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      },
      didDrawPage: (d) => {
        tempSubGroupHeight = d.cursor.y;
        tempHeight = d.cursor.y;
      },
      didParseCell: function (cell, data) {
        alignCol(cell, data);
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 30 },
        9: { cellWidth: 30 },
        10: { cellWidth: 30 },
        11: { cellWidth: 20 }
        // etc
      }
    });
    responseForDoc.data.map((val) => {
      tempPModal += val.pModalNumber;
      tempPBunga += val.pBungaNumber;
      tempTotal += val.pModalNumber + val.pBungaNumber;
    });
    doc.setDrawColor(0, 0, 0);
    doc.setFontSize(10);
    tempHeight += 2;
    if (tempHeight > 180) {
      doc.addPage();
      tempHeight = 10;
    }
    doc.line(15, tempHeight, 310, tempHeight);
    tempHeight += 6;
    doc.text(`TOTAL : `, 15, tempHeight);
    doc.text(`${tempPModal.toLocaleString()}`, 227, tempHeight, {
      align: "right"
    });
    doc.text(`${tempPBunga.toLocaleString()}`, 257, tempHeight, {
      align: "right"
    });
    doc.text(`${tempTotal.toLocaleString()}`, 287, tempHeight, {
      align: "right"
    });
    tempHeight += 4;
    doc.line(15, tempHeight, 310, tempHeight);
    doc.save(`totalPiutang.pdf`);
  };

  const getTotalPiutang = async () => {
    let tempPModal = 0;
    let tempPBunga = 0;
    let tempTotal = 0;
    const tempMarketing = await axios.post(`${tempUrl}/marketingByKode`, {
      kodeMarketing,
      id: user._id,
      token: user.token
    });
    const tempSurveyor = await axios.post(`${tempUrl}/surveyorByKode`, {
      kodeSurveyor,
      id: user._id,
      token: user.token
    });
    const responseForDoc = await axios.post(`${tempUrl}/totalPiutangsForDoc`, {
      sisaBulan,
      kodeMarketing: tempMarketing.data ? tempMarketing.data._id : null,
      kodeSurveyor: tempSurveyor.data ? tempSurveyor.data._id : null,
      id: user._id,
      token: user.token,
      kodeCabang: cabangInput
    });
    setTotalPiutang(responseForDoc.data);
    responseForDoc.data.map((val) => {
      tempPModal += val.pModalNumber;
      tempPBunga += val.pBungaNumber;
      tempTotal += val.pModalNumber + val.pBungaNumber;
    });
    setTotalPModal(tempPModal.toLocaleString());
    setTotalPBunga(tempPBunga.toLocaleString());
    setTotal(tempTotal.toLocaleString());
    setTimeout(() => {
      onDownload();
    }, 2000);
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Total Piutang",
    sheet: "TotalPiutang"
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Laporan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Cari Total Piutang
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={showDataWrapper}>
        <Typography sx={[labelInput, spacingTop]}>Cabang</Typography>
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
            setCabangInput(value.split(" ", 1)[0]);
          }}
        />
        <Typography sx={[labelInput, spacingTop]}>Sisa Bulan</Typography>
        <TextField
          type="number"
          size="small"
          error={error && sisaBulan.length === 0 && true}
          helperText={
            error && sisaBulan.length === 0 && "Sisa Bulan harus diisi!"
          }
          id="outlined-basic"
          variant="outlined"
          value={sisaBulan}
          onChange={(e) => setSisaBulan(e.target.value)}
        />
        <Typography sx={[labelInput, spacingTop]}>Kode Marketing</Typography>
        <Autocomplete
          size="small"
          disablePortal
          id="combo-box-demo"
          options={marketingOptions}
          renderInput={(params) => (
            <TextField
              size="small"
              error={error && kodeMarketing.length === 0 && true}
              helperText={
                error &&
                kodeMarketing.length === 0 &&
                "Kode Marketing harus diisi!"
              }
              placeholder="SEMUA MARKETING"
              {...params}
            />
          )}
          onInputChange={(e, value) => setKodeMarketing(value.split(" ", 1)[0])}
        />
        <Typography sx={[labelInput, spacingTop]}>Kode Surveyor</Typography>
        <Autocomplete
          size="small"
          disablePortal
          id="combo-box-demo"
          options={surveyorOptions}
          renderInput={(params) => (
            <TextField
              size="small"
              error={error && kodeSurveyor.length === 0 && true}
              helperText={
                error &&
                kodeSurveyor.length === 0 &&
                "Kode Surveyor harus diisi!"
              }
              placeholder="SEMUA SURVEYOR"
              {...params}
            />
          )}
          onInputChange={(e, value) => setKodeSurveyor(value.split(" ", 1)[0])}
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
              getTotalPiutang();
            }}
          >
            EXCEL
          </Button>
        </ButtonGroup>
      </Box>
      <table ref={tableRef} style={{ visibility: "hidden" }}>
        <tbody>
          <tr>
            <th>Total Piutang</th>
            <th></th>
            <th></th>
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
            <th>Tanggal</th>
            <th>Nama</th>
            <th>No. Jual</th>
            <th>No. Telp</th>
            <th>Nopol</th>
            <th>Tipe</th>
            <th>Thn</th>
            <th>P. Modal</th>
            <th>P. Bunga</th>
            <th>Total</th>
            <th>S. Bln</th>
          </tr>

          {totalPiutang.map((item, i) => (
            <tr>
              <td>{item.no}</td>
              <td>{item.tglAng}</td>
              <td>{item.namaRegister}</td>
              <td>{item.noJual}</td>
              <td>{item.tlgRegister}</td>
              <td>{item.nopol}</td>
              <td>{item.tipe}</td>
              <td>{item.tahun}</td>
              <td>{item.pModal}</td>
              <td>{item.pBunga}</td>
              <td>{item.total}</td>
              <td>{item.sisaBulan}</td>
            </tr>
          ))}

          <tr>
            <th>TOTAL</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>{totalPModal}</th>
            <th>{totalPBunga}</th>
            <th>{total}</th>
            <th></th>
          </tr>
        </tbody>
      </table>
    </Box>
  );
};

export default CariTotalPiutang;

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
