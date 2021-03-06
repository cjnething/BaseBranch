
var d3 = require('d3');
var React = require('react');
var GraphStore = require('../stores/GraphStore.jsx');
var GraphView = require('./GraphView.jsx');
var NodeResourceActions = require('../actions/NodeResourceActions.js');

var ANIMATION_DURATION = 400;
var TOOLTIP_WIDTH = 30;
var TOOLTIP_HEIGHT = 30;


// d3.selection.prototype.moveToFront = function() {
//   return this.each(function(){
//     this.parentNode.appendChild(this);
//   });
// };  


var ns = {};

ns.create = function(el, props, state) {
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', GraphStore.width)
      .attr('height', GraphStore.height)
      .attr('style', 'background: AliceBlue');

  svg.append('g')
      .attr('class', 'd3-points');

  svg.append('g')
      .attr('class', 'd3-tooltips');

  svg.append('g')
      .attr('class', 'd3-text');

  //var dispatcher = new EventEmitter();
  this.update(el, state, null);

  return; //dispatcher;
};

ns.update = function(el, state) {
  var scales = this._scales(el, state.domain);
  var prevScales = this._scales(el, state.prevDomain);
  this._drawPoints(el, scales, state.data, prevScales);
  this._drawTooltips(el, scales, state.tooltips, prevScales);
};

ns._scales = function(el, domain) {
  if (!domain) {
    return null;
  }

  var width = el.offsetWidth;
  var height = el.offsetHeight;

  var x = d3.scale.linear()
    .range([0, width])
    .domain(domain.x);

  var y = d3.scale.linear()
    .range([height, 0])
    .domain(domain.y);

  var z = d3.scale.linear()
    .range([5, 20])
    .domain([1, 10]);

  return {x: x, y: y, z: z};
};

ns._drawPoints = function(el, scales, data, prevScales) {
  var g = d3.select(el).selectAll('.d3-points');

  var gt = d3.select(el).selectAll('.d3-text');

  var point = g.selectAll('.d3-point')
    .data(data, function(d) { return d.id; });

  var text = gt.selectAll('.d3-text')
    .data(data, function(d) { return d.id; });


  // Draw the circle into the canvas
  point.enter().append('circle')
    .attr('class', 'd3-point')
    .attr('stroke', 'CornflowerBlue')
    .attr('fill', 'AliceBlue')
    .attr('cx', function(d) {
      if (prevScales) {
        return prevScales.x(d.x);
      }
      return scales.x(d.x);
    })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', function(d) { return scales.x(d.x); });

  point.attr('cy', function(d) { return scales.y(d.y); })
      .attr('r', function(d) { return scales.z(d.z); })
      .on('mouseover', function(d) {
        //
      })
      .on('mouseout', function(d) {
        //
      })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', function(d) { return scales.x(d.x); });


  // Add text and link to circles
  text.enter().append("text")
    .attr("x", function(d) { return scales.x(d.x); })
    .attr("y", function(d) { return scales.y(d.y); })
    .attr("z", 11)
    .attr('class', 'd3-text')
    .text( function (d) { return d.name; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("cursor", "pointer")
    .attr("id", function(d) {return d.id})
    .on("click", function(d) {
      NodeResourceActions.setNodeId(d.id);
      GraphView.openModal();
      console.log('gv',GraphView);
    });
    //.moveToFront();

  if (prevScales) {
    point.exit()
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', function(d) { return scales.x(d.x); })
        .remove();
  }
  else {
    point.exit()
        .remove();
  }
};

ns._drawTooltips = function(el, scales, tooltips, prevScales) {
  var g = d3.select(el).selectAll('.d3-tooltips');

  var tooltipRect = g.selectAll('.d3-tooltip-rect')
    .data(tooltips, function(d) { return d.id; });

  tooltipRect.enter().append('rect')
      .attr('class', 'd3-tooltip-rect')
      .attr('width', TOOLTIP_WIDTH)
      .attr('height', TOOLTIP_HEIGHT)
      .attr('x', function(d) {
        if (prevScales) {
          return prevScales.x(d.x) - TOOLTIP_WIDTH/2;
        }
        return scales.x(d.x) - TOOLTIP_WIDTH/2;
      })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; });

  tooltipRect.attr('y', function(d) { return scales.y(d.y) - scales.z(d.z)/2 - TOOLTIP_HEIGHT; })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; });

  if (prevScales) {
    tooltipRect.exit()
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; })
        .remove();
  }
  else {
    tooltipRect.exit()
        .remove();
  }

  var tooltipText = g.selectAll('.d3-tooltip-text')
    .data(tooltips, function(d) { return d.id; });

  tooltipText.enter().append('text')
      .attr('class', 'd3-tooltip-text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(function(d) { return d.z; })
      .attr('x', function(d) {
        if (prevScales) {
          return prevScales.x(d.x);
        }
        return scales.x(d.x);
      })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', function(d) { return scales.x(d.x); });

  tooltipText.attr('y', function(d) { return scales.y(d.y) - scales.z(d.z)/2 - TOOLTIP_HEIGHT/2; })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', function(d) { return scales.x(d.x); });

  if (prevScales) {
    tooltipText.exit()
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('x', function(d) { return scales.x(d.x); })
        .remove();
  }
  else {
    tooltipText.exit()
        .remove();
  }
};

ns.destroy = function(el) {

};

module.exports = ns;
