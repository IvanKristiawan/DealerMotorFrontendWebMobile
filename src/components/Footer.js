import React from "react";
import { Box, Typography } from "@mui/material";
import { namaSoftware } from "../constants/GeneralSetting";
import { useStateContext } from "../contexts/ContextProvider";
import CopyrightIcon from "@mui/icons-material/Copyright";

const Footer = () => {
  const { screenSize } = useStateContext();

  const titleStyle = {
    fontSize: screenSize >= 650 ? "16px" : "14px",
  };

  return (
    <Box sx={container}>
      <CopyrightIcon sx={iconStyle} />
      <Typography sx={titleStyle}>
        {namaSoftware} 2023 Copyright - All Rights Reserved
      </Typography>
    </Box>
  );
};

export default Footer;

const container = {
  height: "50px",
  backgroundColor: "black",
  color: "white",
  backgroundColor: "black",
  display: "flex",
  p: 2,
  pl: 3,
};

const iconStyle = {
  mr: 0.5,
  width: 20,
};
