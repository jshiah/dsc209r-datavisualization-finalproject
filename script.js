let interval; // Store the interval for animation
let isPaused = false; // Track if the animation is paused
const margin = { top: 50, right: 60, bottom: 200, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;


const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let nestedData, years, categories;
let yearIndex = 0;
let categoryIndex = 0;


d3.csv("global_trends.csv").then(data => {
    
    data.forEach(d => {
        d.rank = +d.rank; 
    });

 
    nestedData = d3.group(data, d => d.year, d => d.category);
    years = Array.from(nestedData.keys());
    categories = Array.from(nestedData.get(years[yearIndex]).keys());

    const xScale = d3.scaleBand().range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    
    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);

    const yAxis = svg.append("g");

    svg.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("visibility", "hidden")
    .text("Rank");

    const chartTitle = svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle");

    
    function updateChart(year, category) {
        svg.select(".y-axis-label").style("visibility", "visible");

        const categoryData = Array.from(nestedData.get(year)?.get(category) || [])
            .sort((a, b) => a.rank - b.rank) 
            .slice(0, 5) 
            .map(d => ({
                ...d,
                transformedRank: 6 - d.rank 
            }));

        
        xScale.domain(categoryData.map(d => d.query));
        yScale.domain([0, 5]);

        
        chartTitle.text(`Top 5 Searches (${category}) - ${year}`);

        
        const bars = svg.selectAll(".bar")
            .data(categoryData, d => d.query);

        
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.query))
            .attr("width", xScale.bandwidth())
            .attr("fill", d => colorScale(category))
            .attr("y", d => yScale(d.transformedRank))
            .attr("height", d => height - yScale(d.transformedRank));

        
        bars.transition()
            .duration(500)
            .attr("x", d => xScale(d.query))
            .attr("y", d => yScale(d.transformedRank))
            .attr("height", d => height - yScale(d.transformedRank));

        
        bars.exit().remove();

        
        

        xAxis.transition().duration(500).call(d3.axisBottom(xScale));
        xAxis.selectAll("text")
        .attr("transform", "rotate(-45)") 
        .style("text-anchor", "end")     
        .style("font-size", "12px")
        .attr("dx", "-0.5em")            
        .attr("dy", "0.25em");

        yAxis.call(d3.axisLeft(yScale).ticks(5));
    }

    d3.select("#play-button").on("click", () => {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            if (yearIndex >= years.length) {
                clearInterval(interval); 
            } else {
                updateChart(years[yearIndex], categories[categoryIndex]);
                categoryIndex++;

                
                if (categoryIndex >= categories.length) {
                    categoryIndex = 0;
                    yearIndex++;

                    
                    if (yearIndex < years.length) {
                        categories = Array.from(nestedData.get(years[yearIndex]).keys());
                    }
                }
            }
        }, 1500); 
    });
});


d3.select("#pause-button").on("click", () => {
    if (interval) {
        clearInterval(interval); 
        interval = null;
        isPaused = true;
    }
});


d3.select("#restart-button").on("click", () => {
    if (interval) clearInterval(interval); 

    
    yearIndex = 0;
    categoryIndex = 0;
    categories = Array.from(nestedData.get(years[yearIndex]).keys()); 

    
    updateChart(years[yearIndex], categories[categoryIndex]);

    
    interval = setInterval(() => {
        if (yearIndex >= years.length) {
            clearInterval(interval); 
        } else {
            updateChart(years[yearIndex], categories[categoryIndex]);
            categoryIndex++;

            
            if (categoryIndex >= categories.length) {
                categoryIndex = 0;
                yearIndex++;
                if (yearIndex < years.length) {
                    categories = Array.from(nestedData.get(years[yearIndex]).keys());
                }
            }
        }
    }, 1500); 
});
