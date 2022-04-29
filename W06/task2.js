d3.csv("https://tk-ohmori.github.io/infovis/W04/task1.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:20, left:30, xaxis:10, yaxis:10, label:20},
            label: {x:'X-label', y:'Y-label'}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10, xaxis:10, yaxis:10},
            label: config.label || {x:'xLabelName', y:'yLabelName'}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left + self.config.margin.label}, ${self.config.margin.top + self.config.margin.label})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right - self.config.margin.label;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom - self.config.margin.label*2;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSize(10)
            .tickPadding(3);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(8)
            .tickSize(10)
            .tickPadding(2);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin - self.config.margin.xaxis, xmax + self.config.margin.xaxis] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymax + self.config.margin.yaxis, ymin - self.config.margin.yaxis] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", 5)
            //.attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );

        self.chart.append('text')
            .attr('text-anchor', 'mm')
            .attr('x', self.config.margin.label + self.config.margin.left + parseInt(self.inner_width/2))
            .attr('y', self.config.margin.label + self.config.margin.top + self.config.margin.inner_height + parseInt(self.config.margin.label/2))
            .text(self.config.label.x)

        self.chart.append('text')
            .attr('text-anchor', 'mm')
            .attr('x', )
            .attr('y', )
            // .attr('dy', )
            .attr('transform', 'rotate(-90)')
            .text(self.config.label.y)
    }
}
