define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/departamento.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        render: function () {
            console.log(this.model.attributes);
            delete this.model.attributes.id
            this.$el.html(template({usuarios:this.model.attributes}));
            return this;
        }
    });

});