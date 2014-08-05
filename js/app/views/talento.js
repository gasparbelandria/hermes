define(function (require) {

    "use strict";

    var $                    = require('jquery'),
        _                    = require('underscore'),
        Backbone             = require('backbone'),
        tpl                  = require('text!tpl/Talento.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        events: {
            "click #tarjeta": "tarjetas"
        },

        tarjetas:function(){
            window.location.replace('#departament/'+$( ".dynamicdrop.pais" ).val()+'_'+$( ".dynamicdrop.sucursal" ).val()+'_'+$( ".dynamicdrop.departamento" ).val());
        },

        render: function () {
            this.$el.html(template(this.model.attributes));
            return this;
          }

    });

});