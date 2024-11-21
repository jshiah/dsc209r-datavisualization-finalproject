// Chart 1: Global Trends Visualization (from script.js)
let interval1, isPaused1 = false; // For chart 1 controls
const margin1 = { top: 50, right: 60, bottom: 200, left: 100 };
const width1 = 800 - margin1.left - margin1.right;
const height1 = 600 - margin1.top - margin1.bottom;

const svg1 = d3.select("#chart1")
    .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", `translate(${margin1.left},${margin1.top})`);

let nestedData1, years1, categories1;
let yearIndex1 = 0;
let categoryIndex1 = 0;

d3.csv("global_trends.csv").then(data => {
    data.forEach(d => d.rank = +d.rank);

    nestedData1 = d3.group(data, d => d.year, d => d.category);
    years1 = Array.from(nestedData1.keys());
    categories1 = Array.from(nestedData1.get(years1[yearIndex1]).keys());

    const xScale1 = d3.scaleBand().range([0, width1]).padding(0.1);
    const yScale1 = d3.scaleLinear().range([height1, 0]);
    const colorScale1 = d3.scaleOrdinal(d3.schemeCategory10);

    const xAxis1 = svg1.append("g").attr("transform", `translate(0,${height1})`);
    const yAxis1 = svg1.append("g");

    svg1.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height1 / 2)
        .attr("y", -margin1.left + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("visibility", "hidden")
        .text("Rank");

    const chartTitle1 = svg1.append("text")
        .attr("class", "title")
        .attr("x", width1 / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle");

    function updateChart1(year, category) {
        svg1.select(".y-axis-label").style("visibility", "visible");

        const categoryData1 = Array.from(nestedData1.get(year)?.get(category) || [])
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 5)
            .map(d => ({
                ...d,
                transformedRank: 6 - d.rank
            }));

        xScale1.domain(categoryData1.map(d => d.query));
        yScale1.domain([0, 5]);

        chartTitle1.text(`Top 5 Searches (${category}) - ${year}`);

        const bars = svg1.selectAll(".bar")
            .data(categoryData1, d => d.query);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale1(d.query))
            .attr("width", xScale1.bandwidth())
            .attr("fill", d => colorScale1(category))
            .attr("y", d => yScale1(d.transformedRank))
            .attr("height", d => height1 - yScale1(d.transformedRank));

        bars.transition()
            .duration(500)
            .attr("x", d => xScale1(d.query))
            .attr("y", d => yScale1(d.transformedRank))
            .attr("height", d => height1 - yScale1(d.transformedRank));

        bars.exit().remove();

        xAxis1.transition().duration(500).call(d3.axisBottom(xScale1));
        xAxis1.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .attr("dx", "-0.5em")
            .attr("dy", "0.25em");

        yAxis1.call(d3.axisLeft(yScale1).ticks(5));
    }

    // Play, Pause, Restart functions for Chart 1
    function playChart1() {
        if (interval1) clearInterval(interval1);
        interval1 = setInterval(() => {
            if (yearIndex1 >= years1.length) {
                clearInterval(interval1);
            } else {
                updateChart1(years1[yearIndex1], categories1[categoryIndex1]);
                categoryIndex1++;
                if (categoryIndex1 >= categories1.length) {
                    categoryIndex1 = 0;
                    yearIndex1++;
                    if (yearIndex1 < years1.length) {
                        categories1 = Array.from(nestedData1.get(years1[yearIndex1]).keys());
                    }
                }
            }
        }, 1500);
    }

    function pauseChart1() {
        if (interval1) clearInterval(interval1);
    }

    function restartChart1() {
        if (interval1) clearInterval(interval1);
        yearIndex1 = 0;
        categoryIndex1 = 0;
        categories1 = Array.from(nestedData1.get(years1[yearIndex1]).keys());
        updateChart1(years1[yearIndex1], categories1[categoryIndex1]);
    }

    d3.select("#play-button1").on("click", playChart1);
    d3.select("#pause-button1").on("click", pauseChart1);
    d3.select("#restart-button1").on("click", restartChart1);

    // Initialize the chart
    updateChart1(years1[yearIndex1], categories1[categoryIndex1]);
});



// Load the CSV file for chart2
d3.csv("global_trends.csv").then(function(data) {

    // Convert the 'count' and 'year' columns to numeric types
    data.forEach(d => {
      d.year = +d.year;
      d.count = +d.count;
    });
  
    // Group the data by category and sum the counts to get top categories
    // Using d3.groups()
    const categoryTrends = d3.groups(data, d => d.category)
        .map(([key, values]) => ({
            key,
            value: d3.sum(values, d => d.count)
        }));

  
    // Get top 10 categories based on total count
    const topCategories = categoryTrends
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(d => d.key);
  
    // Filter the data to include only the top categories
    const filteredData = data.filter(d => topCategories.includes(d.category));
    console.log(filteredData); // Check the filtered data to see if it's empty or misstructured

  
    // Get all unique years
    const years = Array.from(new Set(filteredData.map(d => d.year)));
  
    // Set up the margins, width, and height for chart2
    const margin = { top: 20, right: 40, bottom: 100, left: 150 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
  
    // Create the SVG container for chart2
    const svg = d3.select("#chart2")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Create scales for the x and y axes for chart2
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.count) + 10])
      .range([0, width]);
  
    const yScale = d3.scaleBand()
      .domain(topCategories)
      .range([0, height])
      .padding(0.1);
    
    console.log(xScale.domain(), yScale.domain());

  
    // Create the x and y axes for chart2
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
  
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));
  
    // Create a group for the bars in chart2
    const barsGroup = svg.append("g")
      .attr("class", "bars");
  
    // Create a function for updating the bars for each year in chart2
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
    
    console.log(yearData); // Log the data used for bars

  
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
        console.log("Animating...");
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
  
    const buttons = d3.select("#chart2-controls").append("div");

    buttons.append("button")
        .text("Play")
        .on("click", playAnimation);

    buttons.append("button")
        .text("Pause")
        .on("click", pauseAnimation);

  
    // Initialize with the first year
    updateBars(years[0]);
  
    // Start the animation automatically
    playAnimation();
  
  });
  