from geopy.geocoders import Nominatim
import geopy.geocoders
geopy.geocoders.options.default_user_agent = 'jobhunters123123'
geolocator = Nominatim(user_agent="jobhunters123123")
geolocator = Nominatim()
location = geolocator.geocode("Gamle Drammensvei 7, 1369 Stabekk")
print(location.address)
print((location.latitude, location.longitude))