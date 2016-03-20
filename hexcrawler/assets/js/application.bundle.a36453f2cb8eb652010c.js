webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Stylesheet entrypoint
	__webpack_require__(7);
	
	// Depends
	const $ = __webpack_require__(1);
	const d3 = __webpack_require__(3);
	d3.hexbin = __webpack_require__(2).hexbin;
	
	// Are you ready?
	$(function() {
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
	
	  let svg = d3.select('body').append('svg')
	    .attr('width', width + margin.left + margin.right)
	    .attr('height', height + margin.top + margin.bottom)
	    .append('g')
	    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
	  svg.append('g')
	    .selectAll('.hexagon')
	    .data(hexpoints)
	    .enter().append('path')
	    .attr('class', 'hexagon')
	    .attr('d', (d) => 'M' + d.x + ',' + d.y + hexbin.hexagon())
	    .attr('stroke', 'white')
	    .attr('stroke-width', '1px')
	    .style('fill', 'teal');
	
	  svg.selectAll('.hexagon').on('mousedown', update);
	
	  svg.append('g')
	    .append('circle')
	    .attr('r', 5)
	    // .attr('cx', hexpoints[0].x)
	    // .attr('cy', hexpoints[0].y);
	
	  let token = d3.select('circle');
	
	  function update(e) {
	    if (!e.clickable) return;
	
	    svg.selectAll('.hexagon')
	      .each((d) => {
	        if((e.i%2 !== 0 && e.j%2 !== 0) || (e.i%2 == 0 && e.j%2 !== 0)){
	          d.clickable = (d.i <= e.i+1 && d.i >= e.i) && (d.j <= e.j+1 && d.j >= e.j-1) || (d.j == e.j && d.i == e.i-1) ? true : false ;
	        } else {
	          d.clickable = (d.i <= e.i && d.i >= e.i-1) && (d.j <= e.j+1 && d.j >= e.j-1) || (d.j == e.j && d.i == e.i+1) ? true : false ;  
	        }
	      })
	      .style('fill', (d) => d.clickable ? '#D4D4D4' : (d.visited ? 'gray' : 'teal') )
	      .classed('_active', (d) => d.clickable ? true : false);
	
	    token
	      .transition()
	      .attr('cx', e.x)
	      .attr('cy', e.y)
	
	    e.visited = true;
	  }
	
	  update({
	    i: 0,
	    j: 0,
	    x: hexpoints[0].x,
	    y: hexpoints[0].y,
	    clickable: true
	  });
	});


/***/ },

/***/ 7:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=application.bundle.a36453f2cb8eb652010c.js.map