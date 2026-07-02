# Change log

## 2026-07-01

- Add `open_at` to CFPs to prevent submitting before the provided date.

## 2026-06-29

- Use `primary: true` instead of `id: "primary"` for specifying the primary CFP.

  Now you can change the primary CFP on-the-fly (for example, when you want to start a new one for the next year) without losing data integrity.

- Add `inactive: true` to CFPs to hide inactive (old) CFPs and proposals from admin interfaces by default as well as tracks not currently being used.
