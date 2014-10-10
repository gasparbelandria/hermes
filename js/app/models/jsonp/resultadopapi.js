define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        Resultadopapi = Backbone.Model.extend({

//            urlRoot: "http://localhost:3000/employees",
            urlRoot: "api/resultadopapi",

            initialize: function () {
                this.resultadopapi = new ResultadopapiCollection();
                this.resultadopapi.url = this.urlRoot + "/" + this.attributes.id;
            }

        }),

        ResultadopapiCollection = Backbone.Collection.extend({

            model: Resultadopapi,

//            url: "http://localhost:3000/employees"
            url: "api/resultadopapi"

        }),

        originalSync = Backbone.sync;

    Backbone.sync = function (method, model, options) {
        if (method === "read") {
            options.dataType = "jsonp";
            return originalSync.apply(Backbone, arguments);
        }
    };

    return {
        Resultadopapi: Resultadopapi,
       ResultadopapiCollection: ResultadopapiCollection
    };
});