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

        this.update();
    }

    update(){
        this.render();
    }

    render(){
        this.map.selectAll('path')
            .data(topojson.feature(this.data, this.data.objects.countries).features)
            .enter()
            .append('path')
            .attr('d', this.path)
            .attr('stroke', 'dimgray')
            .attr('stroke-width', 0.5)
            .attr('fill', 'lightgray')
            .on('mouseover', (e, d) => {
                e.target.setAttribute('fill', 'white')
            })
            .on('mouseleave', (e, d) => {
                e.target.setAttribute('fill', 'lightgray')
            })
            .on('click', (e, d) => {
                console.log(d.properties.name)
            });
    }
}