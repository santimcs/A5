#!/usr/bin/env ruby

database = ARGV.shift
username = 'root'
# Don't include password in command line for security
end_of_iter = ARGV.shift

backup_dir = "C:\\Users\\PC1\\OneDrive\\Documents\\Backup\\mysql"
begin
  # Ensure backup directory exists
  Dir.mkdir(backup_dir) unless Dir.exist?(backup_dir)
  
  # Create backup filename
  if end_of_iter.nil?
    backup_file = File.join(backup_dir, "#{database}_#{Time.now.strftime('%Y%m%d')}")
  else
    backup_file = File.join(backup_dir, "#{database}_#{end_of_iter}")
  end

  # Execute mysqldump with password prompt
  cmd = "\"c:\\xampp\\mysql\\bin\\mysqldump\" -u#{username} -p #{database} > \"#{backup_file}.sql\""
  result = system(cmd)

  if result
    puts "Backup completed successfully: #{backup_file}.sql"
  else
    raise "mysqldump failed with exit code #{$?.exitstatus}"
  end

rescue StandardError => e
  puts "Error: #{e.message}"
  exit 1
end