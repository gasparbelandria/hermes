define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
     //   EmployeeListView    = require('app/views/EmployeeList'),
        tpl                 = require('text!tpl/Departamento.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        render: function () {
            delete this.model.attributes.id
            this.$el.html(template({usuarios:this.model.attributes}));
            return this;
        }
    });

});