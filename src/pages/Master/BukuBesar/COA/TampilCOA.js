import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableCOA } from "../../../../components/ShowTable";
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

const TampilCOA = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeCOA, setKodeCOA] = useState("");
  const [namaCOA, setNamaCOA] = useState("");
  const [jenisCOA, setJenisCOA] = useState("");
  const [subGroupCOA, setSubGroupCOA] = useState("");
  const [groupCOA, setGroupCOA] = useState("");
  const [jenisSaldo, setJenisSaldo] = useState("");
  const [kasBank, setKasBank] = useState("");
  const [bulan, setBulan] = useState("");
  const [COAsData, setCOAsData] = useState([]);
  const [COAsForDoc, setCOAsForDoc] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  let isCOAExist = kodeCOA.length !== 0;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { title: "Kode", field: "kodeCOA" },
    { title: "Nama COA", field: "namaCOA" },
    { title: "Jenis COA", field: "jenisCOA" },
    { title: "Sub Group COA", field: "subGroupCOA" },
    { title: "Group COA", field: "groupCOA" },
    { title: "Jenis Saldo", field: "jenisSaldo" },
    { title: "Kas/Bank", field: "kasBank" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = COAsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jenisCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.subGroupCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.groupCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jenisSaldo.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.kasBank.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(COAsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getCOAsForDoc();
    getCOAsData();
    id && getGroupCOAById();
  }, [id]);

  const getCOAsData = async () => {
    setLoading(true);
    try {
      const allCOAs = await axios.post(`${tempUrl}/COAsForDoc`, {
        id: user._id,
        token: user.token
      });
      setCOAsData(allCOAs.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getCOAsForDoc = async () => {
    setLoading(true);
    try {
      const allCOAsForDoc = await axios.post(`${tempUrl}/COAsForDocNoId`, {
        id: user._id,
        token: user.token
      });
      setCOAsForDoc(allCOAsForDoc.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getGroupCOAById = async () => {
    if (id) {
      const pickedWilayah = await axios.post(`${tempUrl}/COAs/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeCOA(pickedWilayah.data.kodeCOA);
      setNamaCOA(pickedWilayah.data.namaCOA);
      setJenisCOA(pickedWilayah.data.jenisCOA);
      setSubGroupCOA(pickedWilayah.data.subGroupCOA);
      setGroupCOA(pickedWilayah.data.groupCOA);
      setJenisSaldo(pickedWilayah.data.jenisSaldo);
      setKasBank(pickedWilayah.data.kasBank);
    }
  };

  const deleteCOA = async (id) => {
    try {
      let findCOARecord = await axios.post(`${tempUrl}/neracaSaldoAllRecord`, {
        kodeCOA,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      if (findCOARecord.data.length > 0) {
        // There's Record -> Forbid Delete
        setBulan(findCOARecord.data[0].bulan);
        handleClickOpen();
      } else {
        // No Record Found -> Delete
        setLoading(true);
        await axios.post(`${tempUrl}/deleteCOA/${id}`, {
          id: user._id,
          token: user.token
        });
        setKodeCOA("");
        setNamaCOA("");
        setSubGroupCOA("");
        setGroupCOA("");
        setJenisSaldo("");
        setKasBank("");
        setLoading(false);
        navigate("/COA");
      }
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
    doc.text(`Daftar COA`, 90, 30);
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
      body: COAsData,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarCOA.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(COAsForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `COA`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarCOA.xlsx`);
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
        COA
      </Typography>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Tidak bisa dihapus karena sudah ada mutasi!`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Periode Mutasi: ${bulan}`}
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
          kode={kodeCOA}
          addLink={`/COA/tambahCOA`}
          editLink={`/COA/${id}/edit`}
          deleteUser={deleteCOA}
          nameUser={kodeCOA}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isCOAExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Kode COA</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeCOA}
              />
              <Typography sx={[labelInput, spacingTop]}>Nama COA</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaCOA}
              />
              <Typography sx={[labelInput, spacingTop]}>Jenis Saldo</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={jenisSaldo}
              />
              <Typography sx={[labelInput, spacingTop]}>Kas/Bank</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kasBank}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Jenis COA</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={jenisCOA}
              />
              <Typography sx={[labelInput, spacingTop]}>Group COA</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={groupCOA}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Sub Group COA
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={subGroupCOA}
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
        <ShowTableCOA currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default TampilCOA;

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
