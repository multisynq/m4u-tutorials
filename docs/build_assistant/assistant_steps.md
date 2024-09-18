# Build Assistant Steps

This document outlines the various steps in the Croquet Build Assistant for Unity. Each step is represented by a `StatusItem` that provides real-time feedback on your project's configuration and readiness.

## Status Indicators

Each step includes a status indicator that visually represents the current state:

- ✅ <strong style="color:#4CAF50;">SUCCESS</strong>: The item is correctly configured and ready.
- ❌ <strong style="color:#FF5252;">ERROR</strong>: The item needs immediate attention.
- ⚠️ <strong style="color:#FFA500;">WARNING</strong>: The item may require user intervention.
- ℹ️ <strong style="color:#2196F3;">INFO</strong>: Provides general information about the step.

## Common Features

Each step in the Build Assistant typically includes:

- **Status Message**: A descriptive message explaining the current state.
- **Action Buttons**: Contextual buttons to help resolve issues or perform actions.
- **Docs Button**: Opens this documentation for more detailed information about the step.

## Automatic Checks

When you press `Check if Ready` The Build Assistant examines your project's configuration. Each `StatusItem` performs a check to ensure all components are properly set up for your Croquet application.

## User Interaction

While many issues can be resolved automatically, some steps may require your input or decision-making. The assistant will guide you through these processes with clear instructions and helpful buttons.

---

The following sections detail each step in the `Build Assistant Window`, explaining their purpose, potential issues, and how to resolve them.


## API Key

The API Key is crucial for authenticating your Croquet application.

### Messages

| Type | Content |
|------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | The API Key is ready to go! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | The API Key is not set |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Let's get you a free API Key. It's easy. |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | The API Key is configured!!! Well done! |

### Buttons

1. **Sign Up on the Site**: Opens the Croquet account page ([https://croquet.io/account/](https://croquet.io/account/)).
2. **Goto API Key**: Opens the Unity Project Settings and selects the Croquet Settings asset.

### Setup Process

1. Click "Sign Up on the Site" if you don't have a Croquet account.
2. Click "Goto API Key" in the Build Assistant Window.
3. Paste your API Key into the appropriate field in the Inspector.
4. Click "Check If Ready" to verify the configuration.

## Bridge GameObject

The Bridge GameObject connects your Unity scene with Croquet.

### Messages

| Type | Content |
|------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | Bridge GameObject is ready to go! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Bridge GameObject is missing! |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Bridge GameObject is missing in scene! Click Create Bridge to make one. |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | Bridge Gob (GameObject) found!! Well done! |

### Buttons

1. **Goto Bridge Gob**: Selects the existing Bridge GameObject in the Hierarchy.
2. **Create Bridge Gob**: Creates a new Bridge GameObject in the scene.

### Setup Process

1. If the Bridge GameObject is missing, click "Create Bridge Gob".
2. If it exists, click "Goto Bridge Gob" to select it in the Hierarchy.
3. Verify that the CroquetBridge component and other necessary components are attached.

### Additional Notes

- Creating a Bridge GameObject automatically adds CroquetBridge, CroquetRunner, CroquetEntitySystem, CroquetSpatialSystem, CroquetMaterialSystem, and CroquetFileReader components.
- If Croquet Settings exist in the project, they will be automatically assigned to the CroquetBridge component.

## Bridge Has Settings

This step ensures that the Bridge GameObject is correctly connected to the Croquet Settings asset.

### Messages

| Type | Content |
|------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | Bridge has settings! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Bridge is missing settings! |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Bridge is missing settings! Click Auto Connect to connect it. |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | Bridge connected to settings!!! Well done! |

### Buttons

1. **Auto Connect**: Automatically connects the Bridge to the Croquet Settings asset.
2. **Goto Croquet Settings**: Opens the Croquet Settings asset in the Inspector.

### Setup Process

1. If the Bridge is missing settings, click "Auto Connect" to automatically link it to the Croquet Settings asset.
2. If you need to manually adjust settings, click "Goto Croquet Settings" to open the asset in the Inspector.
3. Verify that the Bridge is correctly connected to the settings.

### Additional Notes

- The Auto Connect feature will search for the CroquetBridge component in the scene and the CroquetSettings asset in the project.
- If either the CroquetBridge or CroquetSettings is missing, an error message will be displayed.
- After successful connection, the status will update automatically.

## Built Output

This step ensures that the built output folders match the Unity Build scene list.

### Messages

| Type | Content |
|------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | Built output folders match the building scene list! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Compare output JS folders to Unity Build scene list with [ Check Building Scenes ] button. |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Compare output JS folders to Unity Build scene list with [ Check Building Scenes ] button. |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | Built output folders match the building scene list! Well done! |

### Buttons

1. **Save Open Scene**: Saves the currently open scene.
2. **Goto Build Panel**: Opens the Unity Build Player Window.
3. **Check Building Scenes**: Compares output JS folders to the Unity Build scene list.

### Setup Process

1. If the current scene has unsaved changes, click "Save Open Scene".
2. Click "Check Building Scenes" to verify that all scenes have a CroquetBridge with the appName set and the corresponding app folder in StreamingAssets.
3. If issues are found, address them in each scene as needed.
4. Use "Goto Build Panel" to review and adjust your build settings if necessary.

### Additional Notes

- The status will show a warning if the scene is not dirty (has no unsaved changes) to remind you to check the building scenes.
- If all scenes have the correct setup, you'll see a success message.
- If some scenes are missing the CroquetBridge or have incorrect settings, an error message will be displayed.

## Has App JS

This step ensures that the app's JavaScript file (index.js) is properly set up for your Croquet application.

### Messages

| Type | Content |
|------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | Input JS: index.js for AppName is ready to go! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Input JS: index.js for AppName is missing |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Input JS: index.js for AppName is missing! |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | Input JS: index.js for AppName found! Well done! |

### Buttons

1. **Set App Name**: Guides you to set the app name in the CroquetBridge component.
2. **Make App JS File**: Creates the necessary JavaScript files for your app.
3. **Goto App JS File**: Opens the index.js file in your default editor.
4. **Goto App JS Folder**: Opens the folder containing the app's JavaScript files.

### Setup Process

1. If the app name is not set, click "Set App Name" and follow the instructions to set it in the CroquetBridge component.
2. If the index.js file is missing, click "Make App JS File" to create it along with other necessary files.
3. Use "Goto App JS File" or "Goto App JS Folder" to view and edit your app's JavaScript files.
4. The status will update automatically once the index.js file is detected.

### Additional Notes

- The app name must be set in the CroquetBridge component before creating the JavaScript files.
- The index.js file should be located in Assets/CroquetJS/\<appName\>/index.js.
- Creating the app JS file will copy a starter template to your project.
- After creating or modifying the JavaScript files, Unity will refresh the AssetDatabase automatically.

## JS Build Tools Version Match

This step ensures that the versions of JS Build Tools in the Unity Editor and in the built output match.

### Messages

| Message Type | Content |
|--------------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | Versions of <strong style="color:#E5DB1C; font-weight:700;">JS Build</strong> Tools and Built output match! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Versions of <strong style="color:#E5DB1C; font-weight:700;">JS Build</strong> Tools and Built output do not match |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Versions of <strong style="color:#E5DB1C; font-weight:700;">JS Build</strong> Tools and Built output do not match!<br><b>Make a new or first build!</b> |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | Versions of <strong style="color:#E5DB1C; font-weight:700;">JS Build</strong> Tools and Built output match!!! Well done! |

### Buttons

1. **Build JS Now**: Triggers a new JS build to update the tools and ensure version match.
2. **Docs**: Opens the documentation for this step.

### Setup Process

1. The system automatically checks if the JS Build Tools versions in the Unity Editor and the built output match.
2. If versions don't match, click "Build JS Now" to trigger a new build and update the tools.
3. After the build, the status will update automatically.
4. If you need more information, click the "Docs" button to access the documentation.

### Additional Notes

- The version check compares the ".last-installed-tools" files in the DotJsBuild and CroquetBridge directories.
- If versions don't match, an error log will show the differences between the Build and Editor versions.
- Ensuring version match is crucial for consistent behavior between the Unity Editor and the built application.
- Regular builds help maintain synchronization between the Editor and built output versions of the JS Build Tools.


## JS Build

This step ensures that the JavaScript build for your Croquet application is properly generated and managed.

### Messages

| Message Type | Content |
|--------------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | Output JS was built! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Output JS missing. |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Output JS not found. Need to Build JS. |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | Output JS was built! Well done! |

### Buttons

1. **Toggle JS Build Watcher**: Starts or stops the JS Build Watcher.
2. **Build JS Now**: Triggers an immediate JS build.
3. **Goto Built Output**: Opens the folder containing the built JS output.
4. **Docs**: Opens the documentation for this step.

### Setup Process

1. If the JS build output is missing, click "Build JS Now" to generate it.
2. Use "Toggle JS Build Watcher" to start automatic rebuilding when changes are detected.
3. After building, use "Goto Built Output" to view the generated files.
4. The status will update automatically after each build.

### Additional Notes

- The JS build output is located in the StreamingAssets folder of your Unity project.
- The JS Build Watcher automatically rebuilds when changes are detected in your JS files.
- If JS Build Tools are missing, the system will attempt to install them before building.
- After building, Unity's AssetDatabase is refreshed to reflect the changes.
- If the build fails or files are missing, appropriate error messages will be displayed.
- Regular builds help ensure your Croquet application's JavaScript is up-to-date with your Unity project.


## JS Build Tools

This step ensures that the necessary JavaScript build tools are installed and ready for your Croquet application.

### Messages

| Message Type | Content |
|--------------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | JS Build Tools are ready to go! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | JS Build Tools are missing |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | JS Build Tools are missing! Click <b>Copy JS Build Tools</b> to get them. |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | JS Build Tools installed!!! Well done! |

### Buttons

1. **Copy JS Build Tools**: Installs or updates the JS Build Tools.
2. **Goto JS Build Tools Folder**: Opens the folder containing the JS Build Tools.
3. **Docs**: Opens the documentation for this step.

### Setup Process

1. If JS Build Tools are missing, click "Copy JS Build Tools" to install them.
2. After installation, use "Goto JS Build Tools Folder" to view the installed tools.
3. The status will update automatically after the installation process.

### Additional Notes

- JS Build Tools are expected to be in the `Assets/CroquetJS/node_modules` folder of your Unity project.
- If the tools are missing, an error message will be logged with the expected location.
- Installing the JS Build Tools is a prerequisite for building your Croquet application's JavaScript.
- The "Build JS Now" button (from the JS Build step) will be shown only when the build tools are properly installed.
- Regular checks ensure that the build tools are always available for your project.

## JS Plugins

This step ensures that all necessary C#-to-JS Proxy Plugins are present for your Croquet application.

### Messages

| Message Type | Content |
|--------------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | All needed C#-to-<strong style="color:#FFFF44; font-weight:700;">JS</strong>-Proxy-Plugins found! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Missing some C#-to-<strong style="color:#FFFF44; font-weight:700;">JS</strong>-Proxy-Plugins! |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Missing some C#-to-<strong style="color:#FFFF44; font-weight:700;">JS</strong>-Proxy-Plugins! |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | All needed C#-to-<strong style="color:#FFFF44; font-weight:700;">JS</strong>-Proxy-Plugins found!  Well done! |

### Buttons

1. **Add JS Plugins**: Adds missing JS plugins to your project.
2. **Goto JS Plugins**: Opens the folder containing the JS plugins.
3. **Docs**: Opens the documentation for this step.

### Setup Process

1. The system automatically checks for missing C#-to-JS Proxy Plugins.
2. If plugins are missing, click "Add JS Plugins" to add them to your project.
3. Use "Goto JS Plugins" to view the plugins folder and verify the installation.
4. The status will update automatically after adding plugins.

### Additional Notes

- JS Plugins are located in the `Assets/CroquetJS/<AppName>/plugins` folder of your Unity project.
- The system analyzes all JS plugins and reports any missing ones.
- Adding plugins will refresh the Unity AssetDatabase to reflect the changes.
- After adding plugins, the system will recheck the status automatically.
- Regular checks ensure that all necessary plugins are available for your Croquet application.
- The documentation provides more detailed information about JS plugins and their usage.


## Node

This step ensures that Node.js is properly set up and configured for your Croquet application.

### Messages

| Message Type | Content |
|--------------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | <strong style="color:#417E37; font-weight:700;">Node</strong> is ready to go! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | <strong style="color:#417E37; font-weight:700;">Node</strong> is not running |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | <strong style="color:#417E37; font-weight:700;">Node</strong> needs your help getting set up. |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | <strong style="color:#417E37; font-weight:700;">Node</strong> path configured!!! Well done! |

### Buttons

1. **Goto Node Path**: Opens the Croquet Settings to view or edit the Node path.
2. **Try Auto**: Attempts to automatically set up Node.
3. **Docs**: Opens the documentation for this step.

### Dropdown

- **Node Path**: Allows selection of the Node path from detected installations.

### Setup Process

1. The system checks for a valid Node installation using the path in Croquet Settings.
2. If Node is not found or configured, click "Try Auto" for automatic setup.
3. If automatic setup fails, use the Node Path dropdown to select a valid installation.
4. Use "Goto Node Path" to manually edit the Node path in Croquet Settings if needed.
5. The status updates automatically after each action or selection.

### Additional Notes

- The system searches for Node installations in common locations based on the operating system.
- On macOS, it checks locations like `/usr/local/bin`, `/opt/homebrew/bin`, and NVM installations.
- On Windows, it looks for Node in the default installation directory.
- If Node is not found, you'll be prompted to download it from the official website.
- The Node version is verified to ensure compatibility with the Croquet application.
- Regular checks ensure that the Node configuration remains valid throughout your project development.


## Ready Total

This step provides an overall status of your Croquet application setup and readiness.

### Messages

| Message Type | Content |
|--------------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | You are <strong style="color:#77ff77; font-weight:700;">Ready to <span style="color:#006AFF;">Synq</span></strong>      All green lights below. |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Warn 00000 |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Look below to fix what's not ready... |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | W00t!!! You are ready to <strong style="color:#006AFF; font-weight:700;">Synq</strong>! |

### Buttons

1. **Be Awesome**: Opens a fun GIF search when everything is ready.
2. **Docs**: Opens the documentation for this step.

### Setup Process

1. The system automatically checks the status of all previous steps.
2. If all steps are complete and successful, the "Ready to Synq" message will appear.
3. If any steps are incomplete or have issues, an error message will prompt you to address them.
4. Once everything is ready, the "Be Awesome" button will appear for a celebratory moment.

### Additional Notes

- The "Ready Total" status is a culmination of all previous configuration steps.
- The success message ("W00t!!!") is displayed briefly before switching to the "Ready to Synq" message.
- If not all steps are ready, the system will guide you to look at the individual steps below for more details.
- The "Be Awesome" button is a fun addition to celebrate your successful setup.
- Regular checks ensure that your Croquet application remains properly configured throughout development.


## Settings

This step ensures that the Croquet Settings asset is properly created and configured for your application.

### Messages

| Message Type | Content |
|--------------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | Settings are ready to go! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Settings are set to defaults! Look for other red items below to fix this. |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Settings asset is missing! Click <b>Create Settings</b> to make some. |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | Settings are configured!!! Well done! |

### Buttons

1. **Goto Settings**: Opens the Croquet Settings asset in the Inspector.
2. **Create Settings**: Creates a new Croquet Settings asset if one doesn't exist.
3. **Goto Node Path**: (Functionality not specified in the provided code)
4. **Goto API Key**: (Functionality not specified in the provided code)
5. **Docs**: Opens the documentation for this step.

### Setup Process

1. The system checks for the existence of a Croquet Settings asset.
2. If the asset is missing, click "Create Settings" to generate a new one.
3. Once created, use "Goto Settings" to view and edit the settings in the Inspector.
4. The status updates automatically after creating or modifying the settings.

### Additional Notes

- The Croquet Settings asset is crucial for configuring your application's behavior.
- If settings are missing, the "Create Settings" button will be shown.
- After creating settings, additional buttons like "Goto Node Path" and "Goto API Key" may appear for further configuration.
- The system will automatically select and highlight the settings asset in the Unity Project window after creation or when using "Goto Settings".
- Regular checks ensure that your settings remain properly configured throughout development.
- If settings are set to defaults, you may need to configure other aspects of your project, indicated by red items in other sections.


## Croquet Systems

This step ensures that all necessary Croquet Systems components are present in your Unity scene.

### Messages

| Message Type | Content |
|--------------|---------|
| <strong style="color:#2196F3; font-weight:700;">INFO</strong> | Croquet Systems are ready to go! |
| <strong style="color:#FFA500; font-weight:700;">WARNING</strong> | Croquet Systems are missing |
| <strong style="color:#FF5252; font-weight:700;">ERROR</strong> | Croquet Systems are missing! Click <b>Add Croquet Systems</b> to get them. |
| <strong style="color:#4CAF50; font-weight:700;">SUCCESS</strong> | Croquet Systems installed!!! Well done! |

### Buttons

1. **Add Croquet Systems**: Adds missing Croquet System components to the CroquetBridge GameObject.
2. **List Missing Systems**: Displays a list of missing Croquet System components.
3. **Docs**: Opens the documentation for this step.

### Setup Process

1. The system automatically checks for the presence of required Croquet System components.
2. If any systems are missing, click "Add Croquet Systems" to add them to the CroquetBridge GameObject.
3. Use "List Missing Systems" to view which components are absent from your scene.
4. The status updates automatically after adding or checking for systems.

### Additional Notes

- Critical Croquet Systems include:
  - CroquetRunner
  - CroquetFileReader
  - CroquetEntitySystem
  - CroquetSpatialSystem
- Optional Croquet Systems include:
  - CroquetMaterialSystem
- Missing critical systems will trigger an error status, while missing optional systems will show a warning.
- All Croquet Systems should be attached to the CroquetBridge GameObject in your scene.
- The system differentiates between critical and optional missing components in its reports.
- Regular checks ensure that all necessary Croquet Systems remain properly configured throughout development.
