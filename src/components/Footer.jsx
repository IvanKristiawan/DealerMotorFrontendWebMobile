import React from "react";
import { Box, Typography } from "@mui/material";
import { namaSoftware } from "../constants/GeneralSetting";
import CopyrightIcon from "@mui/icons-material/Copyright";

const Footer = () => {
  return (
    <Box sx={container}>
      <CopyrightIcon sx={iconStyle} />
      <Typography>
        {namaSoftware} 2023 Copyright - All Rights Reserved
      </Typography>
    </Box>
  );
};

export default Footer;

const container = {
  height: "65px",
  color: "white",
  backgroundColor: "black",
  display: "flex",
  p: 2,
  pl: 3
};

const iconStyle = {
  mr: 0.5,
  width: 20
};
