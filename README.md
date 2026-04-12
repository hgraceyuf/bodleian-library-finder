# Library Hours Widget

A small responsive web app that shows which libraries are open right now.

## Why dragging only `index.html` breaks it

`index.html` depends on nearby files like `app.js`, `libraryData.js`, `styles.css`, and `manifest.webmanifest`.
If you drag only the HTML file onto your desktop by itself, those linked files are no longer beside it, so the page loses its styling and JavaScript.

If you want a desktop shortcut, use:
- `Open Library Widget.command` as a launcher, or
- a macOS alias to the whole project folder or to `index.html` while keeping the other files in place.

## Run locally

You can still double-click `index.html`, but if you want service worker caching too, serve it locally:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Put these project files into that repository.
3. Push the repository to the `main` branch.
4. In GitHub, open `Settings` > `Pages` and make sure GitHub Pages is enabled.
5. The included workflow in `.github/workflows/deploy.yml` will publish the site automatically.
6. After the workflow finishes, your widget will be available at a `https://<username>.github.io/<repo>/` URL.

## Add to iPhone Home Screen

1. Open the published GitHub Pages URL in Safari on your iPhone.
2. Tap the Share button.
3. Tap `Add to Home Screen`.
4. Save it. You will then have a tappable shortcut that opens the widget like an app.

## Customize the library database

Edit `libraryData.js` and replace the sample branches with your own libraries.

Each library uses this shape:

```js
{
  id: "central-library",
  name: "Central Library",
  address: "1 High Street",
  schedule: {
    monday: ["09:00-18:00"],
    tuesday: ["09:00-18:00"],
    wednesday: ["09:00-18:00"],
    thursday: ["09:00-19:00"],
    friday: ["09:00-18:00"],
    saturday: ["10:00-16:00"],
    sunday: []
  }
}
```

To represent a split day, add multiple ranges:

```js
thursday: ["08:30-12:30", "13:30-20:00"]
```

An empty array means the library is closed all day.
