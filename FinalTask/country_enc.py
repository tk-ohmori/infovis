import re

def main():
    html = open('country_list_html.dat', 'r', encoding='utf-8')
    # out = open('country_list.dat', 'w')
    for l in html.readlines():
        result = re.match(r'<option\s+?value="(\w\w)">(.+?)</option>.*', l)
        if result:
            lst =[result.group(2), result.group(1), result.group(2).lower().replace(' ','-'), result.group(2).replace(' ','%20')]
            print(lst)
    html.close()
    # out.close()

if __name__ == '__main__':
    main()