const data = json_data; 

const width = 800;
const height = 500;
const margin = { top: 20, right: 30, bottom: 40, left: 150 };

// Create the SVG container for the chart
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Set up scales
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]).nice()
    .range([0, width - margin.left - margin.right]);

const yScale = d3.scaleBand()
    .domain([...new Set(data.map(d => d.category))])  // Get unique categories from the data
    .range([0, height - margin.top - margin.bottom])
    .padding(0.1);

// Create the axes
const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(xScale));

const yAxis = svg.append("g")
    .call(d3.axisLeft(yScale));

// Create a container for the bars (initially empty)
const bars = svg.append("g")
    .selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("y", d => yScale(d.category))
    .attr("x", 0)
    .attr("height", yScale.bandwidth())
    .attr("width", 0)
    .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

// Create a function to update the bars for each year
function updateBars(year) {
    const yearData = data.filter(d => d.year === year);

    // Join data to bars
    const barsUpdate = bars.data(yearData, d => d.category);

    barsUpdate.transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("width", d => xScale(d.count));
}

// Create a list of unique years
const years = Array.from(new Set(data.map(d => d.year))).sort();
let currentYearIndex = 0;

// Function to animate the chart over time (bar chart race)
function animate() {
    updateBars(years[currentYearIndex]);

    // Move to the next year, looping back to the first year when done
    currentYearIndex = (currentYearIndex + 1) % years.length;

    // Update the animation every 1000ms (1 second), adjust for speed
    setTimeout(animate, 1000);  
}

// Start the animation
animate();
