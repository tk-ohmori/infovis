from selenium import webdriver
from selenium.webdriver.support.select import Select
from urllib.request import urlretrieve
from time import sleep
from tqdm import tqdm

def main():
    driver = webdriver.Chrome(executable_path = 'chromedriver')
    url_ww = 'https://gs.statcounter.com/os-market-share/mobile/worldwide/#monthly-202001-202012-bar'
    driver.get(url_ww)

    driver.find_element_by_id('btn-edit-chart').click()
    region = Select(driver.find_element_by_id('region'))
    length = len(region.options)

    url_list = []
    driver.get(url_ww)
    for i in tqdm(range(length)):
        driver.find_element_by_id('btn-edit-chart').click()
        region = Select(driver.find_element_by_id('region'))
        name = region.options[i].text.replace(' ', '-')
        region.select_by_index(i)
        driver.find_element_by_id('view-chart').click()
        sleep(1)
        csv_url = driver.find_element_by_id('csv-version').get_attribute("href")
        url_list.append([name, csv_url])
    driver.close()

    for x in url_list:
        name = x[0]
        url = x[1]
        urlretrieve(url, 'os_share/' + name + '.csv')

if __name__ == '__main__':
    main()