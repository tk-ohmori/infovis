class BarChar{
    constructor(config, data){
        this.config = {
            parent: config.parent || '#bar_region',
            width: config.width || 600,
            height: config.height || 400,
            margin: config.margin || {top:10, right:40, bottom:30, left:40}
        };

        this.data = data;
        this.init();
    }

    init(){
        this.svg = d3.select(this.config.parent)
            .attr('width', this.config.width)
            .attr('height', this.config.height);

    }

    update(){}

    render(){}
}