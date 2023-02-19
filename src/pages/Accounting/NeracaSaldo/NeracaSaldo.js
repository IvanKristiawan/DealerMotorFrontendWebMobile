import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { ShowTableNeracaSaldo } from "../../../components/ShowTable";
import { Loader } from "../../../components";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { Box, Typography, Divider } from "@mui/material";

const NeracaSaldo = () => {
  const { user } = useContext(AuthContext);

  const [isFetchError, setIsFetchError] = useState(false);
  const [neracaSaldos, setNeracaSaldosData] = useState([]);
  const [totalDebet, setTotalDebet] = useState(0);
  const [totalKredit, setTotalKredit] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNeracaSaldosData();
  }, []);

  const getNeracaSaldosData = async () => {
    let tempTotalDebet = 0;
    let tempTotalKredit = 0;
    setLoading(true);
    try {
      const neracaSaldos = await axios.post(`${tempUrl}/neracaSaldoPeriode`, {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      });
      setNeracaSaldosData(neracaSaldos.data.neracaSaldo);
      for (let i = 0; i < neracaSaldos.data.neracaSaldo.length; i++) {
        tempTotalDebet += neracaSaldos.data.neracaSaldo[i].debet;
        tempTotalKredit += neracaSaldos.data.neracaSaldo[i].kredit;
      }
      setTotalDebet(tempTotalDebet);
      setTotalKredit(tempTotalKredit);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Accounting</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Neraca Saldo
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={tableContainer}>
        <ShowTableNeracaSaldo
          currentPosts={neracaSaldos}
          totalDebet={totalDebet}
          totalKredit={totalKredit}
        />
      </Box>
    </Box>
  );
};

export default NeracaSaldo;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  pt: 4
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};
