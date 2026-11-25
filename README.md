# Expense Tracker

A small, responsive web app for logging income and expenses. Built with HTML, CSS, Tailwind CSS and plain JavaScript, with no frameworks or build step.

## Features
- Add income and expense transactions (description, amount, category, date)
- Live balance, income and expense totals
- Filter the list by type and category
- Spending-by-category bars
- Data saved in the browser with `localStorage`, so it survives a refresh
- Input validation with clear error messages
- Responsive layout (mobile to desktop) and keyboard-friendly forms

## Tech
HTML5, CSS3, Tailwind CSS (via CDN), JavaScript (DOM manipulation, events, array methods, localStorage)

## Run locally
Open `index.html` in a browser. No install needed.

## Project structure
```
index.html   page structure and Tailwind classes
style.css    small custom styles (focus states, bar animation)
script.js    app logic: add, delete, filter, totals, storage
```

## What I practised
- Building a layout with Tailwind utility classes
- Updating the DOM from JavaScript without `innerHTML` for user text
- Persisting state with `localStorage`
