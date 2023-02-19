import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { Chart } from "react-google-charts";

export const optionsPenjualanPerCabang = {
  hAxis: {
    title: "Daftar Cabang"
  },
  vAxis: {
    title: "Jumlah Penjualan",
    minValue: 0
  }
};

export const optionsAngsuranAktif = {
  hAxis: {
    title: "Daftar Cabang"
  },
  vAxis: {
    title: "Total Aktif",
    minValue: 0
  }
};

export const optionsJatuhTempo = {
  hAxis: {
    title: "Daftar Cabang"
  },
  vAxis: {
    title: "Total Jatuh Tempo",
    minValue: 0
  }
};

export const optionsLabaRugi = {
  hAxis: {
    title: "Daftar Cabang"
  },
  vAxis: {
    title: "Total Laba Rugi",
    minValue: 0
  }
};

export const optionsAngsuranTotal = {
  hAxis: {
    title: "Daftar Cabang"
  },
  vAxis: {
    title: "Total Angsuran Total",
    minValue: 0
  }
};

export const optionsAngsuranBunga = {
  hAxis: {
    title: "Daftar Cabang"
  },
  vAxis: {
    title: "Total Angsuran Bunga",
    minValue: 0
  }
};

const DashboardOwner = () => {
  const { user, setting } = useContext(AuthContext);
  let tempDate = new Date();
  const [todayDate, setTodayDate] = useState(
    `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}-${tempDate.getDate()}`
  );
  const [dataBarPenjualanBulanIni, setDataBarPenjualanBulanIni] = useState([]);
  const [dataBarPenjualanBulanLalu, setDataBarPenjualanBulanLalu] = useState(
    []
  );
  const [dataBarLabaRugiBulan, setDataBarLabaRugiBulan] = useState([]);
  const [dataBarAngsuranTotalBulan, setDataBarAngsuranTotalBulan] = useState(
    []
  );
  const [dataBarAngsuranBungaBulan, setDataBarAngsuranBungaBulan] = useState(
    []
  );
  const [dataBarAngsuranAktif, setDataBarAngsuranAktif] = useState([]);
  const [dataBarJatuhTempo, setDataBarJatuhTempo] = useState([]);
  const [
    dataBarPerbandinganPenjualanBulan,
    setDataBarPerbandinganPenjualanBulan
  ] = useState([]);
  const [namaPeriodeLalu, setNamaPeriodeLalu] = useState("");

  function subtractMonths(date, months) {
    date.setMonth(date.getMonth() - months);
    return date;
  }

  useEffect(() => {
    getBulanLalu();
    getLaporanPenjualanSemuaCabangBulanLalu();
    getLaporanPenjualanSemuaCabangBulanIni();
    getPerbandinganPenjualanSemuaCabangBulan();
    getNeracaSaldoLabaRugiSemuaCabangBulan();
    getAngsuranForPenerimaanTotalSemuaCabang();
    getAngsuranForPenerimaanBungaSemuaCabang();
    getLaporanAngsuranAktif();
    getLaporanJatuhTempo();
  }, []);

  const getPerbandinganPenjualanSemuaCabangBulan = async () => {
    let tempPerbandinganPenjualanSemuaCabang = [];
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

    const jualSemuaCabangLalu = await axios.post(
      `${tempUrl}/jualsForLaporanPerSemuaCabang`,
      {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token
      }
    );

    const jualSemuaCabangIni = await axios.post(
      `${tempUrl}/jualsForLaporanPerSemuaCabang`,
      {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token
      }
    );

    for (let i = 0; i < jualSemuaCabangLalu.data.length; i++) {
      for (let j = 0; j < jualSemuaCabangIni.data.length; j++) {
        if (
          jualSemuaCabangLalu.data[i].cabang ===
          jualSemuaCabangIni.data[j].cabang
        ) {
          let objectJualSemuaCabang = {
            tanggal: jualSemuaCabangLalu.data[i].tanggal,
            cabang: jualSemuaCabangLalu.data[i].cabang,
            countLalu: jualSemuaCabangLalu.data[j].count,
            count: jualSemuaCabangIni.data[i].count
          };
          tempPerbandinganPenjualanSemuaCabang.push(objectJualSemuaCabang);
        }
      }
    }

    let tempDataBarChart = [
      ["Total Jual Per Cabang", "Bulan Lalu", "Bulan Ini"]
    ];

    for (let i = 0; i < tempPerbandinganPenjualanSemuaCabang.length; i++) {
      let tempTotalSuara = [
        `Cabang ${tempPerbandinganPenjualanSemuaCabang[i].cabang}`,
        tempPerbandinganPenjualanSemuaCabang[i].countLalu,
        tempPerbandinganPenjualanSemuaCabang[i].count
      ];
      tempDataBarChart.push(tempTotalSuara);
    }
    setDataBarPerbandinganPenjualanBulan(tempDataBarChart);
  };

  const getNeracaSaldoLabaRugiSemuaCabangBulan = async () => {
    let tempPerbandinganLabaRugiSemuaCabang = [];
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

    const labaRugiSemuaCabangLalu = await axios.post(
      `${tempUrl}/neracaSaldoLabaRugiSemuaCabang`,
      {
        labaRugiPeriodeBerjalan: setting.labaRugiPeriodeBerjalan,
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token
      }
    );

    const labaRugiSemuaCabangIni = await axios.post(
      `${tempUrl}/neracaSaldoLabaRugiSemuaCabang`,
      {
        labaRugiPeriodeBerjalan: setting.labaRugiPeriodeBerjalan,
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token
      }
    );

    for (let i = 0; i < labaRugiSemuaCabangLalu.data.length; i++) {
      for (let j = 0; j < labaRugiSemuaCabangIni.data.length; j++) {
        if (
          labaRugiSemuaCabangLalu.data[i].cabang ===
          labaRugiSemuaCabangIni.data[j].cabang
        ) {
          let objectLabaRugiSemuaCabang = {
            cabang: labaRugiSemuaCabangLalu.data[i].cabang,
            countLalu: labaRugiSemuaCabangLalu.data[j].count,
            count: labaRugiSemuaCabangIni.data[i].count
          };
          tempPerbandinganLabaRugiSemuaCabang.push(objectLabaRugiSemuaCabang);
        }
      }
    }

    let tempDataBarChart = [
      ["Total Laba Rugi per Cabang", "Bulan Lalu", "Bulan Ini"]
    ];

    for (let i = 0; i < tempPerbandinganLabaRugiSemuaCabang.length; i++) {
      let tempTotalSuara = [
        `Cabang ${tempPerbandinganLabaRugiSemuaCabang[i].cabang}`,
        tempPerbandinganLabaRugiSemuaCabang[i].countLalu,
        tempPerbandinganLabaRugiSemuaCabang[i].count
      ];
      tempDataBarChart.push(tempTotalSuara);
    }
    setDataBarLabaRugiBulan(tempDataBarChart);
  };

  const getAngsuranForPenerimaanTotalSemuaCabang = async () => {
    let tempPerbandinganAngsuranTotalSemuaCabang = [];
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

    const angsuranTotalSemuaCabangLalu = await axios.post(
      `${tempUrl}/angsuransForPenerimaanTotalSemuaCabang`,
      {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token
      }
    );

    const angsuranTotalSemuaCabangIni = await axios.post(
      `${tempUrl}/angsuransForPenerimaanTotalSemuaCabang`,
      {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token
      }
    );

    for (let i = 0; i < angsuranTotalSemuaCabangLalu.data.length; i++) {
      for (let j = 0; j < angsuranTotalSemuaCabangIni.data.length; j++) {
        if (
          angsuranTotalSemuaCabangLalu.data[i].cabang ===
          angsuranTotalSemuaCabangIni.data[j].cabang
        ) {
          let objectAngsuranTotalSemuaCabang = {
            cabang: angsuranTotalSemuaCabangLalu.data[i].cabang,
            countLalu: angsuranTotalSemuaCabangLalu.data[j].count,
            count: angsuranTotalSemuaCabangIni.data[i].count
          };
          tempPerbandinganAngsuranTotalSemuaCabang.push(
            objectAngsuranTotalSemuaCabang
          );
        }
      }
    }

    let tempDataBarChart = [
      ["Total Penerimaan Angsuran per Cabang", "Bulan Lalu", "Bulan Ini"]
    ];

    for (let i = 0; i < tempPerbandinganAngsuranTotalSemuaCabang.length; i++) {
      let tempTotalSuara = [
        `Cabang ${tempPerbandinganAngsuranTotalSemuaCabang[i].cabang}`,
        tempPerbandinganAngsuranTotalSemuaCabang[i].countLalu,
        tempPerbandinganAngsuranTotalSemuaCabang[i].count
      ];
      tempDataBarChart.push(tempTotalSuara);
    }
    setDataBarAngsuranTotalBulan(tempDataBarChart);
  };

  const getAngsuranForPenerimaanBungaSemuaCabang = async () => {
    let tempPerbandinganAngsuranTotalSemuaCabang = [];
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

    const angsuranTotalSemuaCabangLalu = await axios.post(
      `${tempUrl}/angsuransForPenerimaanBungaSemuaCabang`,
      {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token
      }
    );

    const angsuranTotalSemuaCabangIni = await axios.post(
      `${tempUrl}/angsuransForPenerimaanBungaSemuaCabang`,
      {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token
      }
    );

    for (let i = 0; i < angsuranTotalSemuaCabangLalu.data.length; i++) {
      for (let j = 0; j < angsuranTotalSemuaCabangIni.data.length; j++) {
        if (
          angsuranTotalSemuaCabangLalu.data[i].cabang ===
          angsuranTotalSemuaCabangIni.data[j].cabang
        ) {
          let objectAngsuranTotalSemuaCabang = {
            cabang: angsuranTotalSemuaCabangLalu.data[i].cabang,
            countLalu: angsuranTotalSemuaCabangLalu.data[j].count,
            count: angsuranTotalSemuaCabangIni.data[i].count
          };
          tempPerbandinganAngsuranTotalSemuaCabang.push(
            objectAngsuranTotalSemuaCabang
          );
        }
      }
    }

    let tempDataBarChart = [
      ["Total Penerimaan Angsuran per Cabang", "Bulan Lalu", "Bulan Ini"]
    ];

    for (let i = 0; i < tempPerbandinganAngsuranTotalSemuaCabang.length; i++) {
      let tempTotalSuara = [
        `Cabang ${tempPerbandinganAngsuranTotalSemuaCabang[i].cabang}`,
        tempPerbandinganAngsuranTotalSemuaCabang[i].countLalu,
        tempPerbandinganAngsuranTotalSemuaCabang[i].count
      ];
      tempDataBarChart.push(tempTotalSuara);
    }
    setDataBarAngsuranBungaBulan(tempDataBarChart);
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

  const getLaporanPenjualanSemuaCabangBulanLalu = async () => {
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

    const jualSemuaCabang = await axios.post(
      `${tempUrl}/jualsForLaporanPerSemuaCabang`,
      {
        dariTgl,
        sampaiTgl,
        id: user._id,
        token: user.token
      }
    );
    let tempDataBarChart = [["Total Jual Per Cabang", "Total Penjualan"]];

    if (jualSemuaCabang.data.length > 0) {
      // Total Penjualan Exist
      for (let i = 0; i < jualSemuaCabang.data.length; i++) {
        let tempJualSemuaCabang = [
          `Cabang ${jualSemuaCabang.data[i].cabang}`,
          jualSemuaCabang.data[i].count
        ];
        tempDataBarChart.push(tempJualSemuaCabang);
      }
      setDataBarPenjualanBulanLalu(tempDataBarChart);
    } else {
      // Total Penjualan Not Exist
      const allCabang = await axios.post(`${tempUrl}/cabangs`, {
        id: user._id,
        token: user.token
      });
      for (let i = 0; i < allCabang.data.length; i++) {
        let tempJualSemuaCabang = [`Cabang ${allCabang.data[i]._id}`, 0];
        tempDataBarChart.push(tempJualSemuaCabang);
      }
      setDataBarPenjualanBulanLalu(tempDataBarChart);
    }
  };

  const getLaporanPenjualanSemuaCabangBulanIni = async () => {
    const jualSemuaCabang = await axios.post(
      `${tempUrl}/jualsForLaporanPerSemuaCabang`,
      {
        dariTgl: user.periode.periodeAwal,
        sampaiTgl: user.periode.periodeAkhir,
        id: user._id,
        token: user.token
      }
    );
    let tempDataBarChart = [["Total Jual Per Cabang", "Total Penjualan"]];

    if (jualSemuaCabang.data.length > 0) {
      // Total Penjualan Exist
      for (let i = 0; i < jualSemuaCabang.data.length; i++) {
        let tempJualSemuaCabang = [
          `Cabang ${jualSemuaCabang.data[i].cabang}`,
          jualSemuaCabang.data[i].count
        ];
        tempDataBarChart.push(tempJualSemuaCabang);
      }
      setDataBarPenjualanBulanIni(tempDataBarChart);
    } else {
      // Total Penjualan Not Exist
      const allCabang = await axios.post(`${tempUrl}/cabangs`, {
        id: user._id,
        token: user.token
      });
      for (let i = 0; i < allCabang.data.length; i++) {
        let tempJualSemuaCabang = [`Cabang ${allCabang.data[i]._id}`, 0];
        tempDataBarChart.push(tempJualSemuaCabang);
      }
      setDataBarPenjualanBulanIni(tempDataBarChart);
    }
  };

  const getLaporanAngsuranAktif = async () => {
    const angsuranAktif = await axios.post(`${tempUrl}/jualsForAngsuranAktif`, {
      id: user._id,
      token: user.token
    });
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
      const allCabang = await axios.post(`${tempUrl}/cabangs`, {
        id: user._id,
        token: user.token
      });
      for (let i = 0; i < allCabang.data.length; i++) {
        let tempAngsuranAktif = [`Cabang ${allCabang.data[i]._id}`, 0];
        tempDataBarChart.push(tempAngsuranAktif);
      }
      setDataBarAngsuranAktif(tempDataBarChart);
    }
  };

  const getLaporanJatuhTempo = async () => {
    const angsuranJatuhTempo = await axios.post(`${tempUrl}/jualsJatuhTempo`, {
      id: user._id,
      token: user.token
    });
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
      const allCabang = await axios.post(`${tempUrl}/cabangs`, {
        id: user._id,
        token: user.token
      });
      for (let i = 0; i < allCabang.data.length; i++) {
        let tempJatuhTempo = [`Cabang ${allCabang.data[i]._id}`, 0];
        tempDataBarChart.push(tempJatuhTempo);
      }
      setDataBarJatuhTempo(tempDataBarChart);
    }
  };

  return (
    <Box sx={container}>
      <Typography color="#757575">Dashboard Owner</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Dashboard Owner
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
          Perbandingan Laporan Penjualan Per Cabang
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
          Detail Laporan Penjualan Per Cabang
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

export default DashboardOwner;

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
