import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { Chart } from "react-google-charts";

export const optionsLabaRugi = {
  hAxis: {
    title: "Cabang"
  },
  vAxis: {
    title: "Total Laba Rugi",
    minValue: 0
  }
};

export const optionsAngsuranTotal = {
  hAxis: {
    title: "Cabang"
  },
  vAxis: {
    title: "Total Angsuran Total",
    minValue: 0
  }
};

export const optionsAngsuranBunga = {
  hAxis: {
    title: "Cabang"
  },
  vAxis: {
    title: "Total Angsuran Bunga",
    minValue: 0
  }
};

export const optionsPenjualanPerCabang = {
  hAxis: {
    title: "Cabang"
  },
  vAxis: {
    title: "Jumlah Penjualan",
    minValue: 0
  }
};

export const optionsJual = {
  hAxis: {
    title: "Cabang"
  },
  vAxis: {
    title: "Total Penjualan",
    minValue: 0
  }
};

export const optionsAngsuranAktif = {
  hAxis: {
    title: "Cabang"
  },
  vAxis: {
    title: "Total Aktif",
    minValue: 0
  }
};

export const optionsJatuhTempo = {
  hAxis: {
    title: "Cabang"
  },
  vAxis: {
    title: "Total Jatuh Tempo",
    minValue: 0
  }
};

const DashboardCabang = () => {
  const { user, setting } = useContext(AuthContext);
  let tempDate = new Date();
  const [todayDate, setTodayDate] = useState(
    `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}-${tempDate.getDate()}`
  );
  const [dataBarPenjualanBulanIni, setDataBarPenjualanBulanIni] = useState([]);
  const [dataBarPenjualanBulanLalu, setDataBarPenjualanBulanLalu] = useState(
    []
  );
  const [
    dataBarPerbandinganPenjualanBulan,
    setDataBarPerbandinganPenjualanBulan
  ] = useState([]);
  const [dataBarLabaRugiBulan, setDataBarLabaRugiBulan] = useState([]);
  const [dataBarAngsuranTotalBulan, setDataBarAngsuranTotalBulan] = useState(
    []
  );
  const [dataBarAngsuranBungaBulan, setDataBarAngsuranBungaBulan] = useState(
    []
  );
  const [dataBarAngsuranAktif, setDataBarAngsuranAktif] = useState([]);
  const [dataBarJatuhTempo, setDataBarJatuhTempo] = useState([]);
  const [namaPeriodeLalu, setNamaPeriodeLalu] = useState("");

  function subtractMonths(date, months) {
    date.setMonth(date.getMonth() - months);
    return date;
  }

  useEffect(() => {
    getBulanLalu();
    getLaporanPenjualanCabangBulanLalu();
    getLaporanPenjualanCabangBulanIni();
    getPerbandinganPenjualanCabangBulan();
    getNeracaSaldoLabaRugiCabangBulan();
    getAngsuranForPenerimaanTotalCabang();
    getAngsuranForPenerimaanBungaCabang();
    getLaporanAngsuranAktif();
    getLaporanJatuhTempo();
  }, []);

  const getPerbandinganPenjualanCabangBulan = async () => {
    let tempPerbandinganPenjualanCabang = [];
    const newBulan = new Date(user.periode.periodeAwal);
    const minOneBulan = subtractMonths(newBulan, 1);
    let dariTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      minOneBulan.getDate();
    let lastday = function (y, m) {
      return new Date(y, m, 0).getDate();
    };
    let sampaiTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      lastday(minOneBulan.getDate(), minOneBulan.getMonth() + 1).toLocaleString(
        "en-US",
        {
          minimumIntegerDigits: 2,
          useGrouping: false
        }
      );

    const jualCabangLalu = await axios.post(
      `${tempUrl}/jualsForLaporanPerCabang`,
      {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    const jualCabangIni = await axios.post(
      `${tempUrl}/jualsForLaporanPerCabang`,
      {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    for (let i = 0; i < jualCabangLalu.data.length; i++) {
      for (let j = 0; j < jualCabangIni.data.length; j++) {
        if (jualCabangLalu.data[i].cabang === jualCabangIni.data[j].cabang) {
          let objectJualCabang = {
            tanggal: jualCabangLalu.data[i].tanggal,
            cabang: jualCabangLalu.data[i].cabang,
            countLalu: jualCabangLalu.data[j].count,
            count: jualCabangIni.data[i].count
          };
          tempPerbandinganPenjualanCabang.push(objectJualCabang);
        }
      }
    }

    let tempDataBarChart = [["Total Jual", "Bulan Lalu", "Bulan Ini"]];

    for (let i = 0; i < tempPerbandinganPenjualanCabang.length; i++) {
      let tempTotalSuara = [
        `Cabang ${tempPerbandinganPenjualanCabang[i].cabang}`,
        tempPerbandinganPenjualanCabang[i].countLalu,
        tempPerbandinganPenjualanCabang[i].count
      ];
      tempDataBarChart.push(tempTotalSuara);
    }
    setDataBarPerbandinganPenjualanBulan(tempDataBarChart);
  };

  const getBulanLalu = () => {
    let tempDateName;
    const newBulan = new Date(user.periode.periodeAwal);
    const minOneBulan = subtractMonths(newBulan, 1);
    switch (minOneBulan.getMonth() + 1) {
      case 1:
        tempDateName = "JANUARI";
        break;
      case 2:
        tempDateName = "FEBRUARI";
        break;
      case 3:
        tempDateName = "MARET";
        break;
      case 4:
        tempDateName = "APRIL";
        break;
      case 5:
        tempDateName = "MEI";
        break;
      case 6:
        tempDateName = "JUNI";
        break;
      case 7:
        tempDateName = "JULI";
        break;
      case 8:
        tempDateName = "AGUSTUS";
        break;
      case 9:
        tempDateName = "SEPTEMBER";
        break;
      case 10:
        tempDateName = "OKTOBER";
        break;
      case 11:
        tempDateName = "NOVEMBER";
        break;
      case 12:
        tempDateName = "DESEMBER";
        break;
      default:
        break;
    }
    setNamaPeriodeLalu(`${tempDateName} ${minOneBulan.getFullYear()}`);
  };

  const getLaporanPenjualanCabangBulanIni = async () => {
    const jualCabang = await axios.post(`${tempUrl}/jualsForLaporanPerCabang`, {
      dariTgl: user.periode.periodeAwal,
      sampaiTgl: user.periode.periodeAkhir,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    let tempDataBarChart = [["Total Jual", "Total Penjualan"]];

    if (jualCabang.data.length > 0) {
      // Total Penjualan Exist
      for (let i = 0; i < jualCabang.data.length; i++) {
        let tempJualCabang = [
          `Cabang ${jualCabang.data[i].cabang}`,
          jualCabang.data[i].count
        ];
        tempDataBarChart.push(tempJualCabang);
      }
      setDataBarPenjualanBulanIni(tempDataBarChart);
    } else {
      // Total Penjualan Not Exist
      let tempJualCabang = [`Cabang ${user.cabang._id}`, 0];
      tempDataBarChart.push(tempJualCabang);
      setDataBarPenjualanBulanIni(tempDataBarChart);
    }
  };

  const getLaporanPenjualanCabangBulanLalu = async () => {
    const newBulan = new Date(user.periode.periodeAwal);
    const minOneBulan = subtractMonths(newBulan, 1);
    let dariTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      minOneBulan.getDate();
    let lastday = function (y, m) {
      return new Date(y, m, 0).getDate();
    };
    let sampaiTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      lastday(minOneBulan.getDate(), minOneBulan.getMonth() + 1).toLocaleString(
        "en-US",
        {
          minimumIntegerDigits: 2,
          useGrouping: false
        }
      );

    const jualCabang = await axios.post(`${tempUrl}/jualsForLaporanPerCabang`, {
      dariTgl,
      sampaiTgl,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });
    let tempDataBarChart = [["Total Jual", "Total Penjualan"]];

    if (jualCabang.data.length > 0) {
      // Total Penjualan Exist
      for (let i = 0; i < jualCabang.data.length; i++) {
        let tempJuaCabang = [
          `Cabang ${jualCabang.data[i].cabang}`,
          jualCabang.data[i].count
        ];
        tempDataBarChart.push(tempJuaCabang);
      }
      setDataBarPenjualanBulanLalu(tempDataBarChart);
    } else {
      // Total Penjualan Not Exist
      let tempJuaCabang = [`Cabang ${user.cabang._id}`, 0];
      tempDataBarChart.push(tempJuaCabang);
      setDataBarPenjualanBulanLalu(tempDataBarChart);
    }
  };

  const getNeracaSaldoLabaRugiCabangBulan = async () => {
    let tempPerbandinganLabaRugiCabang = [];
    const newBulan = new Date(user.periode.periodeAwal);
    const minOneBulan = subtractMonths(newBulan, 1);
    let dariTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      minOneBulan.getDate();
    let lastday = function (y, m) {
      return new Date(y, m, 0).getDate();
    };
    let sampaiTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      lastday(minOneBulan.getDate(), minOneBulan.getMonth() + 1).toLocaleString(
        "en-US",
        {
          minimumIntegerDigits: 2,
          useGrouping: false
        }
      );

    const labaRugiCabangLalu = await axios.post(
      `${tempUrl}/neracaSaldoLabaRugiCabang`,
      {
        labaRugiPeriodeBerjalan: setting.labaRugiPeriodeBerjalan,
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    const labaRugiCabangIni = await axios.post(
      `${tempUrl}/neracaSaldoLabaRugiCabang`,
      {
        labaRugiPeriodeBerjalan: setting.labaRugiPeriodeBerjalan,
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    for (let i = 0; i < labaRugiCabangLalu.data.length; i++) {
      for (let j = 0; j < labaRugiCabangIni.data.length; j++) {
        if (
          labaRugiCabangLalu.data[i].cabang === labaRugiCabangIni.data[j].cabang
        ) {
          let objectLabaRugiCabang = {
            cabang: labaRugiCabangLalu.data[i].cabang,
            countLalu: labaRugiCabangLalu.data[j].count,
            count: labaRugiCabangIni.data[i].count
          };
          tempPerbandinganLabaRugiCabang.push(objectLabaRugiCabang);
        }
      }
    }

    let tempDataBarChart = [["Total Laba Rugi", "Bulan Lalu", "Bulan Ini"]];

    for (let i = 0; i < tempPerbandinganLabaRugiCabang.length; i++) {
      let tempLabaRugi = [
        `Cabang ${tempPerbandinganLabaRugiCabang[i].cabang}`,
        tempPerbandinganLabaRugiCabang[i].countLalu,
        tempPerbandinganLabaRugiCabang[i].count
      ];
      tempDataBarChart.push(tempLabaRugi);
    }
    setDataBarLabaRugiBulan(tempDataBarChart);
  };

  const getAngsuranForPenerimaanTotalCabang = async () => {
    let tempPerbandinganAngsuranTotalCabang = [];
    const newBulan = new Date(user.periode.periodeAwal);
    const minOneBulan = subtractMonths(newBulan, 1);
    let dariTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      minOneBulan.getDate();
    let lastday = function (y, m) {
      return new Date(y, m, 0).getDate();
    };
    let sampaiTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      lastday(minOneBulan.getDate(), minOneBulan.getMonth() + 1).toLocaleString(
        "en-US",
        {
          minimumIntegerDigits: 2,
          useGrouping: false
        }
      );

    const angsuranTotalCabangLalu = await axios.post(
      `${tempUrl}/angsuransForPenerimaanTotalCabang`,
      {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    const angsuranTotalCabangIni = await axios.post(
      `${tempUrl}/angsuransForPenerimaanTotalCabang`,
      {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    for (let i = 0; i < angsuranTotalCabangLalu.data.length; i++) {
      for (let j = 0; j < angsuranTotalCabangIni.data.length; j++) {
        if (
          angsuranTotalCabangLalu.data[i].cabang ===
          angsuranTotalCabangIni.data[j].cabang
        ) {
          let objectAngsuranTotalCabang = {
            cabang: angsuranTotalCabangLalu.data[i].cabang,
            countLalu: angsuranTotalCabangLalu.data[j].count,
            count: angsuranTotalCabangIni.data[i].count
          };
          tempPerbandinganAngsuranTotalCabang.push(objectAngsuranTotalCabang);
        }
      }
    }

    let tempDataBarChart = [
      ["Total Penerimaan Angsuran", "Bulan Lalu", "Bulan Ini"]
    ];

    for (let i = 0; i < tempPerbandinganAngsuranTotalCabang.length; i++) {
      let tempTotalSuara = [
        `Cabang ${tempPerbandinganAngsuranTotalCabang[i].cabang}`,
        tempPerbandinganAngsuranTotalCabang[i].countLalu,
        tempPerbandinganAngsuranTotalCabang[i].count
      ];
      tempDataBarChart.push(tempTotalSuara);
    }
    setDataBarAngsuranTotalBulan(tempDataBarChart);
  };

  const getAngsuranForPenerimaanBungaCabang = async () => {
    let tempPerbandinganAngsuranTotalCabang = [];
    const newBulan = new Date(user.periode.periodeAwal);
    const minOneBulan = subtractMonths(newBulan, 1);
    let dariTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      minOneBulan.getDate();
    let lastday = function (y, m) {
      return new Date(y, m, 0).getDate();
    };
    let sampaiTgl =
      minOneBulan.getFullYear() +
      "-" +
      (minOneBulan.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      lastday(minOneBulan.getDate(), minOneBulan.getMonth() + 1).toLocaleString(
        "en-US",
        {
          minimumIntegerDigits: 2,
          useGrouping: false
        }
      );

    const angsuranTotalCabangLalu = await axios.post(
      `${tempUrl}/angsuransForPenerimaanBungaCabang`,
      {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    const angsuranTotalCabangIni = await axios.post(
      `${tempUrl}/angsuransForPenerimaanBungaCabang`,
      {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );

    for (let i = 0; i < angsuranTotalCabangLalu.data.length; i++) {
      for (let j = 0; j < angsuranTotalCabangIni.data.length; j++) {
        if (
          angsuranTotalCabangLalu.data[i].cabang ===
          angsuranTotalCabangIni.data[j].cabang
        ) {
          let objectAngsuranTotalCabang = {
            cabang: angsuranTotalCabangLalu.data[i].cabang,
            countLalu: angsuranTotalCabangLalu.data[j].count,
            count: angsuranTotalCabangIni.data[i].count
          };
          tempPerbandinganAngsuranTotalCabang.push(objectAngsuranTotalCabang);
        }
      }
    }

    let tempDataBarChart = [
      ["Total Penerimaan Angsuran", "Bulan Lalu", "Bulan Ini"]
    ];

    for (let i = 0; i < tempPerbandinganAngsuranTotalCabang.length; i++) {
      let tempTotalSuara = [
        `Cabang ${tempPerbandinganAngsuranTotalCabang[i].cabang}`,
        tempPerbandinganAngsuranTotalCabang[i].countLalu,
        tempPerbandinganAngsuranTotalCabang[i].count
      ];
      tempDataBarChart.push(tempTotalSuara);
    }
    setDataBarAngsuranBungaBulan(tempDataBarChart);
  };

  const getLaporanAngsuranAktif = async () => {
    const angsuranAktif = await axios.post(
      `${tempUrl}/jualsForAngsuranAktifCabang`,
      {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    let tempDataBarChart = [["Angsuran Aktif", "Total Aktif"]];

    if (angsuranAktif.data.length > 0) {
      // Angsuran Aktif Exist
      for (let i = 0; i < angsuranAktif.data.length; i++) {
        let tempAngsuranAktif = [
          `Cabang ${angsuranAktif.data[i].cabang}`,
          angsuranAktif.data[i].count
        ];
        tempDataBarChart.push(tempAngsuranAktif);
      }
      setDataBarAngsuranAktif(tempDataBarChart);
    } else {
      // Angsuran Aktif Not Exist
      let tempAngsuranAktif = [`Cabang ${user.cabang._id}`, 0];
      tempDataBarChart.push(tempAngsuranAktif);
      setDataBarAngsuranAktif(tempDataBarChart);
    }
  };

  const getLaporanJatuhTempo = async () => {
    const angsuranJatuhTempo = await axios.post(
      `${tempUrl}/jualsJatuhTempoCabang`,
      {
        id: user._id,
        token: user.token,
        kodeCabang: user.cabang._id
      }
    );
    let tempDataBarChart = [["Jatuh Tempo", "Total Jatuh Tempo"]];

    if (angsuranJatuhTempo.data.length > 0) {
      // Jatuh Tempo Exist
      for (let i = 0; i < angsuranJatuhTempo.data.length; i++) {
        let tempJatuhTempo = [
          `Cabang ${angsuranJatuhTempo.data[i].cabang}`,
          angsuranJatuhTempo.data[i].count
        ];
        tempDataBarChart.push(tempJatuhTempo);
      }
      setDataBarJatuhTempo(tempDataBarChart);
    } else {
      // Jatuh Tempo Not Exist
      let tempJatuhTempo = [`Cabang ${user.cabang._id}`, 0];
      tempDataBarChart.push(tempJatuhTempo);
      setDataBarJatuhTempo(tempDataBarChart);
    }
  };

  return (
    <Box sx={container}>
      <Typography color="#757575">Dashboard Cabang</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Dashboard Cabang
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />

      <Paper elevation={20}>
        <Typography sx={[detailText, dividerStyle]}>
          Perbandingan Laba Rugi Per Cabang
        </Typography>
        <Typography sx={detailText}>
          {namaPeriodeLalu} - {user.periode.namaPeriode}
        </Typography>
        <Box sx={graphContainer}>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={dataBarLabaRugiBulan}
            options={optionsLabaRugi}
          />
        </Box>
      </Paper>

      <Paper sx={contentSecondContainer} elevation={20}>
        <Typography sx={[detailText, dividerStyle]}>
          Penerimaan Angsuran Per Cabang
        </Typography>
        <Typography sx={detailText}>
          {namaPeriodeLalu} - {user.periode.namaPeriode}
        </Typography>
        <Box sx={graphContainer}>
          <Box sx={graphWrapper}>
            <Typography sx={detailText}>Total</Typography>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={dataBarAngsuranTotalBulan}
              options={optionsAngsuranTotal}
            />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Divider />
          <Box sx={graphWrapper}>
            <Typography sx={detailText}>Bunga</Typography>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={dataBarAngsuranBungaBulan}
              options={optionsAngsuranBunga}
            />
          </Box>
        </Box>
        <Box sx={graphContainer}></Box>
      </Paper>

      <Paper sx={contentSecondContainer} elevation={20}>
        <Typography sx={[detailText, dividerStyle]}>
          Perbandingan Laporan Penjualan Cabang {user.cabang._id}
        </Typography>
        <Box>
          <Typography sx={detailText}>
            {namaPeriodeLalu} - {user.periode.namaPeriode}
          </Typography>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={dataBarPerbandinganPenjualanBulan}
            options={optionsPenjualanPerCabang}
          />
        </Box>
        <Divider />
        <Typography sx={[detailText, dividerStyle]}>
          Detail Laporan Penjualan
        </Typography>
        <Box sx={graphContainer}>
          <Box sx={graphWrapper}>
            <Typography sx={detailText}>{namaPeriodeLalu}</Typography>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={dataBarPenjualanBulanLalu}
              options={optionsPenjualanPerCabang}
            />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Divider />
          <Box sx={graphWrapper}>
            <Typography sx={detailText}>{user.periode.namaPeriode}</Typography>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={dataBarPenjualanBulanIni}
              options={optionsPenjualanPerCabang}
            />
          </Box>
        </Box>
      </Paper>

      <Paper sx={contentSecondContainer} elevation={20}>
        <Typography sx={[detailText, dividerStyle]}>
          Angsuran Per. Tgl {todayDate}
        </Typography>
        <Box sx={graphContainer}>
          <Box sx={graphWrapper}>
            <Typography sx={[detailText, dividerStyle]}>
              Angsuran Aktif
            </Typography>
            <Box sx={graphContainer}>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={dataBarAngsuranAktif}
                options={optionsAngsuranAktif}
              />
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Divider />
          <Box sx={graphWrapper}>
            <Typography sx={[detailText, dividerStyle]}>
              Angsuran Jatuh Tempo
            </Typography>
            <Box sx={graphContainer}>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={dataBarJatuhTempo}
                options={optionsJatuhTempo}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardCabang;

const container = {
  p: {
    xs: 1,
    sm: 4
  }
};

const contentSecondContainer = {
  mt: 4
};

const subTitleText = {
  fontWeight: "900"
};

const detailText = {
  fontWeight: "900",
  textAlign: "center"
};

const dividerStyle = {
  pt: 4
};

const graphContainer = {
  p: {
    xs: 0,
    sm: 6
  },
  display: "flex",
  justifyContent: {
    sm: "space-around"
  },
  flexDirection: {
    xs: "column",
    sm: "column",
    md: "row"
  }
};

const graphWrapper = {
  pt: {
    xs: 4,
    sm: 0
  },
  width: {
    xs: "300px",
    sm: "400px"
  }
};
