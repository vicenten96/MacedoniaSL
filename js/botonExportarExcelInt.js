jQuery(function ($) {
    $("#exportButtonInt").click(function () {
        // parse the HTML table element having an id=exportTable
        var dataSource = shield.DataSource.create({
            data: "#exportTableInt",
            schema: {
                type: "table",
                fields: {
                    Valvula: { type: Number },
                    Profvi: { type: Number },
                    Poiv: { type: Number },
                    Poid: { type: Number },
                    Tv: { type: Number }
                        }
                      }
        });

        var dataSource2 = shield.DataSource.create({
            data: "#exportTableInt2",
            schema: {
                type: "table",
                fields: {
                    Variable: { type: String },
                    Valor: { type: Number },
                        }
                      }
        });

        // when parsing is done, export the data to Excel
        dataSource.read().then(function (data) {
          new shield.exp.OOXMLWorkbook({
              author: "PrepBootstrap",
              worksheets: [
                  {
                      name: "Espaciamiento de Valvulas Intermitente",
                      rows: [
                          {
                              cells: [
                                  {
                                      style: {
                                          bold: true
                                      },
                                      type: Number,
                                      value: "Valvula"
                                  },
                                  {
                                      style: {
                                          bold: true
                                      },
                                      type: Number,
                                      value: "Profvi"
                                  },
                                  {
                                      style: {
                                          bold: true
                                      },
                                      type: Number,
                                      value: "Poiv"
                                  },
                                  {
                                      style: {
                                          bold: true
                                      },
                                      type: Number,
                                      value: "Poid"
                                  },
                                  {
                                      style: {
                                          bold: true
                                      },
                                      type: Number,
                                      value: "Tv"
                                  }
                              ]
                          }
                      ].concat($.map(data, function(item) {
                          return {
                              cells: [
                                  { type: Number, value: item.Valvula },
                                  { type: Number, value: item.Profvi },
                                  { type: Number, value: item.Poiv },
                                  { type: Number, value: item.Poid },
                                  { type: Number, value: item.Tv }
                              ]
                          };
                      }))
                  }
              ]
          }).saveAs({
              fileName: "Diseño LAG Intermitente Espaciamiento"
          });

          dataSource2.read().then(function (data) {
            new shield.exp.OOXMLWorkbook({
                author: "PrepBootstrap",
                worksheets: [
                    {
                        name: "Variables Diseño Intermitente",
                        rows: [
                            {
                                cells: [
                                    {
                                        style: {
                                            bold: true
                                        },
                                        type: String,
                                        value: "Variable"
                                    },
                                    {
                                        style: {
                                            bold: true
                                        },
                                        type: Number,
                                        value: "Valor"
                                    }
                                ]
                            }
                        ].concat($.map(data, function(item) {
                            return {
                                cells: [
                                    { type: Number, value: item.Variable },
                                    { type: Number, value: item.Valor }
                                ]
                            };
                        }))
                    }
                ]
            }).saveAs({
                fileName: "Diseño LAG Intermitente Variables"
            });

        });

      });
    });
});
