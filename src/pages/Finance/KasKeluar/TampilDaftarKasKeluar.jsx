import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDaftarKasKeluar } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
import { Box, Typography, Divider, Pagination } from "@mui/material";

const TampilDaftarKasKeluar = () => {
  const { user } = useContext(AuthContext);
  const { screenSize } = useStateContext();
  const [isFetchError, setIsFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [kasKeluarsData, setKasKeluarsData] = useState([]);
  const kode = null;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = kasKeluarsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noBukti.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tglKasKeluar.toString().includes(searchTerm) ||
      val.COA.kodeCOA.toString().includes(searchTerm.toUpperCase()) ||
      val.COA.namaCOA.toString().includes(searchTerm.toUpperCase()) ||
      val.keterangan.toString().toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(kasKeluarsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getKasKeluarsData();
  }, []);

  const getKasKeluarsData = async () => {
    setLoading(true);
    try {
      const allKasKeluars = await axios.post(`${tempUrl}/kasKeluars`, {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setKasKeluarsData(allKasKeluars.data);
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
      <Typography color="#757575">Finance</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Kas Keluar
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={"/"}
          kode={kode}
          addLink={`/daftarKasKeluar/kasKeluar/tambahKasKeluar`}
          editLink={`/`}
          deleteUser={"/"}
        />
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarKasKeluar
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

export default TampilDaftarKasKeluar;

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
