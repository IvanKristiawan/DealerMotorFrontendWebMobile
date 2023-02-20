import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableGroupCOA } from "../../../../components/ShowTable";
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

const TampilGroupCOA = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeJenisCOA, setKodeJenisCOA] = useState("");
  const [namaJenisCOA, setNamaJenisCOA] = useState("");
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");
  const [namaGroupCOA, setNamaGroupCOA] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [groupCOAsData, setGroupCOAsData] = useState([]);
  const [groupCOAsDataForDoc, setGroupCOAsDataForDoc] = useState([]);
  const navigate = useNavigate();
  let isGroupCOAExist = kodeGroupCOA.length !== 0;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { title: "Kode Jenis", field: "kodeJenisCOA" },
    { title: "Nama Jenis", field: "namaJenisCOA" },
    { title: "Kode Group COA", field: "kodeGroupCOA" },
    { title: "Nama Group COA", field: "namaGroupCOA" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = groupCOAsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeJenisCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaJenisCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.kodeGroupCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaGroupCOA.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(groupCOAsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getGroupCOAsForDoc();
    getGroupCOAsData();
    id && getGroupCOAById();
  }, [id]);

  const getGroupCOAsData = async () => {
    setLoading(true);
    try {
      const allGroupCOAs = await axios.post(`${tempUrl}/groupCOAs`, {
        id: user._id,
        token: user.token
      });
      setGroupCOAsData(allGroupCOAs.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getGroupCOAsForDoc = async () => {
    setLoading(true);
    try {
      const allGroupCOAsForDoc = await axios.post(
        `${tempUrl}/groupCOAsForDoc`,
        {
          id: user._id,
          token: user.token
        }
      );
      setGroupCOAsDataForDoc(allGroupCOAsForDoc.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getGroupCOAById = async () => {
    if (id) {
      const pickedGroupCOA = await axios.post(`${tempUrl}/groupCOAs/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeJenisCOA(pickedGroupCOA.data.kodeJenisCOA);
      setNamaJenisCOA(pickedGroupCOA.data.namaJenisCOA);
      setKodeGroupCOA(pickedGroupCOA.data.kodeGroupCOA);
      setNamaGroupCOA(pickedGroupCOA.data.namaGroupCOA);
    }
  };

  const deleteGroupCOA = async (id) => {
    const findSubGroupsKodeGroup = await axios.post(
      `${tempUrl}/subGroupCOAsKodeGroup`,
      {
        kodeGroupCOA,
        id: user._id,
        token: user.token
      }
    );
    if (findSubGroupsKodeGroup.data.length > 0) {
      // There's Record -> Forbid Delete
      handleClickOpen();
    } else {
      // No Record Found -> Delete
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/deleteGroupCOA/${id}`, {
          id: user._id,
          token: user.token
        });
        setKodeJenisCOA("");
        setKodeGroupCOA("");
        setNamaGroupCOA("");
        setLoading(false);
        navigate("/groupCOA");
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
    doc.text(`Daftar Group COA`, 85, 30);
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
      body: groupCOAsDataForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarGroupCOA.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(groupCOAsDataForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Group COA`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarGroupCOA.xlsx`);
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
        Group COA
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Tidak bisa dihapus karena sudah ada data!`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Nama Group COA data: ${namaGroupCOA}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={kodeGroupCOA}
          addLink={`/groupCOA/tambahGroupCOA`}
          editLink={`/groupCOA/${id}/edit`}
          deleteUser={deleteGroupCOA}
          nameUser={kodeGroupCOA}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isGroupCOAExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Kode Jenis</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={`${kodeJenisCOA} - ${namaJenisCOA}`}
              />
              <Typography sx={[labelInput, spacingTop]}>NamaJenis</Typography>
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
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Kode Group</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeGroupCOA}
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
                value={namaGroupCOA}
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
        <ShowTableGroupCOA
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

export default TampilGroupCOA;

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

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};
