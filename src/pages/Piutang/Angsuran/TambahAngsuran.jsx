import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { Loader, SearchBar } from "../../../components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Paper,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SaveIcon from "@mui/icons-material/Save";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

const TambahAngsuran = () => {
  const { user, setting } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  // Inputan Penjualan
  const [juals, setJuals] = useState([]);
  const [noJual, setNoJual] = useState("");
  const [noKwitansi, setNoKwitansi] = useState(user.noTerakhir);
  const [penerimaanId, setPenerimaanId] = useState("");
  const [parentId, setParentId] = useState("");
  const [jualId, setJualId] = useState("");

  // Inputan Pembeli
  const [noKtpRegister, setNoKtpRegister] = useState("");
  const [namaRegister, setNamaRegister] = useState("");
  const [almRegister, setAlmRegister] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [tglAng, setTglAng] = useState("");
  const [kodeSurveyor, setKodeSurveyor] = useState("");
  const [kodeMarketing, setKodeMarketing] = useState("");

  // Inputan Motor
  const [tipe, setTipe] = useState("");
  const [noMesin, setNoMesin] = useState("");
  const [namaWarna, setNamaWarna] = useState("");
  const [tahun, setTahun] = useState("");

  // Entry Angsuran
  const [noAngsuran, setNoAngsuran] = useState("");
  const [dari, setDari] = useState("");
  const [tglJatuhTempo, setTglJatuhTempo] = useState("");
  const [tglJatuhTempoNext, setTglJatuhTempoNext] = useState("");
  const [inputTglBayar, setInputTglBayar] = useState(new Date());
  // Input
  const [angModal, setAngModal] = useState("");
  const [angBunga, setAngBunga] = useState("");
  const [angPerBulan, setAngPerBulan] = useState("");
  const [denda, setDenda] = useState("");
  const [hutangDenda, setHutangDenda] = useState("");
  const [hutangDendaBefore, setHutangDendaBefore] = useState("");
  const [biayaTarik, setBiayaTarik] = useState("");
  const [totalPiutang, setTotalPiutang] = useState("");
  const [tempTotalPiutang, setTempTotalPiutang] = useState("");
  const [kodeKolektor, setKodeKolektor] = useState(""); // Input
  const [kodeKolektorLama, setKodeKolektorLama] = useState(""); // Input
  const [kolektors, setKolektors] = useState([]);
  const [potongan, setPotongan] = useState(0); // Input
  const [totalBayar, setTotalBayar] = useState("");
  const [tempTotalBayar, setTempTotalBayar] = useState("");
  const [bayar, setBayar] = useState(""); // Input
  const [keterangan, setKeterangan] = useState(""); // Input

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTermJual, setSearchTermJual] = useState("");
  const [openJual, setOpenJual] = React.useState(false);

  const classes = useStyles();

  const handleClickOpenJual = () => {
    setOpenJual(true);
  };

  const handleCloseJual = () => {
    setOpenJual(false);
  };

  const kolektorOptions = kolektors.map((kolektor) => ({
    label: `${kolektor.kodeKolektor} - ${kolektor.namaKolektor}`
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function dhm(t) {
    var cd = 24 * 60 * 60 * 1000,
      ch = 60 * 60 * 1000,
      d = Math.floor(t / cd),
      h = Math.floor((t - d * cd) / ch),
      m = Math.round((t - d * cd - h * ch) / 60000),
      pad = function (n) {
        return n < 10 ? "0" + n : n;
      };
    if (m === 60) {
      h++;
      m = 0;
    }
    if (h === 24) {
      d++;
      h = 0;
    }
    return d;
  }

  const tempPostsJual = juals.filter((val) => {
    if (setSearchTermJual === "") {
      return val;
    } else if (
      val.noRegister.toUpperCase().includes(searchTermJual.toUpperCase()) ||
      val.namaRegister.toUpperCase().includes(searchTermJual.toUpperCase()) ||
      val.tglAng.toUpperCase().includes(searchTermJual.toUpperCase()) ||
      val.nopol.toUpperCase().includes(searchTermJual.toUpperCase()) ||
      val.almRegister.toUpperCase().includes(searchTermJual.toUpperCase())
    ) {
      return val;
    }
  });

  useEffect(() => {
    increaseNoKwt();
    getJual();
    getKolektor();
  }, []);

  const increaseNoKwt = async () => {
    const response = await axios.post(`${tempUrl}/findUser/${user._id}`, {
      id: user._id,
      token: user.token
    });
    let tempNoTerakhir = response.data.noTerakhir;
    let tempNoKwt = tempNoTerakhir.slice(1, tempNoTerakhir.length);
    let tempFirstNoKwt = tempNoTerakhir[0];
    tempNoKwt++;
    setNoKwitansi(tempFirstNoKwt + tempNoKwt);
  };

  const getKolektor = async () => {
    setLoading(true);
    const allKolektors = await axios.post(`${tempUrl}/kolektors`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setKolektors(allKolektors.data);
    setKodeKolektor(`${setting.kodeKolektor} - ${setting.namaKolektor}`);
    setKodeKolektorLama(`${setting.kodeKolektor} - ${setting.namaKolektor}`);
    setLoading(false);
  };

  const getJual = async () => {
    setLoading(true);
    const allJualsForAngsuran = await axios.post(
      `${tempUrl}/jualsForAngsuran`,
      {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    setJuals(allJualsForAngsuran.data);
    setLoading(false);
  };

  const getAngsuranKe = async (noKontrak) => {
    const angsuranBefore = await axios.post(`${tempUrl}/angsuransChildBefore`, {
      noJual: noKontrak,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    let tempAng = 0;
    if (angsuranBefore.data.hutangDenda) {
      tempAng = angsuranBefore.data.hutangDenda;
      setHutangDendaBefore(angsuranBefore.data.hutangDenda);
    }
    const penerimaan = await axios.post(`${tempUrl}/penerimaansByNoJual`, {
      noJual: noKontrak,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setPenerimaanId(penerimaan.data._id);
    const angsuran = await axios.post(`${tempUrl}/angsuransByNoJual`, {
      noJual: noKontrak,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setDari(angsuran.data.tenor);
    setParentId(angsuran.data._id);
    const response = await axios.post(`${tempUrl}/angsuransChild`, {
      noJual: noKontrak,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    const responseNext = await axios.post(`${tempUrl}/angsuransChildNext`, {
      noJual: noKontrak,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setTglJatuhTempoNext(responseNext.data.tglJatuhTempo);
    setNoAngsuran(response.data._id);
    setTglJatuhTempo(response.data.tglJatuhTempo);
    setAngModal(response.data.angModal);
    setAngBunga(response.data.angBunga);
    setAngPerBulan(response.data.angPerBulan);
    setDenda(response.data.denda);
    setHutangDenda(response.data.hutangDenda);
    setBiayaTarik(response.data.biayaTarik);
    setTotalPiutang(
      response.data.angPerBulan +
        response.data.denda +
        response.data.hutangDenda +
        tempAng
    );
    setTempTotalPiutang(
      response.data.angPerBulan +
        response.data.denda +
        response.data.hutangDenda +
        tempAng
    );
    setTotalBayar(
      response.data.angPerBulan +
        response.data.denda +
        response.data.hutangDenda +
        tempAng
    );
    setBayar(
      response.data.angPerBulan +
        response.data.denda +
        response.data.hutangDenda +
        tempAng
    );
    setTempTotalBayar(
      response.data.angPerBulan +
        response.data.denda +
        response.data.hutangDenda +
        tempAng
    );

    let tglBayar =
      inputTglBayar.getFullYear() +
      "-" +
      (inputTglBayar.getMonth() + 1) +
      "-" +
      inputTglBayar.getDate();

    var d1 = new Date(tglBayar); //"now"
    var d2 = new Date(response.data.tglJatuhTempo); // some date
    var diff = Math.abs(d1 - d2); // difference in milliseconds
    var total = dhm(diff);
    if (d1 > d2 && total > setting.toleransiSetting) {
      setDenda(setting.dendaSetting * total);
      setTotalPiutang(
        response.data.angPerBulan +
          response.data.denda +
          response.data.hutangDenda +
          tempAng +
          setting.dendaSetting * total
      );
      setTotalBayar(
        response.data.angPerBulan +
          response.data.denda +
          response.data.hutangDenda +
          tempAng +
          setting.dendaSetting * total
      );
      setBayar(
        response.data.angPerBulan +
          response.data.denda +
          response.data.hutangDenda +
          tempAng +
          setting.dendaSetting * total
      );
    } else {
      setDenda(0);
      setTotalPiutang(
        response.data.angPerBulan +
          response.data.denda +
          response.data.hutangDenda +
          tempAng
      );
      setTotalBayar(
        response.data.angPerBulan +
          response.data.denda +
          response.data.hutangDenda +
          tempAng
      );
    }
  };

  const saveAngsuran = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let tglBayar =
      inputTglBayar?.getFullYear() +
      "-" +
      (inputTglBayar?.getMonth() + 1) +
      "-" +
      inputTglBayar?.getDate();

    let isFailedValidation =
      noJual.length === 0 ||
      inputTglBayar === null ||
      kodeKolektor.length === 0 ||
      bayar.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        const tempKolektor = await axios.post(`${tempUrl}/kolektorByKode`, {
          kodeKolektor: kodeKolektor.split(" ", 1)[0],
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        });
        // Update No Kwitansi User
        await axios.post(`${tempUrl}/users/${user._id}`, {
          noTerakhir: noKwitansi,
          id: user._id,
          token: user.token
        });
        // Update Angsuran
        await axios.post(`${tempUrl}/updateAngsuran/${parentId}`, {
          angsuranKe: noAngsuran - 1,
          _id: noAngsuran,
          tglJatuhTempo,
          angModal,
          angBunga,
          angPerBulan,
          tglBayar,
          kodeKolektor: tempKolektor.data._id,
          noKwitansi,
          keterangan,
          denda,
          potongan: potongan ? potongan : 0,
          jemputan: 0,
          biayaTarik,
          hutangDenda,
          totalPiutang,
          totalBayar,
          bayar,
          userInput: user.username,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.username,
          id: user._id,
          token: user.token
        });
        await axios.post(`${tempUrl}/updatePenerimaan/${penerimaanId}`, {
          angsuranKe: noAngsuran - 1,
          _id: noAngsuran,
          angModal,
          angBunga,
          noKwitansi,
          keterangan,
          denda,
          potongan: potongan ? potongan : 0,
          id: user._id,
          token: user.token
        });
        await axios.post(`${tempUrl}/updateAngsuranBayarKe/${parentId}`, {
          bayarKe: noAngsuran + 1,
          id: user._id,
          token: user.token
        });
        await axios.post(`${tempUrl}/updateJual/${jualId}`, {
          sisaBulan: dari - noAngsuran,
          tglJatuhTempo: tglJatuhTempoNext,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/daftarAngsuran");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Piutang</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Entry Angsuran
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        {/* Data Penjualan */}
        <Paper elevation={6} sx={mainContainer}>
          <Typography variant="h5" sx={titleStyle} color="primary">
            DATA PENJUALAN
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>No. Kwitansi</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={noKwitansi}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>No Jual</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                error={error && noJual.length === 0 && true}
                helperText={
                  error && noJual.length === 0 && "No. Jual harus diisi!"
                }
                variant="outlined"
                value={noJual}
                InputProps={{
                  readOnly: true
                }}
                onClick={() => handleClickOpenJual()}
                placeholder="Pilih..."
              />
            </Box>
          </Box>
        </Paper>

        {/* Data Pembeli */}
        <Paper elevation={6} sx={mainContainer}>
          <Typography variant="h5" sx={titleStyle} color="primary">
            DATA PEMBELI
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Nama Register</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={namaRegister}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Alamat Rumah
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={almRegister}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                No. KTP Register
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={noKtpRegister}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Tanggal Angsuran
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={tglAng}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Kode Kecamatan</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={kodeKecamatan}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Kode Surveyor
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={kodeSurveyor}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Kode Marketing
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={kodeMarketing}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Data Motor */}
        <Paper elevation={6} sx={mainContainer}>
          <Typography variant="h5" sx={titleStyle} color="primary">
            DATA MOTOR
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Tipe</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={tipe}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>No. Mesin</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={noMesin}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Nama Warna</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={namaWarna}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Tahun Perakitan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={tahun}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Data Rincian Harga (Input) */}
        <Paper elevation={6} sx={mainContainer}>
          <Typography variant="h5" sx={titleStyle} color="primary">
            ENTRY ANGSURAN
          </Typography>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Box sx={{ display: "flex" }}>
                <Box>
                  <Typography sx={[labelInput]}>Angsuran Ke-</Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    value={noAngsuran}
                    InputProps={{
                      readOnly: true
                    }}
                    sx={{ backgroundColor: Colors.grey400 }}
                  />
                </Box>
                <Box>
                  <Typography sx={[labelInput]}>Dari</Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    value={dari}
                    InputProps={{
                      readOnly: true
                    }}
                    sx={{ backgroundColor: Colors.grey400 }}
                  />
                </Box>
              </Box>
              <Typography sx={[labelInput, spacingTop]}>
                Tanggal Jatuh Tempo
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={tglJatuhTempo}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              {user.tipeUser === "ADM" ? (
                <>
                  <Typography sx={[labelInput, spacingTop]}>
                    Tanggal Bayar
                  </Typography>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={inputTglBayar}
                    disabled={true}
                    customInput={
                      <TextField
                        error={error && inputTglBayar === null && true}
                        helperText={
                          error &&
                          inputTglBayar === null &&
                          "Tanggal Bayar harus diisi!"
                        }
                        sx={{ backgroundColor: Colors.grey400, width: "100%" }}
                        size="small"
                      />
                    }
                  />
                </>
              ) : (
                <>
                  <Typography sx={[labelInput, spacingTop]}>
                    Tanggal Bayar
                  </Typography>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date(user.periode.periodeAwal)}
                    maxDate={new Date(user.periode.periodeAkhir)}
                    selected={inputTglBayar}
                    onChange={(e) => {
                      setInputTglBayar(e);

                      var d1 = new Date(e); //"now"
                      var d2 = new Date(tglJatuhTempo); // some date
                      var diff = Math.abs(d1 - d2); // difference in milliseconds
                      var total = dhm(diff);
                      if (d1 > d2 && total > setting.toleransiSetting) {
                        setDenda(setting.dendaSetting * total);
                        setTotalPiutang(
                          tempTotalPiutang + setting.dendaSetting * total
                        );
                        setTotalBayar(
                          tempTotalBayar + setting.dendaSetting * total
                        );
                        setBayar(tempTotalBayar + setting.dendaSetting * total);
                      } else {
                        setDenda(0);
                        setTotalPiutang(tempTotalPiutang);
                        setTotalBayar(tempTotalBayar);
                        setBayar(tempTotalBayar);
                      }
                    }}
                    customInput={
                      <TextField
                        error={error && inputTglBayar === null && true}
                        helperText={
                          error &&
                          inputTglBayar === null &&
                          "Tanggal Bayar harus diisi!"
                        }
                        sx={{ width: "100%" }}
                        size="small"
                      />
                    }
                  />
                </>
              )}
              <Typography sx={[labelInput, spacingTop]}>
                Angsuran Modal
                {angModal !== 0 &&
                  !isNaN(parseInt(angModal)) &&
                  ` : ${parseInt(angModal).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={angModal}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Angsuran Bunga
                {angBunga !== 0 &&
                  !isNaN(parseInt(angBunga)) &&
                  ` : ${parseInt(angBunga).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={angBunga}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Angsuran/Bulan
                {angPerBulan !== 0 &&
                  !isNaN(parseInt(angPerBulan)) &&
                  ` : ${parseInt(angPerBulan).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={angPerBulan}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Denda
                {denda !== 0 &&
                  !isNaN(parseInt(denda)) &&
                  ` : ${parseInt(denda).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={denda}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Hutang Denda (baru)
                {hutangDenda !== 0 &&
                  !isNaN(parseInt(hutangDenda)) &&
                  ` : ${parseInt(hutangDenda).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={hutangDenda}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Hutang Denda (lama)
                {hutangDendaBefore !== 0 &&
                  !isNaN(parseInt(hutangDendaBefore)) &&
                  ` : ${parseInt(hutangDendaBefore).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={hutangDendaBefore}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>
                Biaya Tarik
                {biayaTarik !== 0 &&
                  !isNaN(parseInt(biayaTarik)) &&
                  ` : ${parseInt(biayaTarik).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={biayaTarik}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Total Piutang
                {totalPiutang !== 0 &&
                  !isNaN(parseInt(totalPiutang)) &&
                  ` : ${parseInt(totalPiutang).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={totalPiutang}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Kode Kolektor
              </Typography>
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                options={kolektorOptions}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    error={error && kodeKolektor.length === 0 && true}
                    helperText={
                      error &&
                      kodeKolektor.length === 0 &&
                      "Kode Kolektor harus diisi!"
                    }
                    {...params}
                  />
                )}
                onInputChange={(e, value) => setKodeKolektor(value)}
                inputValue={kodeKolektor}
                onChange={(e, value) => setKodeKolektorLama(value)}
                value={kodeKolektorLama}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Potongan
                {potongan !== 0 &&
                  !isNaN(parseInt(potongan)) &&
                  ` : ${parseInt(potongan).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                error={error && potongan.length === 0 && true}
                helperText={
                  error && potongan.length === 0 && "Potongan harus diisi!"
                }
                id="outlined-basic"
                variant="outlined"
                value={potongan}
                onChange={(e) => {
                  setPotongan(e.target.value);
                  setTotalBayar(totalPiutang - e.target.value);
                  setBayar(totalPiutang - e.target.value);
                }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Total Bayar
                {totalBayar !== 0 &&
                  !isNaN(parseInt(totalBayar)) &&
                  ` : ${parseInt(totalBayar).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                value={totalBayar}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: Colors.grey400 }}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Bayar
                {bayar !== 0 &&
                  !isNaN(parseInt(bayar)) &&
                  ` : ${parseInt(bayar).toLocaleString()}`}
              </Typography>
              <TextField
                size="small"
                error={error && bayar.length === 0 && true}
                helperText={error && bayar.length === 0 && "Bayar harus diisi!"}
                id="outlined-basic"
                variant="outlined"
                value={bayar}
                onChange={(e) => {
                  setBayar(e.target.value);
                  var diff = e.target.value - totalBayar;
                  if (diff < 0) {
                    setHutangDenda(diff * -1);
                  } else {
                    setHutangDenda(diff);
                  }
                }}
              />
              <Typography sx={[labelInput, spacingTop]}>Keterangan</Typography>
              <TextareaAutosize
                maxRows={1}
                aria-label="maximum height"
                style={{ height: 135 }}
                value={keterangan}
                onChange={(e) => {
                  setKeterangan(e.target.value);
                }}
              />
            </Box>
          </Box>
        </Paper>

        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/daftarAngsuran")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveAngsuran}
          >
            Simpan
          </Button>
        </Box>
      </Paper>
      <Divider sx={spacingTop} />
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
      <Dialog
        open={openJual}
        onClose={handleCloseJual}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">{`Pilih Data Jual`}</DialogTitle>
        <DialogActions>
          <Box sx={dialogContainer}>
            <SearchBar setSearchTerm={setSearchTermJual} />
            <TableContainer component={Paper} sx={dialogWrapper}>
              <Table aria-label="simple table">
                <TableHead className={classes.root}>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      No. Jual
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Nama Register
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Tanggal</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>No. Plat</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Alamat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempPostsJual
                    .filter((val) => {
                      if (searchTermJual === "") {
                        return val;
                      } else if (
                        val.noRegister
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase()) ||
                        val.namaRegister
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase()) ||
                        val.tglAng
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase()) ||
                        val.nopol
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase()) ||
                        val.almRegister
                          .toUpperCase()
                          .includes(searchTermJual.toUpperCase())
                      ) {
                        return val;
                      }
                    })
                    .map((user, index) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { bgcolor: Colors.grey300 },
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setJualId(user._id);
                          setNoJual(user.noJual);
                          setNoKtpRegister(user.noKtpRegister);
                          setNamaRegister(user.namaRegister);
                          setAlmRegister(user.almRegister);
                          setTglAng(user.tglAng);
                          setKodeKecamatan(
                            `${user.kodeKecamatan.kodeKecamatan} - ${user.kodeKecamatan.namaKecamatan}`
                          );
                          setKodeSurveyor(
                            `${user.kodeSurveyor.kodeSurveyor} - ${user.kodeSurveyor.namaSurveyor}`
                          );
                          setKodeMarketing(
                            `${user.kodeMarketing.kodeMarketing} - ${user.kodeMarketing.namaMarketing}`
                          );
                          setTipe(user.tipe);
                          setNoMesin(user.noMesin);
                          setNamaWarna(user.namaWarna);
                          setTahun(user.tahun);
                          getAngsuranKe(user.noJual);

                          handleCloseJual();
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.noRegister}
                        </TableCell>
                        <TableCell>
                          {user.tenor - user.bayarKe !== 0
                            ? "MASIH"
                            : "SELESAI"}
                        </TableCell>
                        <TableCell>{user.namaRegister}</TableCell>
                        <TableCell>{user.tglAng}</TableCell>
                        <TableCell>{user.nopol}</TableCell>
                        <TableCell>{user.almRegister}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TambahAngsuran;

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
  p: {
    sm: 0,
    md: 3
  },
  pt: {
    sm: 0,
    md: 1
  },
  mt: {
    sm: 0,
    md: 2
  },
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

const mainContainer = {
  padding: 3,
  borderRadius: "20px",
  margin: {
    sm: 0,
    md: 4
  },
  marginTop: {
    xs: 4,
    md: 0
  }
};

const dialogContainer = {
  display: "flex",
  flexDirection: "column",
  padding: 4,
  width: "1000px"
};

const dialogWrapper = {
  width: "100%",
  marginTop: 2
};

const titleStyle = {
  textAlign: "center",
  fontWeight: "600"
};
