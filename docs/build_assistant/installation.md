# M4U Installation Guide

This guide will walk you through the process of installing and setting up Multisynq for your Unity project.

## Prerequisites

- Unity 2021.3 or later
- A Multisynq account (sign up at [https://multisynq.io/account/](https://multisynq.io/account/))

## Installation Steps

### 1. **Install Package dependencies**

   You will be installing 2 packages: `M4U` and `Webview`

   ![](images/build_assistant/git_package.png)

   1. From Unity menu, click on Window > Package Manager
   2. Click the `[+ ▼]` dropdown picker on the top left
   3. Select: [ Add package from git URL ]
   4. Paste the link
   5. Press the Install button on the right.

   Do this for the following package/link:
   - `https://github.com/gree/unity-webview.git?path=/dist/package-nofragment`

   #### Troubleshooting

   ![](images/build_assistant/webview.png)

   If you encounter issues try pressing the `update` button after adding the git package. This might help resolve some issues.
   
### 2. **Download the Multisynq Unity Package**

   ![](images/build_assistant/package_manager.png)

   1. From Unity menu, click on Window > Package Manager
   2. Click the `[Packages: _____ ▼]` dropdown picker
   3. Select: `Unity Registry`
   4. Click to focus in the Search input at the right
   5. Type `Multisynq`
   6. Click the `Install` button (await download)
   7. **Alternately**, you may install directly from github using the upper left `[+ ▼]` button and `Add package from Git url` and paste this link: [https://github.com/multisynq/m4u-package.git](https://github.com/multisynq/m4u-package.git)


### 3. **Open the Multisynq Build Assistant**

   ![](images/build_assistant/menu.png)

   1. In the Unity menu bar, click on `Multisynq`
   2. Select `Open Build Assistant Window`

### 4. **Follow the Build Assistant Steps**
   
   ![](images/build_assistant/guide.png)

   - Click `Check If Ready` to start the configuration process
   - Follow the instructions for each step in the Build Assistant
   - Resolve any issues indicated by red X marks

### 5. **Build Your Project**
   - Once all steps in the Build Assistant show green checkmarks, your project is ready for Multisynq integration

   *You'll be adding [SynqVar] and [SynqRPC] in no time!*

## Next Steps

After installation, refer to this documentation for information on creating multi-user experiences and synchronizing objects across the network.

For troubleshooting and additional questions, consult the FAQ or reach out to Multisynq support.