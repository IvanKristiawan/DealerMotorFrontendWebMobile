import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDaftarReject } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader, usePagination } from "../../../components";
import {
  Box,
  Typography,
  Divider,
  Pagination,
  ButtonGroup,
  Button
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilDaftarReject = () => {
  const { user, setting } = useContext(AuthContext);
  const { screenSize } = useStateContext();
  let navigate = useNavigate();
  const [isFetchError, setIsFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectsData, setRejectsData] = useState([]);
  const [rejectsDataForDoc, setRejectsDataForDoc] = useState([]);

  const columns = [
    { title: "Tgl. Reject", field: "tglReject" },
    { title: "Nama", field: "namaReject" },
    { title: "Alamat", field: "alamatReject" },
    { title: "No. KK", field: "noKKReject" },
    { title: "No. KTP", field: "noKTPReject" },
    { title: "Telepon", field: "tlpReject" },
    { title: "Nopol", field: "nopolReject" },
    { title: "Catatan", field: "catatanReject" },
    { title: "Marketing", field: "marketing" },
    { title: "Surveyor", field: "surveyor" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = rejectsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.tglReject.includes(searchTerm) ||
      val.alamatReject.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noKKReject.toString().includes(searchTerm) ||
      val.noKTPReject
        .toString()
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.nopolReject
        .toString()
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.namaReject
        .toString()
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.tlpReject
        .toString()
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.catatanReject
        .toString()
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kodeMarketing.kodeMarketing
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kodeMarketing.namaMarketing
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kodeSurveyor.kodeSurveyor
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kodeSurveyor.namaSurveyor
        .toUpperCase()
        .includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(rejectsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getRejectsData();
    getRejectsDataForDoc();
  }, []);

  const getRejectsData = async () => {
    setLoading(true);
    try {
      const allRejects = await axios.post(`${tempUrl}/rejects`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setRejectsData(allRejects.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getRejectsDataForDoc = async () => {
    setLoading(true);
    try {
      const allRejectsForDoc = await axios.post(`${tempUrl}/rejectsForDoc`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setRejectsDataForDoc(allRejectsForDoc.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const downloadPdf = () => {
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
    doc.text(`Daftar Reject`, 90, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.setFontSize(12);
    doc.autoTable({
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: rejectsDataForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarReject.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(rejectsDataForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Reject`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarReject.xlsx`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Penjualan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Reject
      </Typography>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button startIcon={<PrintIcon />} onClick={() => downloadPdf()}>
            CETAK
          </Button>
          <Button startIcon={<DownloadIcon />} onClick={() => downloadExcel()}>
            EXCEL
          </Button>
        </ButtonGroup>
      </Box>
      <Box sx={buttonModifierContainer}>
        <ButtonGroup variant="contained">
          <Button
            color="success"
            sx={{ bgcolor: "success.light", textTransform: "none" }}
            startIcon={<AddCircleOutlineIcon />}
            size="small"
            onClick={() => {
              navigate(`/daftarReject/reject/tambahReject`);
            }}
          >
            Tambah
          </Button>
          <Button
            color="primary"
            sx={{ textTransform: "none" }}
            startIcon={<SearchIcon />}
            size="small"
            onClick={() => {
              navigate(`/daftarReject/cariReject`);
            }}
          >
            Cari Semua Reject
          </Button>
        </ButtonGroup>
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarReject
          currentPosts={currentPosts}
          searchTerm={searchTerm}
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

export default TampilDaftarReject;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const dividerStyle = {
  pt: 4
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

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
