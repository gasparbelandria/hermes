define(function (require) {

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),

        Employee = Backbone.Model.extend({

            //urlRoot: "http://localhost:3000/employees",
             urlRoot: "api/employees",

            initialize: function () {
                this.reports = new EmployeeCollection();
                this.reports.url = this.urlRoot + "/" + this.id + "/reports";
            }

        }),

        EmployeeCollection = Backbone.Collection.extend({

            model: Employee,

            url: "api/employees"

        });

    return {
        Employee: Employee,
        EmployeeCollection: EmployeeCollection
    };

});