import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  ButtonGroup
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ProfilUser = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Box sx={container}>
      <Typography color="#757575">Utility</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Profil User
      </Typography>
      <Box sx={buttonModifierContainer}>
        <ButtonGroup variant="contained">
          <Button
            color="primary"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => {
              navigate(`/profilUser/${user._id}/edit`);
            }}
          >
            Ubah Password
          </Button>
        </ButtonGroup>
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={showDataContainer}>
        <Box sx={showDataWrapper}>
          <Typography sx={labelInput}>Username</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={user.username}
          />
          <Typography sx={[labelInput, spacingTop]}>Tipe User</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={user.tipeUser}
          />
          <Typography sx={[labelInput, spacingTop]}>Periode</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={user.periode.namaPeriode}
          />
          <Typography sx={[labelInput, spacingTop]}>Cabang</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={`${user.cabang._id} - ${user.cabang.namaCabang}`}
          />
        </Box>
        <Box sx={[showDataWrapper, secondWrapper]}>
          <Typography sx={labelInput}>Kode Kwitansi</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={user.kodeKwitansi}
          />
          <Typography sx={[labelInput, spacingTop]}>No Terakhir</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={user.noTerakhir}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilUser;

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

const textFieldStyle = {
  display: "flex",
  mt: 4
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
