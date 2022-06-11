class GeoMap{
    constructor(config, data){
        this.config = {
            parent: config.parent || '#map_region',
            width: config.width || 600,
            height: config.height || 450,
            center: config.center || -135,
            bottom: config.bottom || 20
        };

        this.data = data;
        this.init();
    }

    init(){
        this.svg = d3.select(this.config.parent)
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        this.projection = d3.geoMercator()
            .center([120, 33]) // svgに対する位置
            .scale(100) // スケール
            .rotate([this.config.center, 0]); // 中心にする経度，緯度
        
        this.path = d3.geoPath()
            .projection(this.projection);
        
        this.map = this.svg.append('g');

        this.gdpScale = d3.scaleLinear()
            .range([1,0]);

        this.gdpColorScale = d3.interpolateYlOrRd;

        this.OSColor = {'Android':'mediumvioletred', 'iOS':'dodgerblue', 'Samsung':'lightgreen', 'KaiOS':'peachpuff', 'Windows':'iturquoise','Others':'white'};
        this.os_index = {'Android':0, 'iOS':1, 'Samsung':2, 'KaiOS':3, 'Windows':4,'Others':5};

        this.isGDP = true;

        this.strokeColor = function(name){
            if(selected.includes(trsName(name))) return 'green';
            else return 'dimgray';
        }

        this.strokeWidth = function(name){
            if(selected.includes(trsName(name))) return 1.5;
            else return 0.5;
        }

        this.fillColor = function(name){
            if(this.isGDP){
                if(getGDP(name)=='N/A') return 'white';
                else return this.gdpColorScale(this.gdpScale(getGDP(name)));
            }else{
                if(getTopOS(name)=='N/A') return 'white';
                // else return this.OSColor[getTopOS(name)];
                else return d3.schemeCategory10[this.os_index[getTopOS(name)]];
            }
        };

        d3.select('#GDP')
            .on('click', d => {
                this.isGDP = true;
                this.update();
            });
        
        d3.select('#TopOS')
            .on('click', d => {
                this.isGDP = false;
                this.update();
            });
        
    }

    update(){
        this.gdpScale.domain([d3.min(bar_chart.data, d => d.GDP_per_capita), d3.max(bar_chart.data, d => d.GDP_per_capita)]);
        // this.gdpScale.domain([bar_chart.gdp_min, bar_chart.gdp_max]);

        this.pop_filter = function(){
            var lower_bound = 0;
            var upper_bound = 9999999999999999999999999999999999;
            if(document.getElementById('popfilter').checked){
                var lb = document.getElementById('lower_bound').value;
                var ub = document.getElementById('upper_bound').value;
                if(lb!="") lower_bound = +lb;
                if(ub!="") upper_bound = +ub;
                return bar_chart.data.filter(d => (d.Population>=lower_bound) && (d.Population<=upper_bound));
            }
            return bar_chart.data;
        }


        d3.select('#GDP_Top10')
            .on('click', d => {
                var bar_datas = this.pop_filter();
                selected = bar_datas.sort(function(x1, x2){
                    if((+x1.GDP_per_capita) < (+x2.GDP_per_capita)) return 1;
                    else return -1;
                }).slice(0,10).map(d => d.Country);
                this.update();
                bar_chart.update();
            });

        d3.select('#GDP_Top11_20')
            .on('click', d => {
                var bar_datas = this.pop_filter();
                selected = bar_datas.sort(function(x1, x2){
                    if((+x1.GDP_per_capita) < (+x2.GDP_per_capita)) return 1;
                    else return -1;
                }).slice(11,20).map(d => d.Country);
                this.update();
                bar_chart.update();
            });

        d3.select('#GDP_Top21_30')
            .on('click', d => {
                var bar_datas = this.pop_filter();
                selected = bar_datas.sort(function(x1, x2){
                    if((+x1.GDP_per_capita) < (+x2.GDP_per_capita)) return 1;
                    else return -1;
                }).slice(21,30).map(d => d.Country);
                this.update();
                bar_chart.update();
            });
   
        this.render();
    }

    render(){
        this.paths = this.map.selectAll('path')
            .data(topojson.feature(this.data, this.data.objects.countries).features);
        
        this.paths.exit().remove();

        this.paths
            .enter()
            .append('path')
            .merge(this.paths)
            .attr('d', this.path)
            .attr('stroke', d => this.strokeColor(d.properties.name))
            .attr('stroke-width', d => this.strokeWidth(d.properties.name))
            .attr('fill', d => this.fillColor(d.properties.name))
            .on('mouseover', (e, d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(d.properties.name);
                e.target.setAttribute('fill', 'white');
            })
            .on('mousemove', (e, d) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', (e, d) => {
                d3.select('#tooltip')
                    .style('opacity', 0);
                // e.target.style.fill = '';
                e.target.setAttribute('fill', this.fillColor(d.properties.name));
            })
            .on('click', (e, d) => {
                var c_name = trsName(d.properties.name);
                if(selected.includes(c_name)) selected = selected.filter(s => s!=c_name);
                else selected.push(c_name);
                this.render();
                bar_chart.update();
            });
    }
}