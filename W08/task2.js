d3.csv("https://tk-ohmori.github.io/infovis/W08/data2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y;});

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: {top:30, right:10, bottom:30, left:30},
            title: 'タイトル'
        };

        const line_chart = new LineChart( config, data );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class LineChart{
    constructor(config, data){
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:30, right:10, bottom:30, left:30},
            title: config.title || 'Chart Title'
        }
        this.data = data;
        this.init();       
    }

    init(){
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
        
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);
        
        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);
        
        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(6)
            .tickSizeOuter(0);
        
        self.yaxis = d3.axisLeft(self.yscale)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        
        self.yaxis_group = self.chart.append('g');

        self.char_title = self.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(256, 15)`)
            .text(self.config.title);

        self.area = d3.area();
    }

    update(){
        let self = this;

        self.xscale.domain([0, d3.max(self.data, d => d.x)]);
        self.yscale.domain([0, d3.max(self.data, d => d.y)]);

        self.area
            .x(d => self.xscale(d.x))
            .y1(d => self.yscale(d.y))
            .y0(parseInt(self.yscale(0)));
        
        self.render();
    }

    render(){
        let self = this;

        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);

        self.chart
            .append('path')
            .attr('d', self.area(self.data))
            .attr('stroke', 'darkblue')
            .attr('fill', 'cornflowerblue');
        
        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale(d.x) )
            .attr("cy", d => self.yscale(d.y) )
            .attr("r", 5);
    }
}