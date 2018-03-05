(() => {
    'use strict';

    let freelanceApp = angular.module('freelanceApp', ['ui.router']);

    freelanceApp.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {

        $urlRouterProvider.otherwise('/clients');

        $stateProvider.state('clients', {
            url: '/clients',
            templateUrl: 'views/clients.html',
            controller: 'clientsController'
        }).state('developers', {
            url: '/developers',
            templateUrl: 'views/developers.html',
            controller: 'developersController'
        });
    }]);
})();
