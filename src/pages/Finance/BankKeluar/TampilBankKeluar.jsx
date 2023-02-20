import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { useStateContext } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { ShowTableBankKeluar } from "../../../components/ShowTable";
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

const TampilBankKeluar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const { screenSize } = useStateContext();
  const [noBukti, setNoBukti] = useState("");
  const [tglBankKeluar, setTglBankKeluar] = useState("");
  const [tglBankKeluarDate, setTglBankKeluarDate] = useState();
  const [kodeCOA, setKodeCOA] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isPost, setIsPost] = useState("");
  const [jumlah, setJumlah] = useState("");

  const [bankKeluarsChildData, setBankKeluarsChildData] = useState([]);
  const navigate = useNavigate();
  let today = new Date();
  let isEditableManager = user.tipeUser !== "ADM" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADM" &&
    tglBankKeluarDate?.getFullYear() === today.getFullYear() &&
    tglBankKeluarDate?.getMonth() === today.getMonth() &&
    tglBankKeluarDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const currentPosts = bankKeluarsChildData.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const count = Math.ceil(bankKeluarsChildData.length / PER_PAGE);
  const _DATA = usePagination(bankKeluarsChildData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    id && getBankKeluarById();
  }, [id]);

  const getBankKeluarById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/bankKeluars/${id}`, {
        kodeCabang: user.cabang._id,
        id: user._id,
        token: user.token
      });
      setNoBukti(response.data.noBukti);
      setTglBankKeluar(response.data.tglBankKeluar);
      setTglBankKeluarDate(new Date(response.data.tglBankKeluar));
      setKodeCOA(response.data.COA);
      setKeterangan(response.data.keterangan);
      setIsPost(response.data.isPost);
      setJumlah(response.data.jumlah);
      const response2 = await axios.post(
        `${tempUrl}/bankKeluarsChildByNoBukti`,
        {
          noBukti: response.data.noBukti,
          kodeCabang: user.cabang._id,
          id: user._id,
          token: user.token
        }
      );
      setBankKeluarsChildData(response2.data);
    }
  };

  const deleteBankKeluar = async (id) => {
    try {
      setLoading(true);
      for (let bankKeluarsChild of bankKeluarsChildData) {
        await axios.post(
          `${tempUrl}/deleteBankKeluarChild/${bankKeluarsChild._id}`,
          {
            id: user._id,
            token: user.token
          }
        );
      }
      await axios.post(`${tempUrl}/deleteBankKeluar/${id}`, {
        id: user._id,
        token: user.token
      });
      setLoading(false);
      navigate("/daftarBankKeluar");
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
        onClick={() => navigate("/daftarBankKeluar")}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={container}>
        <Typography color="#757575">Finance</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Bank Keluar
        </Typography>
        {isEditable && (
          <Box sx={buttonModifierContainer}>
            <ButtonModifier
              id={id}
              kode={"test"}
              addLink={`/daftarBankKeluar/bankKeluar/${id}/tambahBankKeluarChild`}
              editLink={`/daftarBankKeluar/bankKeluar/${id}/edit`}
              deleteUser={deleteBankKeluar}
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
              Tgl. Kas Keluar
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tglBankKeluar}
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
          <ShowTableBankKeluar id={id} currentPosts={currentPosts} />
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

export default TampilBankKeluar;

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
