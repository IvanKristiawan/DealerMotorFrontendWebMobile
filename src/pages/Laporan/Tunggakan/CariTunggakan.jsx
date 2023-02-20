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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const CariTunggakan = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  var date = new Date();
  const [inputPerTanggal, setInputPerTanggal] = useState(date);
  const [lebihDari, setLebihDari] = useState("");
  const [sampaiDengan, setSampaiDengan] = useState("");
  const [kodeMarketing, setKodeMarketing] = useState("");
  const [kodeSurveyor, setKodeSurveyor] = useState("");
  const [marketings, setMarketings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [tunggakan, setTunggakan] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "No", field: "no" },
    { title: "No. Jual", field: "noJual" },
    { title: "Nama", field: "namaRegister" },
    { title: "Alm", field: "almRegister" },
    { title: "Tlp", field: "tlpRegister" },
    { title: "Tipe", field: "tipe" },
    { title: "Thn", field: "tahun" },
    { title: "Ang", field: "angPerBulan" },
    { title: "Surveyor", field: "kodeSurveyor" },
    { title: "Tenor", field: "tenor" },
    { title: "Sisa Bln", field: "sisaBulan" },
    { title: "JTO", field: "tglJatuhTempo" },
    { title: "MD1", field: "tglMd1" },
    { title: "MD2", field: "tglMd2" },
    { title: "MD3", field: "tglMd3" },
    { title: "SP", field: "tglSpTerakhir" },
    { title: "ST", field: "tglStTerakhir" },
    { title: "HR", field: "hr" }
  ];

  const marketingOptions = marketings.map((marketing) => ({
    label: `${marketing.kodeMarketing} - ${marketing.namaMarketing}`
  }));

  const surveyorOptions = surveyors.map((surveyor) => ({
    label: `${surveyor.kodeSurveyor} - ${surveyor.namaSurveyor}`
  }));

  useEffect(() => {
    getMarketing();
    getSurveyor();
  }, []);

  const getMarketing = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/marketings`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setMarketings(response.data);
    setLoading(false);
  };

  const getSurveyor = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/surveyors`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setSurveyors(response.data);
    setLoading(false);
  };

  const downloadPdf = async () => {
    let perTanggal =
      inputPerTanggal?.getFullYear() +
      "-" +
      (inputPerTanggal?.getMonth() + 1) +
      "-" +
      inputPerTanggal?.getDate();
    const tempMarketing = await axios.post(`${tempUrl}/marketingByKode`, {
      kodeMarketing,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    const tempSurveyor = await axios.post(`${tempUrl}/surveyorByKode`, {
      kodeSurveyor,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    const response = await axios.post(`${tempUrl}/jualsForTunggakan`, {
      perTanggal,
      lebihDari,
      sampaiDengan,
      kodeMarketing: tempMarketing.data ? tempMarketing.data._id : null,
      kodeSurveyor: tempSurveyor.data ? tempSurveyor.data._id : null,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });

    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("l", "mm", [400, 210]);
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Laporan Tunggakan`, 180, 30);
    doc.setFontSize(10);
    doc.text(`Per Tanggal : ${perTanggal}`, 15, 35);
    doc.text(
      `Marketing : ${kodeMarketing === "" ? "SEMUA MARKETING" : kodeMarketing}`,
      15,
      40
    );
    doc.text(
      `Surveyor : ${kodeSurveyor === "" ? "SEMUA SURVEYOR" : kodeSurveyor}`,
      15,
      45
    );
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      200
    );
    doc.setFontSize(12);
    doc.autoTable({
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 50,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: response.data,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`laporanTunggakan.pdf`);
  };

  const getTunggakan = async () => {
    let perTanggal =
      inputPerTanggal?.getFullYear() +
      "-" +
      (inputPerTanggal?.getMonth() + 1) +
      "-" +
      inputPerTanggal?.getDate();
    const tempMarketing = await axios.post(`${tempUrl}/marketingByKode`, {
      kodeMarketing,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    const tempSurveyor = await axios.post(`${tempUrl}/surveyorByKode`, {
      kodeSurveyor,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    const response = await axios.post(`${tempUrl}/jualsForTunggakan`, {
      perTanggal,
      lebihDari,
      sampaiDengan,
      kodeMarketing: tempMarketing.data ? tempMarketing.data._id : null,
      kodeSurveyor: tempSurveyor.data ? tempSurveyor.data._id : null,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setTunggakan(response.data);
    setTimeout(() => {
      onDownload();
    }, 2000);
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Laporan Tunggakan",
    sheet: "LaporanTunggakan"
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Laporan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Cari Tunggakan
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={showDataWrapper}>
        <Typography sx={[labelInput, spacingTop]}>Per. Tanggal</Typography>
        <DatePicker
          dateFormat="dd/MM/yyyy"
          selected={inputPerTanggal}
          onChange={(e) => setInputPerTanggal(e)}
          customInput={
            <TextField
              error={error && inputPerTanggal === null && true}
              helperText={
                error && inputPerTanggal === null && "Per. Tanggal harus diisi!"
              }
              sx={{ width: "100%" }}
              size="small"
            />
          }
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
        <Typography sx={[labelInput, spacingTop]}>Lebih dari</Typography>
        <TextField
          type="number"
          size="small"
          error={error && lebihDari.length === 0 && true}
          helperText={
            error && lebihDari.length === 0 && "Lebih dari harus diisi!"
          }
          id="outlined-basic"
          variant="outlined"
          value={lebihDari}
          onChange={(e) => setLebihDari(e.target.value)}
        />
        <Typography sx={[labelInput, spacingTop]}>Sampai dengan</Typography>
        <TextField
          type="number"
          size="small"
          error={error && sampaiDengan.length === 0 && true}
          helperText={
            error && sampaiDengan.length === 0 && "Sampai dengan harus diisi!"
          }
          id="outlined-basic"
          variant="outlined"
          value={sampaiDengan}
          onChange={(e) => setSampaiDengan(e.target.value)}
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
              getTunggakan();
            }}
          >
            EXCEL
          </Button>
        </ButtonGroup>
      </Box>
      <table ref={tableRef} style={{ visibility: "hidden" }}>
        <tbody>
          <tr>
            <th>Laporan Tunggakan</th>
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
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th>No</th>
            <th>No. Jual</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Telepon</th>
            <th>Tipe</th>
            <th>Angsuran</th>
            <th>Surveyor</th>
            <th>Tenor</th>
            <th>Sisa Bulan</th>
            <th>Jatuh Tempo</th>
            <th>MD1</th>
            <th>MD2</th>
            <th>MD3</th>
            <th>SP</th>
            <th>ST</th>
            <th>HR</th>
          </tr>
          {tunggakan.map((item, i) => (
            <tr>
              <th>{item.no}</th>
              <th>{item.noJual}</th>
              <th>{item.namaRegister}</th>
              <th>{item.almRegister}</th>
              <th>{item.tlpRegister}</th>
              <th>{item.tipe}</th>
              <th>{item.angPerBulan}</th>
              <th>{item.kodeSurveyor}</th>
              <th>{item.tenor}</th>
              <th>{item.sisaBulan}</th>
              <th>{item.tglJatuhTempo}</th>
              <th>{item.tglMd1}</th>
              <th>{item.tglMd2}</th>
              <th>{item.tglMd3}</th>
              <th>{item.tglSpTerakhir}</th>
              <th>{item.tglStTerakhir}</th>
              <th>{item.hr}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default CariTunggakan;

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
