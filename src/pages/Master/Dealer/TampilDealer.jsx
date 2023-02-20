import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDealer } from "../../../components/ShowTable";
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

const TampilDealer = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeDealer, setKodeDealer] = useState("");
  const [namaDealer, setNamaDealer] = useState("");
  const [alamatDealer, setAlamatDealer] = useState("");
  const [teleponDealer, setTeleponDealer] = useState("");
  const [PICDealer, setPICDealer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dealersData, setDealersData] = useState([]);
  const [dealersForDoc, setDealersForDoc] = useState([]);
  const navigate = useNavigate();
  let isDealerExist = kodeDealer.length !== 0;

  const columns = [
    { title: "Kode", field: "kodeDealer" },
    { title: "Nama Dealer", field: "namaDealer" },
    { title: "Alamat", field: "alamatDealer" },
    { title: "Telepon", field: "teleponDealer" },
    { title: "PIC", field: "PICDealer" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = dealersData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeDealer.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaDealer.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.alamatDealer.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.teleponDealer.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.PICDealer.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(dealersData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getDealersForDoc();
    getDealersData();
    id && getDealerById();
  }, [id]);

  const getDealersData = async () => {
    setLoading(true);
    try {
      const allDealers = await axios.post(`${tempUrl}/dealers`, {
        id: user._id,
        token: user.token
      });
      setDealersData(allDealers.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getDealersForDoc = async () => {
    setLoading(true);
    try {
      const allDealersForDoc = await axios.post(`${tempUrl}/dealersForDoc`, {
        id: user._id,
        token: user.token
      });
      setDealersForDoc(allDealersForDoc.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getDealerById = async () => {
    if (id) {
      const pickedDealer = await axios.post(`${tempUrl}/dealers/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeDealer(pickedDealer.data.kodeDealer);
      setNamaDealer(pickedDealer.data.namaDealer);
      setAlamatDealer(pickedDealer.data.alamatDealer);
      setTeleponDealer(pickedDealer.data.teleponDealer);
      setPICDealer(pickedDealer.data.PICDealer);
    }
  };

  const deleteDealer = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteDealer/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeDealer("");
      setNamaDealer("");
      setAlamatDealer("");
      setTeleponDealer("");
      setPICDealer("");
      setLoading(false);
      navigate("/dealer");
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
    doc.text(`Daftar Dealer`, 90, 30);
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
      body: dealersForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarDealer.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(dealersForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Dealer`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarDealer.xlsx`);
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
        Dealer
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
          kode={kodeDealer}
          addLink={`/dealer/tambahDealer`}
          editLink={`/dealer/${id}/edit`}
          deleteUser={deleteDealer}
          nameUser={kodeDealer}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isDealerExist && (
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
                value={kodeDealer}
              />
              <Typography sx={[labelInput, spacingTop]}>Nama Dealer</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaDealer}
              />
              <Typography sx={[labelInput, spacingTop]}>Alamat</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={alamatDealer}
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
                value={teleponDealer}
              />
              <Typography sx={[labelInput, spacingTop]}>PIC</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={PICDealer}
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
        <ShowTableDealer currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default TampilDealer;

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
