import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDaftarStok } from "../../../components/ShowTable";
import { SearchBar, Loader, usePagination } from "../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Pagination,
  Button,
  ButtonGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const TampilDaftarStok = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [noBeli, setNoBeli] = useState("");
  const [tanggalBeli, setTanggalBeli] = useState("");
  const [supplier, setSupplier] = useState("");
  const [merk, setMerk] = useState("");
  const [tipe, setTipe] = useState("");
  const [noRangka, setNoRangka] = useState("");
  const [noMesin, setNoMesin] = useState("");
  const [nopol, setNopol] = useState("");
  const [namaStnk, setNamaStnk] = useState("");
  const [tglStnk, setTglStnk] = useState("");
  const [jenisBeli, setJenisBeli] = useState("");
  const [hargaSatuan, setHargaSatuan] = useState("");
  const [tanggalJual, setTanggalJual] = useState("");
  const [noJual, setNoJual] = useState("");
  const [namaWarna, setNamaWarna] = useState("");
  const [tahun, setTahun] = useState("");
  const [totalBiayaPerawatan, setTotalBiayaPerawatan] = useState("");
  const [daftarStoksLength, setDaftarStoksLength] = useState("");
  const [value, setValue] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [daftarStoksData, setDaftarStoksData] = useState([]);
  const [daftarStoksForDoc, setDaftarStoksForDoc] = useState([]);
  const [daftarStoksForPdf, setDaftarStoksForPdf] = useState([]);
  const [rekapStoks, setRekapStoks] = useState([]);
  const [tipes, setTipes] = useState([]);
  let isDaftarStoksExist = noBeli.length !== 0;

  const columns = [
    { title: "No Beli", field: "noBeli" },
    { title: "Tanggal", field: "tanggalBeli" },
    { title: "Supplier", field: "supplier" },
    { title: "Tipe", field: "tipe" },
    { title: "No Rangka", field: "noRangka" },
    { title: "No Mesin", field: "noMesin" },
    { title: "Nama Stnk", field: "namaStnk" },
    { title: "Tgl Stnk", field: "tglStnk" },
    { title: "Harga", field: "hargaTable" },
    { title: "Tanggal Jual", field: "tanggalJual" },
    { title: "No Jual", field: "noJual" }
  ];

  const columnsRekap = [
    { title: "Tipe", field: "_id" },
    { title: "Total", field: "total" },
    { title: "Harga", field: "hargaTable" }
  ];

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = daftarStoksData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.merk.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noRangka.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noMesin.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.nopol.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaStnk.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jenisBeli.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.supplier.kodeSupplier
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.supplier.namaSupplier
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.tipe.toUpperCase().includes(searchTerm.toUpperCase()) ||
      tipes
        .filter((tipe) => tipe.kodeTipe === val.tipe)
        .map((sup) => sup.namaTipe)
        .includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(daftarStoksData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleChangeLaporan = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    getTipe();
    getDaftarStoksData();
    getRekapStoks();
    getDaftarStoksLength();
    getDaftarStoksForDoc();
    id && getDaftarStokById();
  }, [id, value]);

  const getTipe = async () => {
    setLoading(true);
    const allTipesMainInfo = await axios.post(`${tempUrl}/tipesMainInfo`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setTipes(allTipesMainInfo.data);
    setLoading(false);
  };

  const getRekapStoks = async () => {
    setLoading(true);
    let response;
    switch (value) {
      case "terjual":
        response = await axios.post(`${tempUrl}/daftarStoksRekapTerjual`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        break;
      case "belum":
        response = await axios.post(`${tempUrl}/daftarStoksRekapBlmTerjual`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        break;
      default:
        response = await axios.post(`${tempUrl}/daftarStoksRekap`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
    }
    setRekapStoks(groupBy(response.data, "merk"));
    setLoading(false);
  };

  const getDaftarStoksData = async () => {
    setLoading(true);
    let response;
    switch (value) {
      case "terjual":
        response = await axios.post(`${tempUrl}/daftarStoksTerjual`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        setDaftarStoksData(response.data);
        break;
      case "belum":
        response = await axios.post(`${tempUrl}/daftarStoksBelumTerjual`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        setDaftarStoksData(response.data);
        break;
      default:
        response = await axios.post(`${tempUrl}/daftarStoks`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        setDaftarStoksData(response.data);
    }
    setLoading(false);
  };

  const getDaftarStoksLength = async () => {
    setLoading(true);
    const daftarStoksLength = await axios.post(`${tempUrl}/daftarStoksLength`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setDaftarStoksLength(daftarStoksLength.data);
    setLoading(false);
  };

  const getDaftarStoksForDoc = async () => {
    setLoading(true);
    let response;
    switch (value) {
      case "terjual":
        response = await axios.post(`${tempUrl}/daftarStoksTerjualForDoc`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        break;
      case "belum":
        response = await axios.post(
          `${tempUrl}/daftarStoksBelumTerjualForDoc`,
          {
            id: user._id,
            token: user.token,
            kodeCabang: user.cabang._id
          }
        );
        break;
      default:
        response = await axios.post(`${tempUrl}/daftarStoksForDoc`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
    }
    setDaftarStoksForDoc(response.data);
    setDaftarStoksForPdf(groupBy(response.data, "merk"));
    setLoading(false);
  };

  const getDaftarStokById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/daftarStoks/${id}`, {
        id: user._id,
        token: user.token
      });
      setNoBeli(response.data.noBeli);
      setTanggalBeli(response.data.tanggalBeli);
      setSupplier(response.data.supplier);
      setMerk(response.data.merk);
      setTipe(response.data.tipe);
      setNoRangka(response.data.noRangka);
      setNoMesin(response.data.noMesin);
      setNopol(response.data.nopol);
      setNamaWarna(response.data.namaWarna);
      setTahun(response.data.tahun);
      setNamaStnk(response.data.namaStnk);
      setTglStnk(response.data.tglStnk);
      setJenisBeli(response.data.jenisBeli);
      setHargaSatuan(response.data.hargaSatuan);
      setTanggalJual(response.data.tanggalJual);
      setNoJual(response.data.noJual);
      setTotalBiayaPerawatan(response.data.totalBiayaPerawatan);
    }
  };

  const downloadPdf = () => {
    let tempTotal = 0;
    let tempSubTotal = 0;
    let tempSubGroupHeight = 35;
    let tempHeight = 35;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("l", "mm", [250, 210]);
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar Stok`, 110, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      200
    );
    for (var i = 0; i < Object.keys(daftarStoksForPdf).length; i++) {
      doc.setFontSize(10);
      doc.text(
        `Merk : ${Object.values(daftarStoksForPdf)[i][0].merk}`,
        15,
        tempSubGroupHeight + 5
      );
      doc.autoTable({
        styles: {
          fontSize: 8
        },
        startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 43,
        columns: columns.map((col) => ({
          ...col,
          dataKey: col.field
        })),
        body: Object.values(daftarStoksForPdf)[i],
        headStyles: {
          fillColor: [117, 117, 117],
          color: [0, 0, 0]
        },
        didDrawPage: (d) => {
          tempSubGroupHeight = d.cursor.y;
          tempHeight = d.cursor.y;
        }
      });
      Object.values(daftarStoksForPdf)[i].map((val) => {
        tempSubTotal += val.hargaSatuan;
        tempTotal += val.hargaSatuan;
      });
      doc.setFontSize(8);
      doc.text(
        `Sub Total : ${
          Object.values(daftarStoksForPdf)[i].length
        } | Rp ${tempSubTotal.toLocaleString()}`,
        180,
        tempHeight + 2
      );
      tempSubTotal = 0;
    }
    doc.setFontSize(10);
    doc.text(
      `Total : ${daftarStoksLength} | Rp ${tempTotal.toLocaleString()}`,
      180,
      tempHeight + 8
    );
    doc.save(`daftarStok.pdf`);
  };

  const downloadRekap = () => {
    let tempTotal = 0;
    let tempSubTotal = 0;
    let tempSubGroupHeight = 35;
    let tempHeight = 35;
    let tempCount = 0;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Rekap Stok`, 90, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    function alignCol(data) {
      var col = data.column.index;
      if (col == 2) {
        data.cell.styles.halign = "right";
      }
    }
    for (var i = 0; i < Object.keys(rekapStoks).length; i++) {
      doc.setFontSize(10);
      doc.text(
        `Merk : ${Object.values(rekapStoks)[i][0].merk}`,
        15,
        tempSubGroupHeight + 5
      );
      doc.autoTable({
        styles: {
          fontSize: 8
        },
        startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 43,
        columns: columnsRekap.map((col) => ({ ...col, dataKey: col.field })),
        body: Object.values(rekapStoks)[i],
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
        }
      });
      Object.values(rekapStoks)[i].map((val) => {
        tempSubTotal += val.harga;
        tempTotal += val.harga;
      });
      for (let j = 0; j < Object.values(rekapStoks)[i].length; j++) {
        tempCount += Object.values(rekapStoks)[i][j].total;
      }
      if (tempHeight > 275) {
        doc.addPage();
        tempHeight = 10;
      }
      doc.setFontSize(8);
      doc.text(
        `Sub Total : ${tempCount} | Rp ${tempSubTotal.toLocaleString()}`,
        194,
        tempHeight + 2,
        {
          align: "right"
        }
      );
      tempSubTotal = 0;
      tempCount = 0;
    }
    doc.setFontSize(10);
    doc.text(
      `Total : ${daftarStoksLength} | Rp ${tempTotal.toLocaleString()}`,
      194,
      tempHeight + 8,
      {
        align: "right"
      }
    );
    doc.save(`rekapStok.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(daftarStoksForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Daftar Stok`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarStok.xlsx`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Stok</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Stok
      </Typography>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            startIcon={<FormatListBulletedIcon />}
            onClick={() => downloadRekap()}
          >
            REKAP
          </Button>
          <Button startIcon={<PrintIcon />} onClick={() => downloadPdf()}>
            RINCI
          </Button>
          <Button startIcon={<DownloadIcon />} onClick={() => downloadExcel()}>
            EXCEL
          </Button>
        </ButtonGroup>
      </Box>
      <Divider sx={dividerStyle} />
      <FormControl sx={{ marginTop: 1 }}>
        <FormLabel id="demo-controlled-radio-buttons-group">Laporan</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          defaultValue="semua"
          value={value}
          onChange={handleChangeLaporan}
        >
          <FormControlLabel
            value="terjual"
            control={<Radio />}
            label="Terjual"
          />
          <FormControlLabel
            value="belum"
            control={<Radio />}
            label="Belum Terjual"
          />
          <FormControlLabel value="semua" control={<Radio />} label="Semua" />
        </RadioGroup>
      </FormControl>
      <Divider sx={{ marginTop: 1 }} />
      {isDaftarStoksExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>No. Beli</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noBeli}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Tanggal Beli
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tanggalBeli}
              />
              <Typography sx={[labelInput, spacingTop]}>Supplier</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={`${supplier.kodeSupplier} - ${supplier.namaSupplier}
                `}
              />
              <Typography sx={[labelInput, spacingTop]}>Merk</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={merk}
              />
              <Typography sx={[labelInput, spacingTop]}>Tipe</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={`${tipe} - ${tipes
                  .filter((tipe1) => tipe1.kodeTipe === tipe)
                  .map((sup) => `${sup.namaTipe}`)}
                `}
              />
              <Typography sx={[labelInput, spacingTop]}>Nama Warna</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaWarna}
              />
              <Typography sx={[labelInput, spacingTop]}>Tahun</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tahun}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Total Biaya Perawatan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={totalBiayaPerawatan.toLocaleString()}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>No. Rangka</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noRangka}
              />
              <Typography sx={[labelInput, spacingTop]}>No. Mesin</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noMesin}
              />
              <Typography sx={[labelInput, spacingTop]}>Nopol</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={nopol}
              />
              <Typography sx={[labelInput, spacingTop]}>Nama Stnk</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaStnk}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Tanggal Stnk
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tglStnk}
              />
              <Typography sx={[labelInput, spacingTop]}>Jenis Beli</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={jenisBeli}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Harga Satuan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={hargaSatuan.toLocaleString()}
              />
            </Box>
          </Box>
          <Divider sx={dividerStyle} />
        </>
      )}
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarStok
          currentPosts={currentPosts}
          searchTerm={searchTerm}
          tipes={tipes}
        />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Box>
  );
};

export default TampilDaftarStok;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  pt: 4
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center"
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const spacingTop = {
  mt: 4
};

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
