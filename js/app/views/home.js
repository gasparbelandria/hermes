define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/home.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        initialize:function () {
        var url = 'api/session';
        $.ajax({
            url:url,
            type:'Get',
            dataType:"json",
            success:function (data) {
                if (data!=false){
                    //window.session=data;
                     sessionStorage.setItem("ID", data['ID']);
                     sessionStorage.setItem("nombre", data['nombre']);
                     sessionStorage.setItem("apellido", data['apellido']);
                     sessionStorage.setItem("user", data['user']);
                     sessionStorage.setItem("compania", data['compania']);
                     sessionStorage.setItem("type", data['type']);
                     sessionStorage.setItem("hbdi", data['hbdi']);
                     sessionStorage.setItem("papi", data['papi']);
                    if(data['type']==1){
                      $(".admin, .navbar-search").show();
                      window.location.replace('#'+Backbone.history.fragment);
                    }else if(data['type']==3){
                      $(".emple").show();
                      window.location.replace('#'+Backbone.history.fragment);
                    }else if(data['type']==4){
                       $(".super").show();
                       window.location.replace('#'+Backbone.history.fragment);
                    }
                    $(".login-menu ").hide();
                    $(".logout-menu").show();

                }
            }
        });
        },

        render: function () {
            this.$el.html(template());
            return this;
        }

    });

});


