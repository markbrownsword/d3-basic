'use strict';

angular.module('myApp', [])

.factory('d3', ['$window', function($window) {
  return $window.d3;
}])

.directive('sparkLine', ['$window', 'd3', function($window, d3) {
  function draw(svg, x, y, line, data) {
    var width = parseInt(svg.style('width'));
    var height = parseInt(svg.style('height'));

    x.range([0, width]).nice();
    y.range([height, 0]).nice();
    x.domain(d3.extent(data, function(d) { return d.day; }));
    y.domain([0, d3.max(data, function(d) { return d.tasks; })]);

    svg.select('.linePath').attr('d', line(data));
  }

  function link(scope, element, attrs) {
    var self = d3.select(element[0]);
    var svg = self.append('svg');
    var data = scope.data;
    var x = d3.scale.linear();
    var y = d3.scale.linear();

    // Create function to draw line
    var line = d3.svg.line().interpolate('basis')
      .x(function(d) { return x(d.day); })
      .y(function(d) { return y(d.tasks); });

    // Append path to SVG
    svg.append("path").attr('class', 'linePath');

    // Bind window resize event
    angular.element($window).bind('resize', function() {
      draw(svg, x, y, line, data);
    });

    // Watch changes in underlying data
    scope.$watch('data', function(newVal, oldVal, scope) {
      draw(svg, x, y, line, data);
    }, true);
  }

  return {
    restrict: 'EA',
    scope: {
      data: '='
    },
    link: link
  };
}])

.controller('myApp.mainController', ['$scope', function ($scope) {
  $scope.teams = [
    {
      name: 'Team 1',
      burn: [
        { day: 1, tasks: 25 },
        { day: 2, tasks: 24 },
        { day: 3, tasks: 23 },
        { day: 4, tasks: 20 },
        { day: 5, tasks: 17 },
        { day: 6, tasks: 15 },
        { day: 7, tasks: 12 },
        { day: 8, tasks: 10 },
        { day: 9, tasks: 7 },
        { day: 10, tasks: 4 }
      ]
    }
  ];
}]);
