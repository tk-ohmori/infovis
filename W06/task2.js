d3.csv("https://tk-ohmori.github.io/infovis/W04/task1.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:20, left:30, xaxis:10, yaxis:10, label:20},
            label: {x:'X-label', y:'Y-label'},
            title: "Chart Title"
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
            label: config.label || {x:'xLabelName', y:'yLabelName'},
            title: config.title || 'chartTitle'
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
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

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
            .attr('transform', `translate(${self.config.margin.label}, ${self.inner_height + self.config.margin.label})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(8)
            .tickSize(10)
            .tickPadding(2);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.label}, ${self.config.margin.label})`);
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        const dx = self.config.margin.label + self.config.margin.left;
        self.xscale.domain( [xmin-10, xmax+10] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        const dy = self.config.margin.label + self.config.margin.top;
        self.yscale.domain( [ymax+10, ymin-10] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll('circle')
            .data(self.data)
            .enter()
            .append('circle')
            .attr('cx', d => self.xscale( d.x ) + self.config.margin.label )
            .attr('cy', d => self.yscale( d.y ) + self.config.margin.label )
            .attr('r', 5)

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );

        self.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('x',self.config.margin.label + self.config.margin.left + parseInt(self.inner_width/2))
            .attr('y', self.config.margin.label + self.config.margin.top + self.inner_height + self.config.margin.label + self.config.margin.bottom)
            .attr('font-size', 'large')
            .attr('font-weight', 'bold')
            .text(self.config.label.x)

        self.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -(self.config.margin.label + self.config.margin.top + parseInt(self.inner_height/2)))
            .attr('y', self.config.margin.label)
            .attr('font-size', 'large')
            .attr('font-weight', 'bold')
            //.attr('dx', -15)
            .text(self.config.label.y)
        
        self.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('x',self.config.margin.label + self.config.margin.left + parseInt(self.inner_width/2))
            .attr('y', self.config.margin.label)
            .attr('font-size', 'large')
            .attr('font-weight', 'bold')
            .text(self.config.title)
    }
}
