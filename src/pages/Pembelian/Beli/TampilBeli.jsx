import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableBeli } from "../../../components/ShowTable";
import { Loader, usePagination, ButtonModifier } from "../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Pagination,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@mui/material";

const TampilBeli = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const { screenSize } = useStateContext();
  const [noBeli, setNoBeli] = useState("");
  const [tanggalBeli, setTanggalBeli] = useState("");
  const [tglBeliDate, setTglBeliDate] = useState();
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [jumlahBeli, setJumlahBeli] = useState(0);
  const [ppnBeli, setPpnBeli] = useState(0);
  const [isPpnBeli, setIsPpnBeli] = useState(false);
  const [potongan, setPotongan] = useState(0);
  const [lama, setLama] = useState("");
  const [jenisBeli, setJenisBeli] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");
  const [isPost, setIsPost] = useState("");
  const [daftarStoksData, setDaftarStoksData] = useState([]);
  const navigate = useNavigate();
  let today = new Date();
  let isEditableManager = user.tipeUser !== "ADM" && isPost === false;
  let isEditableAdmin =
    user.tipeUser === "ADM" &&
    tglBeliDate?.getFullYear() === today.getFullYear() &&
    tglBeliDate?.getMonth() === today.getMonth() &&
    tglBeliDate?.getDate() === today.getDate() &&
    isPost === false;
  let isEditable = isEditableManager || isEditableAdmin;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const currentPosts = daftarStoksData.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(daftarStoksData.length / PER_PAGE);
  const _DATA = usePagination(daftarStoksData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    id && getBeliById();
  }, [id, isPpnBeli]);

  const getBeliById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/belis/${id}`, {
        kodeCabang: user.cabang._id,
        id: user._id,
        token: user.token
      });
      setNoBeli(response.data.noBeli);
      setTanggalBeli(response.data.tanggalBeli);
      setJumlahBeli(response.data.jumlahBeli);
      setKodeSupplier(response.data.supplier);
      setPpnBeli(response.data.ppnBeli);
      setIsPpnBeli(response.data.isPpnBeli);
      setPotongan(response.data.potongan);
      setLama(response.data.lama);
      setJenisBeli(response.data.jenisBeli);
      setJatuhTempo(response.data.jatuhTempo);
      setIsPost(response.data.isPost);

      let dateParts = response.data.tanggalBeli.split("-");
      let tempTglBeli = new Date(
        +dateParts[2],
        dateParts[1] - 1,
        +dateParts[0]
      );
      setTglBeliDate(new Date(tempTglBeli));

      const response2 = await axios.post(`${tempUrl}/daftarStoksByNoBeli`, {
        noBeli: response.data.noBeli,
        kodeCabang: user.cabang._id,
        id: user._id,
        token: user.token
      });
      setDaftarStoksData(response2.data);
    }
  };

  const deleteBeli = async (id) => {
    try {
      setLoading(true);
      for (let daftarStok of daftarStoksData) {
        await axios.post(`${tempUrl}/deleteDaftarStok/${daftarStok._id}`, {
          id: user._id,
          token: user.token
        });
      }
      await axios.post(`${tempUrl}/deleteBeli/${id}`, {
        id: user._id,
        token: user.token
      });
      setLoading(false);
      navigate("/daftarBeli");
    } catch (error) {
      console.log(error);
    }
  };

  const changeIsPpn = async () => {
    setIsPpnBeli(!isPpnBeli);
    await axios.post(`${tempUrl}/updateBeli/${id}`, {
      isPpnBeli: !isPpnBeli,
      id: user._id,
      token: user.token
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/daftarBeli")}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Box sx={container}>
        <Typography color="#757575">Pembelian</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Beli
        </Typography>
        {isEditable && (
          <Box sx={buttonModifierContainer}>
            <ButtonModifier
              id={id}
              kode={"test"}
              addLink={`/daftarBeli/beli/${id}/tambahBeliChild`}
              editLink={`/daftarBeli/beli/${id}/edit`}
              deleteUser={deleteBeli}
              nameUser={noBeli}
            />
          </Box>
        )}
        <Divider sx={dividerStyle} />
        <Box sx={textFieldContainer}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={isPpnBeli} />}
              label="PPN"
              onChange={() => changeIsPpn()}
            />
          </FormGroup>
        </Box>
        <Divider sx={{ marginBottom: 2 }} />
        <Box sx={textFieldContainer}>
          <Box sx={textFieldWrapper}>
            <Typography sx={labelInput}>Nomor</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={noBeli}
            />
            <Typography sx={[labelInput, spacingTop]}>Jenis Motor</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={jenisBeli.toLocaleString()}
            />
            <Typography sx={[labelInput, spacingTop]}>Kode Supplier</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={`${kodeSupplier.kodeSupplier} - ${kodeSupplier.namaSupplier}`}
            />
            <Typography sx={[labelInput, spacingTop]}>Jumlah</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={jumlahBeli.toLocaleString()}
            />
            {isPpnBeli && (
              <>
                <Typography sx={[labelInput, spacingTop]}>PPN</Typography>
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="filled"
                  InputProps={{
                    readOnly: true
                  }}
                  value={ppnBeli.toLocaleString()}
                />
              </>
            )}
          </Box>
          <Box sx={[textFieldWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Potongan</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={potongan.toLocaleString()}
            />
            <Typography sx={[labelInput, spacingTop]}>Lama</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={`${lama.toLocaleString()} hari`}
            />
            <Typography sx={[labelInput, spacingTop]}>Tanggal</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={tanggalBeli}
            />
            <Typography sx={[labelInput, spacingTop]}>Jatuh Tempo</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="filled"
              InputProps={{
                readOnly: true
              }}
              value={jatuhTempo.toLocaleString()}
            />
          </Box>
        </Box>
        <Divider sx={dividerStyle} />
        <Box sx={tableContainer}>
          <ShowTableBeli
            id={id}
            currentPosts={currentPosts}
            nomorNota={noBeli}
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
    </>
  );
};

export default TampilBeli;

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
