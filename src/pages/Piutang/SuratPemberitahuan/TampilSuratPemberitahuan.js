import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { ShowTableSuratPemberitahuan } from "../../../components/ShowTable";
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

const TampilSuratPemberitahuan = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [noJual, setNoJual] = useState("");
  const [namaRegister, setNamaRegister] = useState("");
  const [almRegister, setAlmRegister] = useState("");
  const [tlpRegister, setTlpRegister] = useState("");
  const [tglAng, setTglAng] = useState("");
  const [tenor, setTenor] = useState("");
  const [bulan, setBulan] = useState("");
  const [sisaBulan, setSisaBulan] = useState("");
  const [tglSp, setTglSp] = useState("");
  const [spKe, setSpKe] = useState("");

  const [kodeKolektor, setKodeKolektor] = useState("");
  const [tipe, setTipe] = useState("");
  const [noRangka, setNoRangka] = useState("");
  const [tahun, setTahun] = useState("");
  const [namaWarna, setNamaWarna] = useState("");
  const [nopol, setNopol] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [spsData, setSpsData] = useState([]);
  const navigate = useNavigate();
  let isSpsExist = noJual.length !== 0;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = spsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noJual.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.idJual.namaRegister
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.idJual.almRegister.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.idJual.tglAng.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tglSp.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.idJual.nopol.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(spsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getSpsData();
    id && getSpById();
  }, [id]);

  const getSpsData = async () => {
    setLoading(true);
    try {
      const allSps = await axios.post(`${tempUrl}/sps`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setSpsData(allSps.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getSpById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/sps/${id}`, {
        id: user._id,
        token: user.token
      });
      setNoJual(response.data.noJual);
      setNamaRegister(response.data.idJual.namaRegister);
      setAlmRegister(response.data.idJual.almRegister);
      setTlpRegister(response.data.idJual.tlpRegister);
      setTglAng(response.data.idJual.tglAng);
      setTenor(response.data.idJual.tenor);
      setBulan(response.data.idJual.tenor - response.data.idJual.sisaBulan);
      setSisaBulan(response.data.idJual.sisaBulan);
      setTglSp(response.data.tglSp);
      setSpKe(response.data.spKe);

      setKodeKolektor(
        `${response.data.kodeKolektor.kodeKolektor} - ${response.data.kodeKolektor.namaKolektor}`
      );
      setTipe(response.data.idJual.tipe);
      setNoRangka(response.data.idJual.noRangka);
      setTahun(response.data.idJual.tahun);
      setNamaWarna(response.data.idJual.namaWarna);
      setNopol(response.data.idJual.nopol);
    }
  };

  const deleteSp = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteSp/${id}`, {
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
        spKe: findJualByNoJual.data.spKe - 1,
        tglSpTerakhir: "",
        kodeCabang: user.cabang._id,
        id: user._id,
        token: user.token
      });
      setNoJual("");
      setNamaRegister("");
      setAlmRegister("");
      setTglAng("");
      setTenor("");
      setBulan("");
      setSisaBulan("");
      setTglSp("");
      setSpKe("");

      setKodeKolektor("");
      setTipe("");
      setNoRangka("");
      setTahun("");
      setNamaWarna("");
      setNopol("");
      setLoading(false);
      navigate("/suratPemberitahuan");
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPdf = async () => {
    let tempY = 15;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var tempDate;
    var tempDateName;
    const response = await axios.post(`${tempUrl}/angsuransChildTunggak`, {
      tglInput: date,
      noJual,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(`SURAT PEMBERITAHUAN`, 75, tempY);
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
      `Bersama dengan ini kami sampaikan bahwa Bapak / Ibu telah melakukan pembayaran`,
      15,
      tempY
    );
    tempY += 6;
    doc.text(
      `sewa sepeda motor dan untuk menghindari dari biaya pengambilan kembali sepeda motor,`,
      15,
      tempY
    );
    tempY += 6;
    doc.text(
      `dengan ini kami sampaikan bahwa Bapak / Ibu telah menunggak ${response.data.length} bulan.`,
      15,
      tempY
    );
    tempY += 6;
    doc.text(`( sepeda motor ${tipe})`, 15, tempY);
    tempY += 12;
    for (let i = 0; i < response.data.length; i++) {
      tempDate = new Date(response.data[i].tglJatuhTempo);

      switch (tempDate.getMonth() + 1) {
        case 1:
          tempDateName = "JANUARI";
          break;
        case 2:
          tempDateName = "FEBRUARI";
          break;
        case 3:
          tempDateName = "MARET";
          break;
        case 4:
          tempDateName = "APRIL";
          break;
        case 5:
          tempDateName = "MEI";
          break;
        case 6:
          tempDateName = "JUNI";
          break;
        case 7:
          tempDateName = "JULI";
          break;
        case 8:
          tempDateName = "AGUSTUS";
          break;
        case 9:
          tempDateName = "SEPTEMBER";
          break;
        case 10:
          tempDateName = "OKTOBER";
          break;
        case 11:
          tempDateName = "NOVEMBER";
          break;
        case 12:
          tempDateName = "DESEMBER";
          break;
        default:
          break;
      }

      var dt = new Date(response.data[i].tglJatuhTempo);
      let day = dt.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
      let month = (dt.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
      let sum = day + "-" + month + "-" + dt.getFullYear();

      doc.text(
        `${i + 1}.  Angsuran ke ${
          i + 1
        } ${tempDateName} ${tempDate.getFullYear()}`,
        30,
        tempY
      );
      doc.text(`( ${sum} )`, 120, tempY);
      doc.text(
        `Rp. ${response.data[i].angPerBulan.toLocaleString()}`,
        150,
        tempY
      );
      tempY += 6;
    }
    tempY += 6;
    doc.text(`Jumlah di atas belum termasuk denda tunggakan.`, 15, tempY);
    tempY += 12;
    doc.text(
      `Demikian surat pemberitahuan ini kami sampaikan kepada Bapak / Ibu, dan kami`,
      15,
      tempY
    );
    tempY += 6;
    doc.text(
      `menunggu 3 hari dari surat ini diterima. Apabila dalam 3 hari Bapak / Ibu tidak datang`,
      15,
      tempY
    );
    tempY += 6;
    doc.text(
      `ke kantor kami, maka kami akan menarik kembali sepeda motor tersebut.`,
      15,
      tempY
    );
    tempY += 6;
    doc.text(`Atas kerjasamanya kami ucapkan terimakasih.`, 15, tempY);
    tempY += 30;
    doc.text(`Hormat kami,`, 15, tempY);
    tempY += 30;
    doc.text(`${user.username}`, 15, tempY);
    doc.setFontSize(12);
    doc.save(`suratPemberitahuan.pdf`);
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
        Surat Pemberitahuan
      </Typography>
      {isSpsExist && (
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
          addLink={`/suratPemberitahuan/tambahSuratPemberitahuan`}
          deleteUser={deleteSp}
          nameUser={noJual}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isSpsExist && (
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
              <Typography sx={[labelInput, spacingTop]}>Nama</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaRegister}
              />
              <Typography sx={[labelInput, spacingTop]}>Alamat</Typography>
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
                Tgl. Angsuran
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tglAng}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Angs. / Bulan / Sisa
              </Typography>
              <Box sx={{ display: "flex" }}>
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    readOnly: true
                  }}
                  value={tenor}
                  sx={{ backgroundColor: Colors.grey400 }}
                />
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    readOnly: true
                  }}
                  value={bulan}
                  sx={{ ml: 2, backgroundColor: Colors.grey400 }}
                />
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    readOnly: true
                  }}
                  value={sisaBulan}
                  sx={{ ml: 2, backgroundColor: Colors.grey400 }}
                />
              </Box>
              <Typography sx={[labelInput, spacingTop]}>
                Tgl. SP / Ke
              </Typography>
              <Box sx={{ display: "flex" }}>
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    readOnly: true
                  }}
                  value={tglSp}
                  sx={{ backgroundColor: Colors.grey400 }}
                />
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    readOnly: true
                  }}
                  value={spKe}
                  sx={{ ml: 2, backgroundColor: Colors.grey400 }}
                />
              </Box>
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Kolektor</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeKolektor}
              />
              <Typography sx={[labelInput, spacingTop]}>Tipe</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tipe}
              />
              <Typography sx={[labelInput, spacingTop]}>No. Rangka</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noRangka}
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
                Tahun / Warna
              </Typography>
              <Box sx={{ display: "flex" }}>
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    readOnly: true
                  }}
                  value={tahun}
                  sx={{ backgroundColor: Colors.grey400 }}
                />
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    readOnly: true
                  }}
                  value={namaWarna}
                  sx={{ ml: 2, backgroundColor: Colors.grey400 }}
                />
              </Box>
            </Box>
          </Box>
          <Divider sx={dividerStyle} />
        </>
      )}
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      {spsData && (
        <Box sx={tableContainer}>
          <ShowTableSuratPemberitahuan
            currentPosts={currentPosts}
            searchTerm={searchTerm}
          />
        </Box>
      )}
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

export default TampilSuratPemberitahuan;

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
