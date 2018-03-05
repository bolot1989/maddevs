(() => {
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
})();