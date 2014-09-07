define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        image       = require('croppic.min'),
        tpl         = require('text!tpl/CrearUsuarios.html'),
        puestosarray=[],
        paisesarray =[],
        sucursalarray =[],
        departamentoarray=[],
        paisname    ="",
        companyv    =0,
        feedd       =0,
        isDisabled = false,
        template = _.template(tpl);

    return Backbone.View.extend({


        events: {
            "change .departamentocompania":"changePuestos",
            "change .paiscompania":"changeSucursal",
            "change .sucursalcompania":"changeDepartamento",
            "change .companias": "navigate",
            "click #agregarusuario": "agregarusuario"
        },
        navigate:function(){
               var that=this;
               var croppicHeaderOptions = {
                        uploadUrl:'api/sImage',
                        cropUrl:'api/cImage',
                        customUploadButtonId:'cropContainerProfileButton',
                        outputUrlId:'imagen',
                        modal:false,
                        onAfterImgCrop:function(){
                            that.getImageURL();
                        }
                }   
                var cropperHeader = new Croppic('profilepic', croppicHeaderOptions);  
                puestosarray=[];
                departamentoarray=[];
                paisesarray=[];
                sucursalarray=[];
                feedd=0;
                $('.paiscompania').html('');
                $('.sucursalcompania').html('');
                $('.departamentocompania').html('');
                $('#puestosf').html('');
                companyv=window.sessionStorage['compania'];
                this.getPaises();
        },
        getImageURL:function(){
             var data = $('#imagen').val(),
                 arr = data.split('/'),
                 last_element = arr[arr.length - 1]; 
            $('#imagen').val(last_element);
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
                var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Esta Sucursal no tiene Departamentos</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
            }else{
                $('.departamentocompania').prop('disabled', false);
            }
        },

        changePuestos:function(){
            feedd=1;
             var flag=false,
                that=this;
            $('.puestocompania').html('');
            $.each(puestosarray,function(key,value){
                 if ($('.departamentocompania option:selected').val() == value.departamentoid){
                         flag=true;
                         $('.puestocompania').append('<option value='+value.ID+'>'+value.nombre+'</option>');
                   }
            });
             if (flag==false){
                isDisabled = true;
                $("#formulario1 :input").attr("disabled", true);
                $("#formulario :input").attr("disabled", true);
                $('.puestocompania,#type').prop('disabled', true);
                var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Este Departamento no tiene Puestos</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
            }else{
                isDisabled = false;
                $("#formulario1 :input").attr("disabled", false);
                $("#formulario :input").attr("disabled", false);
                $('.puestocompania,#type').prop('disabled', false);
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
        
        agregarusuario:function(){
            if (isDisabled==false){
                var url = 'api/createuser',
                type=$( "#type option:selected" ).val(),
                puesto = $( ".puestocompania option:selected" ).val(),
                departamento = $( ".departamentocompania option:selected" ).val(),
                nombre=$('#nombre').val(),
                apellido=$('#apellido').val(),
                cedula=$('#cedula').val(),
                contrasena=$('#contrasena').val(),
                usuario=$('#usuario').val(),
                fechanacimiento=$('#fechanacimiento').val(),
                hijos=$('#hijos').val(),
                estadocivil=$('#estadocivil option:selected').val(),
                estadoactual=$('#estadoactual option:selected').val(),
                peso=$('#peso').val(),
                altura=$('#altura').val(),
                domicilio1=$('#domicilio1').val(),
                domicilio2=$('#domicilio2').val(),
                telefono1=$('#telefono1').val(),
                telefono2=$('#telefono2').val(),
                mobil1=$('#mobil1').val(),
                mobil2=$('#mobil2').val(),
                correocop=$('#correocop').val(),
                fechaentrada=$('#fechaentrada').val(),
                correoperso=$('#correoperso').val();

                    var formValues = {
                        companiaid: companyv,
                        departamento:departamento,
                        type:type,
                        puesto: puesto,
                        nombre:nombre,
                        apellido:apellido,
                        cedula:cedula,
                        password:contrasena,
                        usuario:usuario,
                        fechanacimiento:fechanacimiento,
                        hijos:hijos,  
                        estadocivil:estadocivil,
                        estadoactual:estadoactual,
                        peso:peso,
                        altura:altura,
                        domicilio1:domicilio1,
                        domicilio2:domicilio2,
                        telefono1:telefono1,
                        telefono2:telefono2,
                        mobil1:mobil1,
                        mobil2:mobil2,
                        fechaentrada:fechaentrada,
                        correocop:correocop,
                        correoperso:correoperso
                    };

                    $.ajax({
                        url:url,
                        type:'POST',
                        dataType:"json",
                        data: formValues,
                        success:function (data) {
                            var randomnum = Math.ceil(Math.random() * 1000000),
                            append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-success" ><h3>'+nombre+" ha sido agregado como empleado al Puesto"+'</h3></div>';
                            $('.alerta').append(append);
                            setTimeout( function() {    
                              $('#'+randomnum).fadeOut();
                            }, 1500);
                            $("input").val("");
                        }
                    });
            }else{
                var randomnum = Math.ceil(Math.random() * 1000000),
                append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Necesitas Eleguir un Puesto para crear un Usuario</h3></div>';
                $('.alerta').append(append);
                setTimeout( function() {    
                  $('#'+randomnum).fadeOut();
                }, 1500);
            }
        },

        render: function () {
            this.$el.html(template());
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