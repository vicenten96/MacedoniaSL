jQuery(function ($) {
    $("#exportButton").click(function () {
        // parse the HTML table element having an id=exportTable
        var dataSource = shield.DataSource.create({
            data: "#exportTable",
            schema: {
                type: "table",
                fields: {
                    Vavula: { type: Number },
                    Profvi: { type: Number },
                    Poiv: { type: Number },
                    Poid: { type: Number },
                    ql: { type: Number },
                    Wi: { type: Number },
                    Qiny: { type: Number },
                    Tv: { type: Number }
                }
            }
        });

        // when parsing is done, export the data to Excel
        dataSource.read().then(function (data) {
            new shield.exp.OOXMLWorkbook({
                author: "PrepBootstrap",
                worksheets: [
                    {
                        name: "Diseño de Valvulas LAG Continuo",
                        rows: [
                            {
                                cells: [
                                    {
                                        style: {
                                            bold: true
                                        },
                                        type: Number,
                                        value: "Vavula"
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
                                        value: "ql"
                                    },
                                    {
                                        style: {
                                            bold: true
                                        },
                                        type: Number,
                                        value: "W"
                                    },
                                    {
                                        style: {
                                            bold: true
                                        },
                                        type: Number,
                                        value: "Qiny"
                                    },
                                    {
                                        style: {
                                            bold: true
                                        },
                                        type: Number,
                                        value: "Tv"
                                    },
                                ]
                            }
                        ].concat($.map(data, function(item) {
                            return {
                                cells: [
                                    { type: Number, value: item.Vavula },
                                    { type: Number, value: item.Profvi },
                                    { type: Number, value: item.Poiv },
                                    { type: Number, value: item.Poid },
                                    { type: Number, value: item.ql },
                                    { type: Number, value: item.Wi },
                                    { type: Number, value: item.Qiny },
                                    { type: Number, value: item.Tv }
                                ]
                            };
                        }))
                    }
                ]
            }).saveAs({
                fileName: "Diseño LAG Continuo"
            });
        });

    });
});
