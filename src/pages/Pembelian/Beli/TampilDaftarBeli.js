import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDaftarBeli } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
import { Box, Typography, Divider, Pagination } from "@mui/material";

const TampilDaftarBeli = () => {
  const { user } = useContext(AuthContext);
  const { screenSize } = useStateContext();
  const [isFetchError, setIsFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [belisData, setBelisData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const kode = null;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = belisData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noBeli.includes(searchTerm) ||
      val.tanggalBeli.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jumlahBeli.toString().includes(searchTerm) ||
      val.lama.toString().toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.ppnBeli.toString().toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jenisBeli
        .toString()
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.supplier.kodeSupplier
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.supplier.namaSupplier.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(belisData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getSuppliersData();
    getBelisData();
  }, []);

  const getSuppliersData = async () => {
    setLoading(true);
    const allSuppliers = await axios.post(`${tempUrl}/suppliersMainInfo`, {
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    setSuppliers(allSuppliers.data);
    setLoading(false);
  };

  const getBelisData = async () => {
    setLoading(true);
    try {
      const allBelis = await axios.post(`${tempUrl}/belis`, {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setBelisData(allBelis.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Pembelian</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Beli
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={"/"}
          kode={kode}
          addLink={`/daftarBeli/beli/tambahBeli`}
          editLink={`/`}
          deleteUser={"/"}
        />
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarBeli
          currentPosts={currentPosts}
          searchTerm={searchTerm}
          suppliers={suppliers}
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

export default TampilDaftarBeli;

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
