// // from combined.js on 11/29:
// Chart 2: CURRENT ISSUE in some years, all bars go to 15 by default ??? 

// let interval2, currentYearIndex = 0; 
// const margin2 = { top: 20, right: 40, bottom: 100, left: 150 };
// const width2 = 800 - margin2.left - margin2.right;
// const height2 = 600 - margin2.top - margin2.bottom;

// const svg2 = d3.select("#chart2")
//     .append("svg")
//     .attr("width", width2 + margin2.left + margin2.right)
//     .attr("height", height2 + margin2.top + margin2.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin2.left},${margin2.top})`);

// d3.csv("trends.csv").then(data => {
//     console.log("Raw Data:", data);  

//     data.forEach(d => {
//         d.year = +d.year;
//         d.count = +d.rank; // aggregate based on 'rank' in place of 'count'
//     });

//     data.forEach(d => {
//         console.log(`Year: ${d.year}, Category: ${d.category}, Rank: ${d.rank}`);
//     });

//     const years = Array.from(new Set(data.map(d => d.year)));
//     console.log("Years:", years); 

//     const yScale2 = d3.scaleBand()
//         .range([0, height2])
//         .padding(0.1);

//     const xScale2 = d3.scaleLinear()
//         .range([0, width2]);

//     svg2.append("g")
//         .attr("class", "x-axis")
//         .attr("transform", `translate(0,${height2})`);

//     svg2.append("g")
//         .attr("class", "y-axis");

//     const barsGroup = svg2.append("g")
//         .attr("class", "bars");

//     const yearLabel = svg2.append("text")
//         .attr("class", "year-label")
//         .attr("x", width2 - 20)
//         .attr("y", height2 - 10)
//         .style("text-anchor", "end")
//         .style("font-size", "16px")
//         .style("fill", "#333");

//     function updateBars(year) {
//         const yearData = data.filter(d => d.year === year);
//         console.log(`Data for Year ${year}:`, yearData); 

//         const aggregatedData = d3.rollup(
//             yearData,
//             v => d3.sum(v, d => d.rank), 
//             d => d.category
//         );
//         console.log("Aggregated Data:", aggregatedData);

//         const aggregatedArray = Array.from(aggregatedData, ([key, value]) => ({ key, value }))
//             .sort((a, b) => b.value - a.value)  // sort by rank count
//             .slice(0, 10);  // top 10 categories
//         console.log("Top 10 Aggregated Categories:", aggregatedArray);  

//         yScale2.domain(aggregatedArray.map(d => d.key));

//         xScale2.domain([0, d3.max(aggregatedArray, d => d.value) + 10]);  
//         console.log("X Scale Domain:", xScale2.domain());  

//         svg2.select(".x-axis")
//             .transition()
//             .duration(500)
//             .call(d3.axisBottom(xScale2));

//         svg2.select(".y-axis")
//             .transition()
//             .duration(500)
//             .call(d3.axisLeft(yScale2));

//         const bars = barsGroup.selectAll(".bar")
//             .data(aggregatedArray, d => d.key);

//         console.log("Number of Bars:", aggregatedArray.length); 

//         bars.enter().append("rect")
//             .attr("class", "bar")
//             .attr("x", 0)
//             .attr("y", d => yScale2(d.key))  
//             .attr("width", 0)  
//             .attr("height", yScale2.bandwidth()) 
//             .attr("fill", (d, i) => d3.schemeCategory10[i % 10])  
//             .transition()
//             .duration(500)
//             .attr("width", d => xScale2(d.value));  

//         bars.transition()
//             .duration(500)
//             .attr("y", d => yScale2(d.key))  
//             .attr("width", d => xScale2(d.value)); 

//         bars.exit().remove();

//         yearLabel.text(`Year: ${year}`);
//     }

//     function animateChart2() {
//         updateBars(years[currentYearIndex]);
//         currentYearIndex = (currentYearIndex + 1) % years.length;
//     }

//     let intervalId2;

//     function playAnimation2() {
//         intervalId2 = setInterval(animateChart2, 1500); 
//     }

//     function pauseAnimation2() {
//         clearInterval(intervalId2);
//     }

//     // Event listeners for play/pause buttons
//     d3.select("#play-button2").on("click", playAnimation2);
//     d3.select("#pause-button2").on("click", pauseAnimation2);

//     updateBars(years[0]);
//     playAnimation2();  
// });
