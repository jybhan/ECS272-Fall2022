import * as d3 from "d3";


//----------------------------------------------------------------------------------//
// Parallel plot
//----------------------------------------------------------------------------------//

export function createDashboard(){
// constructing margins for the graphic
const margin = {top: 30, right: 10, bottom: 10, left: 0},
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;


// put the svg object to the body of the page
const svg = d3.select("#parallelPlot")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        `translate(${margin.left},${margin.top})`);

// Bring in data
d3.csv("https://raw.githubusercontent.com/jybhan/ECS272-Fall2022/main/Homework2/jbhan/studentData.csv").then( function(data) {

  // Only keeping three dimensinos, g1, g2, and g3 for our x axis.
  let dimensions = Object.keys(data[0]).filter(function(d) { return d == "g1" || d== "g2" || d=="g3" })

  // For each dimension, I build a linear scale. I store all in a y object
  let y = {}
  dimensions.forEach(function(dimension){
    let name = dimension
    y[name] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[name]; }) )
      .range([height, 0])
  })

  // Build the X scale -> it find the best position for each Y axis
  let x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function pcoordPath(d) {
      return d3.line()(
        dimensions.map(function(p) { 
            let yValue = Number(d[p])
            let yScale = y[p]
            return [x(p), yScale(yValue)]; 
        })
       );

  }

  // Draw the lines
  svg
    .selectAll("parallelPath")
    .data(data)
    .join("path")
    .attr("d",  pcoordPath)
    .style("fill", "none")
    .style("stroke", "#969696")
    .style("opacity", 0.5)

    d3.select("#Urbanicity").on("click", function(e){
        /* FUNCTION LOGIC ON WHAT YOU DO HERE*/
          svg
            .selectAll("parallelPath")
            .data(data)
            .join("path")
            .attr("d",  pcoordPath)
            .style("fill", "none")
            .style("stroke", d => { return (d["address"].includes("R")) ? "#E41A1B" : "#387EB8"})
            .style("opacity", 0.5)
    })
    
    d3.select("#School").on("click", function(e){
        /* FUNCTION LOGIC ON WHAT YOU DO HERE*/
        svg
            .selectAll("parallelPath")
            .data(data)
            .join("path")
            .attr("d",  pcoordPath)
            .style("fill", "none")
            .style("stroke", d => { return (d["school"].includes("GP")) ? "#E41A1B" : "#387EB8"})
            .style("opacity", 0.5)
    })
    
    d3.select("#Sex").on("click", function(e){
        /* FUNCTION LOGIC ON WHAT YOU DO HERE*/
        svg
            .selectAll("parallelPath")
            .data(data)
            .join("path")
            .attr("d",  pcoordPath)
            .style("fill", "none")
            .style("stroke", d => { return (d["sex"].includes("F")) ? "#E41A1B" : "#387EB8"})
            .style("opacity", 0.5)
    })

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")
 

      //Add axis labels
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+170)
        .attr("x", -margin.top)
        .text("Academic Performance (0-20)")
})

// Adding legend
      var SVG = d3.select("#parallelLegend")
      // create a list of keys
      var keys = ["Rural |  GP  |  Female", "Urban  |  MS  |  Male"]
      // color scale
      var color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeSet1);
      // add dots
      var size = 20
      SVG.selectAll("mydots")
        .data(keys)
        .enter()
        .append("rect")
          .attr("x", 100)
          .attr("y", function(d,i){ return 100 + i*(size+5)}) 
          .attr("width", size)
          .attr("height", size)
          .style("fill", function(d){ return color(d)})
      // add labels
      SVG.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
          .attr("x", 100 + size*1.2)
          .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) 
          .style("fill", function(d){ return color(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")



//----------------------------------------------------------------------------------//
// Scatter plot
//----------------------------------------------------------------------------------//

        // set the dimensions and margins of the graph
        const margin2 = {top: 10, right: 30, bottom: 30, left: 60},
                width2 = 400 - margin2.left - margin2.right,
                height2 = 380 - margin2.top - margin2.bottom;
          
        // append the svg object to the body of the page
        const svg2 = d3.select("#scatterPlot")
            .append("svg")
            .attr("width", width2 + margin2.left + margin2.right)
            .attr("height", height2 + margin2.top + margin2.bottom)
            .append("g")
            .attr("transform", `translate(${margin2.left}, ${margin2.top})`);
        
        //Read the data
        d3.csv("https://raw.githubusercontent.com/jybhan/ECS272-Fall2022/main/Homework2/jbhan/studentData.csv").then( function(data) {
        
            // Add X axis
            const x2 = d3.scaleLinear()
            .domain([ 0, 4.5])
            .range([ 0, width2 ]);
            
          svg2.append("g")
            .attr("transform", `translate(0, ${height2})`)
            .call(d3.axisBottom(x2));
        
            // Add Y axis
            const y2 = d3.scaleLinear()
            .domain([0, 4.5])
            .range([ height2, 0]);
          svg2.append("g")
            .call(d3.axisLeft(y2));
         
          
            // Add dots
            svg2.append('g')
            .selectAll("scatterDot")
            .data(data)
            .join("circle")
                .attr("cx", function (d) { return x2(d.motheredu); } )
                .attr("cy", function (d) { return y2(d.fatheredu); } )
                .attr("r", function (d) {return(d.average);})
                .style("fill", "black")
                .style("opacity", 0.2)
      
         })
      
      // Add X axis label:
      svg2.append("text")
        .attr("text-anchor", "end")
        .attr("x", width2)
        .attr("y", height2 + 30)
        .text("Mother's education");
  
      //Add axis labels
      svg2.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin2.left+30)
        .attr("x", -margin2.top)
        .text("Father's education")
      
      // Code for Legend

      var scatterLegend = d3.select("#scatterLegend")

      scatterLegend.append("circle").attr("cx",50).attr("cy",15).attr("r", 6)
          .style("fill", "#969696")
      scatterLegend.append("circle").attr("cx",50).attr("cy",40).attr("r", 12)
          .style("fill", "#969696")
      scatterLegend.append("text").attr("x", 70).attr("y", 15)
          .text("Lower Average Scores (G1 - G3)").style("font-size", "15px").attr("alignment-baseline","middle")
      scatterLegend.append("text").attr("x", 70).attr("y", 40)
          .text("Higher Average Scores (G1 - G3)").style("font-size", "15px").attr("alignment-baseline","middle")      
   
    // Code for Scatterplot filters

    d3.select("#scatterOption").on("change", function(e){
        /* FUNCTION LOGIC ON WHAT YOU DO HERE*/
        svg2.selectAll("*").remove();
        let selectionChoice = d3.select(this).property('value')
        let keyValue = selectionChoice.split("-")
        // let key = ?
        // let value = ?
        //Adjust the Data Variable..
        //data[key]==value

        d3.csv("https://raw.githubusercontent.com/jybhan/ECS272-Fall2022/main/Homework2/jbhan/studentData.csv").then( function(data) {
            //what if i dont want to filter?
            let chartData = (keyValue[1].includes("A")) ? data : filterData(keyValue[0], keyValue[1], data);
            

            //if(Key == "A"){ dont filter } else { filter 
            const x2 = d3.scaleLinear()
               .domain([ 0, 4.5])
               .range([ 0, width2 ]);
            
            svg2.append("g")
               .attr("transform", `translate(0, ${height2})`)
               .call(d3.axisBottom(x2));

            // Add Y axis
             const y2 = d3.scaleLinear()
               .domain([0, 4.5])
               .range([ height2, 0]);

             svg2.append("g")
               .call(d3.axisLeft(y2));
          
            // Add dots
            
            svg2.append('g')
                .selectAll("scatterDot")
                .data(chartData)
                .join("circle")
                .attr("cx", function (d) { return x2(d.motheredu); } )
                .attr("cy", function (d) { return y2(d.fatheredu); } )
                .attr("r", function (d) {return(d.average);})
                .style("fill", "black")
                .style("opacity", 0.2)
        
         })

    })

    function filterData(key, value, data){
        return data.filter(d => d[key] == value)
    }


    // For dropdown value change
        var dropdownChange = function() {
            var newScatter = d3.select(this).property('average'),
                newData =  data[newScatter];
                updateScatter(newScatter);
        };
     

//----------------------------------------------------------------------------------//
// Pie chart
//----------------------------------------------------------------------------------//
   
        // set the dimensions and margins of the graph
        const width3 = 600,
            height3 = 200,
            margin3 = 40;
        
        // radius of the pie chart
        const radius = Math.min(width3, height3) / 2 - margin3;
        
        // append the svg object to the div
        const svg3 = d3.select("#pieChart")
          .append("svg")
            .attr("width", width3)
            .attr("height", height3)
          .append("g")
            .attr("transform", `translate(${width3-450}, ${height3/2})`);
        
        // create 2 data_sets
        const motheredu2 = {a: 0, b: 59, c:103, d:99, e:131}
        const fatheredu2 = {a: 2, b: 82, c:115, d:100, e:96}
        
        // set the color scale
        const color2 = d3.scaleOrdinal()
          .domain(["a", "b", "c", "d", "e"])
          .range(d3.schemeDark2);
          const pie = d3.pie()
          .value(function(d) {return d[1]; })
          .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) //
        // A function that create / update the plot for a given variable:
        function update(piedata) {
        
          // Compute the position of each group on the pie:
          const data_ready = pie(Object.entries(piedata))
        
          console.log(data_ready)

          // map to data
          const u = svg3.selectAll("path")
            .data(data_ready)
        
          // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.  
          u
            .join('path')
            .transition()
            .duration(1000)
            .attr('d', d3.arc()
              .innerRadius(80)
              .outerRadius(radius)
            )
            .attr('fill', function(d){ return(color2(d.data[0])) })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1)
        };

        d3.select("#motheredu").on("click", function(e){
            const piemother = pie(Object.entries(motheredu2))
            const u = svg3.selectAll("path")
            .data(piemother)
        
          // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.  
          u
            .join('path')
            .transition()
            .duration(1000)
            .attr('d', d3.arc()
              .innerRadius(80)
              .outerRadius(radius)
            )
            .attr('fill', function(d){ return(color2(d.data[0])) })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1)
    
        });
        
        d3.select("#fatheredu").on("click", function(e){
            const piefather = pie(Object.entries(fatheredu2))
            const u = svg3.selectAll("path")
            .data(piefather)

        
          // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.  
          u
            .join('path')
            .transition()
            .duration(1000)
            .attr('d', d3.arc()
              .innerRadius(80)
              .outerRadius(radius)
            )
            .attr('fill', function(d){ return(color2(d.data[0])) })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1)
    
        });


        // Initialize the plot with the first dataset
        update(motheredu2)
          
        var pieLegend = d3.select("#pieLegend")
        
        svg3.append("rect").attr("x",200).attr("y", -80)
          .attr("width", 15).attr("height", 15).style("fill", "#1c9E77")
        svg3.append("rect").attr("x",200).attr("y",-40)
          .attr("width", 15).attr("height", 15).style("fill", "#d95f02")
        svg3.append("rect").attr("x",200).attr("y",0)
          .attr("width", 15).attr("height", 15).style("fill", "#7570b3")
        svg3.append("rect").attr("x",200).attr("y",40)
          .attr("width", 15).attr("height", 15).style("fill", "#e72a84")
        svg3.append("rect").attr("x",200).attr("y",80)
          .attr("width", 15).attr("height", 15).style("fill", "#66A61E")
          
          
        svg3.append("text").attr("x", 220).attr("y", -75)
          .text("None").style("font-size", "15px")
          .attr("alignment-baseline","middle")
        svg3.append("text").attr("x", 220).attr("y", -35)
          .text("Pirmary Education (4th Grade)").style("font-size", "15px")
          .attr("alignment-baseline","middle")
        svg3.append("text").attr("x", 220).attr("y", 5)
          .text("5th to 9th Grade").style("font-size", "15px")
          .attr("alignment-baseline","middle")
        svg3.append("text").attr("x", 220).attr("y", 45)
          .text("Secondary Education").style("font-size", "15px")
          .attr("alignment-baseline","middle")
        svg3.append("text").attr("x", 220).attr("y", 85)
          .text("Higher Education").style("font-size", "15px")
          .attr("alignment-baseline","middle")

    }

export function initPC(){
   // d3 appends only (Creating it for the first time)
   // Create the SVG
   //Create the GROUP (G) Tags for the svg happens here, give them ID's

}

export function parallelChart(data){
    d3.select("#svg").selectAll("*").remove() // clears the entire svg
    /* Logic for this chart  (Updating your chart)*/
    //d3 selections only here
    
}

export function scatterPlot(data){
    d3.select("#svg2").selectAll("*").remove() 
    /* Logic for this chart */
}

export function pieChart(data){
    /* Logic for this chart */

}
