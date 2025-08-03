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

    # Initialize variables
    bid_price = bid_volume = offer_price = offer_volume = last_price = market_volume = "N/A"

    # Fetch data with error handling
    begin
      # Bid information
      bid_value = doc.xpath('//label[contains(text(), "Bid Price / Volume (Shares)")]/following-sibling::span[1]/text()').to_s.strip
      if bid_value.include?(' / ')
        bid_price, bid_volume = bid_value.split(' / ')
      end

      # Offer information
      offer_value = doc.xpath('//label[contains(text(), "Offer Price / Volume (Shares)")]/following-sibling::span[1]/text()').to_s.strip
      if offer_value.include?(' / ')
        offer_price, offer_volume = offer_value.split(' / ')
      end

      # Last price and market volume
      price_element = doc.at_xpath('//label[text()="Last"]/following-sibling::span')
      last_price = price_element.text.strip if price_element

      volume_element = doc.at_xpath('//span[contains(text(), "Volume (Shares)")]/following-sibling::span')
      market_volume = volume_element.text.strip if volume_element

      # Format and display output
      puts "Bid Price:   #{bid_price.ljust(5)} | #{bid_volume}"
      puts "Offer Price: #{offer_price.ljust(5)} | #{offer_volume}"
      puts "Last Price:  #{last_price.ljust(5)} | #{market_volume}"

    rescue => e
      puts "Error fetching data: #{e.message}"
    end

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