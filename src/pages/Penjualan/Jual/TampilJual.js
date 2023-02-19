import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableJual } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifierJual,
} from "../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Pagination,
  Button,
  ButtonGroup,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import angkaTerbilang from "@develoka/angka-terbilang-js";

const TampilJual = () => {
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  // Data Register/Pembeli
  const [noRegister, setNoRegister] = useState("");
  const [namaRegister, setNamaRegister] = useState("");
  const [almRegister, setAlmRegister] = useState("");
  const [almKantor, setAlmKantor] = useState("");
  const [tlpRegister, setTlpRegister] = useState("");
  const [noKtpRegister, setNoKtpRegister] = useState("");
  const [noKKRegister, setNoKKRegister] = useState("");
  const [namaPjmRegister, setNamaPjmRegister] = useState("");
  const [noKtpPjmRegister, setNoKtpPjmRegister] = useState("");
  const [namaRefRegister, setNamaRefRegister] = useState("");
  const [almRefRegister, setAlmRefRegister] = useState("");
  const [tlpRefRegister, setTlpRefRegister] = useState("");
  const [kodeMarketing, setKodeMarketing] = useState("");
  const [kodeSurveyor, setKodeSurveyor] = useState("");
  const [kodePekerjaan, setKodePekerjaan] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [kodeLeasing, setKodeLeasing] = useState("");

  // Data Motor -> Dari Stok
  const [noRangka, setNoRangka] = useState("");
  const [noMesin, setNoMesin] = useState("");
  const [nopol, setNopol] = useState("");
  const [tipe, setTipe] = useState("");
  const [namaWarna, setNamaWarna] = useState("");
  const [tahun, setTahun] = useState("");

  // Data Penjualan -> dari input
  const [hargaTunai, setHargaTunai] = useState("");
  const [uangMuka, setUangMuka] = useState("");
  const [sisaPiutang, setSisaPiutang] = useState("");
  const [angPerBulan, setAngPerBulan] = useState("");
  const [tenor, setTenor] = useState("");
  const [sisaBulan, setSisaBulan] = useState("");
  const [bunga, setBunga] = useState("");
  const [jumlahPiutang, setJumlahPiutang] = useState("");
  const [angModal, setAngModal] = useState("");
  const [angBunga, setAngBunga] = useState("");
  const [noJual, setNoJual] = useState("");
  const [noKwitansi, setNoKwitansi] = useState("");
  const [tglJual, setTglJual] = useState("");
  const [tglJualDate, setTglJualDate] = useState();
  const [jenisJual, setJenisJual] = useState("");
  const [leasing, setLeasing] = useState("");
  const [tglAng, setTglAng] = useState("");
  const [tglAngAkhir, setTglAngAkhir] = useState("");
  const [kodeAngsuran, setKodeAngsuran] = useState("");
  const [isPost, setIsPost] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [jualsData, setJualsData] = useState([]);
  const [jualsForTable, setJualsForTable] = useState([]);
  const [jualsForDoc, setJualsForDoc] = useState([]);
  const [leasings, setLeasings] = useState([]);
  const [tipes, setTipes] = useState([]);
  const [kecamatans, setKecamatans] = useState([]);

  const [pilihCetak, setPilihCetak] = useState("daftarJual");
  const navigate = useNavigate();
  let today = new Date();
  let isJualExist = noJual.length !== 0;
  let isEditableManager = user.tipeUser !== "ADM" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADM" &&
    tglJualDate?.getFullYear() === today.getFullYear() &&
    tglJualDate?.getMonth() === today.getMonth() &&
    tglJualDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const columns = [
    { title: "No. Jual", field: "noJual" },
    { title: "Tanggal Jual", field: "tanggalJual" },
    { title: "Nama Register", field: "namaRegister" },
    { title: "Kode Leasing", field: "kodeLeasing" },
    { title: "Tipe", field: "tipe" },
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = jualsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noJual.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tanggalJual.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaRegister.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.kodeLeasing.kodeLeasing
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kodeLeasing.namaLeasing
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.tipe.toUpperCase().includes(searchTerm.toUpperCase()) ||
      tipes
        .filter((tipe) => tipe.kodeTipe === val.tipe)
        .map((sup) => sup.namaTipe)
        .includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(jualsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getJualsForTable();
    getKecamatan();
    getTipe();
    getJualsData();
    getJualsForDoc();
    id && getJualById();
  }, [id]);

  const getKecamatan = async () => {
    setLoading(true);
    const allKecamatansForTable = await axios.post(
      `${tempUrl}/kecamatansForTable`,
      {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id,
      }
    );
    setKecamatans(allKecamatansForTable.data);
    setLoading(false);
  };

  const getTipe = async () => {
    setLoading(true);
    const allTipesMainInfo = await axios.post(`${tempUrl}/tipesMainInfo`, {
      id: user._id,
      token: user.token,
    });
    setTipes(allTipesMainInfo.data);
    setLoading(false);
  };

  const getJualsData = async () => {
    setLoading(true);
    try {
      const allJuals = await axios.post(`${tempUrl}/juals`, {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id,
      });
      setJualsData(allJuals.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getJualsForTable = async () => {
    setLoading(true);
    const allJualsForTable = await axios.post(`${tempUrl}/jualsForTable`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id,
    });
    setJualsForTable(allJualsForTable.data);
    setLoading(false);
  };

  const getJualsForDoc = async () => {
    setLoading(true);
    const allJualsForDoc = await axios.post(`${tempUrl}/jualsForDoc`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id,
    });
    setJualsForDoc(allJualsForDoc.data);
    setLoading(false);
  };

  const getJualById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/juals/${id}`, {
        id: user._id,
        token: user.token,
      });
      // Data Register/Pembeli
      setNoRegister(response.data.noRegister);
      setNamaRegister(response.data.namaRegister);
      setAlmRegister(response.data.almRegister);
      setAlmKantor(response.data.almKantor);
      setTlpRegister(response.data.tlpRegister);
      setNoKtpRegister(response.data.noKtpRegister);
      setNoKKRegister(response.data.noKKRegister);
      setNamaPjmRegister(response.data.namaPjmRegister);
      setNoKtpPjmRegister(response.data.noKtpPjmRegister);
      setNamaRefRegister(response.data.namaRefRegister);
      setAlmRefRegister(response.data.almRefRegister);
      setTlpRefRegister(response.data.tlpRefRegister);
      setKodeMarketing(response.data.kodeMarketing);
      setKodeSurveyor(response.data.kodeSurveyor);
      setKodePekerjaan(response.data.kodePekerjaan);
      setKodeKecamatan(response.data.kodeKecamatan);
      setKodeLeasing(response.data.kodeLeasing);

      // Data Motor -> Dari Stok
      setNoRangka(response.data.noRangka);
      setNoMesin(response.data.noMesin);
      setNopol(response.data.nopol);
      setTipe(response.data.tipe);
      setNamaWarna(response.data.namaWarna);
      setTahun(response.data.tahun);

      // Data Penjualan -> dari input
      setHargaTunai(response.data.hargaTunai);
      setUangMuka(response.data.uangMuka);
      setSisaPiutang(response.data.sisaPiutang);
      setAngPerBulan(response.data.angPerBulan);
      setTenor(response.data.tenor);
      setSisaBulan(response.data.sisaBulan);
      setBunga(response.data.bunga);
      setJumlahPiutang(response.data.jumlahPiutang);
      setAngModal(response.data.angModal);
      setAngBunga(response.data.angBunga);
      setNoJual(response.data.noJual);
      setNoKwitansi(response.data.noKwitansi);
      setTglJual(response.data.tanggalJual);
      setTglJualDate(new Date(response.data.tanggalJual));
      setJenisJual(response.data.jenisJual);
      setLeasing(response.data.leasing);
      setTglAng(response.data.tglAng);
      setTglAngAkhir(response.data.tglAngAkhir);
      setKodeAngsuran(response.data.kodeAngsuran);
      setIsPost(response.data.isPost);
    }
  };

  const deleteJual = async (id) => {
    try {
      setLoading(true);
      const tempStok = await axios.post(`${tempUrl}/daftarStoksByNorang`, {
        noRangka,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id,
      });
      // Update Stok
      await axios.post(`${tempUrl}/updateDaftarStok/${tempStok.data._id}`, {
        noJual: "",
        tanggalJual: "",
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id,
      });
      if (kodeAngsuran) {
        // Delete Angsuran
        await axios.post(`${tempUrl}/deleteAngsuran/${kodeAngsuran}`, {
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id,
        });
      }
      await axios.post(`${tempUrl}/deleteJual/${id}`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id,
      });
      // Data Register/Pembeli
      setNoRegister("");
      setNamaRegister("");
      setAlmRegister("");
      setAlmKantor("");
      setTlpRegister("");
      setNoKtpRegister("");
      setNoKKRegister("");
      setNamaPjmRegister("");
      setNoKtpPjmRegister("");
      setNamaRefRegister("");
      setAlmRefRegister("");
      setTlpRefRegister("");
      setKodeMarketing("");
      setKodeSurveyor("");
      setKodePekerjaan("");
      setKodeKecamatan("");
      setKodeLeasing("");

      // Data Motor -> Dari Stok
      setNoRangka("");
      setNoMesin("");
      setNopol("");
      setTipe("");
      setNamaWarna("");
      setTahun("");

      // Data Penjualan -> dari input
      setHargaTunai("");
      setUangMuka("");
      setSisaPiutang("");
      setAngPerBulan("");
      setTenor("");
      setBunga("");
      setJumlahPiutang("");
      setAngModal("");
      setAngBunga("");
      setNoJual("");
      setNoKwitansi("");
      setTglJual("");
      setJenisJual("");
      setLeasing("");
      setTglAng("");
      setTglAngAkhir("");
      setLoading(false);
      navigate("/jual");
    } catch (error) {
      console.log(error);
    }
  };

  const pilihCetakPdf = () => {
    if (pilihCetak === "daftarJual") {
      downloadPdfDaftarJual();
    } else if (pilihCetak === "kwitansiUmKredit") {
      downloadPdfCetakKwitansiKredit();
    } else if (pilihCetak === "suratPerjanjian") {
      downloadPdfSuratPerjanjian();
    } else if (pilihCetak === "kwitansiUmTunai") {
      downloadPdfCetakKwitansiTunai();
    }
  };

  const downloadPdfDaftarJual = () => {
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
    doc.text(`Daftar Jual`, 90, 30);
    doc.setFontSize(10);
    doc.text(`Periode: ${user.periode.namaPeriode}`, 15, 35);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.setFontSize(12);
    doc.autoTable({
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: jualsForTable,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0],
      },
    });
    doc.save(`daftarJual.pdf`);
  };

  const downloadPdfCetakKwitansiTunai = async () => {
    const tempStok = await axios.post(`${tempUrl}/daftarStoksByNorang`, {
      noRangka,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id,
    });

    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    let tempX1 = 50;
    let tempY = 38;
    const doc = new jsPDF();
    doc.setFontSize(9);
    doc.text(`${noKwitansi}`, 165, 22);
    doc.text(`${namaRegister}`, tempX1, tempY);
    tempY += 4;
    doc.text(`${almRegister.slice(0, 45)}`, tempX1, tempY);
    tempY += 13;
    doc.setFont(undefined, "bold");
    doc.text(`${angkaTerbilang(uangMuka)} rupiah`, tempX1, tempY);
    doc.setFont(undefined, "normal");
    tempY += 9;
    doc.text(
      `Pembayaran 1 (satu) unit sepeda motor ${tempStok.data.merk}, Tipe : ${tipe}`,
      tempX1,
      tempY
    );
    tempY += 4;
    doc.text(
      `No.Rangka : ${noRangka}.   Nomor Mesin : ${noMesin}`,
      tempX1,
      tempY
    );
    tempY += 4;
    if (nopol.length > 0) {
      // Bekas
      doc.text(`Tahun ${tahun},    Warna : ${namaWarna}`, tempX1, tempY);
    } else {
      // Baru
      doc.text(
        `Keadaan 100% BARU, Tahun ${tahun} Warna : ${namaWarna}`,
        tempX1,
        tempY
      );
    }
    tempY += 34;
    doc.setFont(undefined, "bold");
    doc.text(`${uangMuka.toLocaleString()}`, tempX1 + 10, tempY);
    doc.setFont(undefined, "normal");
    doc.text(`${current_date}`, 140, tempY);
    tempY += 35;
    doc.text(`${namaRegister.slice(0, 30)}`, tempX1 - 8, tempY);
    doc.text(`( ${user.username} )`, 140, tempY);
    doc.save(`kwitansiUMTunai.pdf`);
  };

  const downloadPdfCetakKwitansiKredit = async () => {
    const tempStok = await axios.post(`${tempUrl}/daftarStoksByNorang`, {
      noRangka,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id,
    });
    let makeTglAng1 = new Date(tglAng);
    let makeTglAngAkhir = new Date(tglAngAkhir);
    let tempTglAng1 =
      makeTglAng1.getDate() +
      "-" +
      (makeTglAng1.getMonth() + 1) +
      "-" +
      makeTglAng1.getFullYear();
    let tempTglAngAkhir =
      makeTglAngAkhir.getDate() +
      "-" +
      (makeTglAngAkhir.getMonth() + 1) +
      "-" +
      makeTglAngAkhir.getFullYear();
    let tempX1 = 50;
    let tempY = 38;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF();
    doc.setFontSize(9);
    doc.text(`${noKwitansi}`, 165, 22);
    doc.text(`${namaRegister}`, tempX1, tempY);
    tempY += 4;
    doc.text(`${almRegister.slice(0, 45)}`, tempX1, tempY);
    tempY += 13;
    doc.setFont(undefined, "bold");
    doc.text(`${angkaTerbilang(uangMuka)} rupiah`, tempX1, tempY);
    doc.setFont(undefined, "normal");
    tempY += 9;
    doc.text(
      `UANG MUKA 1 (satu) unit sepeda motor ${tempStok.data.merk} Tipe : ${tipe}`,
      tempX1,
      tempY
    );
    tempY += 4;
    doc.text(
      `No.Rangka : ${noRangka}.   Nomor Mesin : ${noMesin}`,
      tempX1,
      tempY
    );
    tempY += 4;
    if (nopol.length > 0) {
      // Bekas
      doc.text(`Tahun ${tahun},    Warna : ${namaWarna}`, tempX1, tempY);
    } else {
      // Baru
      doc.text(
        `Keadaan 100% BARU, Tahun ${tahun} Warna : ${namaWarna}`,
        tempX1,
        tempY
      );
    }
    tempY += 4;
    doc.setFont(undefined, "bold");
    doc.text(`CATATAN : `, tempX1, tempY);
    doc.setFont(undefined, "normal");
    tempY += 4;
    doc.text(
      `SEWA BELI ${tenor} Bulan. Pembayaran Uang Muka Rp. ${uangMuka.toLocaleString()} dan angsuran perbulan`,
      tempX1,
      tempY
    );
    tempY += 4;
    doc.text(
      `Rp. ${angPerBulan.toLocaleString()} X ${tenor}. Terhitung angsuran Ke-1 (satu) Mulai TGL.${tempTglAng1} s/d`,
      tempX1,
      tempY
    );
    tempY += 4;
    doc.text(
      `Angsuran Ke-${tenor} (${angkaTerbilang(
        tenor
      )} bulan) Jatuh tempo pembayarannya TGL.${tempTglAngAkhir}`,
      tempX1,
      tempY
    );
    tempY += 4;
    doc.text(`Kontrak No. ${noJual}`, tempX1, tempY);
    tempY += 14;
    doc.setFont(undefined, "bold");
    doc.text(`${uangMuka.toLocaleString()}`, tempX1 + 10, tempY);
    doc.setFont(undefined, "normal");
    doc.text(`${current_date}`, 140, tempY);
    tempY += 35;
    doc.text(`${namaRegister.slice(0, 30)}`, tempX1 - 8, tempY);
    doc.text(`( ${user.username} )`, 140, tempY);
    doc.save(`kwitansiUMKredit.pdf`);
  };

  const downloadPdfSuratPerjanjian = async () => {
    const tempStok = await axios.post(`${tempUrl}/daftarStoksByNorang`, {
      noRangka,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id,
    });
    const tempRegister = await axios.post(`${tempUrl}/registersByNo`, {
      noRegister,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id,
    });
    let tempY = 21;
    let makeTglAng1 = new Date(tglAng);
    let makeTglAngAkhir = new Date(tglAngAkhir);
    var myDays = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    let thisDayNumber = makeTglAng1.getDate();
    let thisDay = myDays[makeTglAng1.getDate()];
    let findMonth = (monthNumber) => {
      if (monthNumber === 1) {
        return "JANUARI";
      } else if (monthNumber === 2) {
        return "FEBRUARI";
      } else if (monthNumber === 3) {
        return "MARET";
      } else if (monthNumber === 4) {
        return "APRIL";
      } else if (monthNumber === 5) {
        return "MEI";
      } else if (monthNumber === 6) {
        return "JUNI";
      } else if (monthNumber === 7) {
        return "JULI";
      } else if (monthNumber === 8) {
        return "AGUSTUS";
      } else if (monthNumber === 9) {
        return "SEPTEMBER";
      } else if (monthNumber === 10) {
        return "OKTOBER";
      } else if (monthNumber === 11) {
        return "NOVEMBER";
      } else if (monthNumber === 12) {
        return "DESEMBER";
      }
    };
    let monthYearTglAng1 =
      findMonth(makeTglAng1.getMonth() + 1) + " " + makeTglAng1.getFullYear();
    let monthYearTglAngAkhir =
      findMonth(makeTglAngAkhir.getMonth() + 1) +
      " " +
      makeTglAngAkhir.getFullYear();
    var date = new Date();
    let tempDateName = findMonth(date.getMonth() + 1);
    var current_date =
      date.getDate() +
      " " +
      findMonth(date.getMonth() + 1) +
      " " +
      date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF();
    doc.setFontSize(8);
    doc.text(`${noJual}`, 90, tempY);
    tempY += 5;
    doc.text(`${current_date}`, 90, tempY);
    tempY += 10;
    doc.text(`${thisDay}`, 40, tempY);
    doc.text(`${date.getDate()}`, 85, tempY);
    doc.text(`${tempDateName}`, 114, tempY);
    doc.text(`${date.getFullYear()}`, 150, tempY);
    tempY += 9;
    doc.text(`${setting.namaPemilik}`, 45, tempY);
    tempY += 5;
    doc.text(`${setting.pekerjaanPemilik}`, 45, tempY);
    tempY += 5;
    doc.text(`${setting.alamatPemilik}`, 45, tempY);
    tempY += 13;
    doc.text(`${namaRegister}`, 45, tempY);
    tempY += 5;
    doc.text(`${tempRegister.data.pkjRegister}`, 45, tempY);
    tempY += 5;
    doc.text(`${almRegister.slice(0, 40)}`, 45, tempY);
    tempY += 5;
    doc.text(`${noKtpRegister}`, 45, tempY);
    tempY += 14;
    doc.text(`${tempRegister.data.namaPjmRegister}`, 45, tempY);
    tempY += 5;
    doc.text(`${tempRegister.data.pkjPjmRegister}`, 45, tempY);
    tempY += 5;
    doc.text(`${tempRegister.data.almPjmRegister.slice(0, 40)}`, 45, tempY);
    tempY += 5;
    doc.text(`${tempRegister.data.noKtpPjmRegister}`, 45, tempY);
    tempY += 26;
    doc.text(`${current_date}`, 65, tempY);
    tempY += 5;
    doc.text(`${tempStok.data.merk}`, 130, tempY);
    tempY += 24;
    doc.text(`${tempStok.data.merk}/${tipe}`, 24, tempY + 4);
    doc.text(`${tahun}`, 55, tempY);
    doc.text(`${namaWarna}`, 84, tempY);
    doc.text(`${noRangka}`, 124, tempY);
    doc.text(`${noMesin}`, 175, tempY);
    tempY += 24;
    doc.text(`${tempStok.data.merk}`, 135, tempY);
    tempY += 5;
    doc.text(
      `${hargaTunai.toLocaleString()} ( ${angkaTerbilang(hargaTunai)} rupiah )`,
      163,
      tempY
    );
    tempY += 33;
    doc.text(
      `${uangMuka.toLocaleString()}                  ${angkaTerbilang(
        uangMuka
      )} rupiah`,
      100,
      tempY
    );
    tempY += 5;
    doc.text(`${sisaPiutang.toLocaleString()}`, 100, tempY);
    tempY += 5;
    doc.text(`${thisDayNumber}`, 22, tempY);
    doc.text(`${angkaTerbilang(thisDayNumber)}`, 35, tempY);
    doc.text(`${tenor}`, 125, tempY);
    doc.text(`${angkaTerbilang(tenor)}`, 160, tempY);
    tempY += 4.5;
    doc.text(`${monthYearTglAng1}`, 80, tempY);
    doc.text(`${monthYearTglAngAkhir}`, 160, tempY);
    tempY += 5;
    doc.text(`${angPerBulan.toLocaleString()}`, 110, tempY);
    tempY += 4.5;
    doc.text(`# ${angkaTerbilang(angPerBulan)} rupiah #`, 25, tempY);
    doc.save(`SuratPerjanjianKredit.pdf`);
  };

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(jualsData);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, `Jual`);
    // Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    // Binary String
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    // Download
    XLSX.writeFile(workBook, `daftarJual.xlsx`);
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
        Jual
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button startIcon={<PrintIcon />} onClick={() => pilihCetakPdf()}>
            CETAK
          </Button>
          <Button startIcon={<DownloadIcon />} onClick={() => downloadExcel()}>
            EXCEL
          </Button>
        </ButtonGroup>
      </Box>
      <Paper elevation={6} sx={pilihCetakContainer}>
        <FormControl>
          <FormLabel id="cetak-buttons-group-label">Pilih Cetak</FormLabel>
          <RadioGroup
            row
            aria-labelledby="cetak-buttons-group-label"
            defaultValue="daftarJual"
            value={pilihCetak}
            onChange={(event) => setPilihCetak(event.target.value)}
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="daftarJual"
              control={<Radio />}
              label="Daftar Jual"
            />
            {isJualExist && jenisJual === "KREDIT" && (
              <>
                <FormControlLabel
                  value="kwitansiUmKredit"
                  control={<Radio />}
                  label="Kwitansi UM Kredit"
                />
                <FormControlLabel
                  value="suratPerjanjian"
                  control={<Radio />}
                  label="Surat Perjanjian"
                />
              </>
            )}
            {isJualExist && jenisJual === "TUNAI" && (
              <>
                <FormControlLabel
                  value="kwitansiUmTunai"
                  control={<Radio />}
                  label="Kwitansi UM Tunai"
                />
              </>
            )}
          </RadioGroup>
        </FormControl>
      </Paper>
      {isEditable ? (
        <Box sx={buttonModifierContainer}>
          <ButtonModifierJual
            id={id}
            kode={noJual}
            tambahBaru={`/jual/tambahJualBaru`}
            addLink={`/jual/tambahJualBekas`}
            editLink={
              nopol.length > 0
                ? `/jual/${id}/editBekas`
                : `/jual/${id}/editBaru`
            }
            deleteUser={deleteJual}
            nameUser={noJual}
            addTambahText=" Bekas"
            editable={tenor - sisaBulan === 0}
          />
        </Box>
      ) : (
        <Box sx={buttonModifierContainer}>
          <ButtonModifierJual
            id={id}
            kode={null}
            tambahBaru={`/jual/tambahJualBaru`}
            addLink={`/jual/tambahJualBekas`}
            editLink={
              nopol.length > 0
                ? `/jual/${id}/editBekas`
                : `/jual/${id}/editBaru`
            }
            deleteUser={deleteJual}
            nameUser={noJual}
            addTambahText=" Bekas"
            editable={tenor - sisaBulan === 0}
          />
        </Box>
      )}
      <Divider sx={dividerStyle} />
      {isJualExist && (
        <>
          <Box sx={contentContainer}>
            {/* Data Penjualan */}
            <Paper elevation={6} sx={mainContainer}>
              <Typography variant="h5" sx={titleStyle} color="primary">
                DATA PENJUALAN
              </Typography>
              <Box sx={showDataContainer}>
                <Box sx={showDataWrapper}>
                  <Typography sx={labelInput}>No. Jual</Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={noJual}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    No. Kwitansi
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={noKwitansi}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Tanggal Jual
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={tglJual}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Jenis Jual
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={jenisJual}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <Typography sx={labelInput}>Tanggal Angsuran I</Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={tglAng}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Tanggal Angsuran Akhir
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={tglAngAkhir}
                    InputProps={{
                      readOnly: true,
                    }}
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
                  <Typography sx={labelInput}>Kode Register</Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={noRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Nama Register
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={namaRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Alamat Rumah
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={almRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Alamat Kantor
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={almKantor}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Telepon Register
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={tlpRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    No. KTP Register
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={noKtpRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    No. KK Register
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={noKKRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Nama Penjamin Register
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={namaPjmRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    No. KTP Penjamin Register
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={noKtpPjmRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <Typography sx={labelInput}>Nama Ref. Register</Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={namaRefRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Alamat Ref. Register
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={almRefRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Telepon Ref. Register
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={tlpRefRegister}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Kode Marketing
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={`${kodeMarketing.kodeMarketing} - ${kodeMarketing.namaMarketing}`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Kode Surveyor
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={`${kodeSurveyor.kodeSurveyor} - ${kodeSurveyor.namaSurveyor}`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Kode Pekerjaan
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={`${kodePekerjaan.kodePekerjaan} - ${kodePekerjaan.namaPekerjaan}`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Kode Kecamatan
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={`${kodeKecamatan.kodeKecamatan} - ${kodeKecamatan.namaKecamatan}`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Kode Leasing
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={`${kodeLeasing.kodeLeasing} - ${kodeLeasing.namaLeasing}`}
                    InputProps={{
                      readOnly: true,
                    }}
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
                  <Typography sx={labelInput}>Nopol</Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={nopol}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    No. Rangka
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={noRangka}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    No. Mesin
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={noMesin}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <Typography sx={labelInput}>Tipe</Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={`${tipe} - ${tipes
                      .filter((tipe1) => tipe1.kodeTipe === tipe)
                      .map((sup) => `${sup.namaTipe}`)}`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Nama Warna
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={namaWarna}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Tahun Perakitan
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={tahun}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </Box>
            </Paper>

            {/* Data Rincian Harga (Input) */}
            <Paper elevation={6} sx={mainContainer}>
              <Typography variant="h5" sx={titleStyle} color="primary">
                RINCIAN HARGA
              </Typography>
              <Box sx={showDataContainer}>
                <Box sx={showDataWrapper}>
                  <Typography sx={[labelInput]}>
                    Harga Tunai
                    {hargaTunai !== 0 &&
                      !isNaN(parseInt(hargaTunai)) &&
                      ` : Rp ${parseInt(hargaTunai).toLocaleString()}`}
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={hargaTunai}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Uang Muka
                    {uangMuka !== 0 &&
                      !isNaN(parseInt(uangMuka)) &&
                      ` : Rp ${parseInt(uangMuka).toLocaleString()}`}
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={uangMuka}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Sisa Piutang
                    {sisaPiutang !== 0 &&
                      !isNaN(parseInt(sisaPiutang)) &&
                      ` : Rp ${parseInt(sisaPiutang).toLocaleString()}`}
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={sisaPiutang}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <Typography sx={labelInput}>
                    Angsuran/bulan
                    {angPerBulan !== 0 &&
                      !isNaN(parseInt(angPerBulan)) &&
                      ` : Rp ${parseInt(angPerBulan).toLocaleString()}`}
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={angPerBulan}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Tenor
                    {tenor !== 0 &&
                      !isNaN(parseInt(tenor)) &&
                      ` : ${parseInt(tenor).toLocaleString()}`}
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={tenor}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography sx={[labelInput, spacingTop]}>
                    Total Piutang
                    {jumlahPiutang !== 0 &&
                      !isNaN(parseInt(jumlahPiutang)) &&
                      ` : ${parseInt(jumlahPiutang).toLocaleString()}`}
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="filled"
                    value={jumlahPiutang}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
          <Divider sx={dividerStyle} />
        </>
      )}
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableJual
          currentPosts={currentPosts}
          searchTerm={searchTerm}
          leasings={leasings}
          tipes={tipes}
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

export default TampilJual;

const container = {
  p: 4,
};

const subTitleText = {
  fontWeight: "900",
};

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const dividerStyle = {
  pt: 4,
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row",
  },
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw",
  },
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center",
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center",
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1,
};

const spacingTop = {
  mt: 4,
};

const secondWrapper = {
  marginLeft: {
    sm: 4,
  },
  marginTop: {
    sm: 0,
    xs: 4,
  },
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const mainContainer = {
  padding: 3,
  borderRadius: "20px",
  margin: {
    sm: 0,
    md: 4,
  },
  marginTop: {
    xs: 4,
    md: 0,
  },
};

const pilihCetakContainer = {
  padding: 3,
  borderRadius: "20px",
  margin: {
    sm: 0,
    md: 4,
  },
  marginTop: 2,
};

const titleStyle = {
  textAlign: "center",
  fontWeight: "600",
};

const contentContainer = {
  p: {
    sm: 0,
    md: 3,
  },
  pt: {
    sm: 0,
    md: 1,
  },
  mt: {
    sm: 0,
    md: 2,
  },
};
