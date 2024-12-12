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

// Chart 2: bar chart race 
d3.csv("filtered_data.csv").then(function(data) {
    console.log(data);

    data.forEach(d => d.count = +d.count);

    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 40, left: 150 };

    const svg = d3.select("#chart2").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


     // title
     svg.append("text")
     .attr("x", width / 2)
     .attr("y", -margin.top / 2)  // Position title above the chart
     .attr("text-anchor", "middle")
     .style("font-size", "12px")
     .style("font-weight", "bold")
     .style("fill", "#333")
     .text("Top 10 Google Search Categories per Year");

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)]).nice()
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleBand()
        .domain([...new Set(data.map(d => d.category))])
        .range([0, height - margin.top - margin.bottom])
        .padding(0.1);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    const yAxis = svg.append("g")
        .call(d3.axisLeft(yScale));

    // x-axis Label
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Number of Searches");

    // y-axis Label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Category");

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

    const yearLabel = svg.append("text")
        .attr("class", "year-label")
        .attr("x", width / 2)
        .attr("y", margin.top-10)  
        .attr("text-anchor", "middle")
        .style("font-size", "30px")
        .style("font-weight", "bold")
        .text("");  

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "10px")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("opacity", 0)  
        .style("pointer-events", "none");  

    bars.on("mouseover", function(event, d) {
        tooltip.transition().duration(200).style("opacity", 1);
        
        tooltip.html(`Category: ${d.category}<br>Count: ${d.count}`)
            .style("left", (event.pageX + 10) + "px")  
            .style("top", (event.pageY + 10) + "px"); 
    })
    .on("mousemove", function(event) {
        tooltip.style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY + 10) + "px");
    })
    .on("mouseout", function() {
        tooltip.transition().duration(200).style("opacity", 0);
    });

    function updateBars(year) {
        const yearData = data.filter(d => d.year === year);

        const barsUpdate = bars.data(yearData, d => d.category);

        barsUpdate.transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("width", d => xScale(d.count));

        yearLabel.text(year);
    }

    const years = Array.from(new Set(data.map(d => d.year))).sort();
    let currentYearIndex = 0;

    let timer2;
    let isPaused2 = false;

    function animate() {
        if (isPaused2) return; 

        updateBars(years[currentYearIndex]);

        // increment by 1 year each time, loop back to first year after 2020 (final year in dataset)
        currentYearIndex = (currentYearIndex + 1) % years.length;

        // animation speed: 2000ms (2 sec)
        timer2 = setTimeout(animate, 2000);
    }

    // Play button 
    function playChart2() {
        if (isPaused2) {
            isPaused2 = false;  
            animate();  
        }
    }

    // Pause button 
    function pauseChart2() {
        isPaused2 = true; 
        clearTimeout(timer2); 
    }

    // event listeners for buttons
    d3.select("#play-button2").on("click", playChart2);
    d3.select("#pause-button2").on("click", pauseChart2);

    animate(); 

}).catch(function(error) {
    console.log("Error loading CSV data:", error);
});

//chart3
d3.csv("people_trends.csv").then(data => {
    function updatePieChart(category) {
        d3.select("#chart-title").text(`6 Most Popular ${category} Searches From 2001 to 2020`);

        const filteredData = data.filter(d => d.category === category);
        const categoryCounts = d3.rollup(
            filteredData,
            v => v.length,
            d => d.query
        );

        const sortedCategories = Array.from(categoryCounts, ([key, value]) => ({ query: key, count: value }))
            .sort((a, b) => d3.descending(a.count, b.count))
            .slice(0, 6);

        const total = d3.sum(sortedCategories, d => d.count);
        let angle = 0;
        const arcData = sortedCategories.map(d => {
            const startAngle = angle;
            const endAngle = angle + (d.count / total) * 2 * Math.PI;
            angle = endAngle;
            return { startAngle, endAngle, query: d.query, count: d.count };
        });

        const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        d3.select("#chart").selectAll("*").remove();
        d3.select("#chart")
            .selectAll("path")
            .data(arcData)
            .enter()
            .append("path")
            .attr("d", d => arcGenerator(d))
            .attr("fill", (_, i) => color(i))
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);

        const legendContainer = d3.select(".legend-container");
        const legend = legendContainer.selectAll(".legend").data(sortedCategories, d => d.query);

        legend.enter()
            .append("div")
            .attr("class", "legend")
            .merge(legend)
            .style("color", (_, i) => color(i))
            .text(d => `${d.query}: ${d.count}`);

        legend.exit().remove();
    }

    d3.select("#category-select").on("change", function(event) {
        const category = event.target.value;
        updatePieChart(category);
    });

    updatePieChart("People");
}).catch(error => {
    console.error("Error loading pie chart data:", error);
});