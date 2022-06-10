class BarChart{
    constructor(config, data){
        data.forEach( d => {
            d.Android = ((+d.Android) * (+d.Population))/100.0;
            d.iOS = ((+d.iOS) * (+d.Population))/100.0;
            d.Samsung = ((+d.Samsung) * (+d.Population))/100.0;
            d.KaiOS = ((+d.KaiOS) * (+d.Population))/100.0;
            d.Windows = ((+d.Windows) * (+d.Population))/100.0;
            d.Others = ((+d.Others) * (+d.Population))/100.0;
            // d.GDP_per_capita = +d.GDP_per_capita;
        });

        this.config = {
            parent: config.parent || '#bar_region',
            width: config.width || 600,
            height: config.height || 400,
            margin: config.margin || {top:10, right:40, bottom:30, left:40},
            label: config.label || {yaxis_left:'Population', yaxis_right:'GDP per capita'}
        };

        this.data = data;
        this.init();
    }

    init(){
        this.svg = d3.select(this.config.parent)
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);

        this.os_list = ['Android','iOS','Samsung','KaiOS','Windows','Others'];

        this.inner_width = this.config.width - this.config.margin.left - this.config.margin.right;
        this.inner_height = this.config.height - this.config.margin.top - this.config.margin.bottom;

        this.xscale = d3.scaleBand()
            .range([0, this.inner_width])
            .paddingInner(0.2)
            .paddingOuter(0.1);

        this.yscale = d3.scaleLinear()
            .range([this.inner_height, 0]);

        this.gdp_scale = d3.scaleLinear()
            .range([this.inner_height, 0]);

        this.xaxis = d3.axisBottom(this.xscale);

        this.yaxis = d3.axisLeft(this.yscale);

        this.gdp_axis = d3.axisRight(this.gdp_scale);

        this.yaxis_label = this.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(7, ${this.config.height/2}) rotate(90)`)
            .attr('font-weight', 'bold');
        
        this.gdp_axis_label = this.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${this.config.width-30}, ${this.config.height/2}) rotate(90)`)
            .attr('font-weight', 'bold');
    }

    update(){
        this.gdp_min = d3.min(this.data, d => d.GDP_per_capita);
        this.gdp_max = d3.max(this.data, d => d.GDP_per_capita);

        this.selected_data = selected.map(c => this.data.find(d => d.Country==c));

        this.series = d3.stack()
            .keys(this.os_list)(this.selected_data);

        this.xscale.domain(this.selected_data.map(d => d.Country));
        this.yscale.domain([0, d3.max(this.series, d => d3.max(d, d => d[1]))]);
        this.gdp_scale.domain([0, d3.max(this.selected_data, d => +d.GDP_per_capita)]);


        this.bar_color = d3.scaleOrdinal()
            .domain(this.series.map(d => d.key))
            .range(d3.schemeCategory10.slice(0, this.series.length))
            .unknown('#ccc');

        this.render();
    }

    render(){
        this.chart.selectAll('g').remove();

        this.rects = this.chart.selectAll('.g')
            .data(this.series)
            .enter()
            .append('g')
            .attr('fill', d => this.bar_color(d.key))
            .selectAll('rect')
            .data(d => d)
            .enter()
            .append('rect')
            
        this.rects.attr('x', (d, i) => this.xscale(d.data.Country))
            .attr('y', d => this.yscale(d[1]))
            .attr('height', d => this.yscale(d[0]) - this.yscale(d[1]))
            .attr('width', this.xscale.bandwidth());
            
        this.os_share_str = function(d){
            var str = '';
            if(d.Android!=0){
                str += `&nbsp;&nbsp;&nbsp;&nbsp; Android : ${(100.0*d.Android/(+d.Population)).toFixed(2)} %<br>`
            }
            if(d.iOS!=0){
                str += `&nbsp;&nbsp;&nbsp;&nbsp; iOS : ${(100.0*d.iOS/(+d.Population)).toFixed(2)} %<br>`
            }
            if(d.Samsung!=0){
                str += `&nbsp;&nbsp;&nbsp;&nbsp; Samsung : ${(100.0*d.Samsung/(+d.Population)).toFixed(2)} %<br>`
            }
            if(d.KaiOS!=0){
                str += `&nbsp;&nbsp;&nbsp;&nbsp; KaiOS : ${(100.0*d.KaiOS/(+d.Population)).toFixed(2)} %<br>`
            }
            if(d.Windows!=0){
                str += `&nbsp;&nbsp;&nbsp;&nbsp; Windows : ${(100.0*d.Windows/(+d.Population)).toFixed(2)} %<br>`
            }
            if(d.Others!=0){
                str += `&nbsp;&nbsp;&nbsp;&nbsp; Others : ${(100.0*d.Others/(+d.Population)).toFixed(2)} %<br>`
            }
            return str;
        }

        this.rects
            .on('mouseover', (e, d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`${d.data.Country.replaceAll('-', ' ')} <br>
                    Population : ${(+d.data.Population).toLocaleString()}<br>
                    GDP per capita : ${d.data.GDP_per_capita} $ <br>
                    OS Share : <br>` + this.os_share_str(d.data));
                // console.log(d)
            })
            .on('mousemove', (e, d) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', (e) => {
                d3.select('#tooltip')
                    .style('opacity', 0);
                // e.target.style.fill = '';
            });
        
        this.chart.select('path').remove();
        this.chart.append('path')
            .datum(this.selected_data)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('d', d3.line()
                .x(d => this.xscale(d.Country) + this.xscale.bandwidth()/2)
                .y(d => this.gdp_scale(d.GDP_per_capita)));
        
        this.chart.append('text')
            .attr('x', this.inner_width - 120)
            .attr('y', 25)
            .attr('font-size', 12)
            .text('GDP per capita');
        
        this.chart.append('line')
            .attr('x1', this.inner_width - 30)
            .attr('x2', this.inner_width - 10)
            .attr('y1', 20)
            .attr('y2', 20)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5);
        
        this.chart
            .append('g')
            .attr('transform', `translate(0, ${this.inner_height})`)
            .call(this.xaxis)
            .selectAll('text')
            .html(d => d.replaceAll('-', ' '))
            .attr('transform', 'rotate(30)')
            .attr('font-weight', 'bold')
            .attr('font-size', 12)
            .attr('text-anchor', 'start');
        
        this.chart
            .append('g')
            .call(this.yaxis);

        this.chart
            .append('g')
            .call(this.gdp_axis)
            .attr('transform', `translate(${this.inner_width}, 0)`);

        this.yaxis_label
            .text(this.config.label.yaxis_left);

        this.gdp_axis_label
            .text(this.config.label.yaxis_right);

        var legend = this.chart.selectAll('.legend')
            .data(this.os_list)
            .enter()
            .append('g')
            .attr('class','legend')

        legend.append('rect')
            .attr("x", 0)
            .attr("y", 10)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", d => this.bar_color(d))

        legend.append('text')
            .attr("x", 20)
            .attr("y", 20)
            .text(function (d, i) {	return d ; })
            .attr("class", "textselected")
            .style("text-anchor", "start")
            .style("font-size", 15);

        var top = this.config.margin.top;
        legend.attr('transform', function(d,i) {
            var pos = 0;
            for(let j=0;j<i;j++) {
                pos += legend['_groups'][0][j].getBBox().width + 20;
            }
            return `translate(${pos}, -${top})`; 
        })

    }
    
}
