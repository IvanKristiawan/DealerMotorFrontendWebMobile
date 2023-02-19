import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { Loader } from "../../../components";
import {
  Box,
  Typography,
  Divider,
  Alert,
  Button,
  TextField,
  Snackbar,
  Paper,
  Autocomplete,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahUser = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kodeCabang, setKodeCabang] = useState("");
  const [namaPeriode, setNamaPeriode] = useState("");
  const [username, setUsername] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [kodeKwitansi, setKodeKwitansi] = useState("");
  const [coaKasir, setCoaKasir] = useState("");
  const [password, setPassword] = useState("");

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

  const [cabangs, setCabangs] = useState([]);
  const [coaSubTunais, setCoaSubTunais] = useState([]);
  const [periodesData, setPeriodesData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openAlertUsername, setOpenAlertUsername] = useState(false);
  const [
    openAlertKodeKwitansiCabang,
    setOpenAlertKodeKwitansiCabang
  ] = useState(false);

  const handleClickOpenAlertUsername = () => {
    setOpenAlertUsername(true);
  };

  const handleCloseAlertUsername = () => {
    setOpenAlertUsername(false);
  };

  const handleClickOpenAlertKodeKwitansiCabang = () => {
    setOpenAlertKodeKwitansiCabang(true);
  };

  const handleCloseAlertKodeKwitansiCabang = () => {
    setOpenAlertKodeKwitansiCabang(false);
  };

  const tipeUserOption = [{ label: "MGR" }, { label: "ADM" }];

  const tipeUserOptionOwner = [
    { label: "OWN" },
    { label: "MGR" },
    { label: "ADM" }
  ];

  const periodeOptions = periodesData.map((periode) => ({
    label: `${periode.namaPeriode}`
  }));

  const cabangOptions = cabangs.map((cabang) => ({
    label: `${cabang._id} - ${cabang.namaCabang}`
  }));

  const coaSubTunaiOptions = coaSubTunais.map((coaSubTunai) => ({
    label: `${coaSubTunai.kodeCOA} - ${coaSubTunai.namaCOA}`
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getPeriodesData();
    getCabangsData();
    getCoaSubTunai();
  }, []);

  const getPeriodesData = async () => {
    setLoading(true);
    try {
      const allPeriode = await axios.post(`${tempUrl}/tutupPeriodesDesc`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setPeriodesData(allPeriode.data);
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  const getCabangsData = async (kodeUnit) => {
    setKodeCabang("");
    const response = await axios.post(`${tempUrl}/cabangs`, {
      id: user._id,
      token: user.token
    });
    setCabangs(response.data);
  };

  const getCoaSubTunai = async (kodeUnit) => {
    setCoaKasir("");
    const response = await axios.post(`${tempUrl}/COAsSubKasTunai`, {
      id: user._id,
      token: user.token
    });
    setCoaSubTunais(response.data);
  };

  const saveUser = async (e) => {
    let isFailedValidation =
      username.length === 0 ||
      password.length === 0 ||
      tipeUser.length === 0 ||
      namaPeriode.length === 0 ||
      coaKasir.length === 0 ||
      kodeCabang.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        let tempUsername = await axios.post(`${tempUrl}/getUsername`, {
          username,
          id: user._id,
          token: user.token
        });
        let tempKodeKwitansi = await axios.post(`${tempUrl}/getKodeKwitansi`, {
          kodeKwitansi,
          id: user._id,
          token: user.token,
          kodeCabang: kodeCabang.split(" ", 1)[0]
        });
        const pickedPeriode = await axios.post(
          `${tempUrl}/tutupPeriodeByNamaPeriode`,
          {
            namaPeriode,
            id: user._id,
            token: user.token,
            kodeCabang: user.cabang._id
          }
        );
        let tempPeriode = await axios.post(`${tempUrl}/tutupPeriodes`, {
          id: user._id,
          token: user.token,
          kodeCabang: kodeCabang.split(" ", 1)[0]
        });

        if (tempPeriode.data.length === 0) {
          // Create Periode and Neraca Saldo
          await axios.post(`${tempUrl}/saveTutupPeriode`, {
            periodeAwal: pickedPeriode.data.periodeAwal,
            periodeAkhir: pickedPeriode.data.periodeAkhir,
            namaPeriode: pickedPeriode.data.namaPeriode,
            id: user._id,
            token: user.token,
            kodeCabang: kodeCabang.split(" ", 1)[0]
          });
          function subtractMonths(date, months) {
            date.setMonth(date.getMonth() - months);
            return date;
          }

          const newBulan = new Date(pickedPeriode.data.periodeAwal);
          let tempBulan =
            newBulan.getDate() +
            "-" +
            (newBulan.getMonth() + 1) +
            "-" +
            newBulan.getFullYear();

          const minOneBulan = subtractMonths(newBulan, 1);
          let tempMinOneBulan =
            minOneBulan.getDate() +
            "-" +
            (minOneBulan.getMonth() + 1) +
            "-" +
            minOneBulan.getFullYear();

          // Save 2 months
          await axios.post(`${tempUrl}/saveNeracaSaldo`, {
            bulan: tempMinOneBulan,
            id: user._id,
            token: user.token,
            kodeCabang: kodeCabang.split(" ", 1)[0]
          });
          await axios.post(`${tempUrl}/saveNeracaSaldo`, {
            bulan: tempBulan,
            id: user._id,
            token: user.token,
            kodeCabang: kodeCabang.split(" ", 1)[0]
          });
        }

        let isUsernameAlreadyExist = tempUsername.data.length > 0;
        let isKodeKwitansiCabangAlreadyExist = tempKodeKwitansi.data.length > 0;
        if (isUsernameAlreadyExist) {
          handleClickOpenAlertUsername();
        } else if (isKodeKwitansiCabangAlreadyExist) {
          handleClickOpenAlertKodeKwitansiCabang();
        } else {
          setLoading(true);
          await axios.post(`${tempUrl}/auth/register`, {
            username,
            password,
            tipeUser,
            periode: pickedPeriode.data._id,
            kodeKwitansi,
            coaKasir: coaKasir.split(" ", 1)[0],
            akses: {
              motor,
              area,
              bukuBesar,
              dealer,
              kolektor,
              marketing,
              pekerjaan,
              surveyor,
              leasing,
              supplier,
              cabang,
              beli,
              register,
              reject,
              jual,
              daftarStok,
              totalPiutang,
              tunggakan,
              penerimaanKas,
              kasHarian,
              penjualanPerCabang,
              rekapPenerimaan,
              lapPenjualan,
              angsuran,
              sp,
              st,
              biayaPerawatan,
              kasMasuk,
              kasKeluar,
              bankMasuk,
              bankKeluar,
              posting,
              unposting,
              aktivitasBukuBesar,
              labaRugi,
              neraca,
              neracaSaldo,
              tutupPeriode,
              gantiPeriode,
              profilUser,
              daftarUser
            },
            kodeCabang: kodeCabang.split(" ", 1)[0],
            id: user._id,
            token: user.token
          });
          setLoading(false);
          navigate("/daftarUser");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">User</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah User
      </Typography>
      <Dialog
        open={openAlertUsername}
        onClose={handleCloseAlertUsername}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Username Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Username ${username} sudah ada, ganti Username!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertUsername}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAlertKodeKwitansiCabang}
        onClose={handleCloseAlertKodeKwitansiCabang}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Kode Kwitansi Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Kode Kwitansi ${kodeKwitansi} di Cabang ${
              kodeCabang.split(" ", 1)[0]
            } sudah ada, ganti Kode Kwitansi!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertKodeKwitansiCabang}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Username</Typography>
            <TextField
              size="small"
              error={error && username.length === 0 && true}
              helperText={
                error && username.length === 0 && "Username harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Tipe User</Typography>
            {user.tipeUser === "OWN" ? (
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                options={tipeUserOptionOwner}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    error={error && tipeUser.length === 0 && true}
                    helperText={
                      error && tipeUser.length === 0 && "Tipe User harus diisi!"
                    }
                    {...params}
                  />
                )}
                onInputChange={(e, value) => setTipeUser(value)}
              />
            ) : (
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                options={tipeUserOption}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    error={error && tipeUser.length === 0 && true}
                    helperText={
                      error && tipeUser.length === 0 && "Tipe User harus diisi!"
                    }
                    {...params}
                  />
                )}
                onInputChange={(e, value) => setTipeUser(value)}
              />
            )}
            <Typography sx={[labelInput, spacingTop]}>Periode</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={periodeOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && namaPeriode.length === 0 && true}
                  helperText={
                    error && namaPeriode.length === 0 && "Periode harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setNamaPeriode(value)}
            />
            <Typography sx={[labelInput, spacingTop]}>Kode Cabang</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={cabangOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kodeCabang.length === 0 && true}
                  helperText={
                    error &&
                    kodeCabang.length === 0 &&
                    "Kode Cabang harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setKodeCabang(value)}
              value={kodeCabang}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Kode Kwitansi</Typography>
            <TextField
              size="small"
              error={error && kodeKwitansi.length === 0 && true}
              helperText={
                error &&
                kodeKwitansi.length === 0 &&
                "Kode Kwitansi harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={kodeKwitansi}
              onChange={(e) => setKodeKwitansi(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>COA Kasir</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={coaSubTunaiOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && coaKasir.length === 0 && true}
                  helperText={
                    error && coaKasir.length === 0 && "COA Kasir harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setCoaKasir(value)}
              value={coaKasir}
            />
            <Typography sx={[labelInput, spacingTop]}>Password</Typography>
            <TextField
              size="small"
              error={error && password.length === 0 && true}
              helperText={
                error && password.length === 0 && "Password harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
            />
          </Box>
        </Box>
      </Paper>
      {user.tipeUser === "MGR" && (
        <Paper sx={contentContainer} elevation={12}>
          <Typography variant="h5" sx={[labelInput, spacingTop]}>
            Atur Hak Akses
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography variant="p" sx={[spacingTop]}>
                Master
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={motor} />}
                  label="Motor"
                  onChange={() => setMotor(!motor)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={area} />}
                  label="Area"
                  onChange={() => setArea(!area)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={bukuBesar} />}
                  label="Buku Besar"
                  onChange={() => setBukuBesar(!bukuBesar)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={dealer} />}
                  label="Dealer"
                  onChange={() => setDealer(!dealer)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={kolektor} />}
                  label="Kolektor"
                  onChange={() => setKolektor(!kolektor)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={marketing} />}
                  label="Marketing"
                  onChange={() => setMarketing(!marketing)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={pekerjaan} />}
                  label="Pekerjaan"
                  onChange={() => setPekerjaan(!pekerjaan)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={surveyor} />}
                  label="Surveyor"
                  onChange={() => setSurveyor(!surveyor)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={leasing} />}
                  label="Leasing"
                  onChange={() => setLeasing(!leasing)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={supplier} />}
                  label="Supplier"
                  onChange={() => setSupplier(!supplier)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={cabang} />}
                  label="Cabang"
                  onChange={() => setCabang(!cabang)}
                />
              </FormGroup>
              <Typography variant="p" sx={[spacingTop]}>
                Pembelian
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={beli} />}
                  label="Beli"
                  onChange={() => setBeli(!beli)}
                />
              </FormGroup>
              <Typography variant="p" sx={[spacingTop]}>
                Penjualan
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={register} />}
                  label="Register"
                  onChange={() => setRegister(!register)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={reject} />}
                  label="Reject"
                  onChange={() => setReject(!reject)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={jual} />}
                  label="Jual"
                  onChange={() => setJual(!jual)}
                />
              </FormGroup>
              <Typography variant="p" sx={[spacingTop]}>
                Laporan
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={daftarStok} />}
                  label="Daftar Stok"
                  onChange={() => setDaftarStok(!daftarStok)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={totalPiutang} />}
                  label="Total Piutang"
                  onChange={() => setTotalPiutang(!totalPiutang)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={tunggakan} />}
                  label="Tunggakan"
                  onChange={() => setTunggakan(!tunggakan)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={penerimaanKas} />}
                  label="Penerimaan Kas"
                  onChange={() => setPenerimaanKas(!penerimaanKas)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={kasHarian} />}
                  label="Kas Harian"
                  onChange={() => setKasHarian(!kasHarian)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={penjualanPerCabang} />}
                  label="Penjualan/Cabang"
                  onChange={() => setPenjualanPerCabang(!penjualanPerCabang)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={rekapPenerimaan} />}
                  label="Rekap Penerimaan"
                  onChange={() => setRekapPenerimaan(!rekapPenerimaan)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={lapPenjualan} />}
                  label="Lap. Penjualan"
                  onChange={() => setLapPenjualan(!lapPenjualan)}
                />
              </FormGroup>
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography variant="p" sx={[spacingTop]}>
                Piutang
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={angsuran} />}
                  label="Angsuran"
                  onChange={() => setAngsuran(!angsuran)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={sp} />}
                  label="SP"
                  onChange={() => setSp(!sp)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={st} />}
                  label="ST"
                  onChange={() => setSt(!st)}
                />
              </FormGroup>
              <Typography variant="p" sx={[spacingTop]}>
                Perawatan
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={biayaPerawatan} />}
                  label="Biaya Perawatan"
                  onChange={() => setBiayaPerawatan(!biayaPerawatan)}
                />
              </FormGroup>
              <Typography variant="p" sx={[spacingTop]}>
                Finance
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={kasMasuk} />}
                  label="Kas Masuk"
                  onChange={() => setKasMasuk(!kasMasuk)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={kasKeluar} />}
                  label="Kas Keluar"
                  onChange={() => setKasKeluar(!kasKeluar)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={bankMasuk} />}
                  label="Bank Masuk"
                  onChange={() => setBankMasuk(!bankMasuk)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={bankKeluar} />}
                  label="Bank Keluar"
                  onChange={() => setBankKeluar(!bankKeluar)}
                />
              </FormGroup>
              <Typography variant="p" sx={[spacingTop]}>
                Accounting
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={posting} />}
                  label="Posting"
                  onChange={() => setPosting(!posting)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={unposting} />}
                  label="Unposting"
                  onChange={() => setUnposting(!unposting)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={aktivitasBukuBesar} />}
                  label="Aktivitas Buku Besar"
                  onChange={() => setAktivitasBukuBesar(!aktivitasBukuBesar)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={labaRugi} />}
                  label="Laba Rugi"
                  onChange={() => setLabaRugi(!labaRugi)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={neraca} />}
                  label="Neraca"
                  onChange={() => setNeraca(!neraca)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={neracaSaldo} />}
                  label="Neraca Saldo"
                  onChange={() => setNeracaSaldo(!neracaSaldo)}
                />
              </FormGroup>
              <Typography variant="p" sx={[spacingTop]}>
                Utility
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={profilUser} />}
                  label="Profil User"
                  onChange={() => setProfilUser(!profilUser)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={daftarUser} />}
                  label="Daftar User"
                  onChange={() => setDaftarUser(!daftarUser)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={tutupPeriode} />}
                  label="Tutup Periode"
                  onChange={() => setTutupPeriode(!tutupPeriode)}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={gantiPeriode} />}
                  label="Ganti Periode"
                  onChange={() => setGantiPeriode(!gantiPeriode)}
                />
              </FormGroup>
            </Box>
          </Box>
        </Paper>
      )}
      <Box sx={spacingTop}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/daftarUser")}
          sx={{ marginRight: 2 }}
        >
          {"< Kembali"}
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={saveUser}>
          Simpan
        </Button>
      </Box>
      <Divider sx={dividerStyle} />
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default TambahUser;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
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

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const contentContainer = {
  p: 3,
  pt: 1,
  mt: 2,
  backgroundColor: Colors.grey100
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
