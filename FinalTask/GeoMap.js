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

        // this.OSColor = ['crimson', 'darkblue', 'darkgreen', 'chocolate', 'indigo','white'];
        this.OSColor = {'Android':'mediumvioletred', 'iOS':'dodgerblue', 'Samsung':'lightgreen', 'KaiOS':'peachpuff', 'Windows':'iturquoise','Others':'white'};

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
                else return this.OSColor[getTopOS(name)];
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
        this.gdpScale.domain([bar_chart.gdp_min, bar_chart.gdp_max]);
   
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
                e.target.setAttribute('fill', 'white');
            })
            .on('mouseleave', (e, d) => {
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