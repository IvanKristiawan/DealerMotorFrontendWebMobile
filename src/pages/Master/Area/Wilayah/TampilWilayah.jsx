import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableWilayah } from "../../../../components/ShowTable";
import { FetchErrorHandling } from "../../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Pagination,
  Button,
  ButtonGroup
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilWilayah = () => {
  const { user, setting, dispatch } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeWilayah, setKodeWilayah] = useState("");
  const [namaWilayah, setNamaWilayah] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [wilayahsData, setWilayahsData] = useState([]);
  const [wilayahsDataForDoc, setWilayahsDataForDoc] = useState([]);
  const navigate = useNavigate();
  let isWilayahExist = kodeWilayah.length !== 0;

  const columns = [
    { title: "Kode Wilayah", field: "kodeWilayah" },
    { title: "Nama Wilayah", field: "namaWilayah" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = wilayahsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeWilayah.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaWilayah.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(wilayahsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getWilayahsDataForDoc();
    getWilayahsData();
    id && getWilayahById();
  }, [id]);

  const getWilayahsData = async () => {
    setLoading(true);
    try {
      const allWilayahs = await axios.post(`${tempUrl}/wilayahs`, {
        id: user._id,
        token: user.token
      });
      setWilayahsData(allWilayahs.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getWilayahsDataForDoc = async () => {
    setLoading(true);
    try {
      const allWilayahsForDoc = await axios.post(`${tempUrl}/wilayahsForDoc`, {
        id: user._id,
        token: user.token
      });
      setWilayahsDataForDoc(allWilayahsForDoc.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getWilayahById = async () => {
    if (id) {
      const pickedWilayah = await axios.post(`${tempUrl}/wilayahs/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeWilayah(pickedWilayah.data.kodeWilayah);
      setNamaWilayah(pickedWilayah.data.namaWilayah);
    }
  };

  const deleteWilayah = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteWilayah/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeWilayah("");
      setNamaWilayah("");
      setLoading(false);
      navigate("/wilayah");
    } catch (error) {
      console.log(error);
    }
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
    doc.text(`Daftar Wilayah`, 90, 30);
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
      body: wilayahsDataForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarWilayah.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(wilayahsDataForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Wilayah`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarWilayah.xlsx`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Wilayah
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
        <ButtonModifier
          id={id}
          kode={kodeWilayah}
          addLink={`/wilayah/tambahWilayah`}
          editLink={`/wilayah/${id}/edit`}
          deleteUser={deleteWilayah}
          nameUser={kodeWilayah}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isWilayahExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Kode</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeWilayah}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Wilayah
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaWilayah}
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
        <ShowTableWilayah currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default TampilWilayah;

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

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap"
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const textFieldStyle = {
  display: "flex",
  mt: 4
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

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
