
{
    const svg = d3.create('svg').attr('viewBox', [0, 0, width, 200]);
  
    svg
      .append('circle')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', 20)
      .style('fill', 'green');
  
    return svg.node();
  }