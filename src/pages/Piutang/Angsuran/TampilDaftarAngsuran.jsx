import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDaftarAngsuran } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader, usePagination } from "../../../components";
import { Box, Typography, Divider, Pagination, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const TampilDaftarAngsuran = () => {
  let navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { screenSize } = useStateContext();
  const [isFetchError, setIsFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [jualsData, setJualsData] = useState([]);

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
      val.namaRegister.includes(searchTerm.toUpperCase()) ||
      val.almRegister.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.nopol.toString().includes(searchTerm) ||
      val.noJual.toString().toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tanggalJual
        .toString()
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.tipe.toString().toUpperCase().includes(searchTerm.toUpperCase())
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
    getJualsData();
  }, []);

  const getJualsData = async () => {
    setLoading(true);
    try {
      const allJuals = await axios.post(`${tempUrl}/jualsForDaftarAngsuran`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setJualsData(allJuals.data);
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
      <Typography color="#757575">Piutang</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Angsuran
      </Typography>
      <Box sx={buttonModifierContainer}>
        <Button
          variant="contained"
          color="success"
          sx={{ bgcolor: "success.light", textTransform: "none" }}
          startIcon={<AddCircleOutlineIcon />}
          size="small"
          onClick={() => {
            navigate(`/daftarAngsuran/angsuran/tambahAngsuran`);
          }}
        >
          Bayar
        </Button>
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarAngsuran
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

export default TampilDaftarAngsuran;

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
