d3.csv("https://tk-ohmori.github.io/infovis/W10/task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; d.selected = false;});

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:20, left:30, xaxis:10, yaxis:10, label:20},
            label: {x:'X-label', y:'Y-label'},
            title: "Chart Title"
        };

        const scatter_plot_with_tooltip = new ScatterPlotWithTooltip( config, data );
        scatter_plot_with_tooltip.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlotWithTooltip {

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

        self.original_data = self.data.concat();

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
    
        d3.select('#add')
            .on('click', d => {
                self.data.push({x: +document.getElementById('add_x').value, y: +document.getElementById('add_y').value, selected: false});
                document.getElementById('add_x').value = '';
                document.getElementById('add_y').value = '';
                self.update();
            });

        d3.select('#delete')
            .on('click', d => {
                self.data = (self.data.filter(d => !d.selected));
                self.update();
            });

        d3.select('#clear')
            .on('click', d => {
                self.data = [];
                self.update();
            });

        d3.select('#reset')
            .on('click', d => {
                self.data = self.original_data.concat();
                self.data.forEach( d => {d.selected = false;});
                self.update();
            });

        self.init_render();
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

        self.circles = self.chart.selectAll('circle')
            .data(self.data)
            .join('circle')

        self.circles
            .attr('cx', d => self.xscale( d.x ) + self.config.margin.label )
            .attr('cy', d => self.yscale( d.y ) + self.config.margin.label )
            .attr('r', 10)
            .style('fill', '');

        self.circles
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
                if(d.selected) e.target.style.fill = '#aa0000';
                else e.target.style.fill = '#666';
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', (e, d) => {
                d3.select('#tooltip')
                    .style('opacity', 0);
                if(d.selected) e.target.style.fill = 'red';
                else e.target.style.fill = '';
            })
            .on('click', (e,d) => {
                if(d.selected){
                    d.selected = false;
                    e.target.style.fill = ''
                }else{
                    d.selected = true;
                    e.target.style.fill = 'red';
                }
            });

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );


    }

    init_render(){
        let self = this;

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
