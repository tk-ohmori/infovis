class BarChart{
    constructor(config, data){
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
        
        this.update();
    }

    update(){
        this.gdp_min = d3.min(this.data, d => d.GDP_per_capita);
        this.gdp_max = d3.max(this.data, d => d.GDP_per_capita);

        this.xscale.domain(this.data.map(d => d.Country));
        this.yscale.domain([0, this.gdp_max]);

        this.render();
    }

    render(){
        // this.chart.selectAll('.bar')
        //     .data()
    }
}