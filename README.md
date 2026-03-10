# Accessible Bootstrap Form Component Demos

This package includes four examples:

- `autocomplete.html`
- `autocomplete-dropdown.html`
- `multiselect.html`
- `multiselect-dropdown.html`

## Run locally

Open any HTML file directly after unzipping, or run a local server.

Using Node:
npx serve

Then open:

- http://localhost:3000/autocomplete.html
- http://localhost:3000/autocomplete-dropdown.html
- http://localhost:3000/multiselect.html
- http://localhost:3000/multiselect-dropdown.html


## What changed in this version

This update includes the requested UI changes:

- multi-select dropdown actually drops down lol

## TODO

- test with screen reader

## Included files

- `autocomplete.html`
- `autocomplete.js`
- `autocomplete-dropdown.html`
- `autocomplete-dropdown.js`
- `multiselect.html`
- `multiselect.js`
- `multiselect-dropdown.html`
- `multiselect-dropdown.js`
- `styles.css`
- `README.md`

## Accessibility notes

The autocomplete examples use an ARIA combobox/listbox pattern.

The multi-select examples intentionally use a filterable checkbox-group pattern rather than a fully custom ARIA multi-select listbox, because that is usually the safer and more reliable accessibility approach for 508/WCAG work.
