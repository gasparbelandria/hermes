define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        Departamento = Backbone.Model.extend({

//            urlRoot: "http://localhost:3000/employees",
            urlRoot: "api/departamento",

            initialize: function () {
                this.reports = new DepartamentoCollection();
                this.reports.url = this.urlRoot + "/" + this.attributes.id;
            }

        }),

        DepartamentoCollection = Backbone.Collection.extend({

            model: Departamento,

//            url: "http://localhost:3000/employees"
            url: "api/departamento"

        }),

        originalSync = Backbone.sync;

    Backbone.sync = function (method, model, options) {
        if (method === "read") {
            options.dataType = "jsonp";
            return originalSync.apply(Backbone, arguments);
        }
    };

    return {
        Departamento: Departamento,
        DepartamentoCollection: DepartamentoCollection
    };
});