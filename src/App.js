import "./styles.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Header, ScrollToTop, ChipUser, Footer } from "./components";
import {
  Sidebar,
  Menu,
  SubMenu,
  MenuItem,
  useProSidebar
} from "react-pro-sidebar";
import { ErrorBoundary } from "react-error-boundary";
import { Fallback } from "./components/Fallback";
import MenuIcon from "@mui/icons-material/Menu";
import ClassIcon from "@mui/icons-material/Class";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MopedIcon from "@mui/icons-material/Moped";
import PublicIcon from "@mui/icons-material/Public";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import HailIcon from "@mui/icons-material/Hail";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import CarRentalIcon from "@mui/icons-material/CarRental";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ElevatorIcon from "@mui/icons-material/Elevator";
import InventoryIcon from "@mui/icons-material/Inventory";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SellIcon from "@mui/icons-material/Sell";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import PaymentIcon from "@mui/icons-material/Payment";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ConstructionIcon from "@mui/icons-material/Construction";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddCardIcon from "@mui/icons-material/AddCard";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import PaymentsIcon from "@mui/icons-material/Payments";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ApprovalIcon from "@mui/icons-material/Approval";
import RateReviewIcon from "@mui/icons-material/RateReview";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import BalanceIcon from "@mui/icons-material/Balance";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AddchartIcon from "@mui/icons-material/Addchart";
import SoapIcon from "@mui/icons-material/Soap";
import DoorSlidingIcon from "@mui/icons-material/DoorSliding";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import TodayIcon from "@mui/icons-material/Today";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import {
  Divider,
  Box,
  Typography,
  CssBaseline,
  Tooltip,
  Paper,
  Avatar
} from "@mui/material";
import { Colors } from "./constants/styles";
import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";
import {
  Login,
  DashboardOwner,
  DashboardCabang,
  TampilTipe,
  TambahTipe,
  UbahTipe,
  TampilWarna,
  TambahWarna,
  UbahWarna,
  TampilJenisCOA,
  TambahJenisCOA,
  UbahJenisCOA,
  TampilGroupCOA,
  TambahGroupCOA,
  UbahGroupCOA,
  TampilSubGroupCOA,
  TambahSubGroupCOA,
  UbahSubGroupCOA,
  TampilCOA,
  TambahCOA,
  UbahCOA,
  TampilWilayah,
  TambahWilayah,
  UbahWilayah,
  TampilKecamatan,
  TambahKecamatan,
  UbahKecamatan,
  TampilDealer,
  TambahDealer,
  UbahDealer,
  TampilKolektor,
  TambahKolektor,
  UbahKolektor,
  TampilMarketing,
  TambahMarketing,
  UbahMarketing,
  TampilPekerjaan,
  TambahPekerjaan,
  UbahPekerjaan,
  TampilSurveyor,
  TambahSurveyor,
  UbahSurveyor,
  TampilCabang,
  TambahCabang,
  UbahCabang,
  TampilLeasing,
  TambahLeasing,
  UbahLeasing,
  ProfilUser,
  UbahProfilUser,
  DaftarUser,
  TambahUser,
  UbahUser,
  TampilRegister,
  TambahRegister,
  UbahRegister,
  TampilDaftarReject,
  CariSemuaReject,
  TampilReject,
  TambahReject,
  UbahReject,
  TampilRejectChild,
  TambahRejectChild,
  UbahRejectChild,
  TampilJual,
  TambahJualBekas,
  TambahJualBaru,
  UbahJualBekas,
  UbahJualBaru,
  TampilSupplier,
  TambahSupplier,
  UbahSupplier,
  TampilDaftarBeli,
  TambahBeli,
  TampilBeli,
  UbahBeli,
  TambahBeliChild,
  TampilBeliChild,
  TampilDaftarStok,
  CariTotalPiutang,
  CariTunggakan,
  CariPenerimaanKas,
  KasHarian,
  CariLapPenjualanPerTipe,
  CariLapPenjualanPerMarketing,
  CariLapPenjualanPerSurveyor,
  CariLapPenjualanKreditTunai,
  PenjualanPerCabang,
  RekapPenerimaan,
  TampilDaftarAngsuran,
  TambahAngsuran,
  TampilAngsuran,
  TampilAngsuranChild,
  TampilSuratPemberitahuan,
  TambahSuratPemberitahuan,
  TampilSuratPenarikan,
  TambahSuratPenarikan,
  TampilBiayaPerawatan,
  TambahBiayaPerawatan,
  TampilDaftarKasMasuk,
  TambahKasMasuk,
  TampilKasMasuk,
  UbahKasMasuk,
  TambahKasMasukChild,
  TampilKasMasukChild,
  UbahKasMasukChild,
  TampilDaftarKasKeluar,
  TambahKasKeluar,
  TampilKasKeluar,
  UbahKasKeluar,
  TambahKasKeluarChild,
  TampilKasKeluarChild,
  UbahKasKeluarChild,
  TampilDaftarBankMasuk,
  TambahBankMasuk,
  TampilBankMasuk,
  UbahBankMasuk,
  TambahBankMasukChild,
  TampilBankMasukChild,
  UbahBankMasukChild,
  TampilDaftarBankKeluar,
  TambahBankKeluar,
  TampilBankKeluar,
  UbahBankKeluar,
  TambahBankKeluarChild,
  TampilBankKeluarChild,
  UbahBankKeluarChild,
  Posting,
  Unposting,
  AktivitasBukuBesar,
  NeracaSaldo,
  TutupPeriode,
  LabaRugi,
  Neraca,
  GantiPeriode
} from "./pages/index";

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const { screenSize, setScreenSize } = useStateContext();
  const { collapseSidebar } = useProSidebar();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(true);

  const OWNERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.tipeUser === "OWN") {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const MANAGERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.tipeUser === "MGR") {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const MOTORRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.motor) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const AREARoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.area) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const BUKUBESARRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.bukuBesar) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DEALERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.dealer) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const KOLEKTORRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.kolektor) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const MARKETINGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.marketing) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const PEKERJAANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.pekerjaan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const SURVEYORRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.surveyor) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LEASINGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.leasing) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const SUPPLIERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.supplier) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const CABANGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.cabang) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const BELIRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.beli) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const REGISTERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.register) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const REJECTRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.reject) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const JUALRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.jual) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DAFTARSTOKRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.daftarStok) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const TOTALPIUTANGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.totalPiutang) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const TUNGGAKANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.tunggakan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const PENERIMAANKASRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.penerimaanKas) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const KASHARIANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.kasHarian) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const PENJUALANPERCABANGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.penjualanPerCabang) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const REKAPPENERIMAANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.rekapPenerimaan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LAPPENJUALANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.lapPenjualan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const ANGSURANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.angsuran) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const SPRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.sp) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const STRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.st) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const BIAYAPERAWATANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.biayaPerawatan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const KASMASUKRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.kasMasuk) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const KASKELUARRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.kasKeluar) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const BANKMASUKRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.bankMasuk) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const BANKKELUARRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.bankKeluar) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const POSTINGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.posting) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const UNPOSTINGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.unposting) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const AKTIVITASBUKUBESARRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.aktivitasBukuBesar) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LABARUGIRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.labaRugi) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const NERACARoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.neraca) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const NERACASALDORoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.neracaSaldo) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const TUTUPPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.tutupPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const GANTIPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.gantiPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const PROFILUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.profilUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DAFTARUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.daftarUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const openMenuFunction = () => {
    setOpen(!open);
    collapseSidebar();
  };

  const contentWrapper = {
    minHeight: "100vh",
    width: open && screenSize >= 650 ? "80vw" : "100vw"
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <div style={container}>
          {user && (
            <Sidebar
              backgroundColor={Colors.blue50}
              defaultCollapsed={screenSize >= 650 ? false : true}
              collapsedWidth="0px"
            >
              {user.username && (
                <Paper elevation={6} sx={userAccount}>
                  <Avatar sx={avatarIcon}>{user.username.slice(0, 1)}</Avatar>
                  <Box sx={userAccountWrapper}>
                    <Box>
                      <Typography variant="subtitle2" sx={userNama}>
                        {user.username.slice(0, 12)}
                      </Typography>
                      <Typography variant="subtitle2" sx={userTipe}>
                        {user.tipeUser.slice(0, 12)}
                      </Typography>
                    </Box>
                    <Box>
                      <ChipUser />
                    </Box>
                  </Box>
                </Paper>
              )}
              <Menu>
                <SubMenu
                  label="Dashboard"
                  icon={<QueryStatsIcon name="dashboard-icon" />}
                >
                  {user.tipeUser === "OWN" && (
                    <Link to="/dashboardOwner" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<AutoGraphIcon name="dashboard-owner-icon" />}
                        >
                          Dashboard Owner
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.tipeUser === "MGR" && (
                    <Link to="/dashboardCabang" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<LeaderboardIcon name="dashboard-owner-icon" />}
                        >
                          Dashboard Cabang
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                </SubMenu>
                <Divider />
                <SubMenu label="Master" icon={<ClassIcon name="master-icon" />}>
                  {user.akses.motor === true && (
                    <SubMenu
                      label="Motor"
                      icon={<MopedIcon name="motor-icon" />}
                    >
                      <Divider />
                      <Link to="/tipe" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Tipe/Merk
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link to="/warna" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Warna
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                    </SubMenu>
                  )}
                  {user.akses.area === true && (
                    <SubMenu
                      label="Area"
                      icon={<PublicIcon name="area-icon" />}
                    >
                      <Divider />
                      <Link to="/wilayah" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Wilayah
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link to="/kecamatan" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Kecamatan
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                    </SubMenu>
                  )}
                  {user.akses.bukuBesar === true && (
                    <SubMenu
                      label="Buku Besar"
                      icon={<MenuBookIcon name="buku-besar-icon" />}
                    >
                      <Divider />
                      <Link to="/jenisCOA" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Jenis COA
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link to="/groupCOA" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Group COA
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link to="/subGroupCOA" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Sub Group COA
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link to="/coa" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            COA
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                    </SubMenu>
                  )}
                  {user.akses.dealer === true && (
                    <Link to="/dealer" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<PersonPinIcon name="dealer-icon" />}>
                          Dealer
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.kolektor === true && (
                    <Link to="/kolektor" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<SensorOccupiedIcon name="dealer-icon" />}
                        >
                          Kolektor
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.marketing === true && (
                    <Link to="/marketing" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<AddBusinessIcon name="marketing-icon" />}
                        >
                          Marketing
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.pekerjaan === true && (
                    <Link to="/pekerjaan" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<EngineeringIcon name="pekerjaan-icon" />}
                        >
                          Pekerjaan
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.surveyor === true && (
                    <Link to="/surveyor" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<HailIcon name="surveyor-icon" />}>
                          Surveyor
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.leasing === true && (
                    <Link to="/leasing" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<CarRentalIcon name="leasing-icon" />}>
                          Leasing
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.supplier === true && (
                    <Link to="/supplier" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<AddReactionIcon name="supplier-icon" />}
                        >
                          Supplier
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.cabang === true && (
                    <>
                      <Divider />
                      <Link to="/cabang" style={linkText}>
                        <Box sx={{ paddingLeft: "20px" }}>
                          <MenuItem
                            icon={<AddHomeWorkIcon name="cabang-icon" />}
                          >
                            Cabang
                          </MenuItem>
                        </Box>
                      </Link>
                    </>
                  )}
                </SubMenu>
                <Divider />
                <SubMenu
                  label="Pembelian"
                  icon={<AddShoppingCartIcon name="pembelian-icon" />}
                >
                  {user.akses.beli === true && (
                    <Link to="/daftarBeli" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<ShoppingBagIcon name="beli-icon" />}>
                          Beli
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                </SubMenu>
                <Divider />
                <SubMenu
                  label="Penjualan"
                  icon={<CurrencyExchangeIcon name="penjualan-icon" />}
                >
                  {user.akses.register === true && (
                    <Link to="/register" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<AppRegistrationIcon name="register-icon" />}
                        >
                          Register
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.reject === true && (
                    <Link to="/daftarReject" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<CancelPresentationIcon name="reject-icon" />}
                        >
                          Reject
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.jual === true && (
                    <Link to="/jual" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<SellIcon name="register-icon" />}>
                          Jual
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                </SubMenu>
                <Divider />
                <SubMenu
                  label="Laporan"
                  icon={<InventoryIcon name="utility-icon" />}
                >
                  {user.akses.daftarStok === true && (
                    <Link to="/daftarStok" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<FormatListNumberedIcon name="profil-icon" />}
                        >
                          Daftar Stok
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.totalPiutang === true && (
                    <Link to="/totalPiutang" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<RecentActorsIcon name="total-piutang-icon" />}
                        >
                          Total Piutang
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.tunggakan === true && (
                    <Link to="/tunggakan" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<PlaylistRemoveIcon name="tunggakan-icon" />}
                        >
                          Tunggakan
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.penerimaanKas === true && (
                    <Link to="/penerimaanKas" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<PaymentsIcon name="penerimaan-kas-icon" />}
                        >
                          Penerimaan Kas
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.kasHarian === true && (
                    <Link to="/kasHarian" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<TodayIcon name="kas-harian-icon" />}>
                          Kas Harian
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.penjualanPerCabang === true && (
                    <Link to="/penjualanPerCabang" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={
                            <AddchartIcon name="penjualan-per-cabang-icon" />
                          }
                        >
                          Penjualan/Cabang
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.rekapPenerimaan === true && (
                    <Link to="/rekapPenerimaan" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<SoapIcon name="rekap-penerimaan-icon" />}
                        >
                          Rekap Penerimaan
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.lapPenjualan === true && (
                    <SubMenu
                      label="Lap. Penjualan"
                      icon={<PointOfSaleIcon name="lap-penjualan-icon" />}
                    >
                      <Divider />
                      <Link to="/lapPenjualanPerTipe" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Per Tipe
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link to="/lapPenjualanPerMarketing" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Per Marketing
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link to="/lapPenjualanPerSurveyor" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Per Surveyor
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link to="/lapPenjualanKreditTunai" style={linkText}>
                        <MenuItem>
                          <Typography
                            variant="body2"
                            sx={{ paddingLeft: "70px" }}
                          >
                            Kredit & Tunai
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Divider />
                    </SubMenu>
                  )}
                </SubMenu>
                <Divider />
                <SubMenu
                  label="Piutang"
                  icon={<PriceChangeIcon name="utility-icon" />}
                >
                  {user.akses.angsuran === true && (
                    <Link to="/daftarAngsuran" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<PaymentIcon name="profil-icon" />}>
                          Angsuran
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.sp === true && (
                    <Link to="/suratPemberitahuan" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<HistoryEduIcon name="sp-icon" />}>
                          SP
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.st === true && (
                    <Link to="/suratPenarikan" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<CompareArrowsIcon name="sp-icon" />}>
                          ST
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                </SubMenu>
                <Divider />
                <SubMenu
                  label="Perawatan"
                  icon={<ConstructionIcon name="Perawatan-icon" />}
                >
                  {user.akses.biayaPerawatan === true && (
                    <Link to="/biayaPerawatan" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={
                            <RequestQuoteIcon name="biaya-perawatan-icon" />
                          }
                        >
                          Biaya Perawatan
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                </SubMenu>
                <Divider />
                <SubMenu
                  label="Finance"
                  icon={<MonetizationOnIcon name="Finance-icon" />}
                >
                  {user.akses.kasMasuk === true && (
                    <Link to="/daftarKasMasuk" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<AddCardIcon name="kas-masuk-icon" />}>
                          Kas Masuk
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.kasKeluar === true && (
                    <Link to="/daftarKasKeluar" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<CardMembershipIcon name="kas-keluar-icon" />}
                        >
                          Kas Keluar
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.bankMasuk === true && (
                    <Link to="/daftarBankMasuk" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<FileOpenIcon name="bank-masuk-icon" />}
                        >
                          Bank Masuk
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.bankKeluar === true && (
                    <Link to="/daftarBankKeluar" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={
                            <IndeterminateCheckBoxIcon name="bank-keluar-icon" />
                          }
                        >
                          Bank Keluar
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                </SubMenu>
                <Divider />
                <SubMenu
                  label="Accounting"
                  icon={<AccountBalanceWalletIcon name="accounting-icon" />}
                >
                  {user.akses.posting === true && (
                    <Link to="/posting" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<PostAddIcon name="posting-icon" />}>
                          Posting
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.unposting === true && (
                    <Link to="/unposting" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<ApprovalIcon name="unposting-icon" />}>
                          Unposting
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.aktivitasBukuBesar === true && (
                    <Link to="/aktivitasBukuBesar" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={
                            <RateReviewIcon name="aktivitasBukuBesar-icon" />
                          }
                        >
                          <Typography sx={{ fontSize: "15px" }}>
                            Aktivitas Buku Besar
                          </Typography>
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.neracaSaldo === true && (
                    <Link to="/neracaSaldo" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<AutoStoriesIcon name="neracaSaldo-icon" />}
                        >
                          Neraca Saldo
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.labaRugi === true && (
                    <Link to="/labaRugi" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<MoneyOffIcon name="labaRugi-icon" />}>
                          Laba Rugi
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.neraca === true && (
                    <Link to="/neraca" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<BalanceIcon name="neraca-icon" />}>
                          Neraca
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                </SubMenu>
                <Divider />
                <SubMenu
                  label="Utility"
                  icon={<ManageAccountsIcon name="utility-icon" />}
                >
                  {user.akses.profilUser === true && (
                    <Link to="/profilUser" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<PersonSearchIcon name="profil-icon" />}
                        >
                          Profil User
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.daftarUser === true && (
                    <Link to="/daftarUser" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem icon={<ElevatorIcon name="daftar-icon" />}>
                          Daftar User
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.tutupPeriode === true && (
                    <Link to="/tutupPeriode" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<DoorSlidingIcon name="tutupPeriode-icon" />}
                        >
                          Tutup Periode
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                  {user.akses.gantiPeriode === true && (
                    <Link to="/gantiPeriode" style={linkText}>
                      <Box sx={{ paddingLeft: "20px" }}>
                        <MenuItem
                          icon={<ManageHistoryIcon name="gantiPeriode-icon" />}
                        >
                          Ganti Periode
                        </MenuItem>
                      </Box>
                    </Link>
                  )}
                </SubMenu>
                <Divider />
              </Menu>
            </Sidebar>
          )}
          <main>
            {user && (
              <Tooltip title="Menu">
                <MenuIcon
                  onClick={() => openMenuFunction()}
                  sx={sidebarIcon}
                  fontSize="large"
                />
              </Tooltip>
            )}
            <Box sx={contentWrapper}>
              <ErrorBoundary FallbackComponent={Fallback}>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/admin" />
                  <Route path="/login" element={<Login />} />
                  <Route path="/unauthorized" element={<Login />} />
                  {/* Dashboard */}
                  <Route
                    path="/dashboardOwner"
                    element={
                      <OWNERRoute>
                        <DashboardOwner />
                      </OWNERRoute>
                    }
                  />
                  <Route
                    path="/dashboardCabang"
                    element={
                      <MANAGERRoute>
                        <DashboardCabang />
                      </MANAGERRoute>
                    }
                  />
                  {/* Tipe */}
                  <Route
                    path="/tipe"
                    element={
                      <MOTORRoute>
                        <TampilTipe />
                      </MOTORRoute>
                    }
                  />
                  <Route
                    path="/tipe/tambahTipe"
                    element={
                      <MOTORRoute>
                        <TambahTipe />
                      </MOTORRoute>
                    }
                  />
                  <Route
                    path="/tipe/:id"
                    element={
                      <MOTORRoute>
                        <TampilTipe />
                      </MOTORRoute>
                    }
                  />
                  <Route
                    path="/tipe/:id/edit"
                    element={
                      <MOTORRoute>
                        <UbahTipe />
                      </MOTORRoute>
                    }
                  />
                  {/* Warna */}
                  <Route
                    path="/warna"
                    element={
                      <MOTORRoute>
                        <TampilWarna />
                      </MOTORRoute>
                    }
                  />
                  <Route
                    path="/warna/:id"
                    element={
                      <MOTORRoute>
                        <TampilWarna />
                      </MOTORRoute>
                    }
                  />
                  <Route
                    path="/warna/tambahWarna"
                    element={
                      <MOTORRoute>
                        <TambahWarna />
                      </MOTORRoute>
                    }
                  />
                  <Route
                    path="/warna/:id/edit"
                    element={
                      <MOTORRoute>
                        <UbahWarna />
                      </MOTORRoute>
                    }
                  />
                  {/* Wilayah */}
                  <Route
                    path="/wilayah"
                    element={
                      <AREARoute>
                        <TampilWilayah />
                      </AREARoute>
                    }
                  />
                  <Route
                    path="/wilayah/:id"
                    element={
                      <AREARoute>
                        <TampilWilayah />
                      </AREARoute>
                    }
                  />
                  <Route
                    path="/wilayah/tambahWilayah"
                    element={
                      <AREARoute>
                        <TambahWilayah />
                      </AREARoute>
                    }
                  />
                  <Route
                    path="/wilayah/:id/edit"
                    element={
                      <AREARoute>
                        <UbahWilayah />
                      </AREARoute>
                    }
                  />
                  {/* Kecamatan */}
                  <Route
                    path="/kecamatan"
                    element={
                      <AREARoute>
                        <TampilKecamatan />
                      </AREARoute>
                    }
                  />
                  <Route
                    path="/kecamatan/:id"
                    element={
                      <AREARoute>
                        <TampilKecamatan />
                      </AREARoute>
                    }
                  />
                  <Route
                    path="/kecamatan/tambahKecamatan"
                    element={
                      <AREARoute>
                        <TambahKecamatan />
                      </AREARoute>
                    }
                  />
                  <Route
                    path="/kecamatan/:id/edit"
                    element={
                      <AREARoute>
                        <UbahKecamatan />
                      </AREARoute>
                    }
                  />
                  {/* Jenis COA */}
                  <Route
                    path="/jenisCOA"
                    element={
                      <AREARoute>
                        <TampilJenisCOA />
                      </AREARoute>
                    }
                  />
                  <Route
                    path="/jenisCOA/:id"
                    element={
                      <AREARoute>
                        <TampilJenisCOA />
                      </AREARoute>
                    }
                  />
                  <Route
                    path="/jenisCOA/tambahJenisCOA"
                    element={
                      <AREARoute>
                        <TambahJenisCOA />
                      </AREARoute>
                    }
                  />
                  <Route
                    path="/jenisCOA/:id/edit"
                    element={
                      <AREARoute>
                        <UbahJenisCOA />
                      </AREARoute>
                    }
                  />
                  {/* Group COA */}
                  <Route
                    path="/groupCOA"
                    element={
                      <BUKUBESARRoute>
                        <TampilGroupCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  <Route
                    path="/groupCOA/:id"
                    element={
                      <BUKUBESARRoute>
                        <TampilGroupCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  <Route
                    path="/groupCOA/tambahGroupCOA"
                    element={
                      <BUKUBESARRoute>
                        <TambahGroupCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  <Route
                    path="/groupCOA/:id/edit"
                    element={
                      <BUKUBESARRoute>
                        <UbahGroupCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  {/* Sub Group COA */}
                  <Route
                    path="/subGroupCOA"
                    element={
                      <BUKUBESARRoute>
                        <TampilSubGroupCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  <Route
                    path="/subGroupCOA/:id"
                    element={
                      <BUKUBESARRoute>
                        <TampilSubGroupCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  <Route
                    path="/subGroupCOA/tambahSubGroupCOA"
                    element={
                      <BUKUBESARRoute>
                        <TambahSubGroupCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  <Route
                    path="/subGroupCOA/:id/edit"
                    element={
                      <BUKUBESARRoute>
                        <UbahSubGroupCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  {/* COA */}
                  <Route
                    path="/COA"
                    element={
                      <BUKUBESARRoute>
                        <TampilCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  <Route
                    path="/COA/:id"
                    element={
                      <BUKUBESARRoute>
                        <TampilCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  <Route
                    path="/COA/tambahCOA"
                    element={
                      <BUKUBESARRoute>
                        <TambahCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  <Route
                    path="/COA/:id/edit"
                    element={
                      <BUKUBESARRoute>
                        <UbahCOA />
                      </BUKUBESARRoute>
                    }
                  />
                  {/* Dealer */}
                  <Route
                    path="/dealer"
                    element={
                      <DEALERRoute>
                        <TampilDealer />
                      </DEALERRoute>
                    }
                  />
                  <Route
                    path="/dealer/:id"
                    element={
                      <DEALERRoute>
                        <TampilDealer />
                      </DEALERRoute>
                    }
                  />
                  <Route
                    path="/dealer/tambahDealer"
                    element={
                      <DEALERRoute>
                        <TambahDealer />
                      </DEALERRoute>
                    }
                  />
                  <Route
                    path="/dealer/:id/edit"
                    element={
                      <DEALERRoute>
                        <UbahDealer />
                      </DEALERRoute>
                    }
                  />
                  {/* Kolektor */}
                  <Route
                    path="/kolektor"
                    element={
                      <KOLEKTORRoute>
                        <TampilKolektor />
                      </KOLEKTORRoute>
                    }
                  />
                  <Route
                    path="/kolektor/:id"
                    element={
                      <KOLEKTORRoute>
                        <TampilKolektor />
                      </KOLEKTORRoute>
                    }
                  />
                  <Route
                    path="/kolektor/tambahKolektor"
                    element={
                      <KOLEKTORRoute>
                        <TambahKolektor />
                      </KOLEKTORRoute>
                    }
                  />
                  <Route
                    path="/kolektor/:id/edit"
                    element={
                      <KOLEKTORRoute>
                        <UbahKolektor />
                      </KOLEKTORRoute>
                    }
                  />
                  {/* Marketing */}
                  <Route
                    path="/marketing"
                    element={
                      <MARKETINGRoute>
                        <TampilMarketing />
                      </MARKETINGRoute>
                    }
                  />
                  <Route
                    path="/marketing/:id"
                    element={
                      <MARKETINGRoute>
                        <TampilMarketing />
                      </MARKETINGRoute>
                    }
                  />
                  <Route
                    path="/marketing/tambahMarketing"
                    element={
                      <MARKETINGRoute>
                        <TambahMarketing />
                      </MARKETINGRoute>
                    }
                  />
                  <Route
                    path="/marketing/:id/edit"
                    element={
                      <MARKETINGRoute>
                        <UbahMarketing />
                      </MARKETINGRoute>
                    }
                  />
                  {/* Pekerjaan */}
                  <Route
                    path="/pekerjaan"
                    element={
                      <PEKERJAANRoute>
                        <TampilPekerjaan />
                      </PEKERJAANRoute>
                    }
                  />
                  <Route
                    path="/pekerjaan/:id"
                    element={
                      <PEKERJAANRoute>
                        <TampilPekerjaan />
                      </PEKERJAANRoute>
                    }
                  />
                  <Route
                    path="/pekerjaan/tambahPekerjaan"
                    element={
                      <PEKERJAANRoute>
                        <TambahPekerjaan />
                      </PEKERJAANRoute>
                    }
                  />
                  <Route
                    path="/pekerjaan/:id/edit"
                    element={
                      <PEKERJAANRoute>
                        <UbahPekerjaan />
                      </PEKERJAANRoute>
                    }
                  />
                  {/* Surveyor */}
                  <Route
                    path="/surveyor"
                    element={
                      <SURVEYORRoute>
                        <TampilSurveyor />
                      </SURVEYORRoute>
                    }
                  />
                  <Route
                    path="/surveyor/:id"
                    element={
                      <SURVEYORRoute>
                        <TampilSurveyor />
                      </SURVEYORRoute>
                    }
                  />
                  <Route
                    path="/surveyor/tambahSurveyor"
                    element={
                      <SURVEYORRoute>
                        <TambahSurveyor />
                      </SURVEYORRoute>
                    }
                  />
                  <Route
                    path="/surveyor/:id/edit"
                    element={
                      <SURVEYORRoute>
                        <UbahSurveyor />
                      </SURVEYORRoute>
                    }
                  />
                  {/* Leasing */}
                  <Route
                    path="/leasing"
                    element={
                      <LEASINGRoute>
                        <TampilLeasing />
                      </LEASINGRoute>
                    }
                  />
                  <Route
                    path="/leasing/:id"
                    element={
                      <LEASINGRoute>
                        <TampilLeasing />
                      </LEASINGRoute>
                    }
                  />
                  <Route
                    path="/leasing/tambahLeasing"
                    element={
                      <LEASINGRoute>
                        <TambahLeasing />
                      </LEASINGRoute>
                    }
                  />
                  <Route
                    path="/leasing/:id/edit"
                    element={
                      <LEASINGRoute>
                        <UbahLeasing />
                      </LEASINGRoute>
                    }
                  />
                  {/* Supplier */}
                  <Route
                    path="/supplier"
                    element={
                      <SUPPLIERRoute>
                        <TampilSupplier />
                      </SUPPLIERRoute>
                    }
                  />
                  <Route
                    path="/supplier/:id"
                    element={
                      <SUPPLIERRoute>
                        <TampilSupplier />
                      </SUPPLIERRoute>
                    }
                  />
                  <Route
                    path="/supplier/tambahSupplier"
                    element={
                      <SUPPLIERRoute>
                        <TambahSupplier />
                      </SUPPLIERRoute>
                    }
                  />
                  <Route
                    path="/supplier/:id/edit"
                    element={
                      <SUPPLIERRoute>
                        <UbahSupplier />
                      </SUPPLIERRoute>
                    }
                  />
                  {/* Cabang */}
                  <Route
                    path="/cabang"
                    element={
                      <CABANGRoute>
                        <TampilCabang />
                      </CABANGRoute>
                    }
                  />
                  <Route
                    path="/cabang/:id"
                    element={
                      <CABANGRoute>
                        <TampilCabang />
                      </CABANGRoute>
                    }
                  />
                  <Route
                    path="/cabang/tambahCabang"
                    element={
                      <CABANGRoute>
                        <TambahCabang />
                      </CABANGRoute>
                    }
                  />
                  <Route
                    path="/cabang/:id/edit"
                    element={
                      <CABANGRoute>
                        <UbahCabang />
                      </CABANGRoute>
                    }
                  />
                  {/* PEMBELIAN */}
                  {/* Beli */}
                  <Route
                    path="/daftarBeli"
                    element={
                      <BELIRoute>
                        <TampilDaftarBeli />
                      </BELIRoute>
                    }
                  />
                  <Route
                    path="/daftarBeli/beli/tambahBeli"
                    element={
                      <BELIRoute>
                        <TambahBeli />
                      </BELIRoute>
                    }
                  />
                  <Route
                    path="/daftarBeli/beli/:id"
                    element={
                      <BELIRoute>
                        <TampilBeli />
                      </BELIRoute>
                    }
                  />
                  <Route
                    path="/daftarBeli/beli/:id/edit"
                    element={
                      <BELIRoute>
                        <UbahBeli />
                      </BELIRoute>
                    }
                  />
                  {/* A Beli */}
                  <Route
                    path="/daftarBeli/beli/:id/tambahBeliChild"
                    element={
                      <BELIRoute>
                        <TambahBeliChild />
                      </BELIRoute>
                    }
                  />
                  <Route
                    path="/daftarBeli/beli/:id/:idBeliChild"
                    element={
                      <BELIRoute>
                        <TampilBeliChild />
                      </BELIRoute>
                    }
                  />
                  {/* PENJUALAN */}
                  {/* Register */}
                  <Route
                    path="/register"
                    element={
                      <REGISTERRoute>
                        <TampilRegister />
                      </REGISTERRoute>
                    }
                  />
                  <Route
                    path="/register/:id"
                    element={
                      <REGISTERRoute>
                        <TampilRegister />
                      </REGISTERRoute>
                    }
                  />
                  <Route
                    path="/register/tambahRegister"
                    element={
                      <REGISTERRoute>
                        <TambahRegister />
                      </REGISTERRoute>
                    }
                  />
                  <Route
                    path="/register/:id/edit"
                    element={
                      <REGISTERRoute>
                        <UbahRegister />
                      </REGISTERRoute>
                    }
                  />
                  {/* Reject */}
                  <Route
                    path="/daftarReject"
                    element={
                      <REJECTRoute>
                        <TampilDaftarReject />
                      </REJECTRoute>
                    }
                  />
                  <Route
                    path="/daftarReject/cariReject"
                    element={
                      <REJECTRoute>
                        <CariSemuaReject />
                      </REJECTRoute>
                    }
                  />
                  <Route
                    path="/daftarReject/reject/tambahReject"
                    element={
                      <REJECTRoute>
                        <TambahReject />
                      </REJECTRoute>
                    }
                  />
                  <Route
                    path="/daftarReject/reject/:id"
                    element={
                      <REJECTRoute>
                        <TampilReject />
                      </REJECTRoute>
                    }
                  />
                  <Route
                    path="/daftarReject/reject/:id/edit"
                    element={
                      <REJECTRoute>
                        <UbahReject />
                      </REJECTRoute>
                    }
                  />
                  {/* Reject Child */}
                  <Route
                    path="/daftarReject/reject/:id/tambahRejectChild"
                    element={
                      <REJECTRoute>
                        <TambahRejectChild />
                      </REJECTRoute>
                    }
                  />
                  <Route
                    path="/daftarReject/reject/:id/:idRejectChild"
                    element={
                      <REJECTRoute>
                        <TampilRejectChild />
                      </REJECTRoute>
                    }
                  />
                  <Route
                    path="/daftarReject/reject/:id/:idRejectChild/edit"
                    element={
                      <REJECTRoute>
                        <UbahRejectChild />
                      </REJECTRoute>
                    }
                  />
                  {/* Jual */}
                  <Route
                    path="/jual"
                    element={
                      <JUALRoute>
                        <TampilJual />
                      </JUALRoute>
                    }
                  />
                  <Route
                    path="/jual/:id"
                    element={
                      <JUALRoute>
                        <TampilJual />
                      </JUALRoute>
                    }
                  />
                  <Route
                    path="/jual/tambahJualBekas"
                    element={
                      <JUALRoute>
                        <TambahJualBekas />
                      </JUALRoute>
                    }
                  />
                  <Route
                    path="/jual/tambahJualBaru"
                    element={
                      <JUALRoute>
                        <TambahJualBaru />
                      </JUALRoute>
                    }
                  />
                  <Route
                    path="/jual/:id/editBekas"
                    element={
                      <JUALRoute>
                        <UbahJualBekas />
                      </JUALRoute>
                    }
                  />
                  <Route
                    path="/jual/:id/editBaru"
                    element={
                      <JUALRoute>
                        <UbahJualBaru />
                      </JUALRoute>
                    }
                  />
                  {/* Daftar Stok */}
                  <Route
                    path="/daftarStok"
                    element={
                      <DAFTARSTOKRoute>
                        <TampilDaftarStok />
                      </DAFTARSTOKRoute>
                    }
                  />
                  <Route
                    path="/daftarStok/:id"
                    element={
                      <DAFTARSTOKRoute>
                        <TampilDaftarStok />
                      </DAFTARSTOKRoute>
                    }
                  />
                  {/* Total Piutang */}
                  <Route
                    path="/totalPiutang"
                    element={
                      <TOTALPIUTANGRoute>
                        <CariTotalPiutang />
                      </TOTALPIUTANGRoute>
                    }
                  />
                  {/* Tunggakan */}
                  <Route
                    path="/tunggakan"
                    element={
                      <TUNGGAKANRoute>
                        <CariTunggakan />
                      </TUNGGAKANRoute>
                    }
                  />
                  {/* Penerimaan Kas */}
                  <Route
                    path="/penerimaanKas"
                    element={
                      <PENERIMAANKASRoute>
                        <CariPenerimaanKas />
                      </PENERIMAANKASRoute>
                    }
                  />
                  {/* Kas Harian */}
                  <Route
                    path="/kasHarian"
                    element={
                      <KASHARIANRoute>
                        <KasHarian />
                      </KASHARIANRoute>
                    }
                  />
                  {/* Laporan Penjualan Per Cabang */}
                  <Route
                    path="/penjualanPerCabang"
                    element={
                      <PENJUALANPERCABANGRoute>
                        <PenjualanPerCabang />
                      </PENJUALANPERCABANGRoute>
                    }
                  />
                  {/* Laporan Rekap Penerimaan */}
                  <Route
                    path="/rekapPenerimaan"
                    element={
                      <REKAPPENERIMAANRoute>
                        <RekapPenerimaan />
                      </REKAPPENERIMAANRoute>
                    }
                  />
                  {/* Laporan Penjualan Per Tipe */}
                  <Route
                    path="/lapPenjualanPerTipe"
                    element={
                      <LAPPENJUALANRoute>
                        <CariLapPenjualanPerTipe />
                      </LAPPENJUALANRoute>
                    }
                  />
                  {/* Laporan Penjualan Per Marketing */}
                  <Route
                    path="/lapPenjualanPerMarketing"
                    element={
                      <LAPPENJUALANRoute>
                        <CariLapPenjualanPerMarketing />
                      </LAPPENJUALANRoute>
                    }
                  />
                  {/* Laporan Penjualan Per Surveyor */}
                  <Route
                    path="/lapPenjualanPerSurveyor"
                    element={
                      <LAPPENJUALANRoute>
                        <CariLapPenjualanPerSurveyor />
                      </LAPPENJUALANRoute>
                    }
                  />
                  {/* Laporan Penjualan Kredit Tunai */}
                  <Route
                    path="/lapPenjualanKreditTunai"
                    element={
                      <LAPPENJUALANRoute>
                        <CariLapPenjualanKreditTunai />
                      </LAPPENJUALANRoute>
                    }
                  />
                  {/* Angsuran */}
                  <Route
                    path="/daftarAngsuran"
                    element={
                      <ANGSURANRoute>
                        <TampilDaftarAngsuran />
                      </ANGSURANRoute>
                    }
                  />
                  <Route
                    path="/daftarAngsuran/angsuran/tambahAngsuran"
                    element={
                      <ANGSURANRoute>
                        <TambahAngsuran />
                      </ANGSURANRoute>
                    }
                  />
                  <Route
                    path="/daftarAngsuran/angsuran/:id"
                    element={
                      <ANGSURANRoute>
                        <TampilAngsuran />
                      </ANGSURANRoute>
                    }
                  />
                  <Route
                    path="/daftarAngsuran/angsuran/:id/:idAngsuranChild"
                    element={
                      <ANGSURANRoute>
                        <TampilAngsuranChild />
                      </ANGSURANRoute>
                    }
                  />
                  {/* Surat Pemberitahuan */}
                  <Route
                    path="/suratPemberitahuan"
                    element={
                      <SPRoute>
                        <TampilSuratPemberitahuan />
                      </SPRoute>
                    }
                  />
                  <Route
                    path="/suratPemberitahuan/tambahSuratPemberitahuan"
                    element={
                      <SPRoute>
                        <TambahSuratPemberitahuan />
                      </SPRoute>
                    }
                  />
                  <Route
                    path="/suratPemberitahuan/:id"
                    element={
                      <SPRoute>
                        <TampilSuratPemberitahuan />
                      </SPRoute>
                    }
                  />
                  {/* Surat Penarikan */}
                  <Route
                    path="/suratPenarikan"
                    element={
                      <STRoute>
                        <TampilSuratPenarikan />
                      </STRoute>
                    }
                  />
                  <Route
                    path="/suratPenarikan/tambahSuratPenarikan"
                    element={
                      <STRoute>
                        <TambahSuratPenarikan />
                      </STRoute>
                    }
                  />
                  <Route
                    path="/suratPenarikan/:id"
                    element={
                      <STRoute>
                        <TampilSuratPenarikan />
                      </STRoute>
                    }
                  />
                  {/* Biaya Perawatan */}
                  <Route
                    path="/biayaPerawatan"
                    element={
                      <BIAYAPERAWATANRoute>
                        <TampilBiayaPerawatan />
                      </BIAYAPERAWATANRoute>
                    }
                  />
                  <Route
                    path="/biayaPerawatan/:id"
                    element={
                      <BIAYAPERAWATANRoute>
                        <TampilBiayaPerawatan />
                      </BIAYAPERAWATANRoute>
                    }
                  />
                  <Route
                    path="/biayaPerawatan/tambahBiayaPerawatan"
                    element={
                      <BIAYAPERAWATANRoute>
                        <TambahBiayaPerawatan />
                      </BIAYAPERAWATANRoute>
                    }
                  />
                  {/* Kas Masuk */}
                  <Route
                    path="/daftarKasMasuk"
                    element={
                      <KASMASUKRoute>
                        <TampilDaftarKasMasuk />
                      </KASMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarKasMasuk/kasMasuk/tambahKasMasuk"
                    element={
                      <KASMASUKRoute>
                        <TambahKasMasuk />
                      </KASMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarKasMasuk/kasMasuk/:id"
                    element={
                      <KASMASUKRoute>
                        <TampilKasMasuk />
                      </KASMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarKasMasuk/kasMasuk/:id/edit"
                    element={
                      <KASMASUKRoute>
                        <UbahKasMasuk />
                      </KASMASUKRoute>
                    }
                  />
                  {/* Kas Masuk Child */}
                  <Route
                    path="/daftarKasMasuk/kasMasuk/:id/tambahKasMasukChild"
                    element={
                      <KASMASUKRoute>
                        <TambahKasMasukChild />
                      </KASMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarKasMasuk/kasMasuk/:id/:idKasMasukChild"
                    element={
                      <KASMASUKRoute>
                        <TampilKasMasukChild />
                      </KASMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarKasMasuk/kasMasuk/:id/:idKasMasukChild/edit"
                    element={
                      <KASMASUKRoute>
                        <UbahKasMasukChild />
                      </KASMASUKRoute>
                    }
                  />
                  {/* Kas Keluar */}
                  <Route
                    path="/daftarKasKeluar"
                    element={
                      <KASKELUARRoute>
                        <TampilDaftarKasKeluar />
                      </KASKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarKasKeluar/kasKeluar/tambahKasKeluar"
                    element={
                      <KASKELUARRoute>
                        <TambahKasKeluar />
                      </KASKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarKasKeluar/kasKeluar/:id"
                    element={
                      <KASKELUARRoute>
                        <TampilKasKeluar />
                      </KASKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarKasKeluar/kasKeluar/:id/edit"
                    element={
                      <KASKELUARRoute>
                        <UbahKasKeluar />
                      </KASKELUARRoute>
                    }
                  />
                  {/* Kas Keluar Child */}
                  <Route
                    path="/daftarKasKeluar/kasKeluar/:id/tambahKasKeluarChild"
                    element={
                      <KASKELUARRoute>
                        <TambahKasKeluarChild />
                      </KASKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarKasKeluar/kasKeluar/:id/:idKasKeluarChild"
                    element={
                      <KASKELUARRoute>
                        <TampilKasKeluarChild />
                      </KASKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarKasKeluar/kasKeluar/:id/:idKasKeluarChild/edit"
                    element={
                      <KASKELUARRoute>
                        <UbahKasKeluarChild />
                      </KASKELUARRoute>
                    }
                  />
                  {/* Bank masuk */}
                  <Route
                    path="/daftarBankMasuk"
                    element={
                      <BANKMASUKRoute>
                        <TampilDaftarBankMasuk />
                      </BANKMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarBankMasuk/bankMasuk/tambahBankMasuk"
                    element={
                      <BANKMASUKRoute>
                        <TambahBankMasuk />
                      </BANKMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarBankMasuk/bankMasuk/:id"
                    element={
                      <BANKMASUKRoute>
                        <TampilBankMasuk />
                      </BANKMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarBankMasuk/bankMasuk/:id/edit"
                    element={
                      <BANKMASUKRoute>
                        <UbahBankMasuk />
                      </BANKMASUKRoute>
                    }
                  />
                  {/* Bank Masuk Child */}
                  <Route
                    path="/daftarBankMasuk/bankMasuk/:id/tambahBankMasukChild"
                    element={
                      <BANKMASUKRoute>
                        <TambahBankMasukChild />
                      </BANKMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarBankMasuk/bankMasuk/:id/:idBankMasukChild"
                    element={
                      <BANKMASUKRoute>
                        <TampilBankMasukChild />
                      </BANKMASUKRoute>
                    }
                  />
                  <Route
                    path="/daftarBankMasuk/bankMasuk/:id/:idBankMasukChild/edit"
                    element={
                      <BANKMASUKRoute>
                        <UbahBankMasukChild />
                      </BANKMASUKRoute>
                    }
                  />
                  {/* Bank Keluar */}
                  <Route
                    path="/daftarBankKeluar"
                    element={
                      <BANKKELUARRoute>
                        <TampilDaftarBankKeluar />
                      </BANKKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarBankKeluar/bankKeluar/tambahBankKeluar"
                    element={
                      <BANKKELUARRoute>
                        <TambahBankKeluar />
                      </BANKKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarBankKeluar/bankKeluar/:id"
                    element={
                      <BANKKELUARRoute>
                        <TampilBankKeluar />
                      </BANKKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarBankKeluar/bankKeluar/:id/edit"
                    element={
                      <BANKKELUARRoute>
                        <UbahBankKeluar />
                      </BANKKELUARRoute>
                    }
                  />
                  {/* Bank Keluar Child */}
                  <Route
                    path="/daftarBankKeluar/bankKeluar/:id/tambahBankKeluarChild"
                    element={
                      <BANKKELUARRoute>
                        <TambahBankKeluarChild />
                      </BANKKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarBankKeluar/bankKeluar/:id/:idBankKeluarChild"
                    element={
                      <BANKKELUARRoute>
                        <TampilBankKeluarChild />
                      </BANKKELUARRoute>
                    }
                  />
                  <Route
                    path="/daftarBankKeluar/bankKeluar/:id/:idBankKeluarChild/edit"
                    element={
                      <BANKKELUARRoute>
                        <UbahBankKeluarChild />
                      </BANKKELUARRoute>
                    }
                  />
                  {/* Posting */}
                  <Route
                    path="/posting"
                    element={
                      <POSTINGRoute>
                        <Posting />
                      </POSTINGRoute>
                    }
                  />
                  {/* Unposting */}
                  <Route
                    path="/unposting"
                    element={
                      <UNPOSTINGRoute>
                        <Unposting />
                      </UNPOSTINGRoute>
                    }
                  />
                  {/* Aktivitas Buku Besar */}
                  <Route
                    path="/aktivitasBukuBesar"
                    element={
                      <AKTIVITASBUKUBESARRoute>
                        <AktivitasBukuBesar />
                      </AKTIVITASBUKUBESARRoute>
                    }
                  />
                  {/* Neraca Saldo */}
                  <Route
                    path="/neracaSaldo"
                    element={
                      <NERACASALDORoute>
                        <NeracaSaldo />
                      </NERACASALDORoute>
                    }
                  />
                  {/* Tutup Periode */}
                  <Route
                    path="/tutupPeriode"
                    element={
                      <TUTUPPERIODERoute>
                        <TutupPeriode />
                      </TUTUPPERIODERoute>
                    }
                  />
                  {/* Ganti Periode */}
                  <Route
                    path="/gantiPeriode"
                    element={
                      <GANTIPERIODERoute>
                        <GantiPeriode />
                      </GANTIPERIODERoute>
                    }
                  />
                  {/* Ganti Periode */}
                  <Route
                    path="/gantiPeriode/:id"
                    element={
                      <GANTIPERIODERoute>
                        <GantiPeriode />
                      </GANTIPERIODERoute>
                    }
                  />
                  {/* Laba Rugi */}
                  <Route
                    path="/labaRugi"
                    element={
                      <LABARUGIRoute>
                        <LabaRugi />
                      </LABARUGIRoute>
                    }
                  />
                  {/* Neraca */}
                  <Route
                    path="/neraca"
                    element={
                      <NERACARoute>
                        <Neraca />
                      </NERACARoute>
                    }
                  />
                  {/* Profil User */}
                  <Route
                    path="/profilUser"
                    element={
                      <PROFILUSERRoute>
                        <ProfilUser />
                      </PROFILUSERRoute>
                    }
                  />
                  <Route
                    path="/profilUser/:id/edit"
                    element={
                      <PROFILUSERRoute>
                        <UbahProfilUser />
                      </PROFILUSERRoute>
                    }
                  />
                  {/* Daftar User */}
                  <Route
                    path="/daftarUser"
                    element={
                      <DAFTARUSERRoute>
                        <DaftarUser />
                      </DAFTARUSERRoute>
                    }
                  />
                  <Route
                    path="/daftarUser/:id"
                    element={
                      <DAFTARUSERRoute>
                        <DaftarUser />
                      </DAFTARUSERRoute>
                    }
                  />
                  <Route
                    path="/daftarUser/:id/edit"
                    element={
                      <DAFTARUSERRoute>
                        <UbahUser />
                      </DAFTARUSERRoute>
                    }
                  />
                  <Route
                    path="/daftarUser/tambahUser"
                    element={
                      <DAFTARUSERRoute>
                        <TambahUser />
                      </DAFTARUSERRoute>
                    }
                  />
                  <Route path="*" element={<p>Halaman tidak ditemukan!</p>} />
                </Routes>
              </ErrorBoundary>
            </Box>
          </main>
        </div>
        <Footer />
      </BrowserRouter>
    </Box>
  );
};

export default App;

const container = {
  display: "flex",
  height: "100%",
  minHeight: "100vh"
};

const sidebarIcon = {
  backgroundColor: Colors.grey300,
  borderRadius: "20px",
  padding: 1,
  marginLeft: 1,
  marginTop: 1,
  cursor: "pointer"
};

const linkText = {
  textDecoration: "none",
  color: "inherit"
};

const userAccount = {
  display: "flex",
  p: 2
};

const userAccountWrapper = {
  width: "200px",
  ml: 1,
  display: "flex",
  justifyContent: "space-between"
};

const userNama = {
  fontWeight: 600
};

const userTipe = {
  color: "gray"
};

const avatarIcon = {
  bgcolor: "purple"
};
