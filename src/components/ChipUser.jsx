import React, { useContext } from "react";
import { Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";

const ChipUser = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutButtonHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <Stack direction="row" spacing={1} sx={containerAvatar}>
      <Stack direction="row">
        <Tooltip title="Logout">
          <LogoutIcon sx={logoutStyle} onClick={logoutButtonHandler} />
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default ChipUser;

const containerAvatar = {
  ml: 1,
  mt: {
    md: 0,
    xs: 0.5
  },
  p: 1,
  borderRadius: "16px",
  display: {
    md: null,
    sm: "flex"
  },
  justifyContent: "center"
};

const logoutStyle = {
  my: "auto",
  padding: "3px",
  cursor: "pointer",
  transition: "0.3s",
  "&:hover": {
    color: "primary.light"
  }
};
