import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Colors } from "../../../constants/styles";

const UbahProfilUser = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [kodeCabang, setKodeCabang] = useState("");
  const [username, setUsername] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [periode, setPeriode] = useState("");
  const [kodeKwitansi, setKodeKwitansi] = useState("");
  const [noTerakhir, setNoTerakhir] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/findUser/${id}`, {
      id: user._id,
      token: user.token
    });
    setUsername(response.data.username);
    setTipeUser(response.data.tipeUser);
    setPeriode(response.data.periode);
    setKodeKwitansi(response.data.kodeKwitansi);
    setNoTerakhir(response.data.noTerakhir);
    setKodeCabang(response.data.cabang);
    setLoading(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (password.length === 0) {
      setPassword(user.password);
    }
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/users/${id}`, {
        password,
        id: user._id,
        token: user.token
      });
      setLoading(false);
      logoutButtonHandler();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const logoutButtonHandler = async (e) => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">User</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Ubah Password User
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Username</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={username}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Tipe User</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={tipeUser}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Periode</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={periode}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Cabang</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={`${kodeCabang._id} - ${kodeCabang.namaCabang}`}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Kode Kwitansi</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={kodeKwitansi}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>No Terakhir</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={noTerakhir}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Password (baru)
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
            />
            <Typography>
              *Kosongkan jika tidak ingin mengganti password
            </Typography>
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/profilUser")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={updateUser}
          >
            Ubah
          </Button>
        </Box>
      </Paper>
      <Divider sx={dividerStyle} />
    </Box>
  );
};

export default UbahProfilUser;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
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

const spacingTop = {
  mt: 4
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const contentContainer = {
  p: 3,
  pt: 1,
  mt: 2,
  backgroundColor: Colors.grey100
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
