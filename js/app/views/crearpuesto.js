define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/crearpuesto.html'),
        puestosarray=[],
        paisesarray =[],
        sucursalarray =[],
        departamentoarray=[],
        puestovariablearray={},
        paisname    ="",
        companyv    =0,
        feedd       =0,
        completed   =1,
        template = _.template(tpl);

    return Backbone.View.extend({


        events: {
            "change .departamentocompania":"changePuestos",
            "change .paiscompania":"changeSucursal",
            "change .sucursalcompania":"changeDepartamento",
            "change .companias": "navigate",
            "click #agregarpuesto": "agregarpuesto"
        },

        navigate:function(){
                puestosarray=[];
                departamentoarray=[];
                paisesarray=[];
                sucursalarray=[];
                feedd=0;
                $('.paiscompania').html('');
                $('.sucursalcompania').html('');
                $('.departamentocompania').html('');
                $('#puestosf').html('');
                companyv=$(".companias option:selected" ).val();
                this.getPaises();
        },
        changePais:function(){
             var flag=false,
                that=this;
             $('.paiscompania').html('');
             $.when(
                 $.each( paisesarray, function( key, value ) {
                          flag=true;
                          $('.paiscompania').append( "<option value="+value.ID+">"+value.nombre+"</option>");
                           paisesarray.push({
                                ID: value.ID,
                                nombre: value.nombre
                            });
                })).done(function() {
                    if (feedd==1){
                        that.changeSucursal();
                    }
                });
                 
            if (flag==false){
                $('.paiscompania').prop('disabled', true);
                var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Esta Compañia no tiene Paises</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
            }else{
                $('.paiscompania').prop('disabled', false);
            }
        },

        changeSucursal:function(){
            var flag=false,
                that=this;
            $('.sucursalcompania').html('');
            $.when(
                $.each(sucursalarray,function(key,value){
                 if ($('.paiscompania option:selected').val() == value.paisid){
                         flag=true;
                        $('.sucursalcompania').append('<option value='+value.ID+'>'+value.nombre+'</option>');
                   }
                })).done(function() {
                    if (feedd==1){
                        that.changeDepartamento();
                    }
                });
            if (flag==false){
                $('.sucursalcompania').prop('disabled', true);
                var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Esta Pais no tiene Sucursales</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
            }else{
                $('.sucursalcompania').prop('disabled', false);
            }
        },

        changeDepartamento:function(){
             var flag=false,
                that=this;
            $('.departamentocompania').html('');
            $.when(
                $.each(departamentoarray,function(key,value){
                     if ($('.sucursalcompania option:selected').val() == value.sucursalid){
                             flag=true;
                            $('.departamentocompania').append('<option value='+value.ID+'>'+value.nombre+'</option>'); 
                       }
                 })).done(function() {
                    if (feedd==1){
                        that.changePuestos();
                    }
                });
            if (flag==false){
                $('.departamentocompania').prop('disabled', true);
                $('.nombrepuesto').prop('disabled', true);
                $('.descripcionpuesto').prop('disabled', true);
                var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Esta Sucursal no tiene Departamentos</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
            }else{
                $('.departamentocompania').prop('disabled', false);
                $('.nombrepuesto').prop('disabled', false);
                $('.descripcionpuesto').prop('disabled', false);
            }
        },

        changePuestos:function(){
            feedd=1;
            $('#puestosf').html('');
            $.each(puestosarray,function(key,value){
                 if ($('.departamentocompania option:selected').val() == value.departamentoid){
                        $('#puestosf').append('<h4 id='+value.ID+'>'+value.nombre+'</h4>');
                   }
            });
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
                     that.changeDepartamento();
                     that.getPuestos();
                });
        },

        getSucursales:function(){
            var that = this,
                url ="api/getalls",
               formValues = {
                    companiaid: companyv
                };
            $.when(
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
                     });
                    }
                })
                ).done(function() {
                     that.changeSucursal();
                     that.getDepartamentos();
                });
        },

        getPaises:function(){
            var that=this,
                url = 'api/getallp',
                formValues = {
                compania: companyv
            };
            $.when(
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: formValues,
                success:function (data) {
                  $.each( data.add, function( key, value ) {
                       paisesarray.push({
                            ID: value.ID,
                            nombre: value.nombre
                        });
                    });

                }
            })
            ).done(function() {
                 that.changePais();
                 that.getSucursales();
            });
        },

        getPuestos:function(){
            var that=this,
                url = 'api/getallpuestos',
                formValues = {
                companiaid: companyv
            };
            $.when(
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: formValues,
                success:function (data) {
                  $.each( data, function( key, value ) {
                     puestosarray.push({
                            departamentoid: value.departamento_id,
                            ID:value.ID,
                            nombre: value.nombre
                        });
                    });
                }
            })
            ).done(function() {
                 that.changePuestos();
            });
        },
        validarcampos:function() {
            puestovariablearray={};
            var variables = ["N","G","A","L","P","I","T","V","X","S","B","O","R","D","C","Z","E","K","F","W"];
            $.each(variables,function(key,value){
                puestovariablearray[value+"_min"]= $("#"+value+"_min").val();
                puestovariablearray[value+"_max"]= $("#"+value+"_max").val();
                puestovariablearray[value+"_limite"]= $("#"+value+"_limite").val();
                if (($("#"+value+"_min").val() == "")||($("#"+value+"_max").val() == "")||($("#"+value+"_limite").val() == "")){
                    completed=0;
                }
            });
            if (($(".nombrepuesto").val() == "")||($(".descripcionpuesto").val() == "")){
              completed=0;
            }
        },
        agregarpuesto:function(){
            this.validarcampos();
            if (completed === 1){
                 var url = 'api/createpuesto',
                 departamentoid = $( ".departamentocompania option:selected" ).val(),
                        nombrep=$('.nombrepuesto').val(),
                        descripcion=$('.descripcionpuesto').val();
                    var formValues = {
                        companiaid: companyv,
                        departamentoid: departamentoid,
                        nombre:nombrep,
                        descripcion:descripcion
                    };
                    $.ajax({
                        url:url,
                        type:'POST',
                        dataType:"json",
                        data: formValues,
                        success:function (data) {
                           $('#puestosf').append('<h4 id='+data.id+'>'+nombrep+'</h4>');
                           puestosarray.push({
                                departamentoid: departamentoid,
                                ID:data.id,
                                nombre: nombrep
                            });
                            console.log(puestovariablearray);
                              var url = 'api/finishpuesto';
                                $.ajax({
                                        url:url,
                                        type:'POST',
                                        dataType:"json",
                                        data: {puestohbdi:puestovariablearray,puestoid:data.id},
                                        success:function (data) {
                                    }
                              });
                           var randomnum = Math.ceil(Math.random() * 1000000),
                            append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-success" ><h3>'+nombrep+" ha sido agregado como Puesto a su Departamento"+'</h3></div>';
                            $('.alerta').append(append);
                            setTimeout( function() {    
                              $('#'+randomnum).fadeOut();
                            }, 1500);
                            $("input ,textarea").val("");
                        }
                    });
            }else{
                var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Necesitas llenar todos los campos</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
            }
            completed=1;
        },

        render: function () {
            this.$el.html(template({allcompanias:this.model.attributes}));
            this.navigate();
            return this;
        },

         close: function(){
            puestosarray=[];
            departamentoarray=[];
            paisesarray=[];
            sucursalarray=[];
            this.undelegateEvents();
            this.$el.empty();
        }

    });

});