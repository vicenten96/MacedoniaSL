//Funcion Llenar Casilla
function llenaCasilla() {
  var valor = PG1.value;
  document.getElementById('Pwh').value = valor;
};

//Funcion obtener data
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

//Funcion Grafico y Tablas
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

      //Temperaturas Estatica y Dinamica

      data["Test1"] = data["Tamb"] + (data["Gtest"] * data["Profvi1"]);

      data["Tdin1"] = data["Tyac"] - (data["ProfG11"] - data["Profvi1"]) * data["Gtdin"];

      //Temperatura de la valvula

      if (data["Pfondo1"] < data["Pws"]) {

        data["Tv1"] = ( data["Test1"] + data["Tdin1"] ) / 2;

      } else {

        data["Tv1"] = data["Test1"];

      };

      //Tabla 1 de Resultados
      data["fila1"] = "<tr><th>" + 1 + "</th><td>" + data["Profvi1"].toFixed(2) + "</td><td>" + data["Povi1"].toFixed(2) + "</td><td>" + data["Poid1"].toFixed(2) + "</td><td>" + data["Tv1"].toFixed(2) + "</td>";

      data["Profvi2"] = (data["Profvi1"] + ((data["Poid1"] - data["Povi1"] - data["dP"]) / (data["Gfm"] - data["Gg"])));

    } else if (Math.abs(data["Profemp"] - data["Profvi1"]) < data["EspMin"]) {

      data["Profinicial1"] = 0;

      data["Po1"] = data["Pko"] - 50;

      data["Poprofemp1"] = data["Po1"] + data["Profemp"] * data["Gg"];

      data["Poid1"] = data["Po1"] + data["Profvi1"] * data["Gg"];

      data["Povi1"] = (data["Profvi1"] * (data["Profvi1"] * ((data["Profvi1"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

      //Determinacion de Presion de Fondo
      data["Pfondo1"] = data["Povi1"] + ((data["ProfG11"] - data["Profvi1"]) * data["Gfm"]);

      //Temperaturas Estatica y Dinamica

      data["Test1"] = data["Tamb"] + (data["Gtest"] * data["Profvi1"]);

      data["Tdin1"] = data["Tyac"] - (data["ProfG11"] - data["Profvi1"]) * data["Gtdin"];

      //Temperatura de la valvula

      if (data["Pfondo1"] < data["Pws"]) {

        data["Tv1"] = ( data["Test1"] + data["Tdin1"] ) / 2;

      } else {

        data["Tv1"] = data["Test1"];

      };

      //Tabla 1 de Resultados
      data["fila1"] = "<tr><th>" + 1 + "</th><td>" + data["Profvi1"].toFixed(2) + "</td><td>" + data["Povi1"].toFixed(2) + "</td><td>" + data["Poid1"].toFixed(2) + "</td><td>" + data["Tv1"].toFixed(2) + "</td>";
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

          data["Povi2"] = (data["Profvi2"] * (data["Profvi2"] * ((data["Profvi2"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo2"] = data["Povi2"] + ((data["ProfG11"] - data["Profvi2"]) * data["Gfm"]);

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
          data["fila2"] = "<tr><th>" + 2 + "</th><td>" + data["Profvi2"].toFixed(2) + "</td><td>" + data["Povi2"].toFixed(2) + "</td><td>" + data["Poid2"].toFixed(2) + "</td><td>" + data["Tv2"].toFixed(2) + "</td>";

          data["Profvi3"] = (data["Profvi2"] + ((data["Poid2"] - data["Povi2"] - data["dP"]) / (data["Gfm"] - data["Gg"])));

        } else {
          data["fila2"] = " ";
        }
      } else {
        data["fila2"] = " ";
      }
    } else if (Math.abs(data["Profemp"] - data["Profvi2"]) < data["EspMin"]) {

      if (Math.abs(data["Profvi2"] - data["Profvi1"]) < data["EspMin"]) {

        if ((data["Poid1"] - data["Povi1"]) > 50) {

          data["Profinicial2"] = 0 + data["Profvi1"];

          data["Po2"] = data["Po1"] - data["dP"];

          data["Poprofemp2"] = data["Po2"] + data["Profemp"] * data["Gg"];

          data["Poid2"] = data["Po2"] + data["Profvi2"] * data["Gg"];

          data["Povi2"] = (data["Profvi2"] * (data["Profvi2"] * ((data["Profvi2"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo2"] = data["Povi2"] + ((data["ProfG11"] - data["Profvi2"]) * data["Gfm"]);


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
          data["fila2"] = "<tr><th>" + 2 + "</th><td>" + data["Profvi2"].toFixed(2) + "</td><td>" + data["Povi2"].toFixed(2) + "</td><td>" + data["Poid2"].toFixed(2) + "</td><td>" + data["Tv2"].toFixed(2) + "</td>";

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

          data["Povi3"] = (data["Profvi3"] * (data["Profvi3"] * ((data["Profvi3"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo3"] = data["Povi3"] + ((data["ProfG11"] - data["Profvi3"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test3"] = data["Tamb"] + (data["Gtest"] * data["Profvi3"]);

          data["Tdin3"] = data["Tyac"] - (data["ProfG11"] - data["Profvi3"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo3"] < data["Pws"]) {

            data["Tv3"] = ( data["Test3"] + data["Tdin3"] ) / 2;

          } else {

            data["Tv3"] = data["Test3"];

          };


          //Tabla 3 de Resultados
          data["fila3"] = "<tr><th>" + 3 + "</th><td>" + data["Profvi3"].toFixed(2) + "</td><td>" + data["Povi3"].toFixed(2) + "</td><td>" + data["Poid3"].toFixed(2) + "</td><td>" + data["Tv3"].toFixed(2) + "</td>";

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

          data["Povi3"] = (data["Profvi3"] * (data["Profvi3"] * ((data["Profvi3"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo3"] = data["Povi3"] + ((data["ProfG11"] - data["Profvi3"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test3"] = data["Tamb"] + (data["Gtest"] * data["Profvi3"]);

          data["Tdin3"] = data["Tyac"] - (data["ProfG11"] - data["Profvi3"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo3"] < data["Pws"]) {

            data["Tv3"] = ( data["Test3"] + data["Tdin3"] ) / 2;

          } else {

            data["Tv3"] = data["Test3"];

          };


          //Tabla 3 de Resultados
          data["fila3"] = "<tr><th>" + 3 + "</th><td>" + data["Profvi3"].toFixed(2) + "</td><td>" + data["Povi3"].toFixed(2) + "</td><td>" + data["Poid3"].toFixed(2) + "</td><td>" + data["Tv3"].toFixed(2) + "</td>";

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

          data["Povi4"] = (data["Profvi4"] * (data["Profvi4"] * ((data["Profvi4"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo4"] = data["Povi4"] + ((data["ProfG11"] - data["Profvi4"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test4"] = data["Tamb"] + (data["Gtest"] * data["Profvi4"]);

          data["Tdin4"] = data["Tyac"] - (data["ProfG11"] - data["Profvi4"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo4"] < data["Pws"]) {

            data["Tv4"] = ( data["Test4"] + data["Tdin4"] ) / 2;

          } else {

            data["Tv4"] = data["Test4"];

          };

          //Tabla 4 de Resultados
          data["fila4"] = "<tr><th>" + 4 + "</th><td>" + data["Profvi4"].toFixed(2) + "</td><td>" + data["Povi4"].toFixed(2) + "</td><td>" + data["Poid4"].toFixed(2) + "</td><td>" + data["Tv4"].toFixed(2) + "</td>";

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

          data["Povi4"] = (data["Profvi4"] * (data["Profvi4"] * ((data["Profvi4"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo4"] = data["Povi4"] + ((data["ProfG11"] - data["Profvi4"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test4"] = data["Tamb"] + (data["Gtest"] * data["Profvi4"]);

          data["Tdin4"] = data["Tyac"] - (data["ProfG11"] - data["Profvi4"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo4"] < data["Pws"]) {

            data["Tv4"] = ( data["Test4"] + data["Tdin4"] ) / 2;

          } else {

            data["Tv4"] = data["Test4"];

          };

          //Tabla 4 de Resultados
          data["fila4"] = "<tr><th>" + 4 + "</th><td>" + data["Profvi4"].toFixed(2) + "</td><td>" + data["Povi4"].toFixed(2) + "</td><td>" + data["Poid4"].toFixed(2) + "</td><td>" + data["Tv4"].toFixed(2) + "</td>";

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

          //Temperaturas Estatica y Dinamica

          data["Test5"] = data["Tamb"] + (data["Gtest"] * data["Profvi5"]);

          data["Tdin5"] = data["Tyac"] - (data["ProfG11"] - data["Profvi5"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo5"] < data["Pws"]) {

            data["Tv5"] = ( data["Test5"] + data["Tdin5"] ) / 2;

          } else {

            data["Tv5"] = data["Test5"];

          }

          //Tabla 5 de Resultados
          data["fila5"] = "<tr><th>" + 5 + "</th><td>" + data["Profvi5"].toFixed(2) + "</td><td>" + data["Povi5"].toFixed(2) + "</td><td>" + data["Poid5"].toFixed(2) + "</td><td>" + data["Tv5"].toFixed(2) + "</td>";

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

          //Temperaturas Estatica y Dinamica

          data["Test5"] = data["Tamb"] + (data["Gtest"] * data["Profvi5"]);

          data["Tdin5"] = data["Tyac"] - (data["ProfG11"] - data["Profvi5"]) * data["Gtdin"];

          //Determinacion de Presion de Fondo
          data["Pfondo5"] = data["Povi5"] + ((data["ProfG11"] - data["Profvi5"]) * data["Gfm"]);

          //Temperatura de la valvula

          if (data["Pfondo5"] < data["Pws"]) {

            data["Tv5"] = ( data["Test5"] + data["Tdin5"] ) / 2;

          } else {

            data["Tv5"] = data["Test5"];

          }

          //Tabla 5 de Resultados
          data["fila5"] = "<tr><th>" + 5 + "</th><td>" + data["Profvi5"].toFixed(2) + "</td><td>" + data["Povi5"].toFixed(2) + "</td><td>" + data["Poid5"].toFixed(2) + "</td><td>" + data["Tv5"].toFixed(2) + "</td>";

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

          data["Povi6"] = (data["Profvi6"] * (data["Profvi6"] * ((data["Profvi6"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo6"] = data["Povi6"] + ((data["ProfG11"] - data["Profvi6"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test6"] = data["Tamb"] + (data["Gtest"] * data["Profvi6"]);

          data["Tdin16"] = data["Tyac"] - (data["ProfG11"] - data["Profvi6"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo6"] < data["Pws"]) {

            data["Tv6"] = ( data["Test6"] + data["Tdin6"] ) / 2;

          } else {

            data["Tv6"] = data["Test6"];

          };

          //Tabla 6 de Resultados
          data["fila6"] = "<tr><th>"+ 6 +"</th><td>" + data["Profvi6"].toFixed(2) + "</td><td>" + data["Povi6"].toFixed(2) + "</td><td>" + data["Poid6"].toFixed(2) + "</td><td>" + data["Tv6"].toFixed(2) + "</td>";

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

          data["Povi6"] = (data["Profvi6"] * (data["Profvi6"] * ((data["Profvi6"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo6"] = data["Povi6"] + ((data["ProfG11"] - data["Profvi6"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test6"] = data["Tamb"] + (data["Gtest"] * data["Profvi6"]);

          data["Tdin6"] = data["Tyac"] - (data["ProfG11"] - data["Profvi6"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo6"] < data["Pws"]) {

            data["Tv6"] = ( data["Test6"] + data["Tdin6"] ) / 2;

          } else {

            data["Tv6"] = data["Test6"];

          };

          //Tabla 6 de Resultados
          data["fila6"] = "<tr><th>"+ 6 +"</th><td>" + data["Profvi6"].toFixed(2) + "</td><td>" + data["Povi6"].toFixed(2) + "</td><td>" + data["Poid6"].toFixed(2) + "</td><td>" + data["Tv6"].toFixed(2) + "</td>";

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

          data["Povi7"] = (data["Profvi7"] * (data["Profvi7"] * ((data["Profvi7"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo7"] = data["Povi7"] + ((data["ProfG11"] - data["Profvi7"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test7"] = data["Tamb"] + (data["Gtest"] * data["Profvi7"]);

          data["Tdin7"] = data["Tyac"] - (data["ProfG11"] - data["Profvi7"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo7"] < data["Pws"]) {

            data["Tv7"] = ( data["Test7"] + data["Tdin7"] ) / 2;

          } else {

            data["Tv7"] = data["Test7"];

          };

          //Tabla 7 de Resultados
          data["fila7"] = "<tr><th>" + 7 + "</th><td>" + data["Profvi7"].toFixed(2) + "</td><td>" + data["Povi7"].toFixed(2) + "</td><td>" + data["Poid7"].toFixed(2) + "</td><td>" + data["Tv7"].toFixed(2) + "</td>";

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

          data["Povi7"] = (data["Profvi7"] * (data["Profvi7"] * ((data["Profvi7"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo7"] = data["Povi7"] + ((data["ProfG11"] - data["Profvi7"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test7"] = data["Tamb"] + (data["Gtest"] * data["Profvi7"]);

          data["Tdin7"] = data["Tyac"] - (data["ProfG11"] - data["Profvi7"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo7"] < data["Pws"]) {

            data["Tv7"] = ( data["Test7"] + data["Tdin7"] ) / 2;

          } else {

            data["Tv7"] = data["Test7"];

          };

          //Tabla 7 de Resultados
          data["fila7"] = "<tr><th>" + 7 + "</th><td>" + data["Profvi7"].toFixed(2) + "</td><td>" + data["Povi7"].toFixed(2) + "</td><td>" + data["Poid7"].toFixed(2) + "</td><td>" + data["Tv7"].toFixed(2) + "</td>";

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

          data["Povi8"] = (data["Profvi8"] * (data["Profvi8"] * ((data["Profvi8"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo8"] = data["Povi8"] + ((data["ProfG11"] - data["Profvi8"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test8"] = data["Tamb"] + (data["Gtest"] * data["Profvi8"]);

          data["Tdin8"] = data["Tyac"] - (data["ProfG11"] - data["Profvi8"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo8"] < data["Pws"]) {

            data["Tv8"] = ( data["Test8"] + data["Tdin8"] ) / 2;

          } else {

            data["Tv8"] = data["Test8"];

          };

          //Tabla 8 de Resultados
          data["fila8"] = "<tr><th>" + 8 + "</th><td>" + data["Profvi8"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid8"].toFixed(2) + "</td><td>" + data["Tv8"].toFixed(2) + "</td>";

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

          data["Povi8"] = (data["Profvi8"] * (data["Profvi8"] * ((data["Profvi8"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo8"] = data["Povi8"] + ((data["ProfG11"] - data["Profvi8"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test8"] = data["Tamb"] + (data["Gtest"] * data["Profvi8"]);

          data["Tdin8"] = data["Tyac"] - (data["ProfG11"] - data["Profvi8"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo8"] < data["Pws"]) {

            data["Tv8"] = ( data["Test8"] + data["Tdin8"] ) / 2;

          } else {

            data["Tv8"] = data["Test8"];

          };

          //Tabla 8 de Resultados
          data["fila8"] = "<tr><th>" + 8 + "</th><td>" + data["Profvi8"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid8"].toFixed(2) + "</td><td>" + data["Tv8"].toFixed(2) + "</td>";

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

          //Temperaturas Estatica y Dinamica

          data["Test9"] = data["Tamb"] + (data["Gtest"] * data["Profvi9"]);

          data["Tdin9"] = data["Tyac"] - (data["ProfG11"] - data["Profvi9"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo9"] < data["Pws"]) {

            data["Tv9"] = ( data["Test9"] + data["Tdin9"] ) / 2;

          } else {

            data["Tv9"] = data["Test9"];

          };

          //Tabla 9 de Resultados
          data["fila9"] = "<tr><th>" + 9 + "</th><td>" + data["Profvi9"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid9"].toFixed(2) + "</td><td>" + data["Tv9"].toFixed(2) + "</td>";

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

          data["Povi9"] = (data["Profvi9"] * (data["Profvi9"] * ((data["Profvi9"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo9"] = data["Povi9"] + ((data["ProfG11"] - data["Profvi9"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test9"] = data["Tamb"] + (data["Gtest"] * data["Profvi9"]);

          data["Tdin9"] = data["Tyac"] - (data["ProfG11"] - data["Profvi9"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo9"] < data["Pws"]) {

            data["Tv9"] = ( data["Test9"] + data["Tdin9"] ) / 2;

          } else {

            data["Tv9"] = data["Test9"];

          };

          //Tabla 9 de Resultados
          data["fila9"] = "<tr><th>" + 9 + "</th><td>" + data["Profvi9"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid9"].toFixed(2) + "</td><td>" + data["Tv9"].toFixed(2) + "</td>";


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

          //Temperaturas Estatica y Dinamica

          data["Test10"] = data["Tamb"] + (data["Gtest"] * data["Profvi10"]);

          data["Tdin10"] = data["Tyac"] - (data["ProfG11"] - data["Profvi10"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo10"] < data["Pws"]) {

            data["Tv10"] = ( data["Test10"] + data["Tdin10"] ) / 2;

          } else {

            data["Tv10"] = data["Test10"];

          };

          //Tabla 10 de Resultados
          data["fila10"] = "<tr><th>" + 10 + "</th><td>" + data["Profvi10"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid10"].toFixed(2) + "</td><td>" + data["Tv10"].toFixed(2) + "</td>";

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

          data["Povi10"] = (data["Profvi10"] * (data["Profvi10"] * ((data["Profvi10"] * data["a"]) + data["b"]) + data["c"]) + data["d"]);

          //Determinacion de Presion de Fondo
          data["Pfondo10"] = data["Povi10"] + ((data["ProfG11"] - data["Profvi10"]) * data["Gfm"]);

          //Temperaturas Estatica y Dinamica

          data["Test10"] = data["Tamb"] + (data["Gtest"] * data["Profvi10"]);

          data["Tdin10"] = data["Tyac"] - (data["ProfG11"] - data["Profvi10"]) * data["Gtdin"];

          //Temperatura de la valvula

          if (data["Pfondo10"] < data["Pws"]) {

            data["Tv10"] = ( data["Test10"] + data["Tdin10"] ) / 2;

          } else {

            data["Tv10"] = data["Test10"];

          };

          //Tabla 10 de Resultados
          data["fila10"] = "<tr><th>" + 10 + "</th><td>" + data["Profvi10"].toFixed(2) + "</td><td>" + data["Povi8"].toFixed(2) + "</td><td>" + data["Poid10"].toFixed(2) + "</td><td>" + data["Tv10"].toFixed(2) + "</td>";

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
            fontStyle: "normal"
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


  //ECUACIONES INTERMITENTE

  //Seleccion de la valvula operadora
  if (data["Profvi10"] > 0) {
    data["Dov"] = data["Profvi10"];
  } else if (data["Profvi9"] > 0) {
    data["Dov"] = data["Profvi9"];
  } else if (data["Profvi8"] > 0) {
    data["Dov"] = data["Profvi8"];
  } else if (data["Profvi7"] > 0) {
    data["Dov"] = data["Profvi7"];
  } else if (data["Profvi6"] > 0) {
    data["Dov"] = data["Profvi6"];
  } else if (data["Profvi5"] > 0) {
    data["Dov"] = data["Profvi5"];
  } else if (data["Profvi4"] > 0) {
    data["Dov"] = data["Profvi4"];
  } else if (data["Profvi3"] > 0) {
    data["Dov"] = data["Profvi3"];
  } else if (data["Profvi2"] > 0) {
    data["Dov"] = data["Profvi2"];
  } else if (data["Profvi1"] > 0) {
    data["Dov"] = data["Profvi1"];
  };

  //Presion del revestidor en la valvula operadora
  if (data["Poid10"] > 0) {
    data["Pc"] = data["Poid10"];
  } else if (data["Poid9"] > 0) {
    data["Pc"] = data["Poid9"];
  } else if (data["Poid8"] > 0) {
    data["Pc"] = data["Poid8"];
  } else if (data["Poid7"] > 0) {
    data["Pc"] = data["Poid7"];
  } else if (data["Poid6"] > 0) {
    data["Pc"] = data["Poid6"];
  } else if (data["Poid5"] > 0) {
    data["Pc"] = data["Poid5"];
  } else if (data["Poid4"] > 0) {
    data["Pc"] = data["Poid4"];
  } else if (data["Poid3"] > 0) {
    data["Pc"] = data["Poid3"];
  } else if (data["Poid2"] > 0) {
    data["Pc"] = data["Poid2"];
  } else if (data["Poid1"] > 0) {
    data["Pc"] = data["Poid1"];
  };

  //Presion de operacion en superficie de la valvula operadora
  if (data["Po10"] > 0) {
    data["Pg"] = data["Po10"];
  } else if (data["Po9"] > 0) {
    data["Pg"] = data["Po9"];
  } else if (data["Po8"] > 0) {
    data["Pg"] = data["Po8"];
  } else if (data["Po7"] > 0) {
    data["Pg"] = data["Po7"];
  } else if (data["Po6"] > 0) {
    data["Pg"] = data["Po6"];
  } else if (data["Po5"] > 0) {
    data["Pg"] = data["Po5"];
  } else if (data["Po4"] > 0) {
    data["Pg"] = data["Po4"];
  } else if (data["Po3"] > 0) {
    data["Pg"] = data["Po3"];
  } else if (data["Po2"] > 0) {
    data["Pg"] = data["Po2"];
  } else if (data["Po1"] > 0) {
    data["Pg"] = data["Po1"];
  };


  // Presion atmosferica
  data["Pa"] = 14.7;

  // Presion del tapon inicial
  data["Pt"] = data["Pc"] * data["Fc"];

  //Presion ejercida por la carga liquida
  data["Pe"] = data["Pt"] - data["Pwh"];

  //Entrada de fluido por ciclo TEORICO
  data["Be"] = ( data["Pe"] * data["Ftb"] ) / data["Gs"];

  //Eficiencia del levantamiento
  data["Ef"] = ( 1 - ((0.05 * data["Dov"]) / 1000)  ) * 100;

  //Volumen REAL de liquido producido
  data["Btp"] = (data["Ef"]/100) * data["Be"];

  //Numero de ciclos maximo (3 min por ciclo)
  data["Ncmax"] = 480000 / data["Dov"];

  //Tasa maxima
  data["Qlmax"] = data["Ncmax"] * data["Btp"]

  //Presion promedio
  data["Pvc"] = data["Pg"] - 100;

  data["Ptp"] = (data["Pt"] + data["Pvc"]) / 2;

  data["Ftv"] = data["Ftb"] *  5.614583;

  data["Vt"] = ( data["Dov"] - ( data["Be"] / data["Ftb"]) ) * data["Ftv"];

  //Gas requerido
  data["Qg"] = (data["Ptp"] * data["Vt"]) / data["Pa"];

  var fila = data["fila1"] + data["fila2"] + data["fila3"] + data["fila4"] + data["fila5"] + data["fila6"] + data["fila7"] + data["fila8"] + data["fila9"] + data["fila10"];

  document.getElementById("tablita").innerHTML = fila;

  var fila2 = "<tr><th>Presión de Tapón Inicial (Lpca)</th><th>"+data["Pt"].toFixed(2)+"</th></tr><tr><tr><th>Eficiencia de Levatamiento (%)</th><th>"+data["Ef"].toFixed(2)+"</th></tr><tr><th>Volumen Real de Líquido Producido (Bls/Ciclo)</th><th>"+data["Btp"].toFixed(2)+"</th></tr><tr><th>Número Máximo de Ciclos por Día</th><th>"+data["Ncmax"].toFixed(2)+"</th></tr><tr><th>Tasa máxima (Bls/Día)</th><th>"+data["Qlmax"].toFixed(2)+"</th></tr><tr><th>Gas Requerido (Pcn)</th><th>"+data["Qg"].toFixed(2)+"</th>";

  document.getElementById("tablita2").innerHTML = fila2;

}
