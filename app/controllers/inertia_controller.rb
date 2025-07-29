class InertiaController < ApplicationController
  def default_render
    serializer_class = "Pages::#{controller_name.camelize}::#{action_name.camelize}Serializer"
    serializer = serializer_class.constantize

    render inertia: serializer.new(view_assigns.symbolize_keys).to_inertia
  end

  def self.inertia_share_with(serializer)
    inertia_share do
      serializer.new(self).to_inertia
    end
  end

  # inertia_share do
  #   {
  #     user: -> { serialize(current_user) if current_user },
  #     flash: -> { flash.to_hash },
  #     cfp_closed: -> { CFP.primary.closed? }
  #   }
  # end

  inertia_share_with SharedSerializer

  private

  def serialize(obj, with: nil, **params)
    return {} unless obj

    serializer = with || begin
      model = obj.try(:model) || obj.class
      "#{model.name}Serializer".constantize
    end

    serializer.new(obj, params:)
  end
end
