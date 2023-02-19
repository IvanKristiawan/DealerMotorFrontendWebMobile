import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl } from "../../../../contexts/ContextProvider";
import { useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableTipe } from "../../../../components/ShowTable";
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

const TampilTipe = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeTipe, setKodeTipe] = useState("");
  const [namaTipe, setNamaTipe] = useState("");
  const [noRangka, setNoRangka] = useState("");
  const [noMesin, setNoMesin] = useState("");
  const [isi, setIsi] = useState("");
  const [merk, setMerk] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tipesData, setTipesData] = useState([]);
  const [tipesForDoc, setTipesForDoc] = useState([]);
  const navigate = useNavigate();
  let isTipesExist = kodeTipe.length !== 0;

  const columns = [
    { title: "Kode", field: "kodeTipe" },
    { title: "Tipe / Merk", field: "namaTipe" },
    { title: "No. Rangka", field: "noRangka" },
    { title: "no. Mesin", field: "noMesin" },
    { title: "Isi", field: "isi" },
    { title: "Merk", field: "merk" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = tipesData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeTipe.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaTipe.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noRangka.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noMesin.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.isi.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.merk.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(tipesData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getTipesData();
    getTipesForDoc();
    id && getTipeById();
  }, [id]);

  const getTipesData = async () => {
    setLoading(true);
    try {
      const allTipes = await axios.post(`${tempUrl}/tipes`, {
        id: user._id,
        token: user.token
      });
      setTipesData(allTipes.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getTipesForDoc = async () => {
    setLoading(true);
    const allTipesForDoc = await axios.post(`${tempUrl}/tipesForDoc`, {
      id: user._id,
      token: user.token
    });
    setTipesForDoc(allTipesForDoc.data);
    setLoading(false);
  };

  const getTipeById = async () => {
    if (id) {
      const pickedTipe = await axios.post(`${tempUrl}/tipes/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeTipe(pickedTipe.data.kodeTipe);
      setNamaTipe(pickedTipe.data.namaTipe);
      setNoRangka(pickedTipe.data.noRangka);
      setNoMesin(pickedTipe.data.noMesin);
      setIsi(pickedTipe.data.isi);
      setMerk(pickedTipe.data.merk);
    }
  };

  const deleteTipe = async (id) => {
    setLoading(true);
    await axios.post(`${tempUrl}/deleteTipe/${id}`, {
      id: user._id,
      token: user.token
    });
    setKodeTipe("");
    setNamaTipe("");
    setNoRangka("");
    setNoMesin("");
    setIsi("");
    setMerk("");
    setLoading(false);
    navigate("/tipe");
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
    doc.text(`Daftar Tipe`, 90, 30);
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
      body: tipesData,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarTipe.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(tipesForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Tipe`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarTipe.xlsx`);
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
        Tipe/Merk
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
          kode={kodeTipe}
          addLink={`/tipe/tambahTipe`}
          editLink={`/tipe/${id}/edit`}
          deleteUser={deleteTipe}
          nameUser={kodeTipe}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isTipesExist && (
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
                value={kodeTipe}
              />
              <Typography sx={[labelInput, spacingTop]}>Nama Tipe</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaTipe}
              />
              <Typography sx={[labelInput, spacingTop]}>No. Rangka</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noRangka}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>No. Mesin</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noMesin}
              />
              <Typography sx={[labelInput, spacingTop]}>Isi</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={isi}
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
            </Box>
          </Box>
          <Divider sx={dividerStyle} />
        </>
      )}
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableTipe currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default TampilTipe;

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
