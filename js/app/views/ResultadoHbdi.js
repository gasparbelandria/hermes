define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        Chart       = require('Chart.min'),
        tpl         = require('text!tpl/ResultadoHbdi.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        dochart:function(){
            var hbdidata = this.model.attributes[0],
                Namev=hbdidata["nombre"]+" "+hbdidata["apellido"],
                Av=parseInt(hbdidata["A"]),
                Bv=parseInt(hbdidata["B"]),
                Cv=parseInt(hbdidata["C"]),
                Dv=parseInt(hbdidata["D"]);
           var data = {
                labels: ["A", "D", "C", "B"],
                datasets: [
                    {
                        label: Namev,
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: [Av, Dv, Cv, Bv]
                    }
                ]
            },
            options={
                //Boolean - Whether to show lines for each scale point
                scaleShowLine : true,
                //Boolean - Whether we show the angle lines out of the radar
                angleShowLineOut : true,
                //Boolean - Whether to show labels on the scale
                scaleShowLabels : false,
                // Boolean - Whether the scale should begin at zero
                scaleBeginAtZero : true,
                //String - Colour of the angle line
                angleLineColor : "rgba(0,0,0,.1)",
                //Number - Pixel width of the angle line
                angleLineWidth : 1,
                //String - Point label font declaration
                pointLabelFontFamily : "'Arial'",
                //String - Point label font weight
                pointLabelFontStyle : "normal",
                //Number - Point label font size in pixels
                pointLabelFontSize : 10,
                //String - Point label font colour
                pointLabelFontColor : "#666",
                //Boolean - Whether to show a dot for each point
                pointDot : true,
                //Number - Radius of each point dot in pixels
                pointDotRadius : 3,
                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth : 1,
                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius : 20,
                //Boolean - Whether to show a stroke for datasets
                datasetStroke : true,
                //Number - Pixel width of dataset stroke
                datasetStrokeWidth : 2,
                //Boolean - Whether to fill the dataset with a colour
                datasetFill : true,
                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
            };
            // Get context with jQuery - using jQuery's .get() method.
            var ctx = $("#myChart").get(0).getContext("2d");
            // This will get the first returned node in the jQuery collection.
            var myRadarChart = new Chart(ctx).Radar(data, options);
            
        },

        render: function () {
            delete this.model.attributes.id
            this.$el.html(template({usuario:this.model.attributes[0]}));
            this.dochart();
            return this;
        }

    });

});