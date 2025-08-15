require 'nokogiri'
require 'open-uri'
require 'certified'
require 'time'
load './my_utils.rb'

# Color codes
COLOR_RESET = "\e[0m"
COLOR_GREEN = "\e[32m"
COLOR_RED = "\e[31m"
COLOR_YELLOW = "\e[33m"

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
    offer_price: nil,
    last_price: nil,
    market_volume: nil
  }
  
  # Initialize counters for color changes
  color_counts = {
    green: 0,
    red: 0,
    yellow: 0
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

      # Check if important data has changed (price or volume)
      price_changed = (current_data[:last_price] != previous_data[:last_price])
      volume_changed = (current_data[:market_volume] != previous_data[:market_volume])
      bid_price_changed = (current_data[:bid_price] != previous_data[:bid_price])
      offer_price_changed = (current_data[:offer_price] != previous_data[:offer_price])

      if price_changed || volume_changed || bid_price_changed || offer_price_changed
        puts "\n=== #{stock_name.upcase} data at #{current_time} ==="        
        puts "Bid Price:   #{current_data[:bid_price].ljust(5)} | #{current_data[:bid_volume]}"
        puts "Offer Price: #{current_data[:offer_price].ljust(5)} | #{current_data[:offer_volume]}"
        
        # Determine color for last price
        last_price_color = if current_data[:last_price] == "N/A" || previous_data[:last_price].nil?
                            COLOR_RESET
                          elsif current_data[:last_price].gsub(',', '').to_f > previous_data[:last_price].gsub(',', '').to_f
                            color_counts[:green] += 1
                            COLOR_GREEN
                          elsif current_data[:last_price].gsub(',', '').to_f < previous_data[:last_price].gsub(',', '').to_f
                            color_counts[:red] += 1
                            COLOR_RED
                          else
                            color_counts[:yellow] += 1
                            COLOR_YELLOW
                          end
        
        puts "Last Price:  #{last_price_color}#{current_data[:last_price].ljust(5)}#{COLOR_RESET} | #{current_data[:market_volume]}"

        # Show transaction info only if volume changed
        if volume_changed && current_data[:market_volume] != "N/A" && current_data[:last_price] != "N/A" && 
           !previous_data[:market_volume].nil? && previous_data[:market_volume] != "N/A"
          
          current_volume = current_data[:market_volume].gsub(',', '').to_i
          previous_volume = previous_data[:market_volume].gsub(',', '').to_i
          volume_diff = current_volume - previous_volume
          
          if volume_diff != 0
            transaction_type = current_data[:last_price] == current_data[:bid_price] ? 'Offer' : 'Bid' 
            formatted_diff = volume_diff.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\1,').reverse
            puts "Last Trans:  #{transaction_type.ljust(5)} | #{formatted_diff}"
          end
        end

        # Display color counts if there was a price change
        if price_changed && !previous_data[:last_price].nil? && previous_data[:last_price] != "N/A"
          puts "#{COLOR_YELLOW}Yellow: #{color_counts[:yellow]}#{COLOR_RESET}    " +
               "#{COLOR_GREEN}Green: #{color_counts[:green]}#{COLOR_RESET}    " +
               "#{COLOR_RED}Red: #{color_counts[:red]}#{COLOR_RESET}"
        end
      end

      # Update previous data (only tracking prices and market volume)
      previous_data = {
        bid_price: current_data[:bid_price],
        offer_price: current_data[:offer_price],
        last_price: current_data[:last_price],
        market_volume: current_data[:market_volume]
      }

    rescue OpenURI::HTTPError => e
      puts "\n=== Fetching data at #{current_time} ==="
      puts "HTTP Error: #{e.message}"
    rescue => e
      puts "\n=== Fetching data at #{current_time} ==="
      puts "Error fetching data: #{e.message}"
      puts e.backtrace.join("\n")  # Add this line to see where the error occurred
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