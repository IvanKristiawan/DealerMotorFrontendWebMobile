import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableSurveyor } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
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

const TampilSurveyor = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeSurveyor, setKodeSurveyor] = useState("");
  const [namaSurveyor, setNamaSurveyor] = useState("");
  const [jenisSurveyor, setJenisSurveyor] = useState("");
  const [teleponSurveyor, setTeleponSurveyor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [surveyorsData, setSurveyorsData] = useState([]);
  const [surveyorsForDoc, setSurveyorsForDoc] = useState([]);
  const navigate = useNavigate();
  let isSurveyorExist = kodeSurveyor.length !== 0;

  const columns = [
    { title: "Kode", field: "kodeSurveyor" },
    { title: "Nama Surveyor", field: "namaSurveyor" },
    { title: "Jenis Surveyor", field: "jenisSurveyor" },
    { title: "Telepon Surveyor", field: "teleponSurveyor" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = surveyorsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeSurveyor.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaSurveyor.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jenisSurveyor.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.teleponSurveyor.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(surveyorsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getSurveyorsForDoc();
    getSurveyorsData();
    id && getSurveyorById();
  }, [id]);

  const getSurveyorsData = async () => {
    setLoading(true);
    try {
      const allSurveyors = await axios.post(`${tempUrl}/surveyors`, {
        id: user._id,
        token: user.token
      });
      setSurveyorsData(allSurveyors.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getSurveyorsForDoc = async () => {
    setLoading(true);
    try {
      const allSurveyorsForDoc = await axios.post(
        `${tempUrl}/surveyorsForDoc`,
        {
          id: user._id,
          token: user.token
        }
      );
      setSurveyorsForDoc(allSurveyorsForDoc.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getSurveyorById = async () => {
    if (id) {
      const pickedSurveyor = await axios.post(`${tempUrl}/surveyors/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeSurveyor(pickedSurveyor.data.kodeSurveyor);
      setNamaSurveyor(pickedSurveyor.data.namaSurveyor);
      setJenisSurveyor(pickedSurveyor.data.jenisSurveyor);
      setTeleponSurveyor(pickedSurveyor.data.teleponSurveyor);
    }
  };

  const deleteSurveyor = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteSurveyor/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeSurveyor("");
      setNamaSurveyor("");
      setJenisSurveyor("");
      setTeleponSurveyor("");
      setLoading(false);
      navigate("/surveyor");
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
    doc.text(`Daftar Surveyor`, 90, 30);
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
      body: surveyorsForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarSurveyor.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(surveyorsForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Surveyor`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarSurveyor.xlsx`);
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
        Surveyor
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
          kode={kodeSurveyor}
          addLink={`/surveyor/tambahSurveyor`}
          editLink={`/surveyor/${id}/edit`}
          deleteUser={deleteSurveyor}
          nameUser={kodeSurveyor}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isSurveyorExist && (
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
                value={kodeSurveyor}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Surveyor
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaSurveyor}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Telepon</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={teleponSurveyor}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Jenis Surveyor
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={jenisSurveyor}
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
        <ShowTableSurveyor
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

export default TampilSurveyor;

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
