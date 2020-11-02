from multiprocessing import Process, Pool
import time
import multiprocessing

import urllib.request as urllib2
import requests
import random
import requests
from bs4 import BeautifulSoup
from random import choice

from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
# print("Number of cpu: ", multiprocessing.cpu_count())

retry_strategy = Retry(
    total=3,
    status_forcelist=[429, 500, 502, 503, 504],
    method_whitelist=["HEAD", "GET", "OPTIONS"]
)
adapter = HTTPAdapter(max_retries=retry_strategy)


def millis():
    return int(round(time.time() * 1000))


def http_get(url):
    start_time = millis()
    result = {"url": url, "data": requests.get(url, timeout=5).status_code}
    adapter = HTTPAdapter(max_retries=retry_strategy)
    http = requests.Session()
    http.mount("https://", adapter)
    http.mount("http://", adapter)
    resp = http.get(url)
    print("Url: {}".format(url))
    print("Response code: {}\n".format(resp.status_code))
    return result


urls = []
i = 0
while True:
    i = i + 1
    url1 = ('https://brottsplatskartan.se/api/event/')+str(i)
    urls.append(url1)
    if (i > 5000):
        break
pool = Pool(processes=16)

start_time = millis()
results = pool.map(http_get, urls)

print("\nTotal took " + str(millis() - start_time) + " ms\n")

for result in results:
    print(result)
