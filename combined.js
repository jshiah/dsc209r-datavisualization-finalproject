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



// Chart 2

let interval2, currentYearIndex = 0; // For chart 2 controls
const margin2 = { top: 20, right: 40, bottom: 100, left: 150 };
const width2 = 800 - margin2.left - margin2.right;
const height2 = 600 - margin2.top - margin2.bottom;

const svg2 = d3.select("#chart2")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

d3.csv("global_trends.csv").then(data => {
    console.log(data);
    data.forEach(d => {
        d.year = +d.year;
        d.count = +d.count;
    });

    const years = Array.from(new Set(data.map(d => d.year)));
    console.log("Years:", years);

    const yScale2 = d3.scaleBand()
        .range([0, height2])
        .padding(0.1);

    const xScale2 = d3.scaleLinear()
        .range([0, width2]);

    svg2.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height2})`);

    svg2.append("g")
        .attr("class", "y-axis");

    const barsGroup = svg2.append("g")
        .attr("class", "bars");

    const yearLabel = svg2.append("text")
        .attr("class", "year-label")
        .attr("x", width2 - 20)
        .attr("y", height2 - 10)
        .style("text-anchor", "end")
        .style("font-size", "16px")
        .style("fill", "#333");

    function updateBars(year) {
        const yearData = data.filter(d => d.year === year);

        // aggr data to count occurrences per category for the selected year
        const aggregatedData = d3.rollup(
            yearData,
            v => d3.sum(v, d => d.count),  // Sum counts for each category
            d => d.category
        );

        const aggregatedArray = Array.from(aggregatedData, ([key, value]) => ({ key, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // top 10 categories

        // update yScale to include the top categories
        yScale2.domain(aggregatedArray.map(d => d.key));

        // update xScale to fit the data
        xScale2.domain([0, d3.max(aggregatedArray, d => d.value) + 10]);

        // Update x and y axes
        svg2.select(".x-axis")
            .transition()
            .duration(500)
            .call(d3.axisBottom(xScale2));

        svg2.select(".y-axis")
            .transition()
            .duration(500)
            .call(d3.axisLeft(yScale2));

        const bars = barsGroup.selectAll(".bar")
            .data(aggregatedArray, d => d.key);

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", d => yScale2(d.key))
            .attr("width", 0) 
            .attr("height", yScale2.bandwidth())
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10]) 
            .transition()
            .duration(500)
            .attr("width", d => xScale2(d.value));

        bars.transition()
            .duration(500)
            .attr("y", d => yScale2(d.key))
            .attr("width", d => xScale2(d.value));

        bars.exit().remove();

        yearLabel.text(`Year: ${year}`);
    }

    function animateChart2() {
        updateBars(years[currentYearIndex]);
        currentYearIndex = (currentYearIndex + 1) % years.length;
    }

    let intervalId2;

    function playAnimation2() {
        intervalId2 = setInterval(animateChart2, 1000); 
    }

    function pauseAnimation2() {
        clearInterval(intervalId2);
    }

    d3.select("#play-button2").on("click", playAnimation2);
    d3.select("#pause-button2").on("click", pauseAnimation2);

    updateBars(years[0]);
    playAnimation2(); 
});
