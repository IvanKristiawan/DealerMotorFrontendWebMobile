import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { useStateContext } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { ShowTableBankMasuk } from "../../../components/ShowTable";
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

const TampilBankMasuk = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const { screenSize } = useStateContext();
  const [noBukti, setNoBukti] = useState("");
  const [tglBankMasuk, setTglBankMasuk] = useState("");
  const [tglBankMasukDate, setTglBankMasukDate] = useState();
  const [kodeCOA, setKodeCOA] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isPost, setIsPost] = useState("");
  const [jumlah, setJumlah] = useState("");

  const [bankMasuksChildData, setBankMasuksChildData] = useState([]);
  const navigate = useNavigate();
  let today = new Date();
  let isEditableManager = user.tipeUser !== "ADM" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADM" &&
    tglBankMasukDate?.getFullYear() === today.getFullYear() &&
    tglBankMasukDate?.getMonth() === today.getMonth() &&
    tglBankMasukDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const currentPosts = bankMasuksChildData.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const count = Math.ceil(bankMasuksChildData.length / PER_PAGE);
  const _DATA = usePagination(bankMasuksChildData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    id && getBankMasukById();
  }, [id]);

  const getBankMasukById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/bankMasuks/${id}`, {
        kodeCabang: user.cabang._id,
        id: user._id,
        token: user.token
      });
      setNoBukti(response.data.noBukti);
      setTglBankMasuk(response.data.tglBankMasuk);
      setTglBankMasukDate(new Date(response.data.tglBankMasuk));
      setKodeCOA(response.data.COA);
      setKeterangan(response.data.keterangan);
      setIsPost(response.data.isPost);
      setJumlah(response.data.jumlah);
      const response2 = await axios.post(
        `${tempUrl}/bankMasuksChildByNoBukti`,
        {
          noBukti: response.data.noBukti,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        }
      );
      setBankMasuksChildData(response2.data);
    }
  };

  const deleteBankMasuk = async (id) => {
    try {
      setLoading(true);
      for (let bankMasuksChild of bankMasuksChildData) {
        await axios.post(
          `${tempUrl}/deleteBankMasukChild/${bankMasuksChild._id}`,
          {
            id: user._id,
            token: user.token
          }
        );
      }
      await axios.post(`${tempUrl}/deleteBankMasuk/${id}`, {
        id: user._id,
        token: user.token
      });
      setLoading(false);
      navigate("/daftarBankMasuk");
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
        onClick={() => navigate("/daftarBankMasuk")}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={container}>
        <Typography color="#757575">Finance</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Bank Masuk
        </Typography>
        {isEditable && (
          <Box sx={buttonModifierContainer}>
            <ButtonModifier
              id={id}
              kode={"test"}
              addLink={`/daftarBankMasuk/bankMasuk/${id}/tambahBankMasukChild`}
              editLink={`/daftarBankMasuk/bankMasuk/${id}/edit`}
              deleteUser={deleteBankMasuk}
              nameUser={noBukti}
            />
          </Box>
        )}
        <Divider sx={dividerStyle} />
        <Divider sx={{ marginBottom: 2 }} />
        <Box sx={textFieldContainer}>
          <Box sx={textFieldWrapper}>
            <Typography sx={labelInput}>No. Bukti</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={noBukti}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Tgl. Bank Masuk
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tglBankMasuk}
            />
            <Typography sx={[labelInput, spacingTop]}>Kode COA</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={`${kodeCOA.kodeCOA} - ${kodeCOA.namaCOA}`}
            />
            <Typography sx={[labelInput, spacingTop]}>Jumlah</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={jumlah.toLocaleString()}
            />
          </Box>
          <Box sx={[textFieldWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Keterangan</Typography>
            <TextareaAutosize
              maxRows={1}
              aria-label="maximum height"
              style={{ height: 360, backgroundColor: Colors.grey200 }}
              value={keterangan}
              disabled
            />
          </Box>
        </Box>
        <Divider sx={dividerStyle} />
        <Box sx={tableContainer}>
          <ShowTableBankMasuk id={id} currentPosts={currentPosts} />
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

export default TampilBankMasuk;

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
