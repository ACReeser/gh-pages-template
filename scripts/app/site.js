function SiteCtrl($scope, $routeParams, $location) {
  $scope.unityProjects = ["Atomic Pinball","Psychosurgeon","r/Knights of New","Shell",];
    $scope.site = {tab: ""};
    $scope.gotoUnity = function(index){
      switch(index){
          case 0:
              $location.url("/atomic");
              break;
          case 1:
              $location.url("/psycho");
              break;
      }  
    };
    $scope.goto = function(url){
        $location.url(url);
    };
}
SiteCtrl.$inject = ['$scope', '$routeParams', '$location'];

function AtomicCtrl($scope, $routeParams, $location) {
}

AtomicCtrl.$inject = ['$scope', '$routeParams', '$location'];

angular.module('site', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/home.html'}).
      when('/atomic', {templateUrl: 'partials/atomic.html', controller: AtomicCtrl}).
      when('/about', {templateUrl: 'partials/about.html'}).
      when('/psycho', {templateUrl: 'partials/psycho.html'}).
      when('/resume', {templateUrl: 'partials/resume.html'}).
      when('/python', {templateUrl: 'partials/python.html'}).
      otherwise({redirectTo: '/'});
}]);
  