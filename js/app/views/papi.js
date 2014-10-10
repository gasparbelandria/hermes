define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/papi.html'),
        pagep       = 1,
        questionsp   = [],
        resultadop   = [],
        template = _.template(tpl);

    return Backbone.View.extend({
        events: {
            "click #regresar": "regresar",
            "click #continuar": "continuar",
            "click #guardar": "guardar",
            "click #terminar": "terminar"
        },

        restore:function(){
            if (window.sessionStorage['papi']==1){
                var position=1,
                url = 'api/getpapi';
                questionsp=[];
                $.ajax({
                    url:url,
                    type:'POST',
                    dataType:"json",
                    data: {usuarioid:window.sessionStorage['ID']},
                    success:function (data) { 
                        while(position<91){   
                           if (data[0]['q'+position]==0){
                               questionsp.push(0);
                          }else{
                               $('.papi input[name=q'+position+'][value=' + data[0]['q'+position] + ']').prop('checked',true)
                              questionsp.push(data[0]['q'+position]);
                          }
                          position++
                      }
                    }
                });
            }
        },
        guardar:function(){
            var position=1,
            url = 'api/createpapi';
            questionsp=[];
            while(position<91){
                if ($('.papi input[name=q'+position+']:checked').val()==undefined){
                      questionsp.push(0);
                }else{
                      questionsp.push($('.papi input[name=q'+position+']:checked').val());
                }
                position++
            }
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: {questions:questionsp,
                       companiaid:window.sessionStorage['compania'],
                       usuarioid:window.sessionStorage['ID']},
                success:function (data) {
                     sessionStorage.setItem("papi", 1);
                }
            });
        },
        terminar:function(){
            var N=0,
                G=0,
                A=0,
                L=0,
                P=0,
                I=0,
                T=0,
                V=0,
                X=0,
                S=0,
                B=0,
                O=0,
                R=0,
                D=0,
                C=0,
                Z=0,
                E=0,
                K=0,
                F=0,
                W=0;
            resultadop = [];
            $.when(
                this.guardar()
            ).done(function() {
                 $.each( questionsp, function( key, value ) {
                    var question = key + 1;
                    if (value==1){
                        switch (question)
                        {
                           case 1:
                           case 11:
                           case 21:
                           case 31:
                           case 41:
                           case 51:
                           case 61:
                           case 71:
                           case 81: 
                               G++;
                               break;

                           case 2:
                               A++;
                               break;

                           case 82:
                           case 72:
                           case 62:
                           case 52:
                           case 42:
                           case 32:
                           case 22:
                           case 12:
                               L++;
                               break;

                           case 3:
                           case 13:
                               P++;
                               break;

                           case 83:
                           case 73:
                           case 63:
                           case 53:
                           case 43:
                           case 33:
                           case 23:
                               I++;
                               break;

                           case 84:
                           case 74:
                           case 64:
                           case 54:
                           case 44:
                           case 34:
                               T++;
                               break;

                           case 45:
                           case 55:
                           case 65:
                           case 75:
                           case 85:
                           case 34:
                               V++;
                               break;

                           case 4:
                           case 14:
                           case 24:
                               X++;
                               break;

                           case 56:
                           case 66:
                           case 76:
                           case 86:
                               S++;
                               break;

                           case 5:
                           case 15:
                           case 25:
                           case 35:
                               B++;
                               break;

                           case 6:
                           case 16:
                           case 26:
                           case 36:
                           case 46:
                               O++;
                               break;

                           case 87:
                           case 77:
                           case 67:
                               R++;
                               break;

                           case 88:
                           case 78:
                               D++;
                               break;
                           
                           case 89:
                               C++;
                               break;

                           case 7:
                           case 17:
                           case 27:
                           case 37:
                           case 47:
                           case 57:
                               Z++;
                               break;

                           case 8:
                           case 18:
                           case 28:
                           case 38:
                           case 48:
                           case 58:
                           case 68:
                               K++;
                               break;

                           case 9:
                           case 19:
                           case 29:
                           case 39:
                           case 49:
                           case 59:
                           case 69:
                           case 79:
                               F++;
                               break;

                           case 10:
                           case 20:
                           case 30:
                           case 40:
                           case 50:
                           case 60:
                           case 70:
                           case 80:
                           case 90:
                               W++;
                               break;
                        }
                    }else if(value==2){
                        switch (question)
                        {
                           case 2:
                           case 13:
                           case 24:
                           case 35:
                           case 46:
                           case 57:
                           case 68:
                           case 79:
                           case 90: 
                               N++;
                               break;

                           case 3:
                           case 14:
                           case 25:
                           case 36:
                           case 47:
                           case 58:
                           case 69:
                           case 80: 
                               A++;
                               break;

                           case 81: 
                               L++;
                               break;

                           case 4:
                           case 15:
                           case 26:
                           case 37:
                           case 48:
                           case 59:
                           case 70:
                               P++;
                               break;

                           case 82:
                           case 71:
                               I++;
                               break;

                           case 83:
                           case 72:
                           case 61:
                               T++;
                               break;

                           case 84:
                           case 73:
                           case 62:
                           case 51:
                               V++;
                               break;

                           case 5:
                           case 16:
                           case 27:
                           case 38:
                           case 49:
                           case 60:
                               X++;
                               break;

                           case 85:
                           case 74:
                           case 63:
                           case 52:
                           case 41:
                               S++;
                               break;

                           case 6:
                           case 17:
                           case 28:
                           case 39:
                           case 50:
                               B++;
                               break;

                           case 7:
                           case 18: 
                           case 29:
                           case 40:
                               O++;
                               break;

                           case 86:
                           case 75:
                           case 64:
                           case 54:
                           case 42:
                           case 31:
                               R++;
                               break;

                           case 87:
                           case 76:
                           case 65:
                           case 53:
                           case 43:
                           case 32:
                           case 21:
                               D++;
                               break;

                           case 88:
                           case 77:
                           case 66:
                           case 55:
                           case 44:
                           case 33:
                           case 22:
                           case 11:
                               C++;
                               break;

                           case 8:
                           case 19:
                           case 30:
                               Z++;
                               break;

                           case 89:
                           case 78:
                           case 67:
                           case 56:
                           case 45:
                           case 34:
                           case 23:
                           case 12:
                           case 1:
                               E++;
                               break;

                           case 9:
                           case 20:
                               K++;
                               break;

                           case 10:
                               F++;
                               break;

                        }
                    }
                })
            });
            resultadop.push({key: "N",puntos: N},
                        {key: "G", puntos: G},
                        {key: "A",puntos: A},
                        {key: "L",puntos: L},
                        {key: "P",puntos: P},
                        {key: "I",puntos: I},
                        {key: "T",puntos: T},                   
                        {key: "V",puntos: V},
                        {key: "X",puntos: X},
                        {key: "S",puntos: S},
                        {key: "B",puntos: B},
                        {key: "O",puntos: O},
                        {key: "R",puntos: R},
                        {key: "D",puntos: D},
                        {key: "C",puntos: C},
                        {key: "Z",puntos: Z},
                        {key: "E",puntos: E},
                        {key: "K",puntos: K},
                        {key: "F",puntos: F},
                        {key: "W",puntos: W});
                       var url = 'api/finishpapi';
                        $.ajax({
                          url:url,
                          type:'POST',
                          dataType:"json",
                          data: {resultadop:resultadop,
                                 companiaid:window.sessionStorage['compania'],
                                 usuarioid:window.sessionStorage['ID']},
                          success:function (data) {
                          }
                      });
        },
        continuar:function(){
            if(pagep!=5){
                pagep++;
                this.navigate();
            }
        },
        regresar:function(){
            if(pagep!=1){
                 pagep--;
                 this.navigate();
            }
        },
        navigate:function(){
             if (pagep==1){
              $('.formulario1').show();
              $('.formulario2').hide();
              $('#regresar').hide();
            }else if(pagep==2) {
             $('#regresar').show();
             $('.formulario1').hide();
             $('.formulario2').show();
             $('.formulario3').hide();
            }else if(pagep==3) {
             $('.formulario2').hide();
             $('.formulario3').show();
             $('.formulario4').hide();
            }else if(pagep==4) {
             $('.formulario3').hide();
             $('.formulario4').show();
             $('.formulario5').hide();
             $('#continuar').show();
             $('#terminar').hide();
            }else if(pagep==5) {
             $('.formulario4').hide();
             $('.formulario5').show();
             $('#continuar').hide();
             $('#terminar').show();
            }
        },

        render: function () {
            this.$el.html(template());
            this.restore();
            return this;
        },
         close: function(){
            pagep=1;
            this.undelegateEvents();
            this.$el.empty();
        }

    });

});