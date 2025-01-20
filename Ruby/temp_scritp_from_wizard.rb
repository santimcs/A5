require 'csv'
require 'open-uri'
require 'nokogiri'
require 'sqlite3'

sql = "SELECT name FROM buy WHERE active = 1 ORDER BY name"
const = SQLite3::Database.new('stock_prices.db')
in_df = const.execute(sql)
url = "https://www.set.or.th/en/market/product/stock/quote/"
output_columns = ['name', 'today_low', 'today_high', 'year_low', 'year_high']
data = []
in_df.each do |row|
  name, active = row[0]
  name = name.upcase
  response = open(url + name + '/price') {|f| f.read}
  soup = Nokogiri::HTML(response)
  today_low  = soup.at('span.title-font-family.fs-16px.fw-bolder.me-auto.lh-1')&.text
  today_high = soup.at('span.title-font-family.fs-16px.fw-bolder.lh-1')&.text
  year_low   = soup.at('span.title-font-family.fs-16px.fw-bolder.me-auto.lh-1')&.next_sibling&.text
  year_high  = soup.at('span.title-font-family.fs-16px.fw-bolder.lh-1').next_sibling&.text
  data << [name, today_low, today_high, year_low, year_high] if !today_low.nil? && !year_low.nil?
  sleep(2)   
end
out_df = pd.DataFrame(data, columns=output_columns)