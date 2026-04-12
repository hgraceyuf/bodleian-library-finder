# Library Hours Widget

A small responsive web app that shows which libraries are open right now.

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
