define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        Company = Backbone.Model.extend({

//            urlRoot: "http://localhost:3000/employees",
            urlRoot: "api/company",

            initialize: function () {
                this.company = new CompanyCollection();
                //this.company.url = this.urlRoot + "/" + this.id + "/reports";
            }

        }),

        CompanyCollection = Backbone.Collection.extend({

            model: Company,

//            url: "http://localhost:3000/employees"
            url: "api/company"

        }),

        originalSync = Backbone.sync;

    Backbone.sync = function (method, model, options) {
        if (method === "read") {
            options.dataType = "jsonp";
            return originalSync.apply(Backbone, arguments);
        }
    };

    return {
        Company: Company,
        CompanyCollection: CompanyCollection
    };


});