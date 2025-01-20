require 'open-uri'
require 'nokogiri'

url = "https://www.set.or.th/th/market/product/stock/quote/AOT/price"
doc = Nokogiri::HTML(open(url))
today_low = doc.at('span[class="title-font-family fs-16px fw-bolder me-auto lh-1"]')
puts today_low.text # This will output the content of the HTML tag you specified
year_low  = doc.css('span[class="title-font-family fs-16px fw-bolder me-auto lh-1"]')[1]
puts year_low.text # This will output the content of the HTML tag you specified
# High
today_high = doc.at('span[class="title-font-family fs-16px fw-bolder lh-1"]')
puts today_high.text # This will output the content of the HTML tag you specified
year_high  = doc.css('span[class="title-font-family fs-16px fw-bolder lh-1"]')[1]
puts year_high.text # This will output the content of the HTML tag you specified