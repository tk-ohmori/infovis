d3.csv("https://tk-ohmori.github.io/infovis/W08/data1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value;});
        
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: {top:30, right:10, bottom:30, left:60},
            title: '神戸市の人口'
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart{
    constructor(config, data){
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:30, left:60},
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
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`)
        
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);
        
        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.1);
        
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
    }

    update(){
        let self = this;

        self.xscale.domain([0, d3.max(self.data, d => d.value)]);
        self.yscale.domain(self.data.map(d => d.label));

        self.render();
    }

    render(){
        let self = this;

        self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());
        
        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}