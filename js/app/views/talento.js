define(function (require) {

    "use strict";

    var $                    = require('jquery'),
        _                    = require('underscore'),
        Backbone             = require('backbone'),
        tpl                  = require('text!tpl/talento.html'),
        sucursalesa          = [],
        departamentosa       = [],
        template = _.template(tpl);

    return Backbone.View.extend({

        events: {
            "click #tarjeta": "tarjetas",
            "change .dynamicdrop.pais" : "getSucursales",
            "change .dynamicdrop.sucursal" : "getDepartamentos"
        },
        navigate:function(){
            this.getSucursales();
        },
        getSucursales:function(){
        var that = this,
            flag = false;
        $('.dynamicdrop.sucursal').html('');
        $.when(
           $.each( sucursalesa, function( key, value ) {
              if (value.pais_id == $(".dynamicdrop.pais option:selected").val()){
                 flag = true;
                 $('.dynamicdrop.sucursal').append( "<option value="+value.ID+">"+value.nombre+"</option>");
              }
            })
           ).done(function() {
                     that.getDepartamentos();
                });
         if (flag==false){
                $('.dynamicdrop.sucursal').prop('disabled', true);
                var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Esta Pais no tiene Sucursales</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
        }else{
            $('.dynamicdrop.sucursal').prop('disabled', false);
        }
        },
        getDepartamentos:function(){
         var flag = false;
         $('.dynamicdrop.departamento').html('');
           $.each( departamentosa, function( key, value ) {
              if (value.sucursal_id == $(".dynamicdrop.sucursal option:selected").val()){
                flag = true;
                 $('.dynamicdrop.departamento').append( "<option value="+value.ID+">"+value.nombre+"</option>");
              }
            });
        if (flag==false){
            $('.dynamicdrop.departamento').prop('disabled', true);
            $('#tarjeta').attr('disabled','disabled');
            $('#tarjeta').addClass('noaccesso');
            var randomnum = Math.ceil(Math.random() * 1000000),
            append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Esta Sucursal no tiene Departamentos</h3></div>';
            $('.alerta').append(append);
            setTimeout( function() {    
              $('#'+randomnum).fadeOut();
            }, 1500);
        }else{
            $('.dynamicdrop.departamento').prop('disabled', false);
            $('#tarjeta').removeAttr('disabled');
            $('#tarjeta').removeClass('noaccesso');
        }
        },
        tarjetas:function(){
            window.location.replace('#departament/'+$( ".dynamicdrop.departamento" ).val());
        },

        render: function () {
            this.$el.html(template(this.model.attributes));
            sucursalesa = this.model.attributes.sucursal;
            departamentosa = this.model.attributes.departamento;
            this.navigate();
            return this;
          }

    });

});