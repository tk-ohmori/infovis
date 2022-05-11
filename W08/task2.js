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
            
        self.line = d3.line()
    }

    update(){
        let self = this;

        self.line
            .x(d => d.x)
            .y(d => d.y)
        
        self.render();
    }

    render(){
        let self = this;

        self.svg
            .append('path')
            .attr('d', line(data))
            .attr('stroke', 'black')
            .attr('fill', 'none');
    }
}