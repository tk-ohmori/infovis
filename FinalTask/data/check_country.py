f1 = open('country_list.csv', 'r', encoding='utf-8')
f2 = open('gdp_2020.csv', 'r', encoding='utf-8')
f3 = open('population_2020.csv', 'r', encoding='utf-8')

lines1 = f1.readlines()
lines2 = f2.readlines()
lines3 = f3.readlines()

f1.close()
f2.close()
f3.close()

for i in range(max([len(lines1), len(lines2), len(lines3)])):
    flag = False
    if lines1[i].replace('\n','') != lines2[i].split(',')[0]:
        print("GDP's line: " + str(i+1))
        print(lines1[i].replace('\n',''))
        flag = True
    if lines1[i].replace('\n','') != lines3[i].split(',')[0]:
        print("Population's line: " + str(i+1))
        print(lines1[i].replace('\n',''))
        flag = True
    if flag:
        break
