# About the docs

The docs are deployed at https://multisynq.io/docs/unity

Pre-release docs are at https://multisynq.dev/docs/unity

The docs are generated from the files in this directory using the [Croquet docs generator](https://github.com/croquet/croquet-docs) which has the corresponding JSDoc definitions and theme.

# How to update docs

To update the content, edit the files in this directory:

* `top.md` is the source for the main page
* `build-assistant.md` guide for the build assistant
* `tutorials/*.md` has each of the tutorials

To preview/generate/deploy the docs, they need to be rendered into HTML.

## Docs rendering

### Initial setup

To generate the HTML, clone https://github.com/croquet/croquet-docs next to `unity`:

    ├── m4u-tutorials/        # repo clone
    │
    └── croquet-docs/         # repo clone

Then

    cd unity
    npm i

### Building the react docs

    cd croquet-docs/unity
    npm run build

This will generate the docs into `../dist/unity/`:

    ├── c4u-tutorials/                 # repo clone
    │   └── docs/
    │       ├── top.md                 # becomes index.html
    │       ├── unity-doc.js           # becomes global.html
    │       ├── build-assistant.md     # becomes build-assistant.html
    │       └── tutorials/
    │           └── *.md               # becomes tutorial-*.html
    │
    └── croquet-docs/                  # repo clone
        ├── unity/
        │   └── jsdoc.json             # build definition for react docs
        │
        ├── clean-jsdoc-theme          # theme files for all docs
        │
        └── dist/
            └── unity/                 # generated react docs
                ├── index.html
                ├── global.html
                └── tutorial-*.html

### Continuous rebuilding

While developing, it is useful to have the HTML files get generated continuously. This command will start a watcher and run the build whenever one of the source files changes:

    cd croquet-docs/unity
    npm run watch

Open a browser on one of the generated HTML files, and reload it after changing one of the source files.

See https://github.com/croquet/croquet-docs/tree/main/unity