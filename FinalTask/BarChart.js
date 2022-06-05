class BarChart{
    constructor(config, data){
        data.forEach( d => {
            d.Android = ((+d.Android) * (+d.Population))/100.0;
            d.iOS = ((+d.iOS) * (+d.Population))/100.0;
            d.Samsung = ((+d.Samsung) * (+d.Population))/100.0;
            d.KaiOS = ((+d.KaiOS) * (+d.Population))/100.0;
            d.Windows = ((+d.Windows) * (+d.Population))/100.0;
            d.Others = ((+d.Others) * (+d.Population))/100.0;
        });

        this.config = {
            parent: config.parent || '#bar_region',
            width: config.width || 600,
            height: config.height || 400,
            margin: config.margin || {top:10, right:40, bottom:30, left:40}
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

        this.xaxis = d3.axisBottom(this.xscale);

        this.yaxis = d3.axisLeft(this.yscale);

        this.xaxis_group = this.chart.append('g')
            .attr('transform', `translate(0, ${this.inner_height})`);
        
        this.yaxis_group = this.chart.append('g');

        this.yaxis_label = this.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(7, ${this.config.height/2})`)
            .attr('font-weight', 'bold');
    }

    update(){
        this.gdp_min = d3.min(this.data, d => d.GDP_per_capita);
        this.gdp_max = d3.max(this.data, d => d.GDP_per_capita);

        this.selected_data = this.data.filter(d => selected.includes(d.Country));

        this.series = d3.stack()
            .keys(['Android','iOS','Samsung','KaiOS','Windows','Others'])(this.selected_data);
            // .keys(this.os_list)(this.selected_data);

        this.xscale.domain(this.selected_data.map(d => d.Country));
        this.yscale.domain([0, d3.max(this.series, d => d3.max(d, d => d[1]))]);

        this.bar_color = d3.scaleOrdinal()
            .domain(this.series.map(d => d.key))
            .range(d3.schemeCategory10.slice(0, this.series.length))
            .unknown('#ccc');

        // for(let i in this.series){
        //     console.log(this.series[i])
        //     this.series[i].forEach(d => console.log(d.data.Country + ' : ' + this.yscale(d[1])))
        //     this.series[i].forEach(d => console.log(d.data.Country + ' : ' + (this.yscale(d[0]) - this.yscale(d[1]))))
        //     console.log('\n')
        // }

        // console.log(this.selected_data)
        // console.log(this.series)

        this.render();
    }

    render(){
        this.rects = this.chart.selectAll('gg')
            .data(this.series)
            // .join('g')

        this.rects.exit().remove();

        // 消えない
            
        this.rects
            .enter()
            .append('g')
            .merge(this.rects)
            .attr('fill', d => this.bar_color(d.key))
            .selectAll('rect')
            .data(d => d)
            // .join('rect')
            .enter()
            .append('rect')
            .attr('x', (d, i) => this.xscale(d.data.Country))
            .attr('y', d => this.yscale(d[1]))
            .attr('height', d => this.yscale(d[0]) - this.yscale(d[1]))
            .attr('width', this.xscale.bandwidth());

        this.xaxis_group
            .call(this.xaxis);

        this.yaxis_group
            .call(this.yaxis);

        var legend = this.chart.selectAll('.legend')
            .data(this.os_list)
            .enter()
            .append('g')
            .attr('class','legend')

        legend.append('rect') // 凡例の色付け四角
            .attr("x", 0)
            .attr("y", 10)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", d => this.bar_color(d)) // 色付け

        legend.append('text')  // 凡例の文言
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
