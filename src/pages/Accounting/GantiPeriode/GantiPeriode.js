import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { useStateContext } from "../../../contexts/ContextProvider";
import { ShowTablePeriode } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader, usePagination } from "../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Pagination,
  Button
} from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

const GantiPeriode = () => {
  const { user } = useContext(AuthContext);
  const { error, dispatch } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [periodeAwal, setPeriodeAwal] = useState("");
  const [periodeAkhir, setPeriodeAkhir] = useState("");
  const [namaPeriode, setNamaPeriode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [periodesData, setPeriodesData] = useState([]);
  let isPeriodeExist = periodeAwal.length !== 0;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = periodesData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.periodeAwal.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.periodeAkhir.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaPeriode.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(periodesData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getPeriodesData();
    id && getPeriodeById();
  }, [id]);

  const getPeriodesData = async () => {
    setLoading(true);
    try {
      const allPeriode = await axios.post(`${tempUrl}/tutupPeriodes`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setPeriodesData(allPeriode.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getPeriodeById = async () => {
    if (id) {
      const pickedPeriode = await axios.post(`${tempUrl}/tutupPeriodes/${id}`, {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setPeriodeAwal(pickedPeriode.data.periodeAwal);
      setPeriodeAkhir(pickedPeriode.data.periodeAkhir);
      setNamaPeriode(pickedPeriode.data.namaPeriode);
    }
  };

  const gantiPeriode = async () => {
    try {
      const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
        id: user._id,
        token: user.token
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
      const gantiPeriodeUser = await axios.post(
        `${tempUrl}/updateUserThenLogin/${user._id}`,
        {
          periode: pickedPeriode.data._id,
          id: user._id,
          token: user.token,
          kodeCabang: user.cabang._id
        }
      );
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: gantiPeriodeUser.data.details,
        setting: findSetting.data
      });
    } catch (err) {
      setIsFetchError(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Accounting</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Ganti Periode
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      {isPeriodeExist && (
        <>
          <Box sx={buttonModifierContainer}>
            <Button
              variant="contained"
              color="success"
              sx={{ bgcolor: "success.light", textTransform: "none" }}
              startIcon={<ChangeCircleIcon />}
              size="small"
              onClick={() => {
                gantiPeriode();
              }}
            >
              Ganti Periode
            </Button>
          </Box>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Awal</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={periodeAwal}
              />
              <Typography sx={[labelInput, spacingTop]}>Akhir</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={periodeAkhir}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Periode
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaPeriode}
              />
            </Box>
          </Box>
          <Divider sx={dividerStyle} />
        </>
      )}
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTablePeriode currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default GantiPeriode;

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
