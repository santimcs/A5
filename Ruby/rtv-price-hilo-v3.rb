require 'csv'
require 'open-uri'
require 'nokogiri'

input_file = 'name-ttl.csv'
current_dir = File.dirname(__FILE__)
input_dir   = File.join(current_dir, '..', 'Data')
output_dir  = File.join(current_dir, '..', 'Data')
file_in     = File.join(input_dir, input_file)
file_out    = File.join(output_dir, "price-hilo-ruby.csv")

fo = File.open(file_out, "w")
fi = File.open(file_in, "r")
# puts file_in, file_out

header = 'name, today_low, today_high, year_low, year_high'
header += "\n"
fo.write(header)
puts header
url = "https://www.set.or.th/th/market/product/stock/quote/"

time = Time.new
puts 'Start at: ' + time.strftime("%I:%M %p")

  CSV.foreach(input_file) do |row|
    array = []
    name = row[0] #specify the column names for your CSV file
    array[0] = name.upcase
    # puts array[0]

    response = open(url + name + '/price') {|f| f.read}
    soup = Nokogiri::HTML(response)

    today_low = soup.at_xpath('(//span[@class="title-font-family fs-16px fw-bolder me-auto lh-1"])[1]').text
    array[1] = today_low
    # puts array[1]

    year_low = soup.at_xpath('(//span[@class="title-font-family fs-16px fw-bolder me-auto lh-1"])[2]').text
    array[3] = year_low
    # puts array[2]

    today_high = soup.at_xpath('(//span[@class="title-font-family fs-16px fw-bolder lh-1"])[1]').text
    array[2] = today_high
    # puts array[3]

    year_high = soup.at_xpath('(//span[@class="title-font-family fs-16px fw-bolder lh-1"])[2]').text
    array[4] = year_high
    # puts array[4]  

    out_line = array.join(',')
    out_line += "\n"    
    puts out_line
    fo.write out_line
    sleep(1)
  end

time = Time.new
puts 'End at: ' + time.strftime("%I:%M %p")  

fo.close