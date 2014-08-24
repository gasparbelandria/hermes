define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Login.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Login View');
    },

    events: {
        "click #loginButton": "login"
    },

    render: function () {
        this.$el.html(template());
        return this;
    },

    login:function (event) {
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = 'api/login';
        console.log('Loggin in... ');
        var formValues = {
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val()
        };

        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (data) {
                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }
                else { // If not, send them back to the home page
                     sessionStorage.setItem("ID", data['ID']);
                     sessionStorage.setItem("nombre", data['nombre']);
                     sessionStorage.setItem("apellido", data['apellido']);
                     sessionStorage.setItem("user", data['user']);
                     sessionStorage.setItem("compania", data['compania']);
                     sessionStorage.setItem("type", data['type']);
                     sessionStorage.setItem("hbdi", data['hbdi']);
                     sessionStorage.setItem("papi", data['papi']);
                    if(data['type']==1){
                      $(".admin").show();
                       window.location.replace('#muro');
                    }else if(data['type']==3){
                        $(".emple").show();
                        window.location.replace('#');
                    }else if(data['type']==4){
                        $(".super").show();
                        window.location.replace('#crearcompania');
                    }
                    $(".login-menu ").hide();
                    $(".logout-menu").show();
                }
            }
        });
    }
    });

});