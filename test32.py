import requests
from bs4 import BeautifulSoup
from random import choice
proxies = []

# open file and read the content in a list
with open('proxy.txt', 'r') as filehandle:
    for line in filehandle:
        # remove linebreak which is the last character of the string
        currentPlace = line[:-1]

        # add item to the list
        proxies.append(currentPlace)
def proxy_generator():
    proxy = {'https': choice(proxies)}
    return proxy

def data_scraper(request_method, url, **kwargs):
    while True:
        try:
            proxy = proxy_generator()
            print("Proxy currently being used: {}".format(proxy))
            response = requests.request(request_method, url, proxies=proxy, timeout=7, **kwargs)
            break
            # if the request is successful, no exception is raised
        except:
            print("Connection error, looking for another proxy")
            pass
    return response
while True:
    response = data_scraper('get', "http://icanhazip.com/")
    print(response.status_code)
# import requests
# from requests.exceptions import HTTPError

# # try:
# #     response = requests.get('https://brottsplatskartan.se/api/event/1')
# #     response.raise_for_status()
# #     # access JSOn content
# #     jsonResponse = response.json()
# #     print("Entire JSON response")
# #     print(jsonResponse)
# #     print("Print each key-value pair from JSON response")
# #     for key, value in jsonResponse['data'].items():
# #         print(key, ":", value)
# # except HTTPError as http_err:
# #     print(f'HTTP error occurred: {http_err}')
# # except Exception as err:
# #     print(f'Other error occurred: {err}')
# urls = []
# i = 0
# while True:
#     i = i +1
#     url1 = ('https://brottsplatskartan.se/api/event/')+str(i)
#     urls.append(url1)
#     if (i > 228331):
#         break
# with open('eventfile.txt', 'w') as filehandle:
#     for listitem in urls:
#         filehandle.write('%s\n' % listitem)
# # define an empty list
# places = []

# # open file and read the content in a list
# with open('proxy.txt', 'r') as filehandle:
#     for line in filehandle:
#         # remove linebreak which is the last character of the string
#         currentPlace = line[:-1]

#         # add item to the list
#         places.append(currentPlace)
# print(places[:5])