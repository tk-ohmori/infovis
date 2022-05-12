d3.csv("https://tk-ohmori.github.io/infovis/W08/data1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value;});
        
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:10, left:10},
            title: '神戸市の人口'
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class PieChart{
    constructor(config, data){
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:30, right:10, bottom:10, left:10},
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

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left + self.inner_width/2}, ${self.config.margin.top + self.inner_height/2})`);
        
        self.chart_title = self.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${self.config.margin.left + self.inner_width/2}, ${self.config.margin.top + self.inner_height/2})`)
            .text(self.config.title);
        
        self.pie = d3.pie();

        self.radius = Math.min(self.inner_width, self.inner_height)/2;

        self.arc = d3.arc()
            .innerRadius(self.radius/3)
            .outerRadius(self.radius);

        self.text = d3.arc()
            .innerRadius(self.radius*3/4)
            .outerRadius(self.radius*3/4);
        
        self.ratio = d3.arc()
            .innerRadius(self.radius/2)
            .outerRadius(self.radius/2);
        
        self.color = ['indianred', 'cornflowerblue', 'springgreen', 'coral', 'mediumpurple', 'sandybrown', 'lightpink', 'steelblue', 'seagreen'];
    }

    update(){
        let self = this;

        self.pie.value(d => d.value);

        self.value_sum = d3.sum( self.data, d => d.value);

        self.render();
    }

    render(){
        let self = this;

        self.chart_pie = self.chart.selectAll('pie')
            .data(self.pie(self.data))
            .enter();

        self.chart_pie.append('path')
            .attr('d', self.arc)
            .attr('fill', d => self.color[d.index])
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        self.chart_pie.append('text')
            .attr('fill', 'black')
            .attr('transform', d => `translate(${self.text.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .attr('font-size', '20px')
            .text(d => d.data.label + '');

        self.chart_pie.append('text')
            .attr('fill', 'black')
            .attr('transform', d => `translate(${self.ratio.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .text(d => (d.value*100/self.value_sum).toFixed([1]) + '%');
    }
}