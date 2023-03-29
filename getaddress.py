import geocoder

ip_address = '8.8.8.8' # replace with your desired IP address

location = geocoder.ip(ip_address)

city = location.city
country = location.country
continent = location.continent

print(f"City: {city}, Country: {country}, Continent: {continent}")
