import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { tempUrl } from "../../contexts/ContextProvider";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loading, error, dispatch } = useContext(AuthContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = async (e) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(`${tempUrl}/auth/login`, {
        username,
        password
      });
      const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
        id: res.data.details._id,
        token: res.data.details.token
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data.details,
        setting: findSetting.data
      });

      if (res.data.details.tipeUser === "OWN") {
        navigate("/dashboardOwner");
      } else if (res.data.details.tipeUser === "MGR") {
        navigate("/dashboardCabang");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      setOpen(true);
      dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
  };

  return (
    <Box sx={container}>
      <form onSubmit={handleSubmit(handleClick)}>
        <Typography color="#757575">User</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Login
        </Typography>
        <Divider sx={dividerStyle} />
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              value={username}
              {...register("username", {
                required: "Username harus diisi!"
              })}
              error={!!errors?.username}
              helperText={errors?.username ? errors.username.message : null}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
            />
            <TextField
              type="password"
              id="outlined-basic"
              label="Password"
              variant="outlined"
              autoComplete="current-password"
              sx={spacingTop}
              value={password}
              {...register("password", {
                required: "Password harus diisi!"
              })}
              error={!!errors?.password}
              helperText={errors?.password ? errors.password.message : null}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Box>
        {error && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={alertBox}>
              Username atau Password salah!
            </Alert>
          </Snackbar>
        )}
        <Divider sx={spacingTop} />
      </form>
    </Box>
  );
};

export default Login;

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

const alertBox = {
  width: "100%"
};
