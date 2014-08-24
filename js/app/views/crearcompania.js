define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        image       = require('croppic.min'),
        tpl         = require('text!tpl/CrearCompania.html'),
        sucursalv   = 0,
        paisesv     = 0,
        paisesarray =[],
        continuecompany =1,
        template = _.template(tpl);

    return Backbone.View.extend({

        events: {
            "click #guardarc": "guardarc"
        },
        navigate:function(){   
             var croppicHeaderOptions = {
                    uploadUrl:'api/sImage',
                    cropUrl:'api/cImage',
                    //loaderHtml:'<img class="loader" src="img/loader.gif" >',
                    customUploadButtonId:'cropContainerHeaderButton',
                    outputUrlId:'logo',
                    modal:false
            }   
            var cropperHeader = new Croppic('croppic', croppicHeaderOptions);      
        },
        validate:function(){
            continuecompany=1;
            if (($('#nombree').val()=="")||($('#rubro').val()=="")){
                continuecompany=0;
            }
        },
        guardarc:function(){
                this.validate();
                if (continuecompany==1){
                    var formValues = {
                        nombre: $('#nombree').val(),
                        logo: $('#logo').val(),
                        rubro: $('#rubro').val()
                    };
                    var url = 'api/createc';
                    $.ajax({
                        url:url,
                        type:'POST',
                        dataType:"json",
                        data: formValues,
                        success:function (data) {
                            var randomnum = Math.ceil(Math.random() * 1000000);
                            var append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-success" ><h3>'+$('#nombree').val()+" compañia fue creada"+'</h3></div>';
                            $('.span12').append(append);
                            setTimeout( function() {    
                              $('#'+randomnum).fadeOut();
                            }, 1500);
                        }
                    });
                }else{
                    var randomnum = Math.ceil(Math.random() * 1000000);
                            var append =  '<div style="text-align:center;" id="'+randomnum+'"class="alert alert-error" ><h3>Necesitas llenar los campos vacios</h3></div>';
                            $('.span12').append(append);
                            setTimeout( function() {    
                              $('#'+randomnum).fadeOut();
                            }, 1500);
                }
        },

        render: function () {
            this.$el.html(template());
            this.navigate();
            return this;
        }

    });

});