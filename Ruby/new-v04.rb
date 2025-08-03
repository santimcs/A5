require 'nokogiri'
require 'open-uri'
require 'certified'
require 'time'
load './my_utils.rb'

puts "Enter stock name: "
stock_name = gets.chomp

url = "https://www.set.or.th/en/market/product/stock/quote/#{stock_name}/price"

headers = {
  'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept-Language' => 'en-EN,en;q=0.9'
}

begin
  previous_data = {
    bid_price: nil,
    bid_volume: nil,
    offer_price: nil,
    offer_volume: nil,
    last_price: nil,
    market_volume: nil
  }
  
  loop do
    current_time = Time.now.strftime("%H:%M:%S")
    begin
      html_data = URI.open(url, headers).read
      doc = Nokogiri::HTML(html_data)

      current_data = {
        bid_price: "N/A",
        bid_volume: "N/A",
        offer_price: "N/A",
        offer_volume: "N/A",
        last_price: "N/A",
        market_volume: "N/A"
      }

      # Bid information
      bid_value = doc.xpath('//label[contains(text(), "Bid Price / Volume (Shares)")]/following-sibling::span[1]/text()').to_s.strip
      if bid_value.include?(' / ')
        current_data[:bid_price], current_data[:bid_volume] = bid_value.split(' / ')
      end

      # Offer information
      offer_value = doc.xpath('//label[contains(text(), "Offer Price / Volume (Shares)")]/following-sibling::span[1]/text()').to_s.strip
      if offer_value.include?(' / ')
        current_data[:offer_price], current_data[:offer_volume] = offer_value.split(' / ')
      end

      # Last price and market volume
      price_element = doc.at_xpath('//label[text()="Last"]/following-sibling::span')
      current_data[:last_price] = price_element.text.strip if price_element

      volume_element = doc.at_xpath('//span[contains(text(), "Volume (Shares)")]/following-sibling::span')
      current_data[:market_volume] = volume_element.text.strip if volume_element

      # Check if any relevant data has changed
      relevant_keys = [:bid_price, :bid_volume, :offer_price, :offer_volume, :last_price, :market_volume]
      data_changed = relevant_keys.any? { |key| current_data[key] != previous_data[key] }

      if data_changed
        puts "\n=== Fetching data at #{current_time} ==="
        puts "Bid Price:   #{current_data[:bid_price].ljust(5)} | #{current_data[:bid_volume]}"
        puts "Offer Price: #{current_data[:offer_price].ljust(5)} | #{current_data[:offer_volume]}"
        puts "Last Price:  #{current_data[:last_price].ljust(5)} | #{current_data[:market_volume]}"

        # Show transaction info only if volume changed
        if current_data[:market_volume] != "N/A" && current_data[:last_price] != "N/A" && 
           previous_data[:market_volume] && previous_data[:market_volume] != "N/A"
          
          current_volume = current_data[:market_volume].gsub(',', '').to_i
          previous_volume = previous_data[:market_volume].gsub(',', '').to_i
          volume_diff = current_volume - previous_volume
          
          if volume_diff != 0
            transaction_type = current_data[:last_price] == current_data[:bid_price] ? 'Bid' : 'Offer'
            formatted_diff = volume_diff.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\1,').reverse
            puts "Last Trans:  #{transaction_type.ljust(5)} | #{formatted_diff}"
          end
        end
      end

      previous_data = current_data.dup

    rescue OpenURI::HTTPError => e
      puts "\n=== Fetching data at #{current_time} ==="
      puts "HTTP Error: #{e.message}"
    rescue => e
      puts "\n=== Fetching data at #{current_time} ==="
      puts "Error fetching data: #{e.message}"
    end

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