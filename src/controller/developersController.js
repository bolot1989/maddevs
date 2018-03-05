(() => {
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