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
;(() => {
'use strict';
function clientsController($scope, $http) {
    $scope.showPriceForm = false;
    let clientName = null;
    $scope.searchName = () => {
       $http.post('/findClient', {'name': $scope.clientName })
            .then((response) => {
                if(response.data.name) {
                    clientName = response.data.name
                    $scope.showPriceForm = true;
                }
            })
            .catch((error) => {
                console.log('error ', data);
            });
    }

    $scope.createTask = () => {
        let params = {
            'name': clientName, 
            'description' : $scope.description,
            'price': $scope.price
        };
        $http.post('/createTask', params)
            .then((response) => { 
                $scope.taskResponse = response.data;
            })
            .catch((error) => { 
                $scope.taskResponse = response.data;
            });
    }

    $scope.getStatuses = () => {
        $http.post('/listAllTasks', {'name': clientName})
            .then((response) => { 
                $scope.tasks = response.data;
            })
            .catch((error) => { 
                console.log('error ', data);
            });
    }
};

clientsController.$inject = ['$scope', '$http'];
angular.module('freelanceApp').controller('clientsController', clientsController);
})();;(() => {
    'use strict';
    function developersController($scope, $http) {
        $scope.showDevForm = false;
        let developerName = null;
       
        $scope.searchDevName = () => {
            $http.post('/findDeveloper', {'devName': $scope.devName})
            .then((response) => {
                if (response.data.name) {
                    $scope.showDevForm = true;
                    developerName = response.data.name;
                };
            })
            .catch((err) => {
                console.log('err ', err);
            });
        };

        $scope.searchFreeTask = () => {
            $http.post('/findFreeTasks')
                .then((response) => {
                    $scope.tasks = response.data;
                })
                .catch((err) => {
                    console.log('err ', err);
                });
        };

        $scope.assignTask = (task) => {
            if(task.status !== 'NEW') {
                return;
            }

            $http.post('/startTask', {'description': task.description})
                .then((response) => {
                   alert(response.data);
                })
                .catch((err) => {
                    console.log('err ', err);
                });
        };
        $scope.finishTask = (task) => {
            if(task.status !== 'ASSIGNED') {
                return;
            }
            let params = {
                'description': task.description,
                'developerName': developerName
            };
            debugger;
            $http.post('/finishTask', params)
                .then((response) => {
                    alert(response.data);
                })
                .catch((err) => {
                    console.log('err ', err);
                });
        };

        $scope.searchAssignedTask = () => {
            $http.post('/listAssignedTasks')
                .then((response) => {
                    $scope.tasks = response.data;
                })
                .catch((err) => {
                    console.log('err ', err);
                });
        };
    };

    developersController.$inject = ['$scope', '$http'];
    angular.module('freelanceApp').controller('developersController', developersController);
})();