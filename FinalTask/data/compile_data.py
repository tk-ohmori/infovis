import os

dic = {
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

def main():
    f = open('country_list.csv', 'r', encoding='utf-8')
    country_list = [l.replace('\n','') for l in f.readlines()]
    f.close()
    output = open('finaltask.csv', 'w', encoding='utf-8')
    output.write('Country,Population,GDP_per_capita,Android,iOS,Samsung,KaiOS,Windows,Others\n')
    for country in country_list:
        country = dic.get(country, country).replace(' ','-')
        if country == 'Antarctica':
            continue
        os_share = get_data(country)
        (population, gdp) = get_pop_gdp(country)
        output.write(','.join([country, population, gdp] + os_share) + '\n')
    output.close()

def get_data(country):
    file_name = 'os_share/' + country + '.csv'
    os_list = ['Android', 'iOS', 'Samsung', 'KaiOS', 'Windows', 'Others']
    try:
        f = open(file_name, 'r', encoding='utf-8')
    except OSError as e:
        print(e)
        print(file_name)
        exit(1)
    else:
        dic = {os: 0.0 for os in os_list}
        lines = f.readlines()
        for i, os in enumerate(lines[0].replace('\n','').replace('"','').split(',')[1:]):
            if os not in os_list:
                os = 'Others'
            for l in lines[1:]:
                dic[os] += float(l.replace('\n','').split(',')[i+1])
        f.close()
        return ['{:.2f}'.format(dic[os]/12.0) for os in os_list]
                

def get_pop_gdp(country):
    gdp_file = open('gdp_2020.csv', 'r', encoding='utf-8')
    gdp = ''
    for l in gdp_file.readlines():
        if l.startswith(country):
            gdp = l.replace('\n','').split(',')[-1]
            break
    gdp_file.close()
    if gdp == '':
        print(country + "'s GDP was not found.")
        exit(1)
    pop_file = open('population_2020.csv', 'r', encoding='utf-8')
    pop = ''
    for l in pop_file.readlines():
        if l.startswith(country):
            pop = l.replace('\n','').split(',')[-1].replace('.','')
            break
    pop_file.close()
    if pop == '':
        print(country + "'s population was not found.")
        exit(1)
    return pop, '{:.2f}'.format(float(gdp)/float(pop))



if __name__ == '__main__':
    main()