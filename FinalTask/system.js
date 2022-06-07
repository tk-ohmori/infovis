let selected = ['Japan', 'United-States-of-America', 'China', 'Republic-of-Korea', 'United-Kingdom']
let bar_chart;
let geo_map;

d3.csv('https://tk-ohmori.github.io/infovis/FinalTask/data/finaltask.csv')
    .then(function(data) {
        bar_chart = new BarChart({
            parent: '#bar_region',
            width: 800,
            height: 600,
            margin: {top:30, right:100, bottom:140, left:100}
        }, data);
        bar_chart.update();
    });

d3.json("https://tk-ohmori.github.io/infovis/FinalTask/data/world-110m2.geo.json")
    .then(function(data) {
        geo_map = new GeoMap({
            parent: '#map_region',
            width: 600,
            height: 450,
            center: -135,
            bottom: 20
        }, data);
        geo_map.update();
    });

var country_list = {
    'Bosnia and Herz.':'Bosnia-and-Herzegovina',
    'Brunei':'Brunei-Darussalam',
    'Central African Rep.':'Central-African-Republic',
    'Czechia':'Czech-Republic',
    'Dem. Rep. Congo':'Democratic-Republic-of-the-Congo',
    'Dominican Rep.':'Dominican-Republic',
    'Eq. Guinea':'Equatorial-Guinea',
    'Laos':"Lao-People's-Democratic-Republic",
    'Macedonia':'North-Macedonia',
    'Moldova':'Republic-of-Moldova',
    'N. Cyprus':'Cyprus',
    'Palestine':'State-of-Palestine',
    'Russia':'Russian-Federation',
    'S. Sudan':'South-Sudan',
    'Solomon Is.':'Solomon-Islands',
    'South Korea':'Republic-of-Korea',
    'Syria':'Syrian-Arab-Republic',
    'Tanzania':'United-Republic-of-Tanzania',
    'Vietnam':'Viet-Nam'
}

function trsName(name){
    if(name in country_list) name = country_list[name];
    name = name.replaceAll(' ','-');
    return name;
}

function getGDP(country) {
    country = trsName(country);
    result = bar_chart.data.find(d => d.Country == country);
    if(result==undefined) return 'N/A';
    else return result.GDP_per_capita;
}

function getTopOS(country){
    country = trsName(country);
    result = bar_chart.data.find(d => d.Country == country);
    if(result==undefined) return 'N/A';
    else {
        var os_list = ['Android','iOS','Samsung','KaiOS','Windows','Others'];
        var ary = [+result.Android, +result.iOS, +result.Samsung, +result.KaiOS, +result.Others];
        return os_list[ary.indexOf(Math.max(...ary))]
    }
}