require 'nokogiri'
require 'open-uri'
require 'certified'
require 'time'
load './my_utils.rb'

puts "Enter stock name: "
stock_name = gets.chomp

url = "https://www.set.or.th/en/market/product/stock/quote/#{stock_name}/price"

# Set headers to mimic a browser request
headers = {
  'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept-Language' => 'en-EN,en;q=0.9'
}

begin
  loop do
    current_time = Time.now.strftime("%H:%M:%S")
    puts "\n=== Fetching data at #{current_time} ==="

    html_data = open(url, headers).read
    doc = Nokogiri::HTML(html_data)

    # Fetch and display Bid information
    begin
      bid_value = doc.xpath('//label[contains(text(), "Bid Price / Volume (Shares)")]/following-sibling::span[1]/text()').to_s.strip
      if bid_value.include?(' / ')
        bid_price, bid_volume = bid_value.split(' / ')
        puts "Bid Price: #{bid_price}"
        puts "Bid Volume: #{bid_volume}"
      else
        puts "Bid data not found or in unexpected format"
      end
    rescue => e
      puts "Error fetching bid data: #{e.message}"
    end

    # Fetch and display Offer information
    begin
      offer_value = doc.xpath('//label[contains(text(), "Offer Price / Volume (Shares)")]/following-sibling::span[1]/text()').to_s.strip
      if offer_value.include?(' / ')
        offer_price, offer_volume = offer_value.split(' / ')
        puts "Offer Price: #{offer_price}"
        puts "Offer Volume: #{offer_volume}"
      else
        puts "Offer data not found or in unexpected format"
      end
    rescue => e
      puts "Error fetching offer data: #{e.message}"
    end

    # Fetch market volume
    volume = doc.xpath('//span[contains(text(), "Volume (Shares)")]/following-sibling::span/text()').to_s.strip
    puts "Market Volume: #{volume}" if volume

    price_element = doc.at_xpath('//label[text()="Last"]/following-sibling::span')
    last_price = price_element.text.strip if price_element

    puts "Price: #{last_price}"

    # Wait for 60 seconds before next fetch
    sleep(60)
  end
rescue Interrupt
  puts "\nScript stopped by user. Exiting..."
rescue => e
  puts "Error: #{e.message}"
  puts "Retrying in 60 seconds..."
  sleep(60)
  retry
end