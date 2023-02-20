import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableKecamatan } from "../../../../components/ShowTable";
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

const TampilKecamatan = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeWilayah, setKodeWilayah] = useState("");
  const [namaWilayah, setNamaWilayah] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [namaKecamatan, setNamaKecamatan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [kecamatansData, setKecamatansData] = useState([]);
  const [kecamatansForDoc, setKecamatansForDoc] = useState([]);
  const navigate = useNavigate();
  let isKecamatanExist = kodeKecamatan.length !== 0;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { title: "Kode Wilayah", field: "kodeWilayah" },
    { title: "Nama Wilayah", field: "namaWilayah" },
    { title: "Kode Kecamatan", field: "kodeKecamatan" },
    { title: "Nama Kecamatan", field: "namaKecamatan" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = kecamatansData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeWilayah.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.kodeKecamatan.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaKecamatan.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaWilayah.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(kecamatansData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getKecamatansData();
    getKecamatansForDoc();
    id && getKecamatanById();
  }, [id]);

  const getKecamatansData = async () => {
    setLoading(true);
    try {
      const allKecamatans = await axios.post(`${tempUrl}/kecamatans`, {
        id: user._id,
        token: user.token
      });
      setKecamatansData(allKecamatans.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getKecamatansForDoc = async () => {
    setLoading(true);
    const allKecamatansForDoc = await axios.post(
      `${tempUrl}/kecamatansForDoc`,
      {
        id: user._id,
        token: user.token
      }
    );
    setKecamatansForDoc(allKecamatansForDoc.data);
    setLoading(false);
  };

  const getKecamatanById = async () => {
    if (id) {
      const pickedKecamatan = await axios.post(`${tempUrl}/kecamatans/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeWilayah(pickedKecamatan.data.kodeWilayah);
      setNamaWilayah(pickedKecamatan.data.namaWilayah);
      setKodeKecamatan(pickedKecamatan.data.kodeKecamatan);
      setNamaKecamatan(pickedKecamatan.data.namaKecamatan);
    }
  };

  const deleteKecamatan = async (id) => {
    const findRegisterKecamatan = await axios.post(
      `${tempUrl}/registersKecamatan`,
      {
        kecamatanId: id,
        id: user._id,
        token: user.token
      }
    );
    const findJualKecamatan = await axios.post(`${tempUrl}/jualsKecamatan`, {
      kodeKecamatan: id,
      id: user._id,
      token: user.token
    });
    let isKecamatanDataExist =
      findRegisterKecamatan.data.length > 0 ||
      findJualKecamatan.data.length > 0;
    if (isKecamatanDataExist) {
      // There's Record -> Forbid Delete
      handleClickOpen();
    } else {
      // No Record Found -> Delete
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/deleteKecamatan/${id}`, {
          id: user._id,
          token: user.token
        });
        setKodeWilayah("");
        setNamaWilayah("");
        setKodeKecamatan("");
        setNamaKecamatan("");
        setLoading(false);
        navigate("/kecamatan");
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
    doc.text(`Daftar Kecamatan`, 90, 30);
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
      body: kecamatansData,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarKecamatan.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(kecamatansForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Kecamatan`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarKecamatan.xlsx`);
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
        Kecamatan
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
            {`Kode Kecamatan data: ${kodeKecamatan}`}
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
          kode={kodeWilayah}
          addLink={`/kecamatan/tambahKecamatan`}
          editLink={`/kecamatan/${id}/edit`}
          deleteUser={deleteKecamatan}
          nameUser={kodeKecamatan}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isKecamatanExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Kode Kecamatan</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeKecamatan}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Kecamatan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaKecamatan}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Kode Wilayah</Typography>
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
        <ShowTableKecamatan
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

export default TampilKecamatan;

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
