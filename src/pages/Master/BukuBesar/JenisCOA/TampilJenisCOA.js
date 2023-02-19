import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableJenisCOA } from "../../../../components/ShowTable";
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

const TampilJenisCOA = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeJenisCOA, setKodeJenisCOA] = useState("");
  const [namaJenisCOA, setNamaJenisCOA] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [jenisCOAsData, setJenisCOAsData] = useState([]);
  const [jenisCOAsDataForDoc, setJenisCOAsDataForDoc] = useState([]);
  const navigate = useNavigate();
  let isJenisCOAExist = kodeJenisCOA.length !== 0;

  const columns = [
    { title: "Kode", field: "kodeJenisCOA" },
    { title: "Nama Jenis COA", field: "namaJenisCOA" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = jenisCOAsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeJenisCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaJenisCOA.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(jenisCOAsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getJenisCOAsForDoc();
    getJenisCOAsData();
    id && getJenisCOAById();
  }, [id]);

  const getJenisCOAsData = async () => {
    setLoading(true);
    try {
      const allJenisCOAs = await axios.post(`${tempUrl}/jenisCOAs`, {
        id: user._id,
        token: user.token
      });
      setJenisCOAsData(allJenisCOAs.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getJenisCOAsForDoc = async () => {
    setLoading(true);
    try {
      const allJenisCOAsForDoc = await axios.post(
        `${tempUrl}/jenisCOAsForDoc`,
        {
          id: user._id,
          token: user.token
        }
      );
      setJenisCOAsDataForDoc(allJenisCOAsForDoc.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getJenisCOAById = async () => {
    if (id) {
      const pickedJenisCOA = await axios.post(`${tempUrl}/jenisCOAs/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeJenisCOA(pickedJenisCOA.data.kodeJenisCOA);
      setNamaJenisCOA(pickedJenisCOA.data.namaJenisCOA);
    }
  };

  const deleteJenisCOA = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteJenisCOA/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeJenisCOA("");
      setNamaJenisCOA("");
      setLoading(false);
      navigate("/jenisCOA");
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
    doc.text(`Daftar Jenis COA`, 90, 30);
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
      body: jenisCOAsDataForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarJenisCOA.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(jenisCOAsDataForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Jenis COA`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarJenisCOA.xlsx`);
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
        Jenis COA
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
          kode={kodeJenisCOA}
          addLink={`/jenisCOA/tambahJenisCOA`}
          editLink={`/jenisCOA/${id}/edit`}
          deleteUser={deleteJenisCOA}
          nameUser={kodeJenisCOA}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isJenisCOAExist && (
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
                value={kodeJenisCOA}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Group COA
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaJenisCOA}
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
        <ShowTableJenisCOA
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

export default TampilJenisCOA;

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
