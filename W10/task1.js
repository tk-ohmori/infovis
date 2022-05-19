d3.csv("https://tk-ohmori.github.io/infovis/W10/task1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value;});
        data.forEach( d => { d.area = +d.area;});
        
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: {top:30, right:10, bottom:50, left:60},
            title: '神戸市の人口',
            label: {xaxis:'人数', yaxis:'区'}
        };

        const animated_bar_chart = new AnimatedBarChart( config, data );
        animated_bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class AnimatedBarChart{
    constructor(config, data){
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:50, left:60},
            title: config.title || 'Chart Title',
            label: config.label || {xaxis:'横軸', yaxis:'縦軸'}
        }
        this.data = data;
        this.init();
    }

    init(){
        let self = this;

        self.original_data = self.data.concat();

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
        
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

        self.chart_title = self.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.margin.top/2})`)
            .attr('font-weight', 'bold');
        
        self.xaxis_label = self.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height - 10})`)
            .attr('font-weight', 'bold');
        
        self.yaxis_label = self.svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(7, ${self.config.height/2})`)
            .attr('font-weight', 'bold');
        
        d3.select('#reverse')
            .on('click', d => {
                self.data.reverse();
                self.update();
            });
        
        d3.select('#descend')
            .on('click', d => {
                self.data.sort((a, b) => b.value - a.value);
                self.update();
            });
            
        d3.select('#ascend')
            .on('click', d => {
                self.data.sort((a, b) => a.value - b.value);
                self.update();
            });
        
        d3.select('#reset')
            .on('click', d => {
                self.update(true);
                self.data = self.original_data.concat();
                self.update();
            });

        self.update(true);

    }

    update(flag = false){
        let self = this;

        self.xscale.domain([0, d3.max(self.data, d => d.value)]);
        self.yscale.domain(self.data.map(d => d.label));

        self.render(flag);
    }

    render(flag){
        let self = this;

 

        self.rects = self.chart.selectAll('rect')
        .data(self.data)
        .join('rect');
            
        self.rects
            .transition()
            .duration(flag?0:1000)
            .attr('x', 0)
            .attr('y', d => self.yscale(d.label))
            .attr('width', d => flag?0:self.xscale(d.value))
            .attr('height', self.yscale.bandwidth());

        self.rects
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">人口</div>${d.value.toLocaleString()}人`);
                e.target.style.fill = '#333';
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', (e) => {
                d3.select('#tooltip')
                    .style('opacity', 0);
                e.target.style.fill = '';
            })
            .on('click', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">人口・面積・人口密度</div>
                    人口：${d.value.toLocaleString()}人<br>
                    面積：${d.area}km^2<br>
                    人口密度：${(100*d.value/d.area).toFixed(2)}%`);
            });

        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);

        self.chart_title.text(self.config.title);

        self.xaxis_label.text(self.config.label.xaxis);
        self.yaxis_label.text(self.config.label.yaxis);
    }
}
