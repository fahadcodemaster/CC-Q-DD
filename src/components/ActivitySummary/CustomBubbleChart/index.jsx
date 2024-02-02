import React, {useEffect, useRef} from "react";
import * as d3 from 'd3';

import './style.css'


const CustomBubbleChart = ({data, isHovered, setIsHovered}) => {

    let count = 0;
    const svgRef = useRef(null)
    const tooltipRef = useRef(null)
    if (data){
      data.map((d) => {
        count += d.size
      })
    }

    const calculatePurcentage = (x) => Math.round(parseFloat((x/count)*100).toFixed(1))

    useEffect(() => {

      function createChart() {
        let svgEl = d3.select(svgRef.current)
        const tooltip = d3.select(tooltipRef.current).style('opacity', '0')
        svgEl.selectAll("*").remove();
        
        let svg = svgEl
          .append("svg")
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("height", "400")
          .attr("width", "500")
          .classed("svg-content-responsive", true);
      
        let bubble = d3.layout
          .pack()
          .size([500, 400])
          .value(function(d) {
            return d.size;
          })
          .padding(5);
        // generate data with calculated layout values
        var nodes = bubble.nodes({children: data}).filter(function(d) {
          return !d.children;
        }); // filter out the outer bubble
      
        var vis = svg.selectAll("circle").data(nodes, function(d, i) {
          return d.name + i;
        });
      
        vis
          .enter()
          .append("circle")
          .attr("opacity", (d) => {
            return d.opacity
          })
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
          .attr("class", function(d) {
            return d.className;
          })
          .attr("r", 0)
          .transition()
          .duration(1000)
          .attr("r", function(d) {
            return d.r;
          })
      
        vis
          .enter()
          .append("svg:image").style('opacity', 0)
          .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
          .attr('x', (d) => -(d.r))
          .attr('y', (d) => - (d.r))
          .attr("r", 0)
          .attr('class', 'bubbleImage')
          .on("mouseover", function(d) {
            setIsHovered(d.name.toLowerCase())
            
            tooltip.transition()	
            .duration(200)		
            .style("opacity", .9);		
            tooltip.html("<h3>" + d.name + "</h3>" + "<h2>" + d.size +  " ("+calculatePurcentage(d.size)+"%)</h2>")
            .style("left", (d3.event.pageX - 300) + "px")
            .style("top", (d.y - d.r) + "px");	
          })
          .on("mousemove", (d) => {
            tooltip
              .style("left", (d3.event.pageX - 300) + "px")
              .style("top", (d.y - d.r) + "px");	
          })		
          .on("mouseout", function(d) {	
            setIsHovered('')	
            tooltip.transition()
                  .duration(500)		
                  .style("opacity", 0);	
          })
          .attr("xlink:href", function(d) {
            return d.img;
          })
          .attr("width", function(d) {
            return d.r*2;
          })
          .transition().duration(1000).style('opacity', (d) => {
            return d.opacity
          });
    }

        if(data){
          createChart()
        }
    }, [data])


      

    return (
      <div className="container">
            <div className="bubble_chart" ref={svgRef}></div>
            <div className="tooltip" ref={tooltipRef}></div>
        </div>
    )
}

export default CustomBubbleChart;