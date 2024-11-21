// Load the CSV file
d3.csv("global_trends.csv").then(function(data) {

    // Convert the 'count' and 'year' columns to numeric types
    data.forEach(d => {
      d.year = +d.year;
      d.count = +d.count;
    });
  
    // Group the data by category and sum the counts to get top categories
    const categoryTrends = d3.nest()
      .key(d => d.category)
      .rollup(v => d3.sum(v, d => d.count))
      .entries(data);
  
    // Get top 10 categories based on total count
    const topCategories = categoryTrends
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(d => d.key);
  
    // Filter the data to include only the top categories
    const filteredData = data.filter(d => topCategories.includes(d.category));
  
    // Get all unique years
    const years = Array.from(new Set(filteredData.map(d => d.year)));
  
    // Set up the margins, width, and height
    const margin = { top: 20, right: 40, bottom: 100, left: 150 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
  
    // Create the SVG container
    const svg = d3.select("#chart2")  // Targeting the second chart container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Create scales for the x and y axes
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.count) + 10])
      .range([0, width]);
  
    const yScale = d3.scaleBand()
      .domain(topCategories)
      .range([0, height])
      .padding(0.1);
  
    // Create the x and y axes
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
  
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));
  
    // Create a group for the bars
    const barsGroup = svg.append("g")
      .attr("class", "bars");
  
    // Create a function for updating the bars for each year
    function updateBars(year) {
      const yearData = filteredData.filter(d => d.year === year);
  
      const bars = barsGroup.selectAll(".bar")
        .data(yearData, d => d.category);
  
      // Enter new bars
      bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.category))
        .attr("width", 0) // Set initial width to 0 for animation
        .attr("height", yScale.bandwidth())
        .attr("fill", d => d3.schemeCategory10[d.category % 10])
        .transition()
        .duration(500)
        .attr("width", d => xScale(d.count));
  
      // Update existing bars
      bars.transition()
        .duration(500)
        .attr("x", 0)
        .attr("y", d => yScale(d.category))
        .attr("width", d => xScale(d.count));
  
      // Remove bars that are no longer in the data
      bars.exit().remove();
    }
  
    // Create animation frames for the years
    let currentYearIndex = 0;
  
    function animate() {
      updateBars(years[currentYearIndex]);
      currentYearIndex = (currentYearIndex + 1) % years.length;
    }
  
    let intervalId;
  
    function playAnimation() {
      intervalId = setInterval(animate, 1000); // Adjust the duration for animation speed
    }
  
    function pauseAnimation() {
      clearInterval(intervalId);
    }
  
    // Add play and pause buttons if not already present
    const buttons = d3.select("#controls");
    if (buttons.select("button").empty()) {
        buttons.append("button")
            .text("Play")
            .on("click", playAnimation);

        buttons.append("button")
            .text("Pause")
            .on("click", pauseAnimation);
    }
  
    // Initialize with the first year
    updateBars(years[0]);
  
    // Start the animation automatically
    playAnimation();
  
});
