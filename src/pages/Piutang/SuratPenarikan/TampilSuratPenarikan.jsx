import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { tempUrl } from "../../../contexts/ContextProvider";
import { useStateContext } from "../../../contexts/ContextProvider";
import { AuthContext } from "../../../contexts/AuthContext";
import { ShowTableSuratPenarikan } from "../../../components/ShowTable";
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
  ButtonGroup,
  Button
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PrintIcon from "@mui/icons-material/Print";
import angkaTerbilang from "@develoka/angka-terbilang-js";

const TampilSuratPenarikan = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [noSt, setNoSt] = useState("");
  const [tglSt, setTglSt] = useState("");
  const [noJual, setNoJual] = useState("");
  const [kodeKolektor, setKodeKolektor] = useState("");
  const [angPerBulan, setAngPerBulan] = useState("");
  const [jmlBlnTelat, setJmlBlnTelat] = useState("");
  const [totalDenda, setTotalDenda] = useState("");
  const [biayaTarik, setBiayaTarik] = useState("");

  // Delete it
  const [namaRegister, setNamaRegister] = useState("");
  const [almRegister, setAlmRegister] = useState("");
  const [tlpRegister, setTlpRegister] = useState("");
  const [nopol, setNopol] = useState("");
  const [tglJatuhTempo, setTglJatuhTempo] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [stsData, setStsData] = useState([]);
  const navigate = useNavigate();
  let isStsExist = noJual.length !== 0;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = stsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noSt.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tglSt.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noJual.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(stsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getStsData();
    id && getStById();
  }, [id]);

  const getStsData = async () => {
    setLoading(true);
    try {
      const allSts = await axios.post(`${tempUrl}/sts`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setStsData(allSts.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getStById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/sts/${id}`, {
        id: user._id,
        token: user.token
      });
      setNoSt(response.data.noSt);
      setTglSt(response.data.tglSt);
      setNoJual(response.data.noJual);
      setKodeKolektor(
        `${response.data.kodeKolektor.kodeKolektor} - ${response.data.kodeKolektor.namaKolektor}`
      );
      setAngPerBulan(response.data.angPerBulan);
      setJmlBlnTelat(response.data.jmlBlnTelat);
      setTotalDenda(response.data.totalDenda);
      setBiayaTarik(response.data.biayaTarik);

      setNamaRegister(response.data.idJual.namaRegister);
      setAlmRegister(response.data.idJual.almRegister);
      setTlpRegister(response.data.idJual.tlpRegister);
      setNopol(response.data.idJual.nopol);

      var dt = new Date(response.data.idJual.tglJatuhTempo);
      let day = dt.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
      let month = (dt.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
      let sum = day + "-" + month + "-" + dt.getFullYear();

      setTglJatuhTempo(sum);
    }
  };

  const deleteSt = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteSt/${id}`, {
        id: user._id,
        token: user.token
      });
      // Find Jual
      const findJualByNoJual = await axios.post(`${tempUrl}/jualByNoJual`, {
        noJual,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      await axios.post(`${tempUrl}/updateJual/${findJualByNoJual.data._id}`, {
        tglStTerakhir: "",
        kodeCabang: user.cabang._id,
        id: user._id,
        token: user.token
      });
      setNoSt("");
      setTglSt("");
      setNoJual("");
      setKodeKolektor("");
      setAngPerBulan("");
      setJmlBlnTelat("");
      setTotalDenda("");
      setBiayaTarik("");
      setLoading(false);
      navigate("/suratPenarikan");
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPdf = async () => {
    let tempY = 15;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`SURAT PEMBERITAHUAN PENGAMBILAN KEMBALI KENDARAAN`, 28, tempY);
    tempY += 20;
    doc.setFont(undefined, "normal");
    doc.setFontSize(12);
    doc.text(`${setting.lokasiSP}, ${current_date}`, 15, tempY);
    tempY += 15;
    doc.text(`Kepada Yth. Bapak / Ibu`, 15, tempY);
    doc.setFont(undefined, "bold");
    doc.text(`${namaRegister} - ${noJual}`, 64, tempY);
    doc.setFont(undefined, "normal");
    tempY += 6;
    doc.text(`${almRegister}`, 15, tempY);
    tempY += 6;
    doc.text(`(${tlpRegister})`, 15, tempY);
    tempY += 15;
    doc.text(`Dengan Hormat,`, 15, tempY);
    tempY += 6;
    doc.text(
      `Bersama dengan ini kami sampaikan kembali perihal Bapak / Ibu masih lalai melakukan`,
      15,
      tempY
    );
    tempY += 6;
    doc.text(
      `pembayaran sewa kendaraan dengan perincian sebagai berikut :`,
      15,
      tempY
    );
    tempY += 12;
    doc.text(`Tanggal Jatuh Tempo`, 35, tempY);
    doc.text(`: ${tglJatuhTempo}`, 115, tempY);
    tempY += 6;
    doc.text(`No. Polisi`, 35, tempY);
    doc.text(`: ${nopol}`, 115, tempY);
    tempY += 6;
    doc.text(`Sewa / Bulan`, 35, tempY);
    doc.text(`: ${angPerBulan.toLocaleString()}`, 115, tempY);
    tempY += 6;
    doc.text(`Jumlah Bulan Telat`, 35, tempY);
    doc.text(`: ${jmlBlnTelat} bulan`, 115, tempY);
    tempY += 6;
    doc.text(`Denda Tunggakan`, 35, tempY);
    doc.text(`: ${totalDenda.toLocaleString()}`, 115, tempY);
    tempY += 6;
    doc.text(`Biaya Pengambilan`, 35, tempY);
    doc.text(`: ${biayaTarik.toLocaleString()}`, 115, tempY);
    tempY += 6;
    doc.text(`Total harus dibayar`, 35, tempY);
    doc.text(`: ${(totalDenda + biayaTarik).toLocaleString()}`, 115, tempY);
    tempY += 6;
    doc.text(
      `Terbilang : ${angkaTerbilang(totalDenda + biayaTarik)} rupiah`,
      35,
      tempY
    );
    tempY += 15;
    doc.text(
      `Untuk menghindari Pengambilan Kembali Kendaraan, Mohon SEGERA menyelesaikan`,
      15,
      tempY
    );
    tempY += 6;
    doc.text(`tunggakan sewa di kantor kami.`, 15, tempY);
    tempY += 6;
    doc.text(
      `Demikian atas perhatian dan kerjasamanya, kami ucapkan Terima Kasih.`,
      15,
      tempY
    );
    tempY += 15;
    doc.text(`Hormat kami,`, 15, tempY);
    tempY += 30;
    doc.text(`${user.username}`, 15, tempY);
    doc.setFontSize(12);
    doc.save(`suratPenarikan.pdf`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Piutang</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Surat Penarikan
      </Typography>
      {isStsExist && (
        <Box sx={downloadButtons}>
          <ButtonGroup variant="outlined" color="secondary">
            <Button startIcon={<PrintIcon />} onClick={() => downloadPdf()}>
              CETAK
            </Button>
          </ButtonGroup>
        </Box>
      )}
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={noJual}
          addLink={`/suratPenarikan/tambahSuratPenarikan`}
          deleteUser={deleteSt}
          nameUser={noJual}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isStsExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>No. Jual</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noJual}
              />
              <Typography sx={[labelInput, spacingTop]}>
                No. Surat Penarikan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noSt}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Tgl. Surat Penarikan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tglSt}
              />
              <Typography sx={[labelInput, spacingTop]}>Kolektor</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeKolektor}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Jml Bulan Telat</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={`${jmlBlnTelat} bulan`}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Angsuran / Bulan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={angPerBulan.toLocaleString()}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Denda Tunggakan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={totalDenda.toLocaleString()}
              />
              <Typography sx={[labelInput, spacingTop]}>Biaya Tarik</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={biayaTarik.toLocaleString()}
              />
              <Typography sx={[labelInput, spacingTop]}>Total</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={(biayaTarik + totalDenda).toLocaleString()}
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
        <ShowTableSuratPenarikan
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

export default TampilSuratPenarikan;

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
