import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Box, Typography, Button, Divider } from "@mui/material";
import jsPDF from "jspdf";
import PrintIcon from "@mui/icons-material/Print";

const Neraca = () => {
  const { user, setting } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const downloadPdf = async () => {
    let neracas = await axios.post(`${tempUrl}/neracas`, {
      groupAktivaLancar: setting.groupAktivaLancar,
      groupAktivaTetap: setting.groupAktivaTetap,
      groupKewajibanHutang: setting.groupKewajibanHutang,
      groupModalSaham: setting.groupModalSaham,
      dariTgl: user.periode.periodeAwal,
      sampaiTgl: user.periode.periodeAkhir,
      id: user._id,
      token: user.token,
      kodeCabang: user.cabang._id
    });

    let hal = 1;
    let tempSampaiTgl = user.periode.periodeAkhir;

    let tempY = 5;
    let tempYStart;
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF("p", "mm", [240, 300]);
    doc.setFontSize(9);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      10,
      290
    );
    doc.text(
      `${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`,
      10,
      tempY
    );
    doc.text(`Hal: ${hal}`, 220, 5);
    tempY += 5;
    doc.text(`${setting.lokasiPerusahaan}`, 10, tempY);
    tempY += 5;
    doc.text(`${setting.lokasiSP}`, 10, tempY);
    tempY += 5;
    doc.text(`${setting.kotaPerusahaan}`, 10, tempY);
    tempY += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`NERACA`, 113, tempY);
    doc.setFontSize(9);
    tempY += 5;
    let dateParts = tempSampaiTgl.split("-");
    doc.text(`Per ${dateParts[2]} ${user.periode.namaPeriode}`, 105, tempY);
    doc.setFont(undefined, "normal");
    tempY += 5;
    tempYStart = tempY;
    doc.line(10, tempY, 230, tempY);

    let keys = Object.keys(neracas.data);

    for (let j = 0; j < Object.keys(keys).length; j++) {
      if (tempY > 270) {
        doc.addPage();
        tempY = tempYStart;
        hal++;
        doc.text(`Hal: ${hal}`, 220, 5);
        doc.text(
          `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
          10,
          290
        );
      }
      let tempTotalSaldo = 0;
      let tempSaldo;
      tempY += 8;
      doc.setFont(undefined, "bold");
      doc.text(`${neracas.data[keys[j]][0].jenisCOA} :`, 12, tempY);

      let groupByKodeGroupCOA = neracas.data[keys[j]].reduce(
        (group, neraca) => {
          const { namaGroupCOA } = neraca;
          group[namaGroupCOA] = group[namaGroupCOA] ?? [];
          group[namaGroupCOA].push(neraca);
          return group;
        },
        {}
      );

      let keysSubGroup = Object.keys(groupByKodeGroupCOA);

      for (let j = 0; j < Object.keys(keysSubGroup).length; j++) {
        if (tempY > 270) {
          doc.addPage();
          tempY = tempYStart;
          hal++;
          doc.text(`Hal: ${hal}`, 220, 5);
          doc.text(
            `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
            10,
            290
          );
        }
        tempSaldo = 0;
        tempY += 10;
        doc.setFont(undefined, "bold");
        doc.text(
          `${groupByKodeGroupCOA[keysSubGroup[j]][0].namaGroupCOA} :`,
          15,
          tempY
        );
        tempY += 2;

        doc.setFont(undefined, "normal");
        for (let k = 0; k < groupByKodeGroupCOA[keysSubGroup[j]].length; k++) {
          if (tempY > 270) {
            doc.addPage();
            tempY = tempYStart;
            hal++;
            doc.text(`Hal: ${hal}`, 220, 5);
            doc.text(
              `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
              10,
              290
            );
          }
          tempY += 5;
          doc.text(
            `${groupByKodeGroupCOA[keysSubGroup[j]][k].namaCOA}`,
            20,
            tempY
          );
          if (groupByKodeGroupCOA[keysSubGroup[j]][k].jumlah > 0) {
            // Positive
            doc.text(
              `${groupByKodeGroupCOA[keysSubGroup[j]][
                k
              ].jumlah.toLocaleString()}`,
              160,
              tempY,
              {
                align: "right"
              }
            );
          } else {
            // Negative
            doc.text(
              `(${groupByKodeGroupCOA[keysSubGroup[j]][k].jumlah
                .toLocaleString()
                .slice(1)})`,
              160,
              tempY,
              {
                align: "right"
              }
            );
          }
          tempSaldo += groupByKodeGroupCOA[keysSubGroup[j]][k].jumlah;
          tempY += 2;
        }
        tempTotalSaldo += tempSaldo;
        tempY += 1;
        doc.line(130, tempY, 160, tempY);
        tempY += 4;
        doc.setFont(undefined, "bold");
        doc.text(
          `SUBTOTAL ${groupByKodeGroupCOA[keysSubGroup[j]][0].namaGroupCOA} :`,
          15,
          tempY
        );
        if (tempSaldo > 0) {
          // Postive
          doc.text(`${tempSaldo.toLocaleString()}`, 160, tempY, {
            align: "right"
          });
        } else {
          // Negative
          doc.text(`(${tempSaldo.toLocaleString().slice(1)})`, 160, tempY, {
            align: "right"
          });
        }
        doc.setFont(undefined, "normal");
      }
      tempY += 4;
      tempY += 5;
      doc.setFont(undefined, "bold");
      doc.text(`TOTAL ${neracas.data[keys[j]][0].jenisCOA} :`, 12, tempY);
      if (tempTotalSaldo > 0) {
        // Positive
        doc.text(`${tempTotalSaldo.toLocaleString()}`, 225, tempY, {
          align: "right"
        });
      } else {
        // Negative
        doc.text(`(${tempTotalSaldo.toLocaleString().slice(1)})`, 225, tempY, {
          align: "right"
        });
      }
      tempY += 1;
      doc.line(190, tempY, 225, tempY);
      doc.setFont(undefined, "normal");
    }
    doc.save(`neraca.pdf`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Accounting</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Neraca
      </Typography>
      <Typography sx={subTitleText}>
        Periode : {user.periode.namaPeriode}
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => downloadPdf()}
        >
          CETAK
        </Button>
      </Box>
    </Box>
  );
};

export default Neraca;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
};

const spacingTop = {
  mt: 4
};
