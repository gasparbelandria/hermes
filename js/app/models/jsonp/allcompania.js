define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        AllCompania = Backbone.Model.extend({

//            urlRoot: "http://localhost:3000/employees",
            urlRoot: "/Hermes/api/allcompany",

            initialize: function () {
                this.allcompania = new AllCompaniaCollection();
                //this.company.url = this.urlRoot + "/" + this.id + "/reports";
            }

        }),

       AllCompaniaCollection = Backbone.Collection.extend({

            model: AllCompania,

//            url: "http://localhost:3000/employees"
            url: "/Hermes/api/allcompany"

        }),

        originalSync = Backbone.sync;

    Backbone.sync = function (method, model, options) {
        if (method === "read") {
            options.dataType = "jsonp";
            return originalSync.apply(Backbone, arguments);
        }
    };

    return {
        AllCompania: AllCompania,
        AllCompaniaCollection: AllCompaniaCollection
    };


});