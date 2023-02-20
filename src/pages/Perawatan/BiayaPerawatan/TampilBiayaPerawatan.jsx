import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { ShowTableBiayaPerawatan } from "../../../components/ShowTable";
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
  ButtonGroup,
  TextareaAutosize
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilBiayaPerawatan = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [noBukti, setNoBukti] = useState("");
  const [nopol, setNopol] = useState("");
  const [tglPerawatan, setTglPerawatan] = useState("");
  const [tglPerawatanDate, setTglPerawatanDate] = useState();
  const [keterangan, setKeterangan] = useState("");
  const [biayaPerawatan, setBiayaPerawatan] = useState("");
  const [kodeCOA, setKodeCOA] = useState("");
  const [isPost, setIsPost] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [biayaPerawatansData, setBiayaPerawatansData] = useState([]);
  let today = new Date();
  const navigate = useNavigate();
  let isBiayaPerawatanExist = noBukti.length !== 0;
  let isEditableManager = user.tipeUser !== "ADM" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADM" &&
    tglPerawatanDate?.getFullYear() === today.getFullYear() &&
    tglPerawatanDate?.getMonth() === today.getMonth() &&
    tglPerawatanDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const columns = [
    { title: "No. Bukti", field: "noBukti" },
    { title: "Nopol", field: "nopol" },
    { title: "Tanggal", field: "tglPerawatan" },
    { title: "Ket", field: "keterangan" },
    { title: "Biaya", field: "biayaPerawatanString" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = biayaPerawatansData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noBukti.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.nopol.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tglPerawatan.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.keterangan.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.COA.kodeCOA.toString().includes(searchTerm.toUpperCase()) ||
      val.COA.namaCOA.toString().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(biayaPerawatansData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getBiayaPerawatansData();
    id && getBiayaPerawatanById();
  }, [id]);

  const getBiayaPerawatansData = async () => {
    setLoading(true);
    try {
      const allBiayaPerawatans = await axios.post(
        `${tempUrl}/biayaPerawatansForDoc`,
        {
          dariTgl: user.periode.periodeAwal,
          sampaiTgl: user.periode.periodeAkhir,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        }
      );
      setBiayaPerawatansData(allBiayaPerawatans.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getBiayaPerawatanById = async () => {
    if (id) {
      const pickedBiayaPerawatan = await axios.post(
        `${tempUrl}/biayaPerawatans/${id}`,
        {
          id: user._id,
          token: user.token
        }
      );
      setNoBukti(pickedBiayaPerawatan.data.noBukti);
      setNopol(pickedBiayaPerawatan.data.nopol);
      setTglPerawatan(pickedBiayaPerawatan.data.tglPerawatan);
      setTglPerawatanDate(new Date(pickedBiayaPerawatan.data.tglPerawatan));
      setKeterangan(pickedBiayaPerawatan.data.keterangan);
      setBiayaPerawatan(pickedBiayaPerawatan.data.biayaPerawatan);
      setKodeCOA(pickedBiayaPerawatan.data.COA);
      setIsPost(pickedBiayaPerawatan.data.isPost);
    }
  };

  const deleteBiayaPerawatan = async (id) => {
    let tempTotalBiayaPerawatan = 0;
    try {
      setLoading(true);
      let findDaftarStok = await axios.post(`${tempUrl}/daftarStoksByNopol`, {
        nopol,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      tempTotalBiayaPerawatan =
        parseInt(findDaftarStok.data.totalBiayaPerawatan) -
        parseInt(biayaPerawatan);
      await axios.post(
        `${tempUrl}/updateDaftarStok/${findDaftarStok.data._id}`,
        {
          totalBiayaPerawatan: tempTotalBiayaPerawatan,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        }
      );
      await axios.post(`${tempUrl}/deleteBiayaPerawatan/${id}`, {
        id: user._id,
        token: user.token
      });
      setNoBukti("");
      setNopol("");
      setTglPerawatan("");
      setKeterangan("");
      setBiayaPerawatan("");
      setLoading(false);
      navigate("/biayaPerawatan");
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
    doc.text(`Daftar Biaya Perawatan`, 80, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.setFontSize(12);
    function alignCol(data) {
      var col = data.column.index;
      if (col >= 4) {
        data.cell.styles.halign = "right";
      }
    }
    doc.autoTable({
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: biayaPerawatansData,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      },
      didParseCell: function (cell, data) {
        alignCol(cell, data);
      }
    });
    doc.save(`daftarBiayaPerawatan.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(biayaPerawatansData);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `BiayaPerawatan`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarBiayaPerawatan.xlsx`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Perawatan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Biaya Perawatan
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
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
        {isEditable ? (
          <ButtonModifier
            id={id}
            kode={noBukti}
            addLink={`/biayaPerawatan/tambahBiayaPerawatan`}
            deleteUser={deleteBiayaPerawatan}
            nameUser={noBukti}
          />
        ) : (
          <ButtonModifier
            id={id}
            kode={null}
            addLink={`/biayaPerawatan/tambahBiayaPerawatan`}
            deleteUser={deleteBiayaPerawatan}
            nameUser={noBukti}
          />
        )}
      </Box>
      <Divider sx={dividerStyle} />
      {isBiayaPerawatanExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>No. Bukti</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noBukti}
              />
              <Typography sx={[labelInput, spacingTop]}>Nopol</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={nopol}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Tgl. Perawatan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tglPerawatan}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Kode COA</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={`${kodeCOA.kodeCOA} - ${kodeCOA.namaCOA}`}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Biaya Perawatan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={biayaPerawatan.toLocaleString()}
              />
              <Typography sx={[labelInput, spacingTop]}>Keterangan</Typography>
              <TextareaAutosize
                maxRows={1}
                aria-label="maximum height"
                style={{ height: 150, backgroundColor: Colors.grey200 }}
                value={keterangan}
                disabled
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
        <ShowTableBiayaPerawatan
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

export default TampilBiayaPerawatan;

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
