function llenaCasilla() {
  var valor = PG1.value;
  document.getElementById('Pwh').value = valor;
};

function getData() {
  var data = {}

  var inputs = document.getElementsByTagName("input");
  console.log(inputs.length);

  for (index = 1; index < inputs.length; index++) {
    var id = inputs[index].id;
    var value = parseFloat(inputs[index].value);

    data[id] = value;
  };

  //Ecuación qmax - qb = ( J * Pb ) / 1.8
  data["qmax-qb"] = (data["J"] * data["Pb"]) / 1.8;

  //Gradiente de temperatura estatico
  data["Gtest"] = (data["Tyac"] - data["Tamb"]) / data["ProfG11"];

  //Gradiente de temperatura dinamico
  data["Gtdin"] = (data["Tyac"] - data["Twh"]) / data["ProfG11"];

  return data
};


let miCanvas = document.getElementById("MiGrafica").getContext("2d");

function showChart() {

  document.getElementById("resultados").style.display = "block";

  var data = getData();


  //PRIMER CICLO

  data["Profvi1"] = ((data["Pko"] - data["Pwh"] - data["dP"]) / (data["Gfm"] - data["Gg"]));

  if (data["Profvi1"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi1"]) > data["EspMin"]) {

      data["Profinicial1"] = 0;

      data["Po1"] = data["Pko"] - 50;

      data["Poprofemp1"] = data["Po1"] + data["Profemp"] * data["Gg"];

      data["Poid1"] = data["Po1"] + data["Profvi1"] * data["Gg"];

      data["Povi1"] = (data["Profvi1"] * (data["Profvi1"] * ((data["Profvi1"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

      //Determinacion de Presion de Fondo
      data["Pfondo1"] = data["Povi1"] + ((data["ProfG11"] - data["Profvi1"]) * data["Gfm"]);

      //Determinacion de tasa de liquido del yacimiento
      if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo1"] / data["Pb"])) - (0.8 * (data["Pfondo1"] / data["Pb"]) * (data["Pfondo1"] / data["Pb"])))) > 0) {

        data["qlyac1"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo1"] / data["Pb"])) - (0.8 * (data["Pfondo1"] / data["Pb"]) * (data["Pfondo1"] / data["Pb"])));

      } else {
        data["qlyac1"] = 0;
      };

      //Determinacion de Caudal de Produccion
      if (data["Pfondo1"] < data["Pws"]) {

        data["ql1"] = data["Qdesc"] + data["qlyac1"];

      } else {
        data["ql1"] = data["Qdesc"];
      }

      //Determinacion del Corte de Agua
      if (data["Pfondo1"] < data["Pws"]) {

        data["W1"] = (((data["Fwpozo"] * data["qlyac1"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac1"] + data["Qdesc"]));

      } else {
        data["W1"] = data["Fwfm"];
      }

      //Determinacion de la Relacion Gas-liquido

      data["A1"] = (25.81 + 13.92 * data["W1"]) * (Math.pow(data["IDtbg"], 2)) - 145;

      data["B1"] = 139.2 - (2.7766 + 7.4257 * data["W1"]) * (Math.pow(data["IDtbg"], 2));

      data["C1"] = ((1 - 0.3 * data["W1"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W1"] - 0.03 * data["W1"] * data["IDtbg"]) * data["Profvi1"] / 1000)

      data["D1"] = (data["C1"] * data["ql1"]) / 1000

      data["RGLmin1"] = (data["A1"] + (data["B1"] * data["Profvi1"] / 1000)) * ((Math.exp(2 * data["D1"]) + 1) / (Math.exp(2 * data["D1"]) - 1))

      //Determinacion de Caudal de gas Inyectado

      data["Qiny1"] = (data["RGLmin1"] * data["ql1"]) / 1000;

      //Temperaturas Estatica y Dinamica

      data["Test1"] = data["Tamb"] + (data["Gtest"] * data["Profvi1"]);

      data["Tdin1"] = data["Tyac"] - (data["ProfG11"] - data["Profvi1"]) * data["Gtdin"];

      //Temperatura de la valvula

      if (data["Pfondo1"] < data["Pws"]) {

        data["Tv1"] = ( data["Test1"] + data["Tdin1"] ) / 2;

      } else {

        data["Tv1"] = data["Test1"];

      };

      data["fila1"] = "<tr><th>" + 1 + "</th><td>" + data["Profvi1"].toFixed(2) + "</td><td>" + data["Povi1"].toFixed(2) + "</td><td>" + data["Poid1"].toFixed(2) + "</td><td>" + data["ql1"].toFixed(2) + "</td><td>" + data["W1"].toFixed(2) + "</td><td>" + data["Qiny1"].toFixed(2) + "</td><td>" + data["Tv1"].toFixed(2) + "</td>";

      data["Profvi2"] = (data["Profvi1"] + ((data["Poid1"] - data["Povi1"] - data["dP"]) / (data["Gfm"] - data["Gg"])));

    } else if (Math.abs(data["Profemp"] - data["Profvi1"]) < data["EspMin"]) {

      data["Profinicial1"] = 0;

      data["Po1"] = data["Pko"] - 50;

      data["Poprofemp1"] = data["Po1"] + data["Profemp"] * data["Gg"];

      data["Poid1"] = data["Po1"] + data["Profvi1"] * data["Gg"];

      data["Povi1"] = (data["Profvi1"] * (data["Profvi1"] * ((data["Profvi1"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

      data["Pfondo1"] = data["Povi1"] + ((data["ProfG11"] - data["Profvi1"]) * data["Gfm"]);

      //Determinacion de tasa de liquido del yacimiento
      if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo1"] / data["Pb"])) - (0.8 * (data["Pfondo1"] / data["Pb"]) * (data["Pfondo1"] / data["Pb"])))) > 0) {

        data["qlyac1"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo1"] / data["Pb"])) - (0.8 * (data["Pfondo1"] / data["Pb"]) * (data["Pfondo1"] / data["Pb"])));

      } else {
        data["qlyac1"] = 0;
      };

      //Determinacion de Caudal de produccion
      data["ql1"] = data["Qdise"];

      //Determinacion del Corte de Agua
      if (data["Pfondo1"] < data["Pws"]) {

        data["W1"] = (((data["Fwpozo"] * data["qlyac1"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac1"] + data["Qdesc"]));

      } else {
        data["W1"] = data["Fwfm"];
      };

      //Determinacion de Relacion Gas-liquido

      data["RGLmin1"] = data["RGLtotal"];

      //Determinacion de Caudal de gas Inyectado

      data["Qiny1"] = ((data["RGLmin1"] - data["RGLf"]) * data["ql1"]) / 1000;

      //Temperaturas Estatica y Dinamica

      data["Test1"] = data["Tamb"] + (data["Gtest"] * data["Profvi1"]);

      data["Tdin1"] = data["Tyac"] - (data["ProfG11"] - data["Profvi1"]) * data["Gtdin"];

      //Temperatura de la valvula

      if (data["Pfondo1"] < data["Pws"]) {

        data["Tv1"] = ( data["Test1"] + data["Tdin1"] ) / 2;

      } else {

        data["Tv1"] = data["Test1"];

      };

      data["fila1"] = "<tr><th>" + 1 + "</th><td>" + data["Profvi1"].toFixed(2) + "</td><td>" + data["Povi1"].toFixed(2) + "</td><td>" + data["Poid1"].toFixed(2) + "</td><td>" + data["ql1"].toFixed(2) + "</td><td>" + data["W1"].toFixed(2) + "</td><td>" + data["Qiny1"].toFixed(2) + "</td><td>" + data["Tv1"].toFixed(2) + "</td>";

    } else {
      data["fila1"] = " ";
    }
  } else {
    data["fila1"] = " ";
  };

  var grafGradGas1 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    label: "Gradiente de Gas Inyectado",
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po1"],
        y: 0
      },
      {
        x: data["Poprofemp1"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp1 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    label: "Gradiente del Fluido de Completación",
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Pwh"],
        y: data["Profinicial1"]
      },
      {
        x: data["Poid1"],
        y: data["Profvi1"]
      },
    ],
  };



  //SEGUNDO CICLO

  if (data["Profvi2"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi2"]) > data["EspMin"]) {

      if ((data["Profvi2"] - data["Profvi1"]) > data["EspMin"]) {

        if ((data["Poid1"] - data["Povi1"]) > 50) {

          data["Profinicial2"] = 0 + data["Profvi1"];

          data["Po2"] = data["Po1"] - data["dP"];

          data["Poprofemp2"] = data["Po2"] + data["Profemp"] * data["Gg"];

          data["Poid2"] = data["Po2"] + data["Profvi2"] * data["Gg"];

          data["Povi2"] = (data["Profvi2"] * (data["Profvi2"] * ((data["Profvi2"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo2"] = data["Povi2"] + ((data["ProfG11"] - data["Profvi2"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo2"] / data["Pb"])) - (0.8 * (data["Pfondo2"] / data["Pb"]) * (data["Pfondo2"] / data["Pb"])))) > 0) {

            data["qlyac2"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo2"] / data["Pb"])) - (0.8 * (data["Pfondo2"] / data["Pb"]) * (data["Pfondo2"] / data["Pb"])));

          } else {
            data["qlyac2"] = 0;
          };

          //Determinacion de Caudal de produccion
          if (data["Pfondo2"] < data["Pws"]) {

            data["ql2"] = data["Qdesc"] + data["qlyac2"];

          } else {
            data["ql2"] = data["Qdesc"];
          }

          //Determinacion del Corte de Agua
          if (data["Pfondo2"] < data["Pws"]) {

            data["W2"] = (((data["Fwpozo"] * data["qlyac2"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac2"] + data["Qdesc"]));

          } else {
            data["W2"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["A2"] = (25.81 + 13.92 * data["W2"]) * (Math.pow(data["IDtbg"], 2)) - 145;

          data["B2"] = 139.2 - (2.7766 + 7.4257 * data["W2"]) * (Math.pow(data["IDtbg"], 2));

          data["C2"] = ((1 - 0.3 * data["W2"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W2"] - 0.03 * data["W2"] * data["IDtbg"]) * data["Profvi2"] / 1000)

          data["D2"] = (data["C2"] * data["ql2"]) / 1000

          data["RGLmin2"] = (data["A2"] + (data["B2"] * data["Profvi2"] / 1000)) * ((Math.exp(2 * data["D2"]) + 1) / (Math.exp(2 * data["D2"]) - 1))

          //Determinacion de Caudal de gas Inyectado

          data["Qiny2"] = (data["RGLmin2"] * data["ql2"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test2"] = data["Tamb"] + (data["Gtest"] * data["Profvi2"]);

          data["Tdin2"] = data["Tyac"] - (data["ProfG11"] - data["Profvi2"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo2"] < data["Pws"]) {

            data["Tv2"] = ( data["Test2"] + data["Tdin2"] ) / 2;

          } else {

            data["Tv2"] = data["Test2"];

          }

          //Tabla 2 de Resultados
          data["fila2"] = "<tr><th>" + 2 + "</th><td>" + data["Profvi2"].toFixed(2) + "</td><td>" + data["Povi2"].toFixed(2) + "</td><td>" + data["Poid2"].toFixed(2) + "</td><td>" + data["ql2"].toFixed(2) + "</td><td>" + data["W2"].toFixed(2) + "</td><td>" + data["Qiny2"].toFixed(2) + "</td><td>" + data["Tv2"].toFixed(2) + "</td>";

          data["Profvi3"] = (data["Profvi2"] + ((data["Poid2"] - data["Povi2"] - data["dP"]) / (data["Gfm"] - data["Gg"])));


        } else {
          data["fila2"] = " ";
        }
      } else {
        data["fila2"] = " ";
      }
    } else if (Math.abs(data["Profemp"] - data["Profvi2"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi2"] - data["Profvi1"]) > data["EspMin"]) {

        if ((data["Poid1"] - data["Povi1"]) > 50) {

          data["Profinicial2"] = 0 + data["Profvi1"];

          data["Po2"] = data["Po1"] - data["dP"];

          data["Poprofemp2"] = data["Po2"] + data["Profemp"] * data["Gg"];

          data["Poid2"] = data["Po2"] + data["Profvi2"] * data["Gg"];

          data["Povi2"] = (data["Profvi2"] * (data["Profvi2"] * ((data["Profvi2"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo2"] = data["Povi2"] + ((data["ProfG11"] - data["Profvi2"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo2"] / data["Pb"])) - (0.8 * (data["Pfondo2"] / data["Pb"]) * (data["Pfondo2"] / data["Pb"])))) > 0) {

            data["qlyac2"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo2"] / data["Pb"])) - (0.8 * (data["Pfondo2"] / data["Pb"]) * (data["Pfondo2"] / data["Pb"])));

          } else {
            data["qlyac2"] = 0;
          };

          //Determinacion de Caudal de Produccion
          data["ql2"] = data["Qdise"];

          //Determinacion del Corte de Agua
          if (data["Pfondo2"] < data["Pws"]) {

            data["W2"] = (((data["Fwpozo"] * data["qlyac2"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac2"] + data["Qdesc"]));

          } else {
            data["W2"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["RGLmin2"] = data["RGLtotal"];

          //Determinacion de Caudal de gas Inyectado

          data["Qiny2"] = ((data["RGLmin2"] - data["RGLf"]) * data["ql2"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test2"] = data["Tamb"] + (data["Gtest"] * data["Profvi2"]);

          data["Tdin2"] = data["Tyac"] - (data["ProfG11"] - data["Profvi2"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo2"] < data["Pws"]) {

            data["Tv2"] = ( data["Test2"] + data["Tdin2"] ) / 2;

          } else {

            data["Tv2"] = data["Test2"];

          };

          //Tabla 2 de Resultados
          data["fila2"] = "<tr><th>" + 2 + "</th><td>" + data["Profvi2"].toFixed(2) + "</td><td>" + data["Povi2"].toFixed(2) + "</td><td>" + data["Poid2"].toFixed(2) + "</td><td>" + data["ql2"].toFixed(2) + "</td><td>" + data["W2"].toFixed(2) + "</td><td>" + data["Qiny2"].toFixed(2) + "</td><td>" + data["Tv2"].toFixed(2) + "</td>";

        } else {
          data["fila2"] = " ";
        }
      } else {
        data["fila2"] = " ";
      }
    } else {
      data["fila2"] = " ";
    }
  } else {
    data["fila2"] = " ";
  };

  var grafGradGas2 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po2"],
        y: 0
      },
      {
        x: data["Poprofemp2"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp2 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Povi1"],
        y: data["Profinicial2"]
      },
      {
        x: data["Poid2"],
        y: data["Profvi2"]
      },
    ],
  };

  //TERCER CICLO

  if (data["Profvi3"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi3"]) > data["EspMin"]) {

      if ((data["Profvi3"] - data["Profvi2"]) > data["EspMin"]) {

        if ((data["Poid2"] - data["Povi2"]) > 50) {

          data["Profinicial3"] = 0 + data["Profvi2"];

          data["Po3"] = data["Po2"] - data["dP"];

          data["Poprofemp3"] = data["Po3"] + data["Profemp"] * data["Gg"];

          data["Poid3"] = data["Po3"] + data["Profvi3"] * data["Gg"];

          data["Povi3"] = (data["Profvi3"] * (data["Profvi3"] * ((data["Profvi3"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo3"] = data["Povi3"] + ((data["ProfG11"] - data["Profvi3"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo3"] / data["Pb"])) - (0.8 * (data["Pfondo3"] / data["Pb"]) * (data["Pfondo3"] / data["Pb"])))) > 0) {

            data["qlyac3"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo3"] / data["Pb"])) - (0.8 * (data["Pfondo3"] / data["Pb"]) * (data["Pfondo3"] / data["Pb"])));

          } else {
            data["qlyac3"] = 0;
          };

          //Determinacion de Caudal de produccion
          if (data["Pfondo3"] < data["Pws"]) {

            data["ql3"] = data["Qdesc"] + data["qlyac3"];

          } else {
            data["ql3"] = data["Qdesc"];
          }

          //Determinacion del Corte de Agua
          if (data["Pfondo3"] < data["Pws"]) {

            data["W3"] = (((data["Fwpozo"] * data["qlyac3"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac3"] + data["Qdesc"]));

          } else {
            data["W3"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["A3"] = (25.81 + 13.92 * data["W3"]) * (Math.pow(data["IDtbg"], 2)) - 145;

          data["B3"] = 139.2 - (2.7766 + 7.4257 * data["W3"]) * (Math.pow(data["IDtbg"], 2));

          data["C3"] = ((1 - 0.3 * data["W3"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W3"] - 0.03 * data["W3"] * data["IDtbg"]) * data["Profvi3"] / 1000)

          data["D3"] = (data["C3"] * data["ql3"]) / 1000

          data["RGLmin3"] = (data["A3"] + (data["B3"] * data["Profvi3"] / 1000)) * ((Math.exp(2 * data["D3"]) + 1) / (Math.exp(2 * data["D3"]) - 1))

          //Determinacion de Caudal de gas Inyectado

          data["Qiny3"] = (data["RGLmin3"] * data["ql3"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test3"] = data["Tamb"] + (data["Gtest"] * data["Profvi3"]);

          data["Tdin3"] = data["Tyac"] - (data["ProfG11"] - data["Profvi3"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo3"] < data["Pws"]) {

            data["Tv3"] = ( data["Test3"] + data["Tdin3"] ) / 2;

          } else {

            data["Tv3"] = data["Test3"];

          }

          //Tabla 2 de Resultados
          data["fila3"] = "<tr><th>" + 3 + "</th><td>" + data["Profvi3"].toFixed(2) + "</td><td>" + data["Povi3"].toFixed(2) + "</td><td>" + data["Poid3"].toFixed(2) + "</td><td>" + data["ql3"].toFixed(2) + "</td><td>" + data["W3"].toFixed(2) + "</td><td>" + data["Qiny3"].toFixed(2) + "</td><td>" + data["Tv3"].toFixed(2) + "</td>";

          data["Profvi4"] = (data["Profvi3"] + ((data["Poid3"] - data["Povi3"] - data["dP"]) / (data["Gfm"] - data["Gg"])));

        } else {
          data["fila3"] = " ";
        }
      } else {
        data["fila3"] = " ";
      }
    } else if (Math.abs(data["Profemp"] - data["Profvi3"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi3"] - data["Profvi2"]) > data["EspMin"]) {

        if ((data["Poid2"] - data["Povi2"]) > 50) {

          data["Profinicial3"] = 0 + data["Profvi2"];

          data["Po3"] = data["Po2"] - data["dP"];

          data["Poprofemp3"] = data["Po3"] + data["Profemp"] * data["Gg"];

          data["Poid3"] = data["Po3"] + data["Profvi3"] * data["Gg"];

          data["Povi3"] = (data["Profvi3"] * (data["Profvi3"] * ((data["Profvi3"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo3"] = data["Povi3"] + ((data["ProfG11"] - data["Profvi3"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo3"] / data["Pb"])) - (0.8 * (data["Pfondo3"] / data["Pb"]) * (data["Pfondo3"] / data["Pb"])))) > 0) {

            data["qlyac3"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo3"] / data["Pb"])) - (0.8 * (data["Pfondo3"] / data["Pb"]) * (data["Pfondo3"] / data["Pb"])));

          } else {
            data["qlyac3"] = 0;
          };

          //Determinacion de Caudal de produccion

          data["ql3"] = data["Qdise"];

          //Determinacion del Corte de Agua
          if (data["Pfondo3"] < data["Pws"]) {

            data["W3"] = (((data["Fwpozo"] * data["qlyac3"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac3"] + data["Qdesc"]));

          } else {
            data["W3"] = data["Fwfm"];
          };

          //Determinacion de la Relacion Gas-liquido

          data["RGLmin3"] = (data["RGLtotal"]);

          //Determinacion de Caudal de gas Inyectado

          data["Qiny3"] = ((data["RGLmin3"] - data["RGLf"]) * data["ql3"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test3"] = data["Tamb"] + (data["Gtest"] * data["Profvi3"]);

          data["Tdin3"] = data["Tyac"] - (data["ProfG11"] - data["Profvi3"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo3"] < data["Pws"]) {

            data["Tv3"] = ( data["Test3"] + data["Tdin3"] ) / 2;

          } else {

            data["Tv3"] = data["Test3"];

          }

          //Tabla 2 de Resultados
          data["fila3"] = "<tr><th>" + 3 + "</th><td>" + data["Profvi3"].toFixed(2) + "</td><td>" + data["Povi3"].toFixed(2) + "</td><td>" + data["Poid3"].toFixed(2) + "</td><td>" + data["ql3"].toFixed(2) + "</td><td>" + data["W3"].toFixed(2) + "</td><td>" + data["Qiny3"].toFixed(2) + "</td><td>" + data["Tv3"].toFixed(2) + "</td>";

        } else {
          data["fila3"] = " ";
        }
      } else {
        data["fila3"] = " ";
      }
    } else {
      data["fila3"] = " ";
    }
  } else {
    data["fila3"] = " ";
  };

  var grafGradGas3 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po3"],
        y: 0
      },
      {
        x: data["Poprofemp3"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp3 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Povi2"],
        y: data["Profinicial3"]
      },
      {
        x: data["Poid3"],
        y: data["Profvi3"]
      },
    ],
  };

  //CUARTO CICLO

  if (data["Profvi4"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi4"]) > data["EspMin"]) {

      if ((data["Profvi4"] - data["Profvi3"]) > data["EspMin"]) {

        if ((data["Poid3"] - data["Povi3"]) > 50) {

          data["Profinicial4"] = 0 + data["Profvi3"];

          data["Po4"] = data["Po3"] - data["dP"];

          data["Poprofemp4"] = data["Po4"] + data["Profemp"] * data["Gg"];

          data["Poid4"] = data["Po4"] + data["Profvi4"] * data["Gg"];

          data["Povi4"] = (data["Profvi4"] * (data["Profvi4"] * ((data["Profvi4"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo4"] = data["Povi4"] + ((data["ProfG11"] - data["Profvi4"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo4"] / data["Pb"])) - (0.8 * (data["Pfondo4"] / data["Pb"]) * (data["Pfondo4"] / data["Pb"])))) > 0) {

            data["qlyac4"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo4"] / data["Pb"])) - (0.8 * (data["Pfondo4"] / data["Pb"]) * (data["Pfondo4"] / data["Pb"])));

          } else {
            data["qlyac4"] = 0;
          };

          //Determinacion de Caudal de produccion
          if (data["Pfondo4"] < data["Pws"]) {

            data["ql4"] = data["Qdesc"] + data["qlyac4"];

          } else {
            data["ql4"] = data["Qdesc"];
          }

          //Determinacion del Corte de Agua
          if (data["Pfondo4"] < data["Pws"]) {

            data["W4"] = (((data["Fwpozo"] * data["qlyac4"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac4"] + data["Qdesc"]));

          } else {
            data["W4"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["A4"] = (25.81 + 13.92 * data["W4"]) * (Math.pow(data["IDtbg"], 2)) - 145;

          data["B4"] = 139.2 - (2.7766 + 7.4257 * data["W4"]) * (Math.pow(data["IDtbg"], 2));

          data["C4"] = ((1 - 0.3 * data["W4"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W4"] - 0.03 * data["W4"] * data["IDtbg"]) * data["Profvi4"] / 1000)

          data["D4"] = (data["C4"] * data["ql4"]) / 1000

          data["RGLmin4"] = (data["A4"] + (data["B4"] * data["Profvi4"] / 1000)) * ((Math.exp(2 * data["D4"]) + 1) / (Math.exp(2 * data["D4"]) - 1))

          //Determinacion de Caudal de gas Inyectado

          data["Qiny4"] = (data["RGLmin4"] * data["ql4"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test4"] = data["Tamb"] + (data["Gtest"] * data["Profvi4"]);

          data["Tdin4"] = data["Tyac"] - (data["ProfG11"] - data["Profvi4"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo4"] < data["Pws"]) {

            data["Tv4"] = ( data["Test4"] + data["Tdin4"] ) / 2;

          } else {

            data["Tv4"] = data["Test4"];

          }

          //Tabla 2 de Resultados
          data["fila4"] = "<tr><th>" + 4 + "</th><td>" + data["Profvi4"].toFixed(2) + "</td><td>" + data["Povi4"].toFixed(2) + "</td><td>" + data["Poid4"].toFixed(2) + "</td><td>" + data["ql4"].toFixed(2) + "</td><td>" + data["W4"].toFixed(2) + "</td><td>" + data["Qiny4"].toFixed(2) + "</td><td>" + data["Tv4"].toFixed(2) + "</td>";

          data["Profvi5"] = (data["Profvi4"] + ((data["Poid4"] - data["Povi4"] - data["dP"]) / (data["Gfm"] - data["Gg"])));

        } else {
          data["fila4"] = " ";
        }
      } else {
        data["fila4"] = " ";
      }
    } else if (Math.abs(data["Profemp"] - data["Profvi4"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi4"] - data["Profvi3"]) > data["EspMin"]) {

        if ((data["Poid3"] - data["Povi3"]) > 50) {

          data["Profinicial4"] = 0 + data["Profvi3"];

          data["Po4"] = data["Po3"] - data["dP"];

          data["Poprofemp4"] = data["Po4"] + data["Profemp"] * data["Gg"];

          data["Poid4"] = data["Po4"] + data["Profvi4"] * data["Gg"];

          data["Povi4"] = (data["Profvi4"] * (data["Profvi4"] * ((data["Profvi4"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo4"] = data["Povi4"] + ((data["ProfG11"] - data["Profvi4"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo4"] / data["Pb"])) - (0.8 * (data["Pfondo4"] / data["Pb"]) * (data["Pfondo4"] / data["Pb"])))) > 0) {

            data["qlyac4"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo4"] / data["Pb"])) - (0.8 * (data["Pfondo4"] / data["Pb"]) * (data["Pfondo4"] / data["Pb"])));

          } else {
            data["qlyac4"] = 0;
          };

          //Determinacion de Caudal de produccion

          data["ql4"] = data["Qdise"];

          //Determinacion del Corte de Agua
          if (data["Pfondo4"] < data["Pws"]) {

            data["W4"] = (((data["Fwpozo"] * data["qlyac4"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac4"] + data["Qdesc"]));

          } else {
            data["W4"] = data["Fwfm"];
          };

          //Determinacion de la Relacion Gas-liquido

          data["RGLmin4"] = (data["RGLtotal"]);

          //Determinacion de Caudal de gas Inyectado

          data["Qiny4"] = ((data["RGLmin4"] - data["RGLf"]) * data["ql4"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test4"] = data["Tamb"] + (data["Gtest"] * data["Profvi4"]);

          data["Tdin4"] = data["Tyac"] - (data["ProfG11"] - data["Profvi4"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo4"] < data["Pws"]) {

            data["Tv4"] = ( data["Test4"] + data["Tdin4"] ) / 2;

          } else {

            data["Tv4"] = data["Test4"];

          }

          //Tabla 2 de Resultados
          data["fila4"] = "<tr><th>" + 4 + "</th><td>" + data["Profvi4"].toFixed(2) + "</td><td>" + data["Povi4"].toFixed(2) + "</td><td>" + data["Poid4"].toFixed(2) + "</td><td>" + data["ql4"].toFixed(2) + "</td><td>" + data["W4"].toFixed(2) + "</td><td>" + data["Qiny4"].toFixed(2) + "</td><td>" + data["Tv4"].toFixed(2) + "</td>";
        } else {
          data["fila4"] = " ";
        }
      } else {
        data["fila4"] = " ";
      }
    } else {
      data["fila4"] = " ";
    }
  } else {
    data["fila4"] = " ";
  };

  var grafGradGas4 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po4"],
        y: 0
      },
      {
        x: data["Poprofemp4"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp4 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Povi3"],
        y: data["Profinicial4"]
      },
      {
        x: data["Poid4"],
        y: data["Profvi4"]
      },
    ],
  };


  //QUINTO CICLO

  if (data["Profvi5"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi5"]) > data["EspMin"]) {

      if ((data["Profvi5"] - data["Profvi4"]) > data["EspMin"]) {

        if ((data["Poid4"] - data["Povi4"]) > 50) {

          data["Profinicial5"] = 0 + data["Profvi4"];

          data["Po5"] = data["Po4"] - data["dP"];

          data["Poprofemp5"] = data["Po5"] + data["Profemp"] * data["Gg"];

          data["Poid5"] = data["Po5"] + data["Profvi5"] * data["Gg"];

          data["Povi5"] = (data["Profvi5"] * (data["Profvi5"] * ((data["Profvi5"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo5"] = data["Povi5"] + ((data["ProfG11"] - data["Profvi5"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo5"] / data["Pb"])) - (0.8 * (data["Pfondo5"] / data["Pb"]) * (data["Pfondo5"] / data["Pb"])))) > 0) {

            data["qlyac5"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo5"] / data["Pb"])) - (0.8 * (data["Pfondo5"] / data["Pb"]) * (data["Pfondo5"] / data["Pb"])));

          } else {
            data["qlyac5"] = 0;
          };

          //Determinacion de Caudal de produccion
          if (data["Pfondo5"] < data["Pws"]) {

            data["ql5"] = data["Qdesc"] + data["qlyac5"];

          } else {
            data["ql5"] = data["Qdesc"];
          }

          //Determinacion del Corte de Agua
          if (data["Pfondo5"] < data["Pws"]) {

            data["W5"] = (((data["Fwpozo"] * data["qlyac5"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac5"] + data["Qdesc"]));

          } else {
            data["W5"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["A5"] = (25.81 + 13.92 * data["W5"]) * (Math.pow(data["IDtbg"], 2)) - 145;

          data["B5"] = 139.2 - (2.7766 + 7.4257 * data["W5"]) * (Math.pow(data["IDtbg"], 2));

          data["C5"] = ((1 - 0.3 * data["W5"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W5"] - 0.03 * data["W5"] * data["IDtbg"]) * data["Profvi5"] / 1000)

          data["D5"] = (data["C5"] * data["ql5"]) / 1000

          data["RGLmin5"] = (data["A5"] + (data["B5"] * data["Profvi5"] / 1000)) * ((Math.exp(2 * data["D5"]) + 1) / (Math.exp(2 * data["D5"]) - 1))

          //Determinacion de Caudal de gas Inyectado

          data["Qiny5"] = (data["RGLmin5"] * data["ql5"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test5"] = data["Tamb"] + (data["Gtest"] * data["Profvi5"]);

          data["Tdin5"] = data["Tyac"] - (data["ProfG11"] - data["Profvi5"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo5"] < data["Pws"]) {

            data["Tv5"] = ( data["Test5"] + data["Tdin5"] ) / 2;

          } else {

            data["Tv5"] = data["Test5"];

          }

          //Tabla 2 de Resultados
          data["fila5"] = "<tr><th>" + 5 + "</th><td>" + data["Profvi5"].toFixed(2) + "</td><td>" + data["Povi5"].toFixed(2) + "</td><td>" + data["Poid5"].toFixed(2) + "</td><td>" + data["ql5"].toFixed(2) + "</td><td>" + data["W5"].toFixed(2) + "</td><td>" + data["Qiny5"].toFixed(2) + "</td><td>" + data["Tv5"].toFixed(2) + "</td>";

          data["Profvi6"] = (data["Profvi5"] + ((data["Poid5"] - data["Povi5"] - data["dP"]) / (data["Gfm"] - data["Gg"])));


        } else {
          data["fila5"] = " ";
        }

      } else {
        data["fila5"] = " ";
      }

    } else if (Math.abs(data["Profemp"] - data["Profvi5"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi5"] - data["Profvi4"]) > data["EspMin"]) {

        if ((data["Poid4"] - data["Povi4"]) > 50) {

          data["Profinicial5"] = 0 + data["Profvi4"];

          data["Po5"] = data["Po4"] - data["dP"];

          data["Poprofemp5"] = data["Po5"] + data["Profemp"] * data["Gg"];

          data["Poid5"] = data["Po5"] + data["Profvi5"] * data["Gg"];

          data["Povi5"] = (data["Profvi5"] * (data["Profvi5"] * ((data["Profvi5"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo5"] = data["Povi5"] + ((data["ProfG11"] - data["Profvi5"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo5"] / data["Pb"])) - (0.8 * (data["Pfondo5"] / data["Pb"]) * (data["Pfondo5"] / data["Pb"])))) > 0) {

            data["qlyac5"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo5"] / data["Pb"])) - (0.8 * (data["Pfondo5"] / data["Pb"]) * (data["Pfondo5"] / data["Pb"])));

          } else {
            data["qlyac5"] = 0;
          };

          //Determinacion de Caudal de produccion

          data["ql5"] = data["Qdise"];

          //Determinacion del Corte de Agua
          if (data["Pfondo5"] < data["Pws"]) {

            data["W5"] = (((data["Fwpozo"] * data["qlyac5"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac5"] + data["Qdesc"]));

          } else {
            data["W5"] = data["Fwfm"];
          };

          //Determinacion de la Relacion Gas-liquido

          data["RGLmin5"] = (data["RGLtotal"]);

          //Determinacion de Caudal de gas Inyectado

          data["Qiny5"] = ((data["RGLmin5"] - data["RGLf"]) * data["ql5"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test5"] = data["Tamb"] + (data["Gtest"] * data["Profvi5"]);

          data["Tdin5"] = data["Tyac"] - (data["ProfG11"] - data["Profvi5"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo5"] < data["Pws"]) {

            data["Tv5"] = ( data["Test5"] + data["Tdin5"] ) / 2;

          } else {

            data["Tv5"] = data["Test5"];

          }

          //Tabla 2 de Resultados
          data["fila5"] = "<tr><th>5(Opcional)</th><td>" + data["Profvi5"].toFixed(2) + "</td><td>" + data["Povi5"].toFixed(2) + "</td><td>" + data["Poid5"].toFixed(2) + "</td><td>" + data["ql5"].toFixed(2) + "</td><td>" + data["W5"].toFixed(2) + "</td><td>" + data["Qiny5"].toFixed(2) + "</td>td>" + data["Tv5"].toFixed(2) + "</td>";
        } else {
          data["fila5"] = " ";
        }
      } else {
        data["fila5"] = " ";
      }
    } else {
      data["fila5"] = " ";
    }
  } else {
    data["fila5"] = " ";
  };


  var grafGradGas5 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po5"],
        y: 0
      },
      {
        x: data["Poprofemp5"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp5 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Povi4"],
        y: data["Profinicial5"]
      },
      {
        x: data["Poid5"],
        y: data["Profvi5"]
      },
    ],
  };


  //SEXTO CICLO

  if (data["Profvi6"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi6"]) > data["EspMin"]) {

      if ((data["Profvi6"] - data["Profvi5"]) > data["EspMin"]) {

        if ((data["Poid5"] - data["Povi5"]) > 50) {

          data["Profinicial6"] = 0 + data["Profvi5"];

          data["Po6"] = data["Po5"] - data["dP"];

          data["Poprofemp6"] = data["Po6"] + data["Profemp"] * data["Gg"];

          data["Poid6"] = data["Po6"] + data["Profvi6"] * data["Gg"];

          data["Povi6"] = (data["Profvi6"] * (data["Profvi6"] * ((data["Profvi6"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo6"] = data["Povi6"] + ((data["ProfG11"] - data["Profvi6"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo6"] / data["Pb"])) - (0.8 * (data["Pfondo6"] / data["Pb"]) * (data["Pfondo6"] / data["Pb"])))) > 0) {

            data["qlyac6"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo6"] / data["Pb"])) - (0.8 * (data["Pfondo6"] / data["Pb"]) * (data["Pfondo6"] / data["Pb"])));

          } else {
            data["qlyac6"] = 0;
          };

          //Determinacion de Caudal de produccion
          if (data["Pfondo6"] < data["Pws"]) {

            data["ql6"] = data["Qdesc"] + data["qlyac6"];

          } else {
            data["ql6"] = data["Qdesc"];
          }

          //Determinacion del Corte de Agua
          if (data["Pfondo6"] < data["Pws"]) {

            data["W6"] = (((data["Fwpozo"] * data["qlyac6"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac6"] + data["Qdesc"]));

          } else {
            data["W6"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["A6"] = (25.81 + 13.92 * data["W6"]) * (Math.pow(data["IDtbg"], 2)) - 145;

          data["B6"] = 139.2 - (2.7766 + 7.4257 * data["W6"]) * (Math.pow(data["IDtbg"], 2));

          data["C6"] = ((1 - 0.3 * data["W6"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W6"] - 0.03 * data["W5"] * data["IDtbg"]) * data["Profvi6"] / 1000)

          data["D6"] = (data["C6"] * data["ql6"]) / 1000

          data["RGLmin6"] = (data["A6"] + (data["B6"] * data["Profvi6"] / 1000)) * ((Math.exp(2 * data["D6"]) + 1) / (Math.exp(2 * data["D6"]) - 1))

          //Determinacion de Caudal de gas Inyectado

          data["Qiny6"] = (data["RGLmin6"] * data["ql6"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test6"] = data["Tamb"] + (data["Gtest"] * data["Profvi6"]);

          data["Tdin6"] = data["Tyac"] - (data["ProfG11"] - data["Profvi6"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo6"] < data["Pws"]) {

            data["Tv6"] = ( data["Test6"] + data["Tdin6"] ) / 2;

          } else {

            data["Tv6"] = data["Test6"];

          }

          //Tabla 2 de Resultados
          data["fila6"] = "<tr><th>" + 6 + "</th><td>" + data["Profvi6"].toFixed(2) + "</td><td>" + data["Povi6"].toFixed(2) + "</td><td>" + data["Poid6"].toFixed(2) + "</td><td>" + data["ql6"].toFixed(2) + "</td><td>" + data["W6"].toFixed(2) + "</td><td>" + data["Qiny6"].toFixed(2) + "</td><td>" + data["Tv6"].toFixed(2) + "</td>";

          data["Profvi7"] = (data["Profvi6"] + ((data["Poid6"] - data["Povi6"] - data["dP"]) / (data["Gfm"] - data["Gg"])));

        } else {
          data["fila6"] = " ";
        }

      } else {
        data["fila6"] = " ";
      }

    } else if (Math.abs(data["Profemp"] - data["Profvi6"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi6"] - data["Profvi5"]) > data["EspMin"]) {

        if ((data["Poid5"] - data["Povi5"]) > 50) {

          data["Profinicial6"] = 0 + data["Profvi5"];

          data["Po6"] = data["Po5"] - data["dP"];

          data["Poprofemp6"] = data["Po6"] + data["Profemp"] * data["Gg"];

          data["Poid6"] = data["Po6"] + data["Profvi6"] * data["Gg"];

          data["Povi6"] = (data["Profvi6"] * (data["Profvi6"] * ((data["Profvi6"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo6"] = data["Povi6"] + ((data["ProfG11"] - data["Profvi6"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo6"] / data["Pb"])) - (0.8 * (data["Pfondo6"] / data["Pb"]) * (data["Pfondo6"] / data["Pb"])))) > 0) {

            data["qlyac6"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo6"] / data["Pb"])) - (0.8 * (data["Pfondo6"] / data["Pb"]) * (data["Pfondo6"] / data["Pb"])));

          } else {
            data["qlyac6"] = 0;
          };

          //Determinacion de Caudal de produccion

          data["ql6"] = data["Qdise"];

          //Determinacion del Corte de Agua
          if (data["Pfondo6"] < data["Pws"]) {

            data["W6"] = (((data["Fwpozo"] * data["qlyac6"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac6"] + data["Qdesc"]));

          } else {
            data["W6"] = data["Fwfm"];
          };

          //Determinacion de la Relacion Gas-liquido

          data["RGLmin6"] = (data["RGLtotal"]);

          //Determinacion de Caudal de gas Inyectado

          data["Qiny6"] = ((data["RGLmin6"] - data["RGLf"]) * data["ql6"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test6"] = data["Tamb"] + (data["Gtest"] * data["Profvi6"]);

          data["Tdin6"] = data["Tyac"] - (data["ProfG11"] - data["Profvi6"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo6"] < data["Pws"]) {

            data["Tv6"] = ( data["Test6"] + data["Tdin6"] ) / 2;

          } else {

            data["Tv6"] = data["Test6"];

          }

          //Tabla 2 de Resultados
          data["fila6"] = "<tr><th>" + 6 + "</th><td>" + data["Profvi6"].toFixed(2) + "</td><td>" + data["Povi6"].toFixed(2) + "</td><td>" + data["Poid6"].toFixed(2) + "</td><td>" + data["ql6"].toFixed(2) + "</td><td>" + data["W6"].toFixed(2) + "</td><td>" + data["Qiny6"].toFixed(2) + "</td><td>" + data["Tv6"].toFixed(2) + "</td>";

        } else {
          data["fila6"] = " ";
        }

      } else {
        data["fila6"] = " ";
      }
    } else {
      data["fila6"] = " ";
    }
  } else {
    data["fila6"] = " ";
  }

  var grafGradGas6 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po6"],
        y: 0
      },
      {
        x: data["Poprofemp6"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp6 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Povi5"],
        y: data["Profinicial6"]
      },
      {
        x: data["Poid6"],
        y: data["Profvi6"]
      },
    ],
  };

  //SEPTIMO CICLO

  if (data["Profvi7"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi7"]) > data["EspMin"]) {

      if ((data["Profvi7"] - data["Profvi6"]) > data["EspMin"]) {

        if ((data["Poid6"] - data["Povi6"]) > 50) {

          data["Profinicial7"] = 0 + data["Profvi6"];

          data["Po7"] = data["Po6"] - data["dP"];

          data["Poprofemp7"] = data["Po7"] + data["Profemp"] * data["Gg"];

          data["Poid7"] = data["Po7"] + data["Profvi7"] * data["Gg"];

          data["Povi7"] = (data["Profvi7"] * (data["Profvi7"] * ((data["Profvi7"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo7"] = data["Povi7"] + ((data["ProfG11"] - data["Profvi7"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo7"] / data["Pb"])) - (0.8 * (data["Pfondo7"] / data["Pb"]) * (data["Pfondo7"] / data["Pb"])))) > 0) {

            data["qlyac7"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo7"] / data["Pb"])) - (0.8 * (data["Pfondo7"] / data["Pb"]) * (data["Pfondo7"] / data["Pb"])));

          } else {
            data["qlyac7"] = 0;
          };

          //Determinacion de Caudal de produccion
          if (data["Pfondo7"] < data["Pws"]) {

            data["ql7"] = data["Qdesc"] + data["qlyac7"];

          } else {
            data["ql7"] = data["Qdesc"];
          }

          //Determinacion del Corte de Agua
          if (data["Pfondo7"] < data["Pws"]) {

            data["W7"] = (((data["Fwpozo"] * data["qlyac7"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac7"] + data["Qdesc"]));

          } else {
            data["W7"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["A7"] = (25.81 + 13.92 * data["W7"]) * (Math.pow(data["IDtbg"], 2)) - 145;

          data["B7"] = 139.2 - (2.7766 + 7.4257 * data["W7"]) * (Math.pow(data["IDtbg"], 2));

          data["C7"] = ((1 - 0.3 * data["W7"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W7"] - 0.03 * data["W7"] * data["IDtbg"]) * data["Profvi7"] / 1000)

          data["D7"] = (data["C7"] * data["ql7"]) / 1000

          data["RGLmin7"] = (data["A7"] + (data["B7"] * data["Profvi7"] / 1000)) * ((Math.exp(2 * data["D7"]) + 1) / (Math.exp(2 * data["D7"]) - 1))

          //Determinacion de Caudal de gas Inyectado

          data["Qiny7"] = (data["RGLmin7"] * data["ql7"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test7"] = data["Tamb"] + (data["Gtest"] * data["Profvi7"]);

          data["Tdin7"] = data["Tyac"] - (data["ProfG11"] - data["Profvi7"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo7"] < data["Pws"]) {

            data["Tv7"] = ( data["Test7"] + data["Tdin7"] ) / 2;

          } else {

            data["Tv7"] = data["Test7"];

          };

          //Tabla 2 de Resultados
          data["fila7"] = "<tr><th>" + 7 + "</th><td>" + data["Profvi7"].toFixed(2) + "</td><td>" + data["Povi7"].toFixed(2) + "</td><td>" + data["Poid7"].toFixed(2) + "</td><td>" + data["ql7"].toFixed(2) + "</td><td>" + data["W7"].toFixed(2) + "</td><td>" + data["Qiny7"].toFixed(2) + "</td><td>" + data["Tv7"].toFixed(2) + "</td>";

          data["Profvi8"] = (data["Profvi7"] + ((data["Poid7"] - data["Povi7"] - data["dP"]) / (data["Gfm"] - data["Gg"])));

        } else {
          data["fila7"] = " ";
        }
      } else {
        data["fila7"] = " ";
      }
    } else if (Math.abs(data["Profemp"] - data["Profvi7"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi7"] - data["Profvi6"]) > data["EspMin"]) {

        if ((data["Poid6"] - data["Povi6"]) > 50) {

          data["Profinicial7"] = 0 + data["Profvi6"];

          data["Po7"] = data["Po6"] - data["dP"];

          data["Poprofemp7"] = data["Po7"] + data["Profemp"] * data["Gg"];

          data["Poid7"] = data["Po7"] + data["Profvi7"] * data["Gg"];

          data["Povi7"] = (data["Profvi7"] * (data["Profvi7"] * ((data["Profvi7"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo7"] = data["Povi7"] + ((data["ProfG11"] - data["Profvi7"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo7"] / data["Pb"])) - (0.8 * (data["Pfondo7"] / data["Pb"]) * (data["Pfondo7"] / data["Pb"])))) > 0) {

            data["qlyac7"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo7"] / data["Pb"])) - (0.8 * (data["Pfondo7"] / data["Pb"]) * (data["Pfondo7"] / data["Pb"])));

          } else {
            data["qlyac7"] = 0;
          };

          //Determinacion de Caudal de produccion

          data["ql7"] = data["Qdise"];

          //Determinacion del Corte de Agua
          if (data["Pfondo7"] < data["Pws"]) {

            data["W7"] = (((data["Fwpozo"] * data["qlyac7"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac7"] + data["Qdesc"]));

          } else {
            data["W7"] = data["Fwfm"];
          };

          //Determinacion de la Relacion Gas-liquido

          data["RGLmin7"] = (data["RGLtotal"]);

          //Determinacion de Caudal de gas Inyectado

          data["Qiny7"] = ((data["RGLmin7"] - data["RGLf"]) * data["ql7"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test7"] = data["Tamb"] + (data["Gtest"] * data["Profvi7"]);

          data["Tdin7"] = data["Tyac"] - (data["ProfG11"] - data["Profvi7"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo7"] < data["Pws"]) {

            data["Tv7"] = ( data["Test7"] + data["Tdin7"] ) / 2;

          } else {

            data["Tv7"] = data["Test7"];

          }

          //Tabla 2 de Resultados
          data["fila7"] = "<tr><th>" + 7 + "</th><td>" + data["Profvi7"].toFixed(2) + "</td><td>" + data["Povi7"].toFixed(2) + "</td><td>" + data["Poid7"].toFixed(2) + "</td><td>" + data["ql7"].toFixed(2) + "</td><td>" + data["W7"].toFixed(2) + "</td><td>" + data["Qiny7"].toFixed(2) + "</td><td>" + data["Tv7"].toFixed(2) + "</td>";

        } else {
          data["fila7"] = " ";
        }

      } else {
        data["fila7"] = " ";
      }

    } else {
      data["fila7"] = " ";
    }
  } else {
    data["fila7"] = " ";
  };



  var grafGradGas7 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po7"],
        y: 0
      },
      {
        x: data["Poprofemp7"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp7 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Povi6"],
        y: data["Profinicial7"]
      },
      {
        x: data["Poid7"],
        y: data["Profvi7"]
      },
    ],
  };

  //OCTAVO CICLO

  if (data["Profvi8"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi8"]) > data["EspMin"]) {

      if ((data["Profvi8"] - data["Profvi7"]) > data["EspMin"]) {

        if ((data["Poid7"] - data["Povi7"]) > 50) {

          data["Profinicial8"] = 0 + data["Profvi7"];

          data["Po8"] = data["Po7"] - data["dP"];

          data["Poprofemp8"] = data["Po8"] + data["Profemp"] * data["Gg"];

          data["Poid8"] = data["Po8"] + data["Profvi8"] * data["Gg"];

          data["Povi8"] = (data["Profvi8"] * (data["Profvi8"] * ((data["Profvi8"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo8"] = data["Povi8"] + ((data["ProfG11"] - data["Profvi8"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo8"] / data["Pb"])) - (0.8 * (data["Pfondo8"] / data["Pb"]) * (data["Pfondo8"] / data["Pb"])))) > 0) {

            data["qlyac8"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo8"] / data["Pb"])) - (0.8 * (data["Pfondo8"] / data["Pb"]) * (data["Pfondo8"] / data["Pb"])));

          } else {
            data["qlyac8"] = 0;
          };

          //Determinacion de Caudal de produccion
          if (data["Pfondo8"] < data["Pws"]) {

            data["ql8"] = data["Qdesc"] + data["qlyac8"];

          } else {
            data["ql8"] = data["Qdesc"];
          }

          //Determinacion del Corte de Agua
          if (data["Pfondo8"] < data["Pws"]) {

            data["W8"] = (((data["Fwpozo"] * data["qlyac8"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac8"] + data["Qdesc"]));

          } else {
            data["W8"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["A8"] = (25.81 + 13.92 * data["W8"]) * (Math.pow(data["IDtbg"], 2)) - 145;

          data["B8"] = 139.2 - (2.7766 + 7.4257 * data["W8"]) * (Math.pow(data["IDtbg"], 2));

          data["C8"] = ((1 - 0.3 * data["W8"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W8"] - 0.03 * data["W8"] * data["IDtbg"]) * data["Profvi8"] / 1000)

          data["D8"] = (data["C8"] * data["ql8"]) / 1000

          data["RGLmin8"] = (data["A8"] + (data["B8"] * data["Profvi8"] / 1000)) * ((Math.exp(2 * data["D8"]) + 1) / (Math.exp(2 * data["D8"]) - 1))

          //Determinacion de Caudal de gas Inyectado

          data["Qiny8"] = (data["RGLmin8"] * data["ql8"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test8"] = data["Tamb"] + (data["Gtest"] * data["Profvi8"]);

          data["Tdin8"] = data["Tyac"] - (data["ProfG11"] - data["Profvi8"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo8"] < data["Pws"]) {

            data["Tv8"] = ( data["Test8"] + data["Tdin8"] ) / 2;

          } else {

            data["Tv8"] = data["Test8"];

          };

          //Tabla 2 de Resultados
          data["fila8"] = "<tr><th>" + 8 + "</th><td>" + data["Profvi8"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid8"].toFixed(2) + "</td><td>" + data["ql8"].toFixed(2) + "</td><td>" + data["W8"].toFixed(2) + "</td><td>" + data["Qiny8"].toFixed(2) + "</td><td>" + data["Tv8"].toFixed(2) + "</td>";

          data["Profvi9"] = (data["Profvi8"] + ((data["Poid8"] - data["Povi8"] - data["dP"]) / (data["Gfm"] - data["Gg"])));

        } else {
          data["fila8"] = " ";
        }
      } else {
        data["fila8"] = " ";
      }
    } else if (Math.abs(data["Profemp"] - data["Profvi8"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi8"] - data["Profvi7"]) > data["EspMin"]) {

        if ((data["Poid7"] - data["Povi7"]) > 50) {

          data["Profinicial8"] = 0 + data["Profvi7"];

          data["Po8"] = data["Po7"] - data["dP"];

          data["Poprofemp8"] = data["Po8"] + data["Profemp"] * data["Gg"];

          data["Poid8"] = data["Po8"] + data["Profvi8"] * data["Gg"];

          data["Povi8"] = (data["Profvi8"] * (data["Profvi8"] * ((data["Profvi8"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo8"] = data["Povi8"] + ((data["ProfG11"] - data["Profvi8"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo8"] / data["Pb"])) - (0.8 * (data["Pfondo8"] / data["Pb"]) * (data["Pfondo8"] / data["Pb"])))) > 0) {

            data["qlyac8"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo8"] / data["Pb"])) - (0.8 * (data["Pfondo8"] / data["Pb"]) * (data["Pfondo8"] / data["Pb"])));

          } else {
            data["qlyac8"] = 0;
          };

          //Determinacion de Caudal de produccion
          data["ql8"] = data["Qdise"];

          //Determinacion del Corte de Agua
          if (data["Pfondo8"] < data["Pws"]) {

            data["W8"] = (((data["Fwpozo"] * data["qlyac8"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac8"] + data["Qdesc"]));

          } else {
            data["W8"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["RGLmin8"] = (data["RGLtotal"]);

          //Determinacion de Caudal de gas Inyectado

          data["Qiny8"] = ((data["RGLmin8"] - data["RGLf"]) * data["ql8"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test8"] = data["Tamb"] + (data["Gtest"] * data["Profvi8"]);

          data["Tdin8"] = data["Tyac"] - (data["ProfG11"] - data["Profvi8"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo8"] < data["Pws"]) {

            data["Tv8"] = ( data["Test8"] + data["Tdin8"] ) / 2;

          } else {

            data["Tv8"] = data["Test8"];

          }

          //Tabla 2 de Resultados
          data["fila8"] = "<tr><th>" + 8 + "</th><td>" + data["Profvi8"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid8"].toFixed(2) + "</td><td>" + data["ql8"].toFixed(2) + "</td><td>" + data["W8"].toFixed(2) + "</td><td>" + data["Qiny8"].toFixed(2) + "</td><td>" + data["Tv8"].toFixed(2) + "</td>";


        } else {
          data["fila8"] = " ";
        }
      } else {
        data["fila8"] = " ";
      }
    } else {
      data["fila8"] = " ";
    }
  } else {
    data["fila8"] = " ";
  };


  var grafGradGas8 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po8"],
        y: 0
      },
      {
        x: data["Poprofemp8"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp8 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Povi7"],
        y: data["Profinicial8"]
      },
      {
        x: data["Poid8"],
        y: data["Profvi8"]
      },
    ],
  };

  //NOVENO CICLO

  if (data["Profvi9"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi9"]) > data["EspMin"]) {

      if ((data["Profvi9"] - data["Profvi8"]) > data["EspMin"]) {

        if ((data["Poid8"] - data["Povi8"]) > 50) {

          data["Profinicial9"] = 0 + data["Profvi8"];

          data["Po9"] = data["Po8"] - data["dP"];

          data["Poprofemp9"] = data["Po9"] + data["Profemp"] * data["Gg"];

          data["Poid9"] = data["Po9"] + data["Profvi9"] * data["Gg"];

          data["Povi9"] = (data["Profvi9"] * (data["Profvi9"] * ((data["Profvi9"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo9"] = data["Povi9"] + ((data["ProfG11"] - data["Profvi9"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo9"] / data["Pb"])) - (0.8 * (data["Pfondo9"] / data["Pb"]) * (data["Pfondo9"] / data["Pb"])))) > 0) {

            data["qlyac9"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo9"] / data["Pb"])) - (0.8 * (data["Pfondo9"] / data["Pb"]) * (data["Pfondo9"] / data["Pb"])));

          } else {
            data["qlyac9"] = 0;
          };

          //Determinacion de Caudal de produccion
          if (data["Pfondo9"] < data["Pws"]) {

            data["ql9"] = data["Qdesc"] + data["qlyac9"];

          } else {
            data["ql9"] = data["Qdesc"];
          }

          //Determinacion del Corte de Agua
          if (data["Pfondo9"] < data["Pws"]) {

            data["W9"] = (((data["Fwpozo"] * data["qlyac9"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac9"] + data["Qdesc"]));

          } else {
            data["W9"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["A9"] = (25.81 + 13.92 * data["W9"]) * (Math.pow(data["IDtbg"], 2)) - 145;

          data["B9"] = 139.2 - (2.7766 + 7.4257 * data["W9"]) * (Math.pow(data["IDtbg"], 2));

          data["C9"] = ((1 - 0.3 * data["W9"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W9"] - 0.03 * data["W9"] * data["IDtbg"]) * data["Profvi9"] / 1000)

          data["D9"] = (data["C9"] * data["ql9"]) / 1000

          data["RGLmin9"] = (data["A9"] + (data["B9"] * data["Profvi9"] / 1000)) * ((Math.exp(2 * data["D9"]) + 1) / (Math.exp(2 * data["D9"]) - 1))

          //Determinacion de Caudal de gas Inyectado

          data["Qiny9"] = (data["RGLmin9"] * data["ql9"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test9"] = data["Tamb"] + (data["Gtest"] * data["Profvi9"]);

          data["Tdin9"] = data["Tyac"] - (data["ProfG11"] - data["Profvi9"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo9"] < data["Pws"]) {

            data["Tv9"] = ( data["Test9"] + data["Tdin9"] ) / 2;

          } else {

            data["Tv9"] = data["Test9"];

          };

          //Tabla 2 de Resultados
          data["fila9"] = "<tr><th>" + 9 + "</th><td>" + data["Profvi9"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid9"].toFixed(2) + "</td><td>" + data["ql9"].toFixed(2) + "</td><td>" + data["W9"].toFixed(2) + "</td><td>" + data["Qiny9"].toFixed(2) + "</td><td>" + data["Tv9"].toFixed(2) + "</td>";

          data["Profvi10"] = (data["Profvi9"] + ((data["Poid9"] - data["Povi9"] - data["dP"]) / (data["Gfm"] - data["Gg"])));

        } else {
          data["fila9"] = " ";
        }
      } else {
        data["fila9"] = " ";
      }
    } else if (Math.abs(data["Profemp"] - data["Profvi9"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi9"] - data["Profvi8"]) > data["EspMin"]) {

        if ((data["Poid8"] - data["Povi8"]) > 50) {

          data["Profinicial9"] = 0 + data["Profvi8"];

          data["Po9"] = data["Po8"] - data["dP"];

          data["Poprofemp9"] = data["Po9"] + data["Profemp"] * data["Gg"];

          data["Poid9"] = data["Po9"] + data["Profvi9"] * data["Gg"];

          data["Povi9"] = (data["Profvi9"] * (data["Profvi9"] * ((data["Profvi9"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo9"] = data["Povi9"] + ((data["ProfG11"] - data["Profvi9"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo9"] / data["Pb"])) - (0.8 * (data["Pfondo9"] / data["Pb"]) * (data["Pfondo9"] / data["Pb"])))) > 0) {

            data["qlyac9"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo9"] / data["Pb"])) - (0.8 * (data["Pfondo9"] / data["Pb"]) * (data["Pfondo9"] / data["Pb"])));

          } else {
            data["qlyac9"] = 0;
          };

          //Determinacion de Caudal de produccion
          data["ql9"] = data["Qdise"];

          //Determinacion del Corte de Agua
          if (data["Pfondo9"] < data["Pws"]) {

            data["W9"] = (((data["Fwpozo"] * data["qlyac9"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac9"] + data["Qdesc"]));

          } else {
            data["W9"] = data["Fwfm"];
          };

          //Determinacion de la Relacion Gas-liquido

          data["RGLmin9"] = (data["RGLtotal"]);

          //Determinacion de Caudal de gas Inyectado

          data["Qiny9"] = ((data["RGLmin9"] - data["RGLf"]) * data["ql9"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test9"] = data["Tamb"] + (data["Gtest"] * data["Profvi9"]);

          data["Tdin9"] = data["Tyac"] - (data["ProfG11"] - data["Profvi9"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo9"] < data["Pws"]) {

            data["Tv9"] = ( data["Test9"] + data["Tdin9"] ) / 2;

          } else {

            data["Tv9"] = data["Test9"];

          }

          //Tabla 2 de Resultados
          data["fila9"] = "<tr><th>" + 9 + "</th><td>" + data["Profvi9"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid9"].toFixed(2) + "</td><td>" + data["ql9"].toFixed(2) + "</td><td>" + data["W9"].toFixed(2) + "</td><td>" + data["Qiny9"].toFixed(2) + "</td><td>" + data["Tv9"].toFixed(2) + "</td>";


        } else {
          data["fila9"] = " ";
        }
      } else {
        data["fila9"] = " ";
      }
    } else {
      data["fila9"] = " ";
    }
  } else {
    data["fila9"] = " ";
  };

  var grafGradGas9 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po9"],
        y: 0
      },
      {
        x: data["Poprofemp9"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp9 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Povi8"],
        y: data["Profinicial9"]
      },
      {
        x: data["Poid9"],
        y: data["Profvi9"]
      },
    ],
  };

  //DECIMO CICLO

  if (data["Profvi10"] < data["Profemp"]) {

    if ((data["Profemp"] - data["Profvi10"]) > data["EspMin"]) {

      if ((data["Profvi10"] - data["Profvi9"]) > data["EspMin"]) {

        if ((data["Poid9"] - data["Povi9"]) > 50) {

          data["Profinicial10"] = 0 + data["Profvi9"];

          data["Po10"] = data["Po9"] - data["dP"];

          data["Poprofemp10"] = data["Po10"] + data["Profemp"] * data["Gg"];

          data["Poid10"] = data["Po10"] + data["Profvi10"] * data["Gg"];

          data["Povi10"] = (data["Profvi10"] * (data["Profvi10"] * ((data["Profvi10"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo10"] = data["Povi10"] + ((data["ProfG11"] - data["Profvi10"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo10"] / data["Pb"])) - (0.8 * (data["Pfondo10"] / data["Pb"]) * (data["Pfondo10"] / data["Pb"])))) > 0) {

            data["qlyac10"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo10"] / data["Pb"])) - (0.8 * (data["Pfondo10"] / data["Pb"]) * (data["Pfondo10"] / data["Pb"])));

          } else {
            data["qlyac10"] = 0;
          };

          //Determinacion de Caudal de produccion
          if (data["Pfondo10"] < data["Pws"]) {

            data["ql10"] = data["Qdesc"] + data["qlyac10"];

          } else {
            data["ql10"] = data["Qdesc"];
          }

          //Determinacion del Corte de Agua
          if (data["Pfondo10"] < data["Pws"]) {

            data["W10"] = (((data["Fwpozo"] * data["qlyac10"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac10"] + data["Qdesc"]));

          } else {
            data["W10"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["A10"] = (25.81 + 13.92 * data["W10"]) * (Math.pow(data["IDtbg"], 2)) - 145;

          data["B10"] = 139.2 - (2.7766 + 7.4257 * data["W10"]) * (Math.pow(data["IDtbg"], 2));

          data["C10"] = ((1 - 0.3 * data["W10"]) * (3 - 0.7 * data["IDtbg"])) + ((0.06 - 0.015 * data["W10"] - 0.03 * data["W10"] * data["IDtbg"]) * data["Profvi10"] / 1000)

          data["D10"] = (data["C10"] * data["ql10"]) / 1000

          data["RGLmin10"] = (data["A10"] + (data["B10"] * data["Profvi10"] / 1000)) * ((Math.exp(2 * data["D10"]) + 1) / (Math.exp(2 * data["D10"]) - 1))

          //Determinacion de Caudal de gas Inyectado

          data["Qiny10"] = (data["RGLmin10"] * data["ql10"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test10"] = data["Tamb"] + (data["Gtest"] * data["Profvi10"]);

          data["Tdin10"] = data["Tyac"] - (data["ProfG11"] - data["Profvi10"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo10"] < data["Pws"]) {

            data["Tv10"] = ( data["Test10"] + data["Tdin10"] ) / 2;

          } else {

            data["Tv10"] = data["Test10"];

          };

          //Tabla 2 de Resultados
          data["fila10"] = "<tr><th>" + 10 + "</th><td>" + data["Profvi10"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid10"].toFixed(2) + "</td><td>" + data["ql10"].toFixed(2) + "</td><td>" + data["W10"].toFixed(2) + "</td><td>" + data["Qiny10"].toFixed(2) + "</td><td>" + data["Tv10"].toFixed(2) + "</td>";

        } else {
          data["fila10"] = " ";
        }
      } else {
        data["fila10"] = " ";
      }
    } else if (Math.abs(data["Profemp"] - data["Profvi10"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi10"] - data["Profvi9"]) > data["EspMin"]) {

        if ((data["Poid9"] - data["Povi9"]) > 50) {

          data["Profinicial10"] = 0 + data["Profvi9"];

          data["Po10"] = data["Po9"] - data["dP"];

          data["Poprofemp10"] = data["Po10"] + data["Profemp"] * data["Gg"];

          data["Poid10"] = data["Po10"] + data["Profvi10"] * data["Gg"];

          data["Povi10"] = (data["Profvi10"] * (data["Profvi10"] * ((data["Profvi10"] * data["a"]) + data["b"]) + data["c"]) + data["d"])

          //Determinacion de Presion de Fondo
          data["Pfondo10"] = data["Povi10"] + ((data["ProfG11"] - data["Profvi10"]) * data["Gfm"]);

          //Determinacion de tasa de liquido del yacimiento
          if ((data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo10"] / data["Pb"])) - (0.8 * (data["Pfondo10"] / data["Pb"]) * (data["Pfondo10"] / data["Pb"])))) > 0) {

            data["qlyac10"] = data["Qb"] + data["qmax-qb"] * (1 - (0.2 * (data["Pfondo10"] / data["Pb"])) - (0.8 * (data["Pfondo10"] / data["Pb"]) * (data["Pfondo10"] / data["Pb"])));

          } else {
            data["qlyac10"] = 0;
          };

          //Determinacion de Caudal de produccion

          data["ql10"] = data["Qdise"];

          //Determinacion del Corte de Agua
          if (data["Pfondo10"] < data["Pws"]) {

            data["W10"] = (((data["Fwpozo"] * data["qlyac10"]) + (data["Fwfm"] * data["Qdesc"])) / (data["qlyac10"] + data["Qdesc"]));

          } else {
            data["W10"] = data["Fwfm"];
          }

          //Determinacion de la Relacion Gas-liquido

          data["RGLmin10"] = data["RGLtotal"]

          //Determinacion de Caudal de gas Inyectado

          data["Qiny10"] = ((data["RGLmin10"] - data["RGLf"]) * data["ql10"]) / 1000;

          //Temperaturas Estatica y Dinamica

          data["Test10"] = data["Tamb"] + (data["Gtest"] * data["Profvi10"]);

          data["Tdin10"] = data["Tyac"] - (data["ProfG11"] - data["Profvi10"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo10"] < data["Pws"]) {

            data["Tv10"] = ( data["Test10"] + data["Tdin10"] ) / 2;

          } else {

            data["Tv10"] = data["Test10"];

          }

          //Tabla 2 de Resultados
          data["fila10"] = "<tr><th>" + 10 + "</th><td>" + data["Profvi10"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid10"].toFixed(2) + "</td><td>" + data["ql10"].toFixed(2) + "</td><td>" + data["W10"].toFixed(2) + "</td><td>" + data["Qiny10"].toFixed(2) + "</td><td>" + data["Tv10"].toFixed(2) + "</td>";

        } else {
          data["fila10"] = " ";
        }
      } else {
        data["fila10"] = " ";
      }
    } else {
      data["fila10"] = " ";
    }
  } else {
    data["fila10"] = " ";
  };

  var grafGradGas10 = {
    showLine: true,
    borderColor: "rgb(39, 223, 39)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Po10"],
        y: 0
      },
      {
        x: data["Poprofemp10"],
        y: data["Profemp"]
      },
    ],
  };

  var grafGradComp10 = {
    showLine: true,
    borderColor: "rgb(28, 124, 233)",
    fill: false,
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["Povi9"],
        y: data["Profinicial10"]
      },
      {
        x: data["Poid10"],
        y: data["Profvi10"]
      },
    ],
  };









  var grafGradProd = {
    showLine: true,
    borderColor: "rgb(107,51,255)",
    fill: false,
    label: "Gradiente de Produccion",
    backgroundColor: "rgb(0,0,0)",
    lineTension: 0,
    data: [{
        x: data["PG1"],
        y: data["ProfG1"]
      },
      {
        x: data["PG2"],
        y: data["ProfG2"]
      },
      {
        x: data["PG3"],
        y: data["ProfG3"]
      },
      {
        x: data["PG4"],
        y: data["ProfG4"]
      },
      {
        x: data["PG5"],
        y: data["ProfG5"]
      },
      {
        x: data["PG6"],
        y: data["ProfG6"]
      },
      {
        x: data["PG7"],
        y: data["ProfG7"]
      },
      {
        x: data["PG8"],
        y: data["ProfG8"]
      },
      {
        x: data["PG9"],
        y: data["ProfG9"]
      },
      {
        x: data["PG10"],
        y: data["ProfG10"]
      },
      {
        x: data["PG11"],
        y: data["ProfG11"]
      }
    ],
  };



  var graficaContinuo = {
    datasets: [grafGradProd, grafGradGas1, grafGradComp1, grafGradGas2, grafGradComp2, grafGradGas3, grafGradComp3, grafGradGas4, grafGradComp4, grafGradGas5, grafGradComp5, grafGradGas6, grafGradComp6, grafGradGas7, grafGradComp7, grafGradGas8, grafGradComp8, grafGradGas9, grafGradComp9, grafGradGas10, grafGradComp10],
  };

  var chart = new Chart(miCanvas, {
    type: "scatter",
    data: graficaContinuo,

    options: {
      legend: {
        labels: {
          filter: function(legendItem, chartData) {
            if (legendItem.datasetIndex > 2) {
              return false;
            }
            return true;
          }
        }
      },
      scales: {
        xAxes: [{
          type: 'linear',
          position: "top",
          scaleLabel: {
            display: true,
            labelString: 'Presión (Lpc)',
            padding: 3,
            fontSize: 24,
            fontStyle: "normal",
          },
          ticks: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 2500,
            stepSize: 50
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Profundidad (Pies)',
            padding: 3,
            fontSize: 24,
            fontStyle: "normal"
          },
          ticks: {
            reverse: true,
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 10000,
            stepSize: 500
          }
        }]
      },
    }
  });


  var fila = data["fila1"] + data["fila2"] + data["fila3"] + data["fila4"] + data["fila5"] + data["fila6"] + data["fila7"] + data["fila8"] + data["fila9"] + data["fila10"];

  document.getElementById("tablita").innerHTML = fila;

};


var canvas = document.getElementById("MiGrafica").getCanvas();
var dataURL = canvas.toDataURL();
