def main():
    org = open('gdp.csv', 'r', encoding='utf-8')
    out = open('gdp_2020.csv', 'w')
    for l in org.readlines():
        l = l.split(',')
        country = l[0].replace('"', '')
        gdp = l[-3].replace('"', '')
        out.write(country + ',' + gdp + '\n')
    out.close()

if __name__ == '__main__':
    main()
