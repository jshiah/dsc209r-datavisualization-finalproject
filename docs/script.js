const margin = { top: 50, right: 20, bottom: 50, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create SVG canvas
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data
d3.csv("/docs/global_trends.csv").then(data => {
    // Parse data
    data.forEach(d => {
        d.rank = +d.rank; // Convert rank to number
    });

    // Group data by year and location (Global by default)
    const nestedData = d3.group(data.filter(d => d.location === "Global"), d => d.year);

    // Define scales
    const xScale = d3.scaleBand().range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Initialize axes
    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = svg.append("g");

    // Add chart title
    svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -20)
        .text("Top 5 Searches by Year (Global Trends)")
        .attr("text-anchor", "middle");

    // Function to update the chart for a given year
    function updateChart(year) {
        const yearData = Array.from(nestedData.get(year) || [])
            .sort((a, b) => a.rank - b.rank) // Sort by rank
            .slice(0, 5); // Take top 5

        // Update scales
        xScale.domain(yearData.map(d => d.query));
        yScale.domain([0, d3.max(yearData, d => d.rank)]);

        // Join data to bars
        const bars = svg.selectAll(".bar")
            .data(yearData, d => d.query);

        // Enter selection (new elements)
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.query))
            .attr("y", height)
            .attr("width", xScale.bandwidth())
            .attr("height", 0)
            .attr("fill", d => colorScale(d.category))
            .transition()
            .duration(500)
            .attr("y", d => yScale(d.rank))
            .attr("height", d => height - yScale(d.rank));

        // Update selection (existing elements)
        bars.transition()
            .duration(500)
            .attr("x", d => xScale(d.query))
            .attr("y", d => yScale(d.rank))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.rank))
            .attr("fill", d => colorScale(d.category));

        // Exit selection (removing old elements)
        bars.exit()
            .transition()
            .duration(500)
            .attr("y", height)
            .attr("height", 0)
            .remove();

        // Update axes
        xAxis.transition().duration(500).call(d3.axisBottom(xScale));
        yAxis.transition().duration(500).call(d3.axisLeft(yScale));
    }

    // Start with the first year
    const initialYear = "2001";
    updateChart(initialYear);

    // Add a play button
    let currentYear = 2001;
    d3.select("#play-button").on("click", () => {
        const years = Array.from(nestedData.keys()).sort();
        let index = years.indexOf(currentYear.toString());

        const interval = setInterval(() => {
            if (index >= years.length) {
                clearInterval(interval);
            } else {
                updateChart(years[index]);
                currentYear = years[index];
                index++;
            }
        }, 1000); // Adjust interval time as needed
    });
});