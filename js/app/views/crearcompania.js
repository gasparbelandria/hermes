define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/CrearCompania.html'),
        sucursalv   = 0,
        paisesv     = 0,
        paisesarray =[],
        template = _.template(tpl);

    return Backbone.View.extend({

        events: {
            "click #guardarc": "guardarc"
        },

        guardarc:function(){
                var formValues = {
                    nombre: $('#nombree').val(),
                    logo: $('#logo').val(),
                    rubro: $('#rubro').val()
                };
                var url = 'api/createc';
                $.ajax({
                    url:url,
                    type:'POST',
                    dataType:"json",
                    data: formValues,
                    success:function (data) {
                        var randomnum = Math.ceil(Math.random() * 1000000);
                        var append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-success" ><h3>'+$('#nombree').val()+" compañia fue creada"+'</h3></div>';
                        $('.span12').append(append);
                        setTimeout( function() {    
                          $('#'+randomnum).fadeOut();
                        }, 1500);
                    }
                });
        },

        render: function () {
            this.$el.html(template());
            return this;
        }

    });

});