define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        Resultadohbdi = Backbone.Model.extend({

//            urlRoot: "http://localhost:3000/employees",
            urlRoot: "/Hermes/api/resultadohbdi",

            initialize: function () {
                this.resultadohbdi = new ResultadohbdiCollection();
                this.resultadohbdi.url = this.urlRoot + "/" + this.attributes.id;
            }

        }),

        ResultadohbdiCollection = Backbone.Collection.extend({

            model: Resultadohbdi,

//            url: "http://localhost:3000/employees"
            url: "/Hermes/api/resultadohbdi"

        }),

        originalSync = Backbone.sync;

    Backbone.sync = function (method, model, options) {
        if (method === "read") {
            options.dataType = "jsonp";
            return originalSync.apply(Backbone, arguments);
        }
    };

    return {
        Resultadohbdi: Resultadohbdi,
       ResultadohbdiCollection: ResultadohbdiCollection
    };
});