# Extracted from https://github.com/rails/rails/pull/48073

module ActionDispatch
  module SystemTesting
    # Deletes screenshots older than the provided TTL (time to live) in seconds.
    #
    # This method is supposed to be called in the beginning of a test suite run and after
    # test files and configuration have been loaded.
    def self.rotate_screenshots(ttl: 1.hour)
      screenshots_dir = Capybara.save_path.presence || "tmp/screenshots"
      return unless File.directory?(screenshots_dir)

      drop_older = ttl.ago

      Dir.each_child(screenshots_dir) do |path|
        path = File.join(screenshots_dir, path)

        next if File.ctime(path) > drop_older

        File.delete(path)
      end
    end
  end
end
