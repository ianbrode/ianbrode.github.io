webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Stylesheet entrypoint
	__webpack_require__(10);
	
	const HexMap = __webpack_require__(6);
	
	new HexMap('body');


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// Depends
	const $ = __webpack_require__(1);
	const d3 = __webpack_require__(3);
	d3.hexbin = __webpack_require__(2).hexbin;
	const pointInPolygon = __webpack_require__(4);
	
	const voronoiMap = __webpack_require__(7);
	
	module.exports = function(el) {
	  let margin = {
	    top: 50,
	    right: 20,
	    bottom: 20,
	    left: 50
	  };
	  let width = 850;
	  let height = 350;
	  let MapColumns = 30;
	  let MapRows = 20;
	  let hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),height/((MapRows + 1/3) * 1.5)]);
	
	  let points = [];
	  for (let i = 0; i < MapRows; i++) {
	    for (let j = 0; j < MapColumns; j++) {
	      points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
	    }
	  }
	  let hexbin = d3.hexbin().radius(hexRadius);
	  let hexpoints = hexbin(points);
	  hexpoints[0].visited = true;
	
	  let svg = d3.select(el).append('svg')
	    .attr('width', width + margin.left + margin.right)
	    .attr('height', height + margin.top + margin.bottom)
	    .append('g')
	    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
	  let hexmap = svg.append('g').classed('hexmap', true);
	
	  hexmap.selectAll('.hexagon')
	    .data(hexpoints)
	    .enter()
	    .append('path')
	    .attr('class', 'hexagon')
	    .attr('d', (d) => 'M' + d.x + ',' + d.y + hexbin.hexagon())
	    .attr('stroke', 'white')
	    .attr('stroke-width', '1px')
	    .style('fill', '#676666');
	
	  svg.selectAll('.hexagon')
	    .on('mousedown', update);
	
	  svg.append('g')
	    .append('circle')
	    .attr('r', 5);
	
	  let token = d3.select('circle');
	
	  function update(e) {
	    if (!e.clickable) return;
	
	    e.visited = true;
	
	    svg.selectAll('.hexagon')
	      .each((d) => {
	        let result;
	        if((e.i%2 !== 0 && e.j%2 !== 0) || (e.i%2 == 0 && e.j%2 !== 0)){
	          result = (d.i <= e.i+1 && d.i >= e.i) && (d.j <= e.j+1 && d.j >= e.j-1) || (d.j == e.j && d.i == e.i-1) ? true : false ;
	        } else {
	          result = (d.i <= e.i && d.i >= e.i-1) && (d.j <= e.j+1 && d.j >= e.j-1) || (d.j == e.j && d.i == e.i+1) ? true : false ;  
	        }
	        d.clickable = result;
	        if (!d.visible) d.visible = result;
	      })
	      .style('fill', (d) => (d.visited || d.visible) ? d.region : '#676666')
	      .style('stroke', (d) => d.clickable ? '#78FFAB' : 'white' )
	      .style('fill-opacity', (d) => d.clickable ? 1 : 0.5)
	      .classed('_active', (d) => d.clickable ? true : false);
	
	    token.transition()
	      .attr('cx', e.x)
	      .attr('cy', e.y)
	  }
	
	  let poligons = voronoiMap();
	
	  let regions = ['desert', 'forest', 'hills', 'marsh', 'mountains', 'plains'];
	  
	  let colors = ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'violet', 'steelblue', 'wheat', '#515050'];
	
	  function rollDice(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	  }
	
	  // function generateRegion(i) {
	  //   // i%6
	  //   rollDice(1, 6)
	  // }
	
	  svg.selectAll('.hexagon')
	    .each((d) => {
	      poligons.forEach((p, i) => {
	        if (pointInPolygon([d.x, d.y], p)) d.region = colors[i];
	      });
	    })
	
	  update({
	    i: 0,
	    j: 0,
	    x: hexpoints[0].x,
	    y: hexpoints[0].y,
	    clickable: true
	  });
	
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const d3 = __webpack_require__(3);
	
	module.exports = function() {
	  let hexmap = d3.select('.hexmap').node().getBBox();
	  let width = hexmap.width;
	  let height = hexmap.height;
	  let vertices = d3.range(10).map((d) => [Math.random() * width, Math.random() * height]);
	  let voronoi = d3.geom.voronoi().clipExtent([[0, 0], [width, height]]);
	  return voronoi(vertices);
	};


/***/ },
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=application.bundle.65ec094588935e41ec89.js.map