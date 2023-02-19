import React, { useContext } from "react";
// ...
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { namaSoftware, namaProgram } from "../constants/GeneralSetting";
import { useStateContext } from "../contexts/ContextProvider";

const Header = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);

  const container = {
    height: screenSize >= 650 ? "65px" : "90px",
    backgroundColor: "black"
  };

  const contained = {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: screenSize >= 650 ? "row" : "column",
    paddingLeft: "50px",
    paddingRight: "50px",
    paddingTop: "10px"
  };

  return (
    <Box style={container}>
      <Box style={contained}>
        <Box sx={wrapper}>
          {user ? (
            <Link to="/" className="logo" style={titleStyle}>
              {`${namaSoftware} - ${namaProgram} (${user.cabang._id} - ${user.cabang.namaCabang})`}
            </Link>
          ) : (
            <Link to="/" className="logo" style={titleStyle}>
              {`${namaSoftware} - ${namaProgram}`}
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;

const titleStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "20px",
  paddingTop: "8px"
};

const wrapper = {
  display: "flex"
};
