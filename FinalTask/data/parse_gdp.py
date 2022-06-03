def main():
    org = open('gdp.csv', 'r', encoding='utf-8')
    out = open('gdp_2020.csv', 'w')
    for l in org.readlines():
        l = l.split(',')
        country = l[0].replace('"', '')
        i = -3
        gdp = ''
        while(gdp == ''):
            gdp = l[i].replace('"', '')
            i -= 1
        out.write(country + ',' + gdp + '\n')
    out.close()

if __name__ == '__main__':
    main()
