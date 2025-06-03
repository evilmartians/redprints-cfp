module Sections
  class Table < SitePrism::Section
    set_default_search_arguments "table"

    element :first_row, "tbody tr:first-child"
    element :second_row, "tbody tr:nth-child(2)"
    element :last_row, "tbody tr:last-child"

    elements :rows, "tbody tr"
  end
end
