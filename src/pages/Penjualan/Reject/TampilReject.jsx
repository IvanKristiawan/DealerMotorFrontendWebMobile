import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { useStateContext } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { ShowTableRejectChild } from "../../../components/ShowTable";
import { Loader, usePagination, ButtonModifier } from "../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Pagination,
  Button,
  TextareaAutosize
} from "@mui/material";

const TampilReject = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const { screenSize } = useStateContext();
  const [tglReject, setTglReject] = useState("");
  const [alamatReject, setAlamatReject] = useState("");
  const [noKKReject, setNoKKReject] = useState("");
  const [noKTPReject, setNoKTPReject] = useState("");
  const [nopolReject, setNopolReject] = useState("");
  const [namaReject, setNamaReject] = useState("");
  const [tlpReject, setTlpReject] = useState("");
  const [catatanReject, setCatatanReject] = useState("");
  const [daftarAnakData, setDaftarAnakData] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const currentPosts = daftarAnakData.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(daftarAnakData.length / PER_PAGE);
  const _DATA = usePagination(daftarAnakData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    id && getRejectById();
  }, [id]);

  const getRejectById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/rejects/${id}`, {
        kodeCabang: user.cabang._id,
        id: user._id,
        token: user.token
      });
      setTglReject(response.data.tglReject);
      setAlamatReject(response.data.alamatReject);
      setNoKKReject(response.data.noKKReject);
      setNoKTPReject(response.data.noKTPReject);
      setNopolReject(response.data.nopolReject);
      setNamaReject(response.data.namaReject);
      setTlpReject(response.data.tlpReject);
      setCatatanReject(response.data.catatanReject);
      setDaftarAnakData(response.data.anak);
    }
  };

  const deleteReject = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteReject/${id}`, {
        id: user._id,
        token: user.token
      });
      setLoading(false);
      navigate("/daftarReject");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/daftarReject")}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={container}>
        <Typography color="#757575">Penjualan</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Reject
        </Typography>
        <Box sx={buttonModifierContainer}>
          <ButtonModifier
            id={id}
            kode={"test"}
            addLink={`/daftarReject/reject/${id}/tambahRejectChild`}
            editLink={`/daftarReject/reject/${id}/edit`}
            deleteUser={deleteReject}
            nameUser={namaReject}
          />
        </Box>
        <Divider sx={dividerStyle} />
        <Divider sx={{ marginBottom: 2 }} />
        <Box sx={textFieldContainer}>
          <Box sx={textFieldWrapper}>
            <Typography sx={labelInput}>Tanggal Reject</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tglReject}
            />
            <Typography sx={[labelInput, spacingTop]}>Nama</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={namaReject.toLocaleString()}
            />
            <Typography sx={[labelInput, spacingTop]}>Alamat Reject</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={alamatReject}
            />
            <Typography sx={[labelInput, spacingTop]}>No. KK</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={noKKReject}
            />
            <Typography sx={[labelInput, spacingTop]}>No. KTP</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={noKTPReject.toLocaleString()}
            />
          </Box>
          <Box sx={[textFieldWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Nopol</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={nopolReject.toLocaleString()}
            />
            <Typography sx={[labelInput, spacingTop]}>Telepon</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tlpReject.toLocaleString()}
            />
            <Typography sx={[labelInput, spacingTop]}>Catatan</Typography>
            <TextareaAutosize
              maxRows={1}
              aria-label="maximum height"
              style={{ height: 150, backgroundColor: Colors.grey200 }}
              value={catatanReject}
              disabled
            />
          </Box>
        </Box>
        <Divider sx={dividerStyle} />
        <Box sx={tableContainer}>
          <ShowTableRejectChild id={id} currentPosts={currentPosts} />
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

export default TampilReject;

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
