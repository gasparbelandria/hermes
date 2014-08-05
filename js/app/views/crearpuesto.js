define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/CrearPuesto.html'),
        paisesarray =[],
        sucursalarray =[],
        departamentoarray=[],
        paisname    ="",
        companyv    =0,
        feedd       =0,
        template = _.template(tpl);

    return Backbone.View.extend({


        events: {
            "change .paiscompania":"changeSucursal",
            "change .sucursalcompania":"changeDepartamento",
            "change .companias": "navigate",
            "click #agregarpuesto": "agregarpuesto"
        },

        navigate:function(){
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
            feedd=1;
            var flag=false;
            $('.departamentocompania').html('');
            $.each(departamentoarray,function(key,value){
                 if ($('.sucursalcompania option:selected').val() == value.sucursalid){
                         flag=true;
                        $('.departamentocompania').append('<option value='+value.ID+'>'+value.nombre+'</option>'); 
                   }
            });
            if (flag==false){
                $('.departamentocompania').prop('disabled', true);
                $('.nombrepuesto').prop('disabled', true);
                var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Esta Sucursal no tiene Departamentos</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
            }else{
                $('.departamentocompania').prop('disabled', false);
                $('.nombrepuesto').prop('disabled', false);
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
                     that.changeDepartamento();
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

        agregarpuesto:function(){
             var url = 'api/createpuesto',
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
            this.navigate();
            return this;
        },

         close: function(){
            departamentoarray=[];
            paisesarray=[];
            sucursalarray=[];
            this.undelegateEvents();
            this.$el.empty();
        }

    });

});