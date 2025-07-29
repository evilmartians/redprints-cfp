module Alba::Inertia
  def to_inertia
    Alba.collection?(@object) ? serializable_inertia_hash_for_collection : attributes_to_inertia_hash(@object, {})
  end

  private

  def attributes_to_inertia_hash(obj, hash)
    attributes.each do |key, attribute|
      set_key_and_inertia_attribute_body_from(obj, key, attribute, hash)
    rescue ::Alba::Error, FrozenError, TypeError
      raise
    rescue StandardError => e
      handle_error(e, obj, key, attribute, hash)
    end
    @with_traits.nil? ? hash : hash.merge!(inertia_hash_from_traits(obj))
  end

  def set_key_and_inertia_attribute_body_from(obj, key, attribute, hash)
    key = transform_key(key)
    ser = self
    value = -> { ser.send(:fetch_attribute, obj, key, attribute) }
    # value = -> { fetch_attribute(obj, key, attribute) }
    # When `select` is not overridden, skip calling it for better performance
    unless @_select_arity.nil?
      # `select` can be overridden with both 2 and 3 parameters
      # Here we check the arity and build arguments accordingly
      args = @_select_arity == 3 ? [key, value, attribute] : [key, value]
      return unless select(*args)
    end

    hash[key] = value unless Alba::REMOVE_KEY == value # rubocop:disable Style/YodaCondition
  end

  def inertia_hash_from_traits(obj)
    h = {}
    return h if @with_traits.nil?

    Array(@with_traits).each do |trait|
      body = @_traits.fetch(trait) { raise Alba::Error, "Trait not found: #{trait}" }

      resource_class = Alba.resource_class
      resource_class.class_eval(&body)
      h.merge!(resource_class.new(obj, params: params, within: @within).to_inertia)
    end
    h
  end

  def serializable_inertia_hash_for_collection
    if @_collection_key
      @object.to_h do |item|
        k = item.public_send(@_collection_key)
        key = Alba.regularize_key(k)
        [key, attributes_to_inertia_hash(item, {})]
      end
    else
      @object.map { |obj| attributes_to_inertia_hash(obj, {}) }
    end
  end

  #   hash = {}
  #     # TODO: Alba.collection?(@object)
  #     # TODO: traits
  #     # TODO: error handling
  #     @_attributes.each do |key, attribute|
  #       key = transform_key(key)
  #       ser = self
  #       obj = @object
  #       hash[key] = -> { ser.send(:fetch_attribute, obj, key, attribute) }
  #     end
  #
  #     hash
end
