import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Pagination,
  Button,
  ButtonGroup
} from "@mui/material";
import { ShowTableAngsuran } from "../../../components/ShowTable";
import { Loader, usePagination } from "../../../components";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TampilAngsuran = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const { screenSize } = useStateContext();

  // Show Data Jual
  const [namaRegister, setNamaRegister] = useState("");
  const [noJual, setNoJual] = useState("");
  const [tanggalJual, setTanggalJual] = useState("");
  const [nopol, setNopol] = useState("");
  const [almRegister, setAlmRegister] = useState("");
  const [tipe, setTipe] = useState("");
  const [hargaTunai, setHargaTunai] = useState("");
  const [uangMuka, setUangMuka] = useState("");
  const [angPerBulan, setAngPerBulan] = useState("");
  const [tenor, setTenor] = useState("");
  const [jumlahPiutang, setJumlahPiutang] = useState("");
  const [tahun, setTahun] = useState("");
  const [namaWarna, setNamaWarna] = useState("");
  const [noRangka, setNoRangka] = useState("");
  const [noMesin, setNoMesin] = useState("");
  const [noRegister, setNoRegister] = useState("");
  const [tglAng, setTglAng] = useState("");
  const [tglAngAkhir, setTglAngAkhir] = useState("");
  const [modal, setModal] = useState("");
  const [bunga, setBunga] = useState("");

  const [tglSpTerakhir, setTglSpTerakhir] = useState("");
  const [tglMdTerakhir, setTglMdTerakhir] = useState("");
  const [tglStTerakhir, setTglStTerakhir] = useState("");
  const [spKe, setSpKe] = useState("");
  const [angsurans, setAngsurans] = useState([]);
  const [angsuranTableRekap, setAngsuranTableRekap] = useState([]);
  const [angsuranTableRinci, setAngsuranTableRinci] = useState([]);
  const navigate = useNavigate();

  const columnsRekap = [
    { title: "Tgl. Bayar", field: "tglBayar" },
    { title: "TJ. Tempo", field: "tglJatuhTempo" },
    { title: "No. Kwitansi", field: "noKwitansi" },
    { title: "Ke", field: "_id" },
    { title: "Keterangan", field: "keterangan" },
    { title: "Bayar", field: "angPerBulan" },
    { title: "Saldo", field: "saldo" }
  ];

  const columnsRinci = [
    { title: "Tgl. Bayar", field: "tglBayar" },
    { title: "TJ. Tempo", field: "tglJatuhTempo" },
    { title: "No. Kwitansi", field: "noKwitansi" },
    { title: "Ke", field: "_id" },
    { title: "A. Modal", field: "angModal" },
    { title: "Saldo", field: "modal" },
    { title: "A. Bunga", field: "angBunga" },
    { title: "Saldo", field: "bunga" },
    { title: "Bayar", field: "angPerBulan" },
    { title: "Saldo", field: "saldo" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const currentPosts = angsurans.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(angsurans.length / PER_PAGE);
  const _DATA = usePagination(angsurans, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    id && getJualById();
  }, [id]);

  const getAngsuran = async () => {
    setLoading(true);
    const allAngsuransByNoJual = await axios.post(
      `${tempUrl}/angsuransByNoJual`,
      {
        noJual: id,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    setAngsurans(allAngsuransByNoJual.data.angsuran);
    setModal(
      allAngsuransByNoJual.data.angsuran[0].angModal *
        allAngsuransByNoJual.data.tenor
    );
    setBunga(
      allAngsuransByNoJual.data.angsuran[0].angBunga *
        allAngsuransByNoJual.data.tenor
    );
    setLoading(false);
  };

  const getAngsuranRekap = async () => {
    setLoading(true);
    const allAngsuransByNoJualRekap = await axios.post(
      `${tempUrl}/angsuransByNoJualRekap`,
      {
        noJual: id,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    setAngsuranTableRekap(allAngsuransByNoJualRekap.data);
    setLoading(false);
  };

  const getAngsuranRinci = async () => {
    setLoading(true);
    const allAngsuransByNoJualRinci = await axios.post(
      `${tempUrl}/angsuransByNoJualRinci`,
      {
        noJual: id,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    setAngsuranTableRinci(allAngsuransByNoJualRinci.data);
    setLoading(false);
  };

  const getJualById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/jualByNoJual`, {
        noJual: id,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      if (response.data.tglAng.length !== 0) {
        getAngsuran();
        getAngsuranRekap();
        getAngsuranRinci();
      }
      setNamaRegister(response.data.namaRegister);
      setNoJual(response.data.noJual);
      setTanggalJual(response.data.tglAng);
      setNopol(response.data.nopol);
      setAlmRegister(response.data.almRegister);
      setTipe(response.data.tipe);
      setHargaTunai(response.data.hargaTunai);
      setUangMuka(response.data.uangMuka);
      setAngPerBulan(response.data.angPerBulan);
      setTenor(response.data.tenor);
      setJumlahPiutang(response.data.jumlahPiutang);
      setTahun(response.data.tahun);
      setNamaWarna(response.data.namaWarna);
      setNoRangka(response.data.noRangka);
      setNoMesin(response.data.noMesin);
      setNoRegister(response.data.noRegister);
      setTglAng(response.data.tglAng);
      setTglAngAkhir(response.data.tglAngAkhir);
      setTglSpTerakhir(response.data.tglSpTerakhir);
      setTglMdTerakhir(response.data.tglMdTerakhir);
      setTglStTerakhir(response.data.tglStTerakhir);
      setSpKe(response.data.spKe);
    }
  };

  const downloadPdfRekap = () => {
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
    doc.text(`Kartu Kredit Rekap`, 85, 30);
    doc.setFontSize(10);
    doc.text(`Nama               : ${namaRegister}`, 15, 40);
    doc.text(`Tipe                    : ${tipe}`, 120, 40);
    doc.text(`Alamat              : ${almRegister.substring(0, 30)}`, 15, 45);
    doc.text(`No. Rangka        : ${noRangka}`, 120, 45);
    doc.text(`Tgl. kontrak      : ${tanggalJual}`, 15, 50);
    doc.text(`No. Mesin           : ${noMesin}`, 120, 50);
    doc.text(`Harga Tunai     : ${hargaTunai.toLocaleString()}`, 15, 55);
    doc.text(`Nopol                  : ${nopol}`, 120, 55);
    doc.text(`Uang Muka       : ${uangMuka.toLocaleString()}`, 15, 60);
    doc.text(`No. Kontrak        : ${noRegister}`, 120, 60);
    doc.text(
      `Angs / Bulan    : ${angPerBulan.toLocaleString()} / ${tenor}`,
      15,
      65
    );
    doc.text(`Tgl. Angs. I         : ${tglAng}`, 120, 65);
    doc.text(`Jml. Piutang    : ${jumlahPiutang.toLocaleString()}`, 15, 70);
    doc.text(`Tgl. Angs. Akhir  : ${tglAngAkhir}`, 120, 70);
    doc.text(`Thn / Warna     : ${tahun} / ${namaWarna}`, 15, 75);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.setFontSize(12);
    function alignCol(data) {
      var col = data.column.index;
      if (col >= 5 && col <= 6) {
        data.cell.styles.halign = "right";
      }
    }
    doc.autoTable({
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 80,
      columns: columnsRekap.map((col) => ({ ...col, dataKey: col.field })),
      body: angsuranTableRekap,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      },
      didParseCell: function (cell, data) {
        alignCol(cell, data);
      }
    });
    doc.save(`kartuKreditRekap.pdf`);
  };

  const downloadPdfRinci = () => {
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("l", "mm", [280, 210]);
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Kartu Kredit Rinci`, 120, 30);
    doc.setFontSize(10);
    doc.text(`Nama               : ${namaRegister}`, 15, 40);
    doc.text(`Tipe                    : ${tipe}`, 120, 40);
    doc.text(`Alamat              : ${almRegister.substring(0, 30)}`, 15, 45);
    doc.text(`No. Rangka        : ${noRangka}`, 120, 45);
    doc.text(`Tgl. kontrak      : ${tanggalJual}`, 15, 50);
    doc.text(`No. Mesin           : ${noMesin}`, 120, 50);
    doc.text(`Harga Tunai     : ${hargaTunai.toLocaleString()}`, 15, 55);
    doc.text(`Nopol                  : ${nopol}`, 120, 55);
    doc.text(`Uang Muka       : ${uangMuka.toLocaleString()}`, 15, 60);
    doc.text(`No. Kontrak        : ${noRegister}`, 120, 60);
    doc.text(
      `Angs / Bulan     : ${angPerBulan.toLocaleString()} / ${tenor}`,
      15,
      65
    );
    doc.text(`Tgl. Angs. I         : ${tglAng}`, 120, 65);
    doc.text(`Jml. Piutang     : ${jumlahPiutang.toLocaleString()}`, 15, 70);
    doc.text(`Tgl. Angs. Akhir  : ${tglAngAkhir}`, 120, 70);
    doc.text(`Thn / Warna     : ${tahun} / ${namaWarna}`, 15, 75);
    doc.text(`Modal              : ${modal.toLocaleString()}`, 15, 80);
    doc.text(`Bunga              : ${bunga.toLocaleString()}`, 15, 85);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      200
    );
    doc.setFontSize(12);
    function alignCol(data) {
      var col = data.column.index;
      if (col >= 4 && col <= 9) {
        data.cell.styles.halign = "right";
      }
    }
    doc.autoTable({
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 90,
      columns: columnsRinci.map((col) => ({ ...col, dataKey: col.field })),
      body: angsuranTableRinci,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      },
      didParseCell: function (cell, data) {
        alignCol(cell, data);
      }
    });
    doc.save(`kartuKreditRinci.pdf`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/daftarAngsuran")}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button startIcon={<PrintIcon />} onClick={() => downloadPdfRekap()}>
            Rekap
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => downloadPdfRinci()}
          >
            Rinci
          </Button>
        </ButtonGroup>
      </Box>
      <Box sx={container}>
        <Typography color="#757575">Piutang</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Angsuran
        </Typography>
        <Divider sx={[dividerStyle, { marginBottom: 2 }]} />
        <Box sx={textFieldContainer}>
          <Box sx={textFieldWrapper}>
            <Typography sx={labelInput}>Nama Register</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={namaRegister}
            />
            <Typography sx={[labelInput, spacingTop]}>No. Jual</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={noJual}
            />
            <Typography sx={[labelInput, spacingTop]}>Tanggal Jual</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tanggalJual}
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
          </Box>
          <Box sx={[textFieldWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Tgl. SP Terakhir</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tglSpTerakhir}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Tgl. MD Terakhir
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tglMdTerakhir}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Tgl. ST Terakhir
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tglStTerakhir}
            />
            <Typography sx={[labelInput, spacingTop]}>SP Ke-</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={spKe}
            />
          </Box>
        </Box>
        <Divider sx={dividerStyle} />
        <Box sx={tableContainer}>
          <ShowTableAngsuran id={id} currentPosts={currentPosts} />
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
    </>
  );
};

export default TampilAngsuran;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  pt: 4
};

const textFieldContainer = {
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const textFieldWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
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
