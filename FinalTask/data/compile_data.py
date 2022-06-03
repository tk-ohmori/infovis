import glob
import os

def main():
    files = glob.glob('os_share/*.csv')
    output = open('finaltask.csv', 'w')
    for f in files:
        os_share = get_data(f)
        country = os.path.basename(f).replace('.csv','').replace('-',' ')
        (population, gdp) = get_pop_gdp(country)
        output.write(','.join([country, population, gdp] + os_share) + '\n')
    output.close()

def get_data(file_name):
    os_list = ['Android', 'iOS', 'Samsung', 'KaiOS', 'Windows', 'Others']
    try:
        f = open(file_name, 'r')
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
    gdp_file = open('gdp_2020.csv', 'r')
    gdp = ''
    for l in gdp_file.readlines():
        if l.startswith(country):
            gdp = l.replace('\n','').split(',')[-1]
            break
    gdp_file.close()
    if gdp == '':
        print(country + "'s GDP was not found.")
        exit(1)
    pop_file = open('population_2020.csv', 'r')
    pop = ''
    for l in pop_file.readlines():
        if l.startswith(country):
            pop = l.replace('\n','').split(',')[-1].replace('.','')
            break
    pop_file.close()
    if pop == '':
        print(country + "'s population was not found.")
        exit(1)
    return gdp, pop



if __name__ == '__main__':
    main()