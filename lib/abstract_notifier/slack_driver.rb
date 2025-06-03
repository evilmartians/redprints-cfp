module AbstractNotifier
  module SlackDriver
    class << self
      def notify(payload)
        url = payload.delete(:webhook_url)
        # We silently ignore Slack notification if not configured
        return unless url

        text = payload.delete(:body)

        slack_payload = {
          attachments: [
            {
              fallback: text,
              color: payload.delete(:color) || "good",
              fields: [
                {
                  title: payload.delete(:title) || "Notification",
                  value: text,
                  short: false
                }
              ]
            }
          ]
        }

        peform_request(url, slack_payload)
      end

      alias_method :call, :notify

      def peform_request(url, payload)
        uri = URI.parse(url)
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        http.request_post(uri.path, payload.to_json, "Content-Type" => "application/json")
      end
    end
  end
end
