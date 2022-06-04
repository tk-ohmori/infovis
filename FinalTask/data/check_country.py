f1 = open('country_list.csv', 'r', encoding='utf-8')
f2 = open('gdp_2020.csv', 'r', encoding='utf-8')
f3 = open('population_2020.csv', 'r', encoding='utf-8')

lines1 = f1.readlines()
lines2 = f2.readlines()
lines3 = f3.readlines()

f1.close()
f2.close()
f3.close()

import glob
import os
files = glob.glob('os_share/*.csv')
files = [os.path.basename(f).replace('.csv','') for f in files]

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

def check(lines, country):
    country = dic.get(country, country).replace(' ','-')
    if country == 'Antarctica':
        return True
    for l in lines:
        if l.split(',')[0]==country:
            return True
    return False

for i in range(min([len(lines1), len(lines2), len(lines3)])):
    flag = False
    country = lines1[i].replace('\n','')
    if not check(lines2, country):
        print("GDP: " + country)
        flag = True
    if not check(lines3, country):
        print("Population: " + country)
        flag = True
    if dic.get(country, country).replace(' ','-') not in files and country!='Antarctica':
        print('OS FILE: ' + country)
        flag = True
    if flag:
        break

