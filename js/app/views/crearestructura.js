define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/CrearEstructura.html'),
        paisesarray =[],
        sucursalarray =[],
        departamentoarray=[],
        paisname    ="",
        companyv    =0,
        page        =0,
        fetch       =0,
        template = _.template(tpl);

    return Backbone.View.extend({

        initialize: function(){
          //this.model.bind("change", this.modelChanged, this);
        },

        events: {
            "change .psucursalcompania": "change",
            "change .companias": "changec",
            "click #guardare": "guardare",
            "click #Regresar": "returne",
            "click #agregarp": "agregarp",
            "click #agregars": "agregars",
            "click #agregard": "agregard"
        },
        guardare:function(){
            if(page!=3){
                page++;
                this.navigate();
            }
        },
        returne:function(){
            if(page!=0){
                 page--;
                 this.navigate();
            }
        },
        navigate:function(){
             if (page==0){
              $('.form1').show();
              $('.form2').hide();
              $('#Regresar').hide();
            }else if(page==1) {
                if (fetch==0){
                    $('#paises').html('');
                     this.getPaises();
                     fetch++;
                }
                $('#Regresar').show();
                $('.form1').hide();
                $('.form2').show();
                $('.form3').hide();
            }else if(page==2) {
                if (fetch==1){
                    $('#sucursalesf').html('');
                    $('.paiscompania').html('');
                    this.getSucursales();
                    fetch++;
                }
                $('.form2').hide();
                $('.form3').show();
                $('#guardare').show();
                $('.form4').hide();
            }else if(page==3) {
                if (fetch==2){
                    $('#departamentosf').html('');
                    $('.psucursalcompania').html('');
                    this.getDepartamentos();   
                    fetch++;
                }
                $('#guardare').hide();
                $('.form3').hide();
                $('.form4').show();
            }
        },
        getDepartamentos:function(){
        var that=this;
         $.each(paisesarray,function(key,value){
                  $('.psucursalcompania').append('<option value='+value.ID+'>'+value.nombre+'</option>');  
             });
              var url ="api/getalld";
              var formValues = {
                    companiaid: companyv
                };
               $.when($.ajax({
                    url:url,
                    type:'POST',
                    dataType:"json",
                    data: formValues,
                    success:function (data) {
                     $.each(data,function(key,value){
                        departamentoarray.push({
                                sucursalid: value.sucursal_id,
                                ID:value.ID,
                                nombre: value.nombre
                            });
                     });
                    }
                })).done(function() {
                     that.change();
                });
        },
        getSucursales:function(){
             var url ="api/getalls";
             var formValues = {
                    companiaid: companyv
                };
            $.each(paisesarray,function(key,value){
                  $('.paiscompania').append( "<option value="+value.ID+">"+value.nombre+"</option>");
                  $('#sucursalesf').append("<div class='span4 "+value.ID+"'><h3>"+value.nombre+"</h3></div>");
            });
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: formValues,
                success:function (data) {
                 $.each(data,function(key,value){
                       sucursalarray.push({
                            paisid: value.pais_id,
                            ID:value.ID,
                            nombre: value.nombre
                        });
                      $('.span4.'+value.pais_id+'').append('<label id='+value.ID+'>'+value.nombre+'</label>');  
                 });
                }
            });
        },
        getPaises:function(){
            companyv=$(".companias option:selected" ).val();
            $(".lookoutpais").show();
            $("#agregarp").show();
            var flag=true;
            var url = 'api/getallp';
            var formValues = {
                compania: companyv
            };
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: formValues,
                success:function (data) {
                   $.each( data.sub, function( key, value ) {
                      flag=false;
                      $('.lookoutpais').append( "<option value="+value.ID+">"+value.nombre+"</option>");
                    });
                    if (flag==true){
                        $(".lookoutpais").hide();
                        $("#agregarp").hide();
                        $("#agregarp").removeClass('form2');
                    }
                  $.each( data.add, function( key, value ) {
                      $('#paises').append( '<h4 id="'+value.ID+'">'+value.nombre+'</h4>');
                       paisesarray.push({
                            ID: value.ID,
                            nombre: value.nombre
                        });
                    });
                }
            });
        },
        changec:function(){
            $("#agregarp").addClass('form2');
            fetch=0;
            departamentoarray=[];
            paisesarray=[];
            sucursalarray=[];
        },
        change:function(){
            $('#departamentosf').html('');
            $('.sucursalcompania').html('');
            $.each(sucursalarray,function(key,value){
                if(value.paisid==$('.psucursalcompania option:selected').val()){
                    $('.sucursalcompania').append('<option value='+value.ID+'>'+value.nombre+'</option>'); 
                    $('#departamentosf').append("<div class='span4 "+value.ID+"'><h3>"+value.nombre+"</h3></div>");
                } 
             });
            if (($('.sucursalcompania option:selected').text())==""){
                $(".nombred").prop('disabled', true);
                 var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Este Pais no tiene sucursales</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
            }else{
                $(".nombred").prop('disabled', false);
            }
            $.each(departamentoarray,function(key,value){
              $('.span4.'+value.sucursalid+'').append('<label id='+value.ID+'>'+value.nombre+'</label>');  
            });
        },
        agregarp:function(){
            if($( ".lookoutpais option:selected" ).val()!=undefined){
                 paisname = $( ".lookoutpais option:selected" ).text();
                 var formValues = {
                    companiaid: companyv,
                    paisid: $( ".lookoutpais option:selected" ).val()
                };
                var url = 'api/createp';
                $.ajax({
                    url:url,
                    type:'POST',
                    dataType:"json",
                    data: formValues,
                    success:function (data) {
                        var randomnum = Math.ceil(Math.random() * 1000000),
                            append = '<h4 id="'+data.id+'">'+paisname+'</h4>',
                            append1 =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-success" ><h3>'+paisname+" ha sido agregado como país a su Compañia"+'</h3></div>';
                        paisesarray.push({
                            ID: data.id,
                            nombre: paisname
                        });
                        $('#paises').append(append);
                        $('.alerta').append(append1);
                        setTimeout( function() {    
                          $('#'+randomnum).fadeOut();
                        }, 1500);
                    }
                });
                 $(".lookoutpais option:selected").remove();
                 if($( ".lookoutpais option:selected" ).val() == undefined){
                     $(".lookoutpais").hide();
                     $("#agregarp").hide();
                 }
            }
        },

        agregars:function(){
                    var url = 'api/creates',
                        pais_id = $( ".paiscompania option:selected" ).val(),
                        nombrev=$('.nombres').val();
                    var formValues = {
                        companiaid: companyv,
                        paisid: pais_id,
                        nombre:nombrev
                    };
                    $.ajax({
                        url:url,
                        type:'POST',
                        dataType:"json",
                        data: formValues,
                        success:function (data) {
                           $('.span4.'+pais_id+'').append('<label id='+data.id+'>'+nombrev+'</label>');
                           sucursalarray.push({
                                paisid: paisid,
                                ID:data.id,
                                nombre: nombrev,
                            });
                           var randomnum = Math.ceil(Math.random() * 1000000),
                            append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-success" ><h3>'+nombrev+" ha sido agregado como sucursal a su Compañia"+'</h3></div>';
                            $('.alerta').append(append);
                            setTimeout( function() {    
                              $('#'+randomnum).fadeOut();
                            }, 1500);
                        }
                    });
        },

        agregard:function(){
             var url = 'api/created',
                        sucursalid = $( ".sucursalcompania option:selected" ).val(),
                        nombred=$('.nombred').val();
                    var formValues = {
                        companiaid: companyv,
                        sucursal_id: sucursalid,
                        nombre:nombred
                    };
                    $.ajax({
                        url:url,
                        type:'POST',
                        dataType:"json",
                        data: formValues,
                        success:function (data) {
                           $('.span4.'+sucursalid+'').append('<label id='+data.id+'>'+nombred+'</label>');
                           departamentoarray.push({
                                sucursalid: sucursalid,
                                ID:data.id,
                                nombre: nombred
                            });
                           var randomnum = Math.ceil(Math.random() * 1000000),
                            append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-success" ><h3>'+nombred+" ha sido agregado como sucursal a su Compañia"+'</h3></div>';
                            $('.alerta').append(append);
                            setTimeout( function() {    
                              $('#'+randomnum).fadeOut();
                            }, 1500);
                        }
                    });
        },

        render: function () {
            this.$el.html(template({allcompanias:this.model.attributes}));
            return this;
        },

         close: function(){
            $("#agregarp").addClass('form2');
            page=0;
            departamentoarray=[];
            paisesarray=[];
            sucursalarray=[];
            this.undelegateEvents();
            this.$el.empty();
        }

    });

});