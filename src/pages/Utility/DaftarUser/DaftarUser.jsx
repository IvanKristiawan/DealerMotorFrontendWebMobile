import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableUser } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader, usePagination } from "../../../components";
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
  DialogActions,
  Checkbox,
  FormGroup,
  FormControlLabel
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const DaftarUser = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeCabang, setKodeCabang] = useState("");
  const [username, setUsername] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [periode, setPeriode] = useState("");
  const [kodeKwitansi, setKodeKwitansi] = useState("");
  const [noTerakhir, setNoTerakhir] = useState("");
  const [coaKasir, setCoaKasir] = useState("");

  // Akses Master
  const [motor, setMotor] = useState(false);
  const [area, setArea] = useState(false);
  const [bukuBesar, setBukuBesar] = useState(false);
  const [dealer, setDealer] = useState(false);
  const [kolektor, setKolektor] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [pekerjaan, setPekerjaan] = useState(false);
  const [surveyor, setSurveyor] = useState(false);
  const [leasing, setLeasing] = useState(false);
  const [supplier, setSupplier] = useState(false);
  const [cabang, setCabang] = useState(false);

  // Akses Pembelian
  const [beli, setBeli] = useState(false);

  // Akses Penjualan
  const [register, setRegister] = useState(false);
  const [reject, setReject] = useState(false);
  const [jual, setJual] = useState(false);

  // Akses Laporan
  const [daftarStok, setDaftarStok] = useState(false);
  const [totalPiutang, setTotalPiutang] = useState(false);
  const [tunggakan, setTunggakan] = useState(false);
  const [penerimaanKas, setPenerimaanKas] = useState(false);
  const [kasHarian, setKasHarian] = useState(false);
  const [penjualanPerCabang, setPenjualanPerCabang] = useState(false);
  const [rekapPenerimaan, setRekapPenerimaan] = useState(false);
  const [lapPenjualan, setLapPenjualan] = useState(false);

  // Akses Piutang
  const [angsuran, setAngsuran] = useState(false);
  const [sp, setSp] = useState(false);
  const [st, setSt] = useState(false);

  // Akses Perawatan
  const [biayaPerawatan, setBiayaPerawatan] = useState(false);

  // Akses Finance
  const [kasMasuk, setKasMasuk] = useState(false);
  const [kasKeluar, setKasKeluar] = useState(false);
  const [bankMasuk, setBankMasuk] = useState(false);
  const [bankKeluar, setBankKeluar] = useState(false);

  // Akses Accounting
  const [posting, setPosting] = useState(false);
  const [unposting, setUnposting] = useState(false);
  const [aktivitasBukuBesar, setAktivitasBukuBesar] = useState(false);
  const [labaRugi, setLabaRugi] = useState(false);
  const [neraca, setNeraca] = useState(false);
  const [neracaSaldo, setNeracaSaldo] = useState(false);
  const [tutupPeriode, setTutupPeriode] = useState(false);
  const [gantiPeriode, setGantiPeriode] = useState(false);

  // Akses Utility
  const [profilUser, setProfilUser] = useState(false);
  const [daftarUser, setDaftarUser] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUser] = useState([]);
  const [usersForDoc, setUsersForDoc] = useState([]);
  const navigate = useNavigate();
  let isUserExist = username.length !== 0;

  const columns = [
    { title: "Username", field: "username" },
    { title: "Tipe User", field: "tipeUser" },
    { title: "Periode", field: "periode" },
    { title: "Kode Kwitansi", field: "kodeKwitansi" },
    { title: "No. Terakhir", field: "noTerakhir" },
    { title: "Cabang", field: "cabang" }
  ];

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = users.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.periode.namaPeriode
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kodeKwitansi.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noTerakhir.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.cabang._id.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.cabang.namaCabang.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(users, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getUsers();
    getUsersForDoc();
    id && getUserById();
  }, [id]);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/users`, {
        tipeAdmin: user.tipeUser,
        id: user._id,
        token: user.token
      });
      setUser(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getUsersForDoc = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/users/usersForDoc`, {
      tipeAdmin: user.tipeUser,
      id: user._id,
      token: user.token
    });
    setUsersForDoc(response.data);
    setLoading(false);
  };

  const getUserById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/findUser/${id}`, {
        tipeAdmin: user.tipeUser,
        id: user._id,
        token: user.token
      });
      setUsername(response.data.username);
      setTipeUser(response.data.tipeUser);
      setPeriode(response.data.periode.namaPeriode);
      setKodeKwitansi(response.data.kodeKwitansi);
      setNoTerakhir(response.data.noTerakhir);
      setKodeCabang(response.data.cabang);
      setCoaKasir(response.data.coaKasir);

      // Akses Master
      setMotor(response.data.akses.motor);
      setArea(response.data.akses.area);
      setBukuBesar(response.data.akses.bukuBesar);
      setDealer(response.data.akses.dealer);
      setKolektor(response.data.akses.kolektor);
      setMarketing(response.data.akses.marketing);
      setPekerjaan(response.data.akses.pekerjaan);
      setSurveyor(response.data.akses.surveyor);
      setLeasing(response.data.akses.leasing);
      setSupplier(response.data.akses.supplier);
      setCabang(response.data.akses.cabang);

      // Akses Pembelian
      setBeli(response.data.akses.beli);

      // Akses Penjualan
      setRegister(response.data.akses.register);
      setReject(response.data.akses.reject);
      setJual(response.data.akses.jual);

      // Akses Laporan
      setDaftarStok(response.data.akses.daftarStok);
      setTotalPiutang(response.data.akses.totalPiutang);
      setTunggakan(response.data.akses.tunggakan);
      setPenerimaanKas(response.data.akses.penerimaanKas);
      setKasHarian(response.data.akses.kasHarian);
      setPenjualanPerCabang(response.data.akses.penjualanPerCabang);
      setRekapPenerimaan(response.data.akses.rekapPenerimaan);
      setLapPenjualan(response.data.akses.lapPenjualan);

      // Akses Piutang
      setAngsuran(response.data.akses.angsuran);
      setSp(response.data.akses.sp);
      setSt(response.data.akses.st);

      // Akses Perawatan
      setBiayaPerawatan(response.data.akses.biayaPerawatan);

      // Akses Finance
      setKasMasuk(response.data.akses.kasMasuk);
      setKasKeluar(response.data.akses.kasKeluar);
      setBankMasuk(response.data.akses.bankMasuk);
      setBankKeluar(response.data.akses.bankKeluar);

      // Akses Accounting
      setPosting(response.data.akses.posting);
      setUnposting(response.data.akses.unposting);
      setAktivitasBukuBesar(response.data.akses.aktivitasBukuBesar);
      setLabaRugi(response.data.akses.labaRugi);
      setNeraca(response.data.akses.neraca);
      setNeracaSaldo(response.data.akses.neracaSaldo);
      setTutupPeriode(response.data.akses.tutupPeriode);
      setGantiPeriode(response.data.akses.gantiPeriode);

      // Akses Utility
      setProfilUser(response.data.akses.profilUser);
      setDaftarUser(response.data.akses.daftarUser);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/users/deleteUser/${id}`, {
        tipeAdmin: user.tipeUser,
        id: user._id,
        token: user.token
      });
      getUsers();
      setUsername("");
      setTipeUser("");
      setPeriode("");
      setKodeKwitansi("");
      setNoTerakhir("");
      setKodeCabang("");
      setLoading(false);
      navigate("/daftarUser");
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
    doc.text(`Daftar User`, 90, 30);
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
      body: usersForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarUser.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(usersForDoc);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `User`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarUser.xlsx`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">User</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar User
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
        <Button
          variant="contained"
          color="success"
          sx={{ bgcolor: "success.light", textTransform: "none" }}
          startIcon={<AddCircleOutlineIcon />}
          size="small"
          onClick={() => {
            navigate(`/daftarUser/tambahUser`);
          }}
        >
          Tambah
        </Button>
        {id && (
          <>
            <ButtonGroup variant="contained">
              <Button
                color="primary"
                startIcon={<EditIcon />}
                sx={{ textTransform: "none" }}
                onClick={() => {
                  navigate(`/daftarUser/${id}/edit`);
                }}
              >
                Ubah
              </Button>
              <Button
                color="error"
                startIcon={<DeleteOutlineIcon />}
                sx={{ textTransform: "none" }}
                onClick={handleClickOpen}
              >
                Hapus
              </Button>
            </ButtonGroup>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{`Hapus Data`}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {`Yakin ingin menghapus data ${username}?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => deleteUser(id)}>Ok</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
      <Divider sx={dividerStyle} />
      {isUserExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Username</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={username}
              />
              <Typography sx={[labelInput, spacingTop]}>Tipe User</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={tipeUser}
              />
              <Typography sx={[labelInput, spacingTop]}>Periode</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={periode}
              />
              <Typography sx={[labelInput, spacingTop]}>Cabang</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={`${kodeCabang._id} - ${kodeCabang.namaCabang}`}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Kode Kwitansi</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeKwitansi}
              />
              <Typography sx={[labelInput, spacingTop]}>
                No. Terakhir
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noTerakhir}
              />
              <Typography sx={[labelInput, spacingTop]}>COA Kasir</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={coaKasir}
              />
            </Box>
          </Box>
          <Divider sx={dividerStyle} />
          {user.tipeUser === "MGR" && (
            <>
              <Typography variant="h5" sx={[labelInput, spacingTop]}>
                Hak Akses User
              </Typography>
              <Box sx={showDataContainer}>
                <Box sx={showDataWrapper}>
                  <Typography variant="p" sx={[spacingTop]}>
                    Master
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={motor} disabled />}
                      label="Motor"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={area} disabled />}
                      label="Area"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={bukuBesar} disabled />}
                      label="Buku Besar"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={dealer} disabled />}
                      label="Dealer"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={kolektor} disabled />}
                      label="Kolektor"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={marketing} disabled />}
                      label="Marketing"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={pekerjaan} disabled />}
                      label="Pekerjaan"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={surveyor} disabled />}
                      label="Surveyor"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={leasing} disabled />}
                      label="Leasing"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={supplier} disabled />}
                      label="Supplier"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={cabang} disabled />}
                      label="Cabang"
                    />
                  </FormGroup>
                  <Typography variant="p" sx={[spacingTop]}>
                    Pembelian
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={beli} disabled />}
                      label="Beli"
                    />
                  </FormGroup>
                  <Typography variant="p" sx={[spacingTop]}>
                    Penjualan
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={register} disabled />}
                      label="Register"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={reject} disabled />}
                      label="Reject"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={jual} disabled />}
                      label="Jual"
                    />
                  </FormGroup>
                  <Typography variant="p" sx={[spacingTop]}>
                    Laporan
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={daftarStok} disabled />}
                      label="Daftar Stok"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={totalPiutang} disabled />}
                      label="Total Piutang"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={tunggakan} disabled />}
                      label="Tunggakan"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={penerimaanKas} disabled />}
                      label="Penerimaan Kas"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={kasHarian} disabled />}
                      label="Kas Harian"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={penjualanPerCabang} disabled />
                      }
                      label="Penjualan/Cabang"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={rekapPenerimaan} disabled />}
                      label="Rekap Penerimaan"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={lapPenjualan} disabled />}
                      label="Lap. Penjualan"
                    />
                  </FormGroup>
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <Typography variant="p" sx={[spacingTop]}>
                    Piutang
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={angsuran} disabled />}
                      label="Angsuran"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={sp} disabled />}
                      label="SP"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={st} disabled />}
                      label="ST"
                    />
                  </FormGroup>
                  <Typography variant="p" sx={[spacingTop]}>
                    Perawatan
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={biayaPerawatan} disabled />}
                      label="Biaya Perawatan"
                    />
                  </FormGroup>
                  <Typography variant="p" sx={[spacingTop]}>
                    Finance
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={kasMasuk} disabled />}
                      label="Kas Masuk"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={kasKeluar} disabled />}
                      label="Kas Keluar"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={bankMasuk} disabled />}
                      label="Bank Masuk"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={bankKeluar} disabled />}
                      label="Bank Keluar"
                    />
                  </FormGroup>
                  <Typography variant="p" sx={[spacingTop]}>
                    Accounting
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={posting} disabled />}
                      label="Posting"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={unposting} disabled />}
                      label="Unposting"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={aktivitasBukuBesar} disabled />
                      }
                      label="Aktivitas Buku Besar"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={labaRugi} disabled />}
                      label="Laba Rugi"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={neraca} disabled />}
                      label="Neraca"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={neracaSaldo} disabled />}
                      label="Neraca Saldo"
                    />
                  </FormGroup>
                  <Typography variant="p" sx={[spacingTop]}>
                    Utility
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={profilUser} disabled />}
                      label="Profil User"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={daftarUser} disabled />}
                      label="Daftar User"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={tutupPeriode} disabled />}
                      label="Tutup Periode"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={gantiPeriode} disabled />}
                      label="Ganti Periode"
                    />
                  </FormGroup>
                </Box>
              </Box>
            </>
          )}
        </>
      )}
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableUser currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default DaftarUser;

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
