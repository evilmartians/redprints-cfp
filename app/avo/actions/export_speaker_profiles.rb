class Avo::Actions::ExportSpeakerProfiles < Avo::BaseAction
  self.name = "Export to JSON"
  self.visible = -> { true }
  self.message = "Export selected speaker profiles to JSON"
  self.confirm_button_label = "Export"
  self.cancel_button_label = "Cancel"
  self.no_confirmation = true

  def handle(query:, fields:, current_user:, resource:, **args)
    speaker_profiles = query

    json_data = speaker_profiles.map do |profile|
      {
        name: profile.name,
        company: profile.company,
        role: profile.role,
        image: generate_image_path(profile),
        socials: parse_socials(profile.socials),
        bio: profile.bio,
        group: "speaker"
      }.compact
    end

    json_string = JSON.pretty_generate(json_data)

    download json_string, "speaker_profiles_#{Time.current.strftime("%Y%m%d_%H%M%S")}.json"
  end

  private

  def parse_socials(socials_text)
    return [] if socials_text.blank?

    socials_text.split(/[\n,]/).map(&:strip).compact_blank
  end

  def generate_image_path(profile)
    return nil unless profile.photo.attached?

    Rails.application.routes.url_helpers.rails_blob_url(profile.photo.blob, host: AppConfig.host, port: AppConfig.port)
  end
end
