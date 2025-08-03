require 'nokogiri'
require 'open-uri'
require 'certified'
load './my_utils.rb'

process = ARGV.shift

file_in = '..\data\name-ttl.csv'
file_out = '..\data\stocks.csv'
file_temp = '..\data\name-tmp.csv'
fo = File.open(file_out, "w")
ft = File.open(file_temp,"w")
fi = File.open(file_in,"r")

if (process == '-o')
  puts "Enter stock name "
  stock_name = gets.chomp
  ft.write stock_name
else
  fi.each do |line|
    array = line.chomp.split(",")
    stock_name = array[0]
    out_line = stock_name + "\n"
    ft.write out_line
  end
end

ft.close

# Column Header
header = 'Name,Market,Price,Max,Min,PE,PBV,Paid-up,Market Cap,Dly Vol,Beta' 
header += "\n"
fo.write(header)

time = Time.new
puts 'Start at: ' + time.strftime("%I:%M %p")

fi = File.open(file_temp, "r")

def clean_numeric_value(value)
  value.to_s.gsub(/[^\d\.-]/, '').strip rescue 'N/A'
end

fi.each do |line|
  stock_name = line.chomp
  url = "https://www.set.or.th/en/market/product/stock/quote/#{stock_name}/factsheet"
  
  begin
    html_data = open(url, {
      'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language' => 'en-EN,en;q=0.9'
    }).read
    doc = Nokogiri::HTML(html_data)

    # Price extraction with better error handling
    price = begin
      container = doc.at_css('.price-right-col .item-list-details')
      next 'N/A' unless container
      label = container.at_css('label')
      next 'N/A' unless label && label.text.strip == 'Price (Baht)'
      clean_numeric_value(container.at_css('span').text)
    rescue
      'N/A'
    end

    # 52-week high/low with better error handling
    high_low = doc.at_xpath('//div[contains(@class, "price-right-col")]//label[contains(text(), "52 Week High/Low")]/following-sibling::span')&.text || 'N/A'
    high, low = begin
      parts = high_low.split('/').map { |v| clean_numeric_value(v) }
      parts.size == 2 ? parts : ['N/A', 'N/A']
    rescue
      ['N/A', 'N/A']
    end
    
    # P/E and P/BV with better error handling
    pe = begin
      doc.at_xpath('//div[contains(@class, "price-right-col")]//label[contains(text(), "P/E (X)")]/following-sibling::span')&.text
    rescue
      nil
    end
    pe = clean_numeric_value(pe)

    pbv = begin
      doc.at_xpath('//div[contains(@class, "price-right-col")]//label[contains(text(), "P/BV (X)")]/following-sibling::span')&.text
    rescue
      nil
    end
    pbv = clean_numeric_value(pbv)
    

    # Paid-up with better error handling
    paid_up = begin
      doc.at_xpath('//div[contains(@class, "price-left-col")]//label[contains(text(), "Paid-up (M.Baht)")]/following-sibling::span')&.text
    rescue
      nil
    end
    paid_up = clean_numeric_value(paid_up)

    # Market cap with better error handling
    market_cap = begin
      doc.at_xpath('//div[contains(@class, "price-left-col")]//label[contains(text(), "Market Cap (M.Baht)")]/following-sibling::span')&.text
    rescue
      nil
    end
    market_cap = clean_numeric_value(market_cap)


    # Prepare output line
    out_line = "#{stock_name.upcase},,#{price},#{high},#{low},#{pe},#{pbv},#{paid_up},#{market_cap},0,0\n"
    
    puts "Fetching #{stock_name.upcase}:"
    puts "Price: #{price}"
    puts "52W High/Low: #{high}/#{low}"
    puts "P/E: #{pe}"
    puts "P/BV: #{pbv}"
    puts "Paid-up: #{paid_up} M"
    puts "Market Cap: #{market_cap} M"
    puts "---------------------"
    
    fo.write out_line
    sleep(1 + rand(2)) # Random delay between 1-3 seconds
  rescue => e
    puts "Error processing #{stock_name}: #{e.message}"
    puts e.backtrace if ENV['DEBUG']
    fo.write "#{stock_name.upcase},ERROR,ERROR,ERROR,ERROR,ERROR,ERROR\n"
  end
end

time = Time.new
puts 'End at: ' + time.strftime("%I:%M %p")

fo.close
#