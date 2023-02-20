import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableRegister } from "../../../components/ShowTable";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
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

const TampilRegister = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [noRegister, setNoRegister] = useState("");
  const [tanggalRegister, setTanggalRegister] = useState("");
  const [namaRegister, setNamaRegister] = useState("");
  const [almRegister, setAlmRegister] = useState("");
  const [tlpRegister, setTlpRegister] = useState("");
  const [noKtpRegister, setNoKtpRegister] = useState("");
  const [almKtpRegister, setAlmKtpRegister] = useState("");
  const [noKKRegister, setNoKKRegister] = useState("");
  const [pkjRegister, setPkjRegister] = useState("");
  const [namaPjmRegister, setNamaPjmRegister] = useState("");
  const [almPjmRegister, setAlmPjmRegister] = useState("");
  const [tlpPjmRegister, setTlpPjmRegister] = useState("");
  const [hubunganRegister, setHubunganRegister] = useState("");
  const [noKtpPjmRegister, setNoKtpPjmRegister] = useState("");
  const [pkjPjmRegister, setPkjPjmRegister] = useState("");
  const [namaRefRegister, setNamaRefRegister] = useState("");
  const [almRefRegister, setAlmRefRegister] = useState("");
  const [tlpRefRegister, setTlpRefRegister] = useState("");
  const [kecamatanId, setKecamatanId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [registersData, setRegistersData] = useState([]);
  const [registersForDoc, setRegistersForDoc] = useState([]);
  const navigate = useNavigate();
  let isRegisterExist = noRegister.length !== 0;

  const columns = [
    { title: "No", field: "noRegister" },
    { title: "Tanggal", field: "tanggalRegister" },
    { title: "Nama", field: "namaRegister" },
    { title: "Alamat", field: "almRegister" },
    { title: "Telepon", field: "tlpRegister" },
    { title: "No. KTP", field: "noKtpRegister" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = registersData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noRegister.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tanggalRegister.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaRegister.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.almRegister.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tlpRegister.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noKtpRegister.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(registersData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getRegistersData();
    getRegistersForDoc();
    id && getUserById();
  }, [id]);

  const getRegistersData = async () => {
    setLoading(true);
    try {
      const allRegisters = await axios.post(`${tempUrl}/registers`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setRegistersData(allRegisters.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getRegistersForDoc = async () => {
    setLoading(true);
    const allRegisterForDoc = await axios.post(`${tempUrl}/registersForDoc`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setRegistersForDoc(allRegisterForDoc.data);
    setLoading(false);
  };

  const getUserById = async () => {
    if (id) {
      const pickedRegister = await axios.post(`${tempUrl}/registers/${id}`, {
        id: user._id,
        token: user.token
      });
      setNoRegister(pickedRegister.data.noRegister);
      setTanggalRegister(pickedRegister.data.tanggalRegister);
      setNamaRegister(pickedRegister.data.namaRegister);
      setAlmRegister(pickedRegister.data.almRegister);
      setTlpRegister(pickedRegister.data.tlpRegister);
      setNoKtpRegister(pickedRegister.data.noKtpRegister);
      setAlmKtpRegister(pickedRegister.data.almKtpRegister);
      setNoKKRegister(pickedRegister.data.noKKRegister);
      setNamaPjmRegister(pickedRegister.data.namaPjmRegister);
      setAlmPjmRegister(pickedRegister.data.almPjmRegister);
      setTlpPjmRegister(pickedRegister.data.tlpPjmRegister);
      setHubunganRegister(pickedRegister.data.hubunganRegister);
      setNoKtpPjmRegister(pickedRegister.data.noKtpPjmRegister);
      setPkjPjmRegister(
        `${pickedRegister.data.pekerjaanPenjaminId.kodePekerjaan} - ${pickedRegister.data.pekerjaanPenjaminId.namaPekerjaan}`
      );
      setPkjRegister(
        `${pickedRegister.data.pekerjaanId.kodePekerjaan} - ${pickedRegister.data.pekerjaanId.namaPekerjaan}`
      );
      setNamaRefRegister(pickedRegister.data.namaRefRegister);
      setAlmRefRegister(pickedRegister.data.almRefRegister);
      setTlpRefRegister(pickedRegister.data.tlpRefRegister);
      setKecamatanId(
        `${pickedRegister.data.kecamatanId.kodeKecamatan} - ${pickedRegister.data.kecamatanId.namaKecamatan}`
      );
    }
  };

  const deleteRegister = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteRegister/${id}`, {
        id: user._id,
        token: user.token
      });
      setNoRegister("");
      setTanggalRegister("");
      setNamaRegister("");
      setAlmRegister("");
      setTlpRegister("");
      setNoKtpRegister("");
      setAlmKtpRegister("");
      setNoKKRegister("");
      setPkjRegister("");
      setNamaPjmRegister("");
      setAlmPjmRegister("");
      setTlpPjmRegister("");
      setHubunganRegister("");
      setNoKtpPjmRegister("");
      setPkjPjmRegister("");
      setNamaRefRegister("");
      setAlmRefRegister("");
      setTlpRefRegister("");
      setLoading(false);
      navigate("/register");
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
    doc.text(`Daftar Register`, 90, 30);
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
      body: registersData,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarRegister.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(registersForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Register`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarRegister.xlsx`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Penjualan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Register Penjualan
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
          kode={noRegister}
          addLink={`/register/tambahRegister`}
          editLink={`/register/${id}/edit`}
          deleteUser={deleteRegister}
          nameUser={noRegister}
        />
      </Box>
      {isRegisterExist && (
        <>
          <Divider sx={dividerStyle} />
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>No</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>Tanggal</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tanggalRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Register
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Alamat Register
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={almRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Telepon Register
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tlpRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                No. KTP Register
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noKtpRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Alamat KTP Register
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={almKtpRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                No. KK Register
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noKKRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Pekerjaan Register
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={pkjRegister}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Kecamatan</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kecamatanId}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Penjamin
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaPjmRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Alamat Penjamin
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={almPjmRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Telepon Penjamin
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tlpPjmRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Hubungan Penjamin
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={hubunganRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                No. KTP Penjamin
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noKtpPjmRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Pekerjaan Penjamin
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={pkjPjmRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Referensi
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaRefRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Alamat Referensi
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={almRefRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Telepon Referensi
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tlpRefRegister}
              />
            </Box>
          </Box>
        </>
      )}
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableRegister
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

export default TampilRegister;

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
