function SiteCtrl($scope, $routeParams, $location) {
  $scope.unityProjects = ["Atomic Pinball","Psychosurgeon","r/Knights of New",];
  $scope.webProjects = ["Time Slice","Ico-Ico",];
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
    $scope.gotoWeb = function(index){
      switch(index){
          case 0:
              $location.url("/time");
              break;
          case 1:
              $location.url("/icoico");
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

var site = angular.module('site', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/home.html'}).
      when('/atomic', {templateUrl: 'partials/atomic.html', controller: AtomicCtrl}).
      when('/about', {templateUrl: 'partials/about.html'}).
      when('/psycho', {templateUrl: 'partials/psycho.html'}).
      when('/resume', {templateUrl: 'partials/resume.html'}).
      when('/python', {templateUrl: 'partials/python.html'}).
      when('/time', {templateUrl: 'partials/time.html'}).
      when('/icoico', {templateUrl: 'partials/ico.html'}).
      when('/zombie', {templateUrl: 'partials/zombie.html'}).
      when('/shell', {templateUrl: 'partials/shell.html'}).
      otherwise({redirectTo: '/'});
}]);

site.directive("muckAboutSprite", ["$timeout","$q", function($timeout, $q) {
  return {
      link: function(scope, iElement, iAttrs) {
          if (iAttrs.robot != null){
            var sprites = ["http://i.imgur.com/57AQdCH.png", "http://i.imgur.com/Hbf1qra.png", "http://i.imgur.com/SiIzBLr.png", "http://i.imgur.com/tCMYaFH.png"];  
          } else {
            var sprites = ["http://imgur.com/zUIGo43.png", "http://imgur.com/0mRkARJ.png", "http://imgur.com/UIJ8KaM.png", "http://imgur.com/0yyLhYw.png"];
          }
          var ticksPerSecond = 8;
          var pixelsPerTick = 10;
          var directionToMove;
          var moveInDirection = function(){
              if (directionToMove < 4){
                  iElement.css("background-image", "url("+sprites[directionToMove]+")");
              }
            switch(directionToMove){
                case 0: //go north
                    iElement.css("top", "+="+pixelsPerTick);
                    break;
                case 1: //go east
                    iElement.css("left", "+="+pixelsPerTick);
                    break;
                case 2: //go south
                    iElement.css("top", "-="+pixelsPerTick);
                    break;
                case 3: //go west
                    iElement.css("left", "-="+pixelsPerTick);
                    break;
            }  
          };
          var delayedMove = function(counter){
              var result = $q.defer();
              $timeout(moveInDirection, (1000/ticksPerSecond)).then(function(){
                if (counter > 0){
                    delayedMove(counter-1).then(function(){
                       result.resolve(); 
                    });
                } else {
                    result.resolve();
                }
            });
            return result.promise;
          };
          var muckAbout = function(){
              directionToMove = Math.floor((Math.random()*5));
              var top = iElement.css("top");
              var left = iElement.css("left");
              if (top < 64) directionToMove = 2;
              if (top > 1000) directionToMove = 0;
              if (left < 64) directionToMove = 1;
              if (left > 800) directionToMove = 3;
              var length = Math.floor((Math.random()*5)+1);
              delayedMove(length).then(function(){
                muckAbout();  
              });
          };
          muckAbout();
          
          iElement.css("left", Math.floor((Math.random()*500)+1));
          iElement.css("top", Math.floor((Math.random()*500)+1));
      }
      
      };
}]);
site.directive("zeppelinMothership", ["$timeout","$q", function($timeout, $q) {
  return {
      link: function(scope, iElement, iAttrs) {
          var sprite = "http://i.imgur.com/gX95rYd.png";
          var ticksPerSecond = 8;
          var pixelsPerTick = 1;
          var move = function(){
            iElement.css("left", "+="+pixelsPerTick);
          };
          var delayedMove = function(counter){
              var result = $q.defer();
              $timeout(move, (1000/ticksPerSecond)).then(function(){
                if (counter > 0){
                    delayedMove(counter-1).then(function(){
                       result.resolve(); 
                    });
                } else {
                    result.resolve();
                }
            });
            return result.promise;
          };
          var go = function(){
              delayedMove(length).then(function(){
                go();  
              });
          };
          go();
          
          iElement.css("left", -2468);
          iElement.css("top", Math.floor((Math.random()*500)+1));
      }
      
      }
}]);
site.directive("progressBar", [function(){
  return {
    link: function(scope, iElement, iAttrs){
        var t = $(iElement.find(".progressbar")),
            dataperc = t.attr('data-perc'),
            barperc = Math.round(dataperc*5.56);
        t.find('.bar').animate({width:barperc}, dataperc*25);
        t.find('.label').append('<div class="perc"></div>');
        
        function perc() {
            var length = t.find('.bar').css('width'),
                perc = Math.round(parseInt(length)/5.56),
                labelpos = (parseInt(length)-20);
            t.find('.label').css('left', labelpos);
            t.find('.perc').text(perc+'%');
        }
        perc();
	    setInterval(perc, 0);
    }  
  };
}]);