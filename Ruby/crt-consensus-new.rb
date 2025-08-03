# encoding: utf-8
require 'nokogiri'
require 'open-uri'
load './ruby/my_utils.rb'

# Get the current script's directory
current_dir = File.dirname(__FILE__)
# Construct the file path to the input folder
input_dir = File.join(current_dir, '..', 'Data')
# Construct the file path to the output folder
output_dir = File.join(current_dir, '..', 'Data')

# Construct the file path to the input file
file_in = File.join(input_dir, "name-ttl.csv")
# Construct the file path to the output file
file_out = File.join(output_dir, "consensus-new.csv")

# fi = File.open(file_in, "r")
fi = File.open(file_in, "r:bom|utf-8")  # Changed this line to handle BOM
fo = File.open(file_out,"w") 

# Column Header
header = 'name,target,max,min,buy,hold,sell'
header += "\n"
fo.write(header)

time = Time.new
puts 'Start at: ' + time.strftime("%A, %b %d %I:%M %p") 
puts header 

j = 0 # record number to display at the end of the line

fi.each do |line|
    stock_name = line.chomp.encode('ASCII', invalid: :replace, undef: :replace, replace: '')
    status = 'x'
    url = "https://www.settrade.com/th/equities/quote/#{stock_name}/analyst-consensus"
    
    begin
        html_data = open(url).read
        html_data = html_data.force_encoding("utf-8")
        doc = Nokogiri::HTML(html_data)

        array = []
        ary_out = []
        array[0] = stock_name.upcase
        ary_out[0] = stock_name.upcase

        elements = doc.xpath("//div[@class='col-4 heading1-font-family fs-24px text-middle-gray text-end px-0']/text()")
        i = 0

        elements.each do | element |
            i += 1
            target_price = element.text
            ary_out[1] = element.text
        end

        elements = doc.xpath("//div[@class='col-4 heading1-font-family fs-24px text-end px-0 text-positive']/text()")
        i = 0
        elements.each do | element |
            i += 1
            target_max = element.text
            ary_out[2] = element.text.strip!
        end

        elements = doc.xpath("//div[@class='col-4 heading1-font-family fs-24px text-end px-0 text-negative']/text()")
        i = 0
        elements.each do | element |
            i += 1
            target_min = element.text
            ary_out[3] = element.text.strip!
        end

        elements = doc.xpath("//div[@class='progress-bar progress-bar-item']/@aria-label")
        i = 0
        ary_out[4] = 0
        ary_out[5] = 0
        ary_out[6] = 0
     
        elements.each do | element |
            text = element.text
            split_text = text.split(" ")

            if split_text[0]  == 'Buy'
                ary_out[4] = split_text[1]
            elsif split_text[0]  == 'Hold'
                ary_out[5] = split_text[1]
            elsif split_text[0]  == 'Sell'
                ary_out[6] = split_text[1]    
            end
        end

        if (ary_out[1].strip! != '0.00')  # EPS_a
            out_line = ary_out.join(',')
            out_line += "\n"
            fo.write(out_line) 

            j += 1
            
            printf "%-8s %6.2f %6.2f %6.2f %2s %2s %2s %3d\n", 
            ary_out[0], ary_out[1], ary_out[2], ary_out[3], ary_out[4], ary_out[5], ary_out[6], j    
        end
    rescue => e
        puts "Error processing #{stock_name}: #{e.message}"
    end

    sleep(1)
end

time = Time.new
puts 'End at: ' + time.strftime("%A, %b %d %I:%M %p")

fo.close
fi.close