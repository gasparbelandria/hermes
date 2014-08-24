define(function (require) {

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
        ShellView   = require('app/views/Shell'),
        HomeView    = require('app/views/Home'),
        $body = $('body'),
        shellView = new ShellView({el: $body}).render(),
        $content = $("#content", shellView.el),
        homeView = new HomeView({el: $content});

    // Close the search dropdown on click anywhere in the UI
    $body.click(function () {
        $('.dropdown').removeClass("open");
    });

    $("body").on("click", "#showMeBtn", function (event) {
        event.preventDefault();
        shellView.search();
    });

     $.ajaxSetup({
        statusCode: {
            401: function(){
                // Redirec the to the login page.
                window.location.replace('/#login');
             
            },
            403: function() {
                // 403 -- Access denied
                window.location.replace('/#denied');
            }
        }
    });

    return Backbone.Router.extend({

        routes: {
            "": "home",
            "muro": "muro",
            "login" : "login",
            "logout" : "logout",
            "contact": "contact",
            "talento": "talento",
            "analisis": "analisis",
            "hbdi":"hbdi",
            "papi":"papi",
            "crearcompania": "crearcompania",
            "crearestructura":"crearestructura",
            "crearpuesto":"crearpuesto",
            "crearusuario":"crearusuario",
            "resultadop/:id": "resultadop",
            "resultadoh/:id": "resultadoh",
            "departament/:id": "departament",
            "employees/:id": "employeeDetails"
        },

        home: function () {
            homeView.delegateEvents(); // delegate events when the view is recycled
            homeView.render();
            shellView.selectMenuItem('home-menu');
        },

        login: function() {
            require(["app/views/Login"], function (LoginView) {
                var view = new LoginView({el: $content});
                view.render();
                shellView.selectMenuItem('login-menu');
            });
        },

        logout: function(){
            var url = 'api/logout';
            $.ajax({
                url:url,
                type:'Get',
                dataType:"json",
                success:function () {
                        sessionStorage.clear();
                        $(".login-menu ").show();
                        $(".logout-menu, .emple, .admin, .navbar-search,.super").hide();
                        window.location.replace('#login');
                }
            });
        },



        showView: function(view){
          if (this.currentView){
            this.currentView.close();
          }
          this.currentView = view;
          this.currentView.render();
          //$($content).html(this.currentView.el);
          return view;
          },

        muro: function() {
             require(["app/views/Muro"], function (MuroView) {
                var view = new MuroView({el: $content});
                view.render();
                shellView.selectMenuItem('muro-menu');
            });
        },

        contact: function () {
            require(["app/views/Contact"], function (ContactView) {
                var view = new ContactView({el: $content});
                view.render();
                shellView.selectMenuItem('contact-menu');
            });
        },

        crearcompania: function () {
            require(["app/views/crearcompania"], function (CrearCView) {
                var view = new CrearCView({el: $content});
                view.render();
                shellView.selectMenuItem('super-menu');
            });
        },

        hbdi: function () {
            var that = this;
            require(["app/views/hbdi"], function (CrearCView) {
                var view = new CrearCView({el: $content});
                //view.render();
                 that.showView(view);
                shellView.selectMenuItem('hbdi-menu');
            });
        },

        papi: function () {
            var that = this;
            require(["app/views/papi"], function (CrearCView) {
                var view = new CrearCView({el: $content});
               // view.render();
                 that.showView(view);
                shellView.selectMenuItem('papi-menu');
            });
        },

        analisis: function () {
            require(["app/views/Analisis"], function (AnalisisView) {
                var view = new AnalisisView({el: $content});
                view.render();
                shellView.selectMenuItem('analisis-menu');
            });
        },
       crearestructura:function(){
            var that = this;
                require(["app/views/crearestructura","app/models/allcompania"], function (CrearEView,models) {
                  var allcompania = new models.AllCompania();
                  allcompania.fetch({
                        success: function (data) {
                            var view = new CrearEView({model:data, el: $content});
                            //view.render();
                            that.showView(view);
                        }
                    });
                    shellView.selectMenuItem('estructura-menu');
                });
        },
        crearpuesto:function(){
            var that = this;
                require(["app/views/crearpuesto","app/models/allcompania"], function (CrearPView,models) {
                  var allcompania = new models.AllCompania();
                  allcompania.fetch({
                        success: function (data) {
                            var view = new CrearPView({model:data, el: $content});
                            //view.render();
                            that.showView(view);
                        }
                    });
                    shellView.selectMenuItem('puestos-menu');
                });
        },
        crearusuario:function(){
            var that = this;
                require(["app/views/crearusuario","app/models/allcompania"], function (CrearUView,models) {
                  var allcompania = new models.AllCompania();
                  allcompania.fetch({
                        success: function (data) {
                            var view = new CrearUView({model:data, el: $content});
                            //view.render();
                            that.showView(view);
                        }
                    });
                    shellView.selectMenuItem('usuario-menu');
                });
        },
        talento: function () {
            require(["app/views/Talento", "app/models/compania"], function (TalentoView,models) {
                var compania = new models.Company();
                 compania.fetch({
                    success: function (data) {
                        // Note that we could also 'recycle' the same instance of EmployeeFullView
                        // instead of creating new instances
                        var view = new TalentoView({model:data, el: $content});
                        view.render();
                    }
                });
                shellView.selectMenuItem('talento-menu');
            });
        },
        resultadoh:function (id) {
            require(["app/views/ResultadoHbdi", "app/models/resultadohbdi"], function (ResultadohView, models) {
                var resultadohbdi = new models.Resultadohbdi({id: id});
                resultadohbdi.fetch({
                    success: function (data) {
                        var view = new ResultadohView({model: data, el: $content});
                        view.render();
                    }
                });
                 shellView.selectMenuItem('talento-menu');
            });
        },
        
        resultadop:function (id) {
           require(["app/views/ResultadoPapi", "app/models/resultadopapi"], function (ResultadopView, models) {
                var resultadopapi = new models.Resultadopapi({id: id});
                resultadopapi.fetch({
                    success: function (data) {
                        var view = new ResultadopView({model: data, el: $content});
                        view.render();
                    }
                });
                 shellView.selectMenuItem('talento-menu');
            });
        },
        departament: function (id) {
            require(["app/views/Departamento", "app/models/departamento"], function (DepartamentoView, models) {
                var departamento = new models.Departamento({id: id});
                departamento.fetch({
                    success: function (data) {
                        var view = new DepartamentoView({model: data, el: $content});
                        view.render();
                    }
                });
                shellView.selectMenuItem('talento-menu');
            });
        },

        employeeDetails: function (id) {
            require(["app/views/Employee", "app/models/employee"], function (EmployeeView, models) {
                var employee = new models.Employee({id: id});
                employee.fetch({
                    success: function (data) {
                        var view = new EmployeeView({model: data, el: $content});
                        view.render();
                    }
                });
                shellView.selectMenuItem();
            });
        }

    });

});