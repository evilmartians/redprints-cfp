module Sections
  class Form < SitePrism::Section
    set_default_search_arguments "form"

    def select_star(name, value)
      find("button[name='#{name}[#{value}]']").click
    end
  end
end
