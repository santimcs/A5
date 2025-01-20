require 'open-uri'
require 'nokogiri'
require 'csv'

url = "https://www.set.or.th/th/market/product/stock/quote/"
filename = 'name-ttl.csv'
CSV.open("stock-price-hilo.csv", "wb") do |csv|
  csv << ['name', 'today_low', 'today_high', 'year_low', 'year_high']

  CSV.foreach(filename, headers: true) do |row|
    name = row['name']
    url_with_name = "#{url}#{name}/price"
    doc = Nokogiri::HTML(open(url_with_name))
    today_low = doc.at('span[class="title-font-family fs-16px fw-bolder me-auto lh-1"]')
    year_low  = doc.css('span[class="title-font-family fs-16px fw-bolder me-auto lh-1"]')[1]
    today_high = doc.at('span[class="title-font-family fs-16px fw-bolder lh-1"]')
    year_high  = doc.css('span[class="title-font-family fs-16px fw-bolder lh-1"]')[1]
    csv << [name, today_low, today_high, year_low, year_high]
  end
end
