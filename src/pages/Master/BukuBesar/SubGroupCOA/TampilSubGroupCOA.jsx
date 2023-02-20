import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableSubGroupCOA } from "../../../../components/ShowTable";
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
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilSubGroupCOA = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");
  const [namaGroupCOA, setNamaGroupCOA] = useState("");
  const [kodeSubGroupCOA, setKodeSubGroupCOA] = useState("");
  const [namaSubGroupCOA, setNamaSubGroupCOA] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [subGroupCOAsData, setSubGroupCOAsData] = useState([]);
  const [subGroupCOAsForDoc, setSubGroupCOAsForDoc] = useState([]);
  const navigate = useNavigate();
  let isSubGroupCOAExist = kodeSubGroupCOA.length !== 0;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { title: "Kode Group", field: "kodeGroupCOA" },
    { title: "Kode Sub Group COA", field: "kodeSubGroupCOA" },
    { title: "Nama Sub Group COA", field: "namaSubGroupCOA" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = subGroupCOAsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeGroupCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaGroupCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.kodeSubGroupCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaSubGroupCOA.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(subGroupCOAsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getSubGroupCOAsForDoc();
    getSubGroupCOAsData();
    id && getSubGroupCOAById();
  }, [id]);

  const getSubGroupCOAsData = async () => {
    setLoading(true);
    try {
      const allSubGroupCOAs = await axios.post(`${tempUrl}/subGroupCOAs`, {
        id: user._id,
        token: user.token
      });
      setSubGroupCOAsData(allSubGroupCOAs.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getSubGroupCOAsForDoc = async () => {
    setLoading(true);
    try {
      const allSubGroupCOAsForDoc = await axios.post(
        `${tempUrl}/subGroupCOAsForDoc`,
        {
          id: user._id,
          token: user.token
        }
      );
      setSubGroupCOAsForDoc(allSubGroupCOAsForDoc.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getSubGroupCOAById = async () => {
    if (id) {
      const pickedSubGroupCOA = await axios.post(
        `${tempUrl}/subGroupCOAs/${id}`,
        {
          id: user._id,
          token: user.token
        }
      );
      setKodeGroupCOA(pickedSubGroupCOA.data.kodeGroupCOA);
      setNamaGroupCOA(pickedSubGroupCOA.data.namaGroupCOA);
      setKodeSubGroupCOA(pickedSubGroupCOA.data.kodeSubGroupCOA);
      setNamaSubGroupCOA(pickedSubGroupCOA.data.namaSubGroupCOA);
    }
  };

  const deleteSubGroupCOA = async (id) => {
    const findCoasKodeSubGroup = await axios.post(`${tempUrl}/COAsSubGroup`, {
      kodeSubGroupCOA,
      id: user._id,
      token: user.token
    });
    if (findCoasKodeSubGroup.data.length > 0) {
      // There's Record -> Forbid Delete
      handleClickOpen();
    } else {
      // No Record Found -> Delete
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/deleteSubGroupCOA/${id}`, {
          id: user._id,
          token: user.token
        });
        setKodeGroupCOA("");
        setKodeSubGroupCOA("");
        setNamaGroupCOA("");
        setNamaSubGroupCOA("");
        setLoading(false);
        navigate("/subGroupCOA");
      } catch (error) {
        console.log(error);
      }
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
    doc.text(`Daftar Sub Group COA`, 85, 30);
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
      body: subGroupCOAsForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarSubGroupCOA.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(subGroupCOAsForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Sub Group COA`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarSubGroupCOA.xlsx`);
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
        Sub Group COA
      </Typography>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Tidak bisa dihapus karena sudah ada data!`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Nama Sub Group COA data: ${namaSubGroupCOA}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
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
          kode={kodeSubGroupCOA}
          addLink={`/subGroupCOA/tambahSubGroupCOA`}
          editLink={`/subGroupCOA/${id}/edit`}
          deleteUser={deleteSubGroupCOA}
          nameUser={kodeSubGroupCOA}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isSubGroupCOAExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Kode Group COA</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={`${kodeGroupCOA} - ${namaGroupCOA}`}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Kode Sub Group
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeSubGroupCOA}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Sub Group
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaSubGroupCOA}
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
        <ShowTableSubGroupCOA
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

export default TampilSubGroupCOA;

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
