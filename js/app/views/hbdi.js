define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/hbdi.html'),
        pageh        = 1,
        questionsh   = [],
        resultadoh   = [],
        template = _.template(tpl);

    return Backbone.View.extend({
        events: {
            "click #regresarh": "regresarh",
            "click #continuarh": "continuarh",
            "click #guardarh": "guardarh",
            "click #terminarh": "terminarh"
        },
        restoreh:function(){
           if (window.sessionStorage['hbdi']==1){
                var url = 'api/gethbdi',
                position=1;
                questionsh=[];
                $.ajax({
                    url:url,
                    type:'POST',
                    dataType:"json",
                    data: {usuarioid:window.sessionStorage['ID']},
                    success:function (data) { 
                        while(position<53){   
                           if (data[0]['q'+position]==0){
                               questionsh.push(0);
                          }else{
                               $('.hbdi input[name=q'+position+'][value=' + data[0]['q'+position] + ']').prop('checked',true)
                              questionsh.push(data[0]['q'+position]);
                          }
                          position++
                      }
                    }
                });
            }
        },
        guardarh:function(){
            var position=1,
            url = 'api/createhbdi';
            questionsh=[];
            while(position<53){
                if ($('.hbdi input[name=q'+position+']:checked').val()==undefined){
                      questionsh.push(0);
                }else{
                      questionsh.push($('.hbdi input[name=q'+position+']:checked').val());
                }
                position++
            }
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: {questions:questionsh,
                       companiaid:window.sessionStorage['compania'],
                       usuarioid:window.sessionStorage['ID']},
                success:function (data) {
                  sessionStorage.setItem("hbdi", 1);
                }
            });
        },
        terminarh:function(){
            var A=0,
                B=0,
                C=0,
                D=0;
            resultadoh = [];
            $.when(
                this.guardarh()
            ).done(function() {
                 $.each( questionsh, function( key, value ) {
                    var question = key + 1;
                    if (value==1){
                        switch (question)
                        {
                           case 1:
                           case 2:
                           case 3:
                           case 4:
                           case 5:
                           case 6:
                           case 7:
                           case 8:
                           case 9:
                           case 10:
                           case 11:
                           case 12:
                           case 13:
                           case 27:
                           case 28:
                           case 29:
                           case 30:
                           case 31:
                           case 32:
                           case 33:
                           case 34:
                           case 35:
                           case 36:
                           case 37:
                           case 38:
                           case 39:
                               B++;
                               break;

                           case 14:
                           case 15:
                           case 16:
                           case 17:
                           case 18:
                           case 19:
                           case 20:
                           case 21:
                           case 22:
                           case 23:
                           case 24:
                           case 25:
                           case 26:
                           case 40:
                           case 41:
                           case 42:
                           case 43:
                           case 44:
                           case 45:
                           case 46:
                           case 47:
                           case 48:
                           case 49:
                           case 50:
                           case 51:
                           case 52:
                               A++;
                               break;
                        }
                    }else if(value==2){
                        switch (question)
                        {
                           case 1:
                           case 2:
                           case 3:
                           case 4:
                           case 5:
                           case 6:
                           case 7:
                           case 8:
                           case 9:
                           case 10:
                           case 11:
                           case 12:
                           case 13:
                           case 40:
                           case 41:
                           case 42:
                           case 43:
                           case 44:
                           case 45:
                           case 46:
                           case 47:
                           case 48:
                           case 49:
                           case 50:
                           case 51:
                           case 52:
                               C++;
                               break;

                           case 14:
                           case 15:
                           case 16:
                           case 17:
                           case 18:
                           case 19:
                           case 20:
                           case 21:
                           case 22:
                           case 23:
                           case 24:
                           case 25:
                           case 26:
                           case 27:
                           case 28:
                           case 29:
                           case 30:
                           case 31:
                           case 32:
                           case 33:
                           case 34:
                           case 35:
                           case 36:
                           case 37:
                           case 38:
                           case 39:
                               D++;
                               break;

                        }
                    }
                })
            });
            resultadoh.push({key: "A", puntos: A},
                        {key: "B",puntos: B},
                        {key: "C",puntos: C},
                        {key: "D",puntos: D});
            var url = 'api/finishhbdi';
                        $.ajax({
                          url:url,
                          type:'POST',
                          dataType:"json",
                          data: {resultadoh:resultadoh,
                                 companiaid:window.sessionStorage['compania'],
                                 usuarioid:window.sessionStorage['ID']},
                          success:function (data) {
                          }
                      });
        },
        continuarh:function(){
            if(pageh!=2){
                pageh++;
                this.navigate();
            }
        },
        regresarh:function(){
            if(pageh!=1){
                 pageh--;
                 this.navigate();
            }
        },
        navigate:function(){
             if (pageh==1){
              $('.hformulario1').show();
              $('.hformulario2').hide();
              $('#regresarh').hide();
              $('#continuarh').show();
              $('#terminarh').hide();
            }else if(pageh==2) {
             $('#regresarh').show();
             $('.hformulario1').hide();
             $('.hformulario2').show();
             $('#continuarh').hide();
             $('#terminarh').show();
            }
        },

        render: function () {
            this.$el.html(template());
            this.restoreh();
            return this;
        },

         close: function(){
            pageh=1;
            this.undelegateEvents();
            this.$el.empty();
        }

    });

});