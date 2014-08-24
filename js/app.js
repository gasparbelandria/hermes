require.config({

    baseUrl: 'js/lib',

    paths: {
        app: '../app',
        tpl: '../tpl'
    },

    map: {
        '*': {
            'app/models/employee': 'app/models/jsonp/employee',
            'app/models/departamento': 'app/models/jsonp/departamento',
            'app/models/compania': 'app/models/jsonp/compania',
            'app/models/resultadohbdi': 'app/models/jsonp/resultadohbdi',
            'app/models/resultadopapi': 'app/models/jsonp/resultadopapi',
            'app/models/allcompania': 'app/models/jsonp/allcompania'
        }
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require(['jquery', 'backbone', 'app/router'], function ($, Backbone, Router) {
    var router = new Router();
    Backbone.history.start();
});