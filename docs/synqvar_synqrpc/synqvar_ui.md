# [SynqVarUI]
## Usage and Examples

The SynqVarUI system extends the SynqVar functionality by providing automatic UI generation and synchronization for variables in Multisynq for Unity. It simplifies the process of creating and maintaining UI elements that display synchronized game state across multiple clients.

![UI Example](images/image24.png)

## Introduction

SynqVarUI automatically creates and updates UI elements for your synchronized variables, supporting both basic text display and image-based representations. It works seamlessly with Unity's UI system and TextMeshPro, making it easy to create dynamic, networked user interfaces.

## Full Code Example

```cs
  using UnityEngine;
  using Multisynq;

  public class PlayerInventory : SynqBehaviour {
    public static partial class _ {
      public const string inv = "/VarInventory_Canvas/Panel/Inventory_Lay/InvItem";
      public const string fmt = "<b>{{key}}</b>\n<color=#4ff>{{value}}</color>";
    }

    [SynqVarUI(order=5,  clonePath=_.inv, formatStr=_.fmt)] public int wood = 0;
    [SynqVarUI(order=10, clonePath=_.inv, formatStr=_.fmt)] public int gold = 0;
    [SynqVarUI(order=20, clonePath=_.inv, formatStr=_.fmt)] public int sand = 42;

    void Update() {
      if (Input.GetKeyDown(KeyCode.W)) wood += 1;
      if (Input.GetKeyDown(KeyCode.G)) gold += 1;
      if (Input.GetKeyDown(KeyCode.S)) sand += 1;
    }
  }
```

## Key Components

The SynqVarUI system consists of several key components:

1. **SynqVarUIAttribute**: An attribute that extends SynqVar to include UI-specific properties
2. **SynqVarUI_Mgr**: A manager class that handles UI element creation and updates
3. **UI Templates**: Prefab-based UI elements that are cloned and customized for each variable

## SynqVarUI Attribute

The `[SynqVarUI]` attribute extends `[SynqVar]` with additional UI-specific options.

### Syntax

```cs
  [SynqVarUI(
    labelTxt = "Gold",
    formatStr = "<b>{{key}}</b>: {{value}}",
    clonePath = "/UI/Template",
    imgCompPath = "Icon",
    order = 1
  )]
  public int goldCount = 0;
```

### Options

- `labelTxt`: Custom display name for the variable
- `formatStr`: String format template using `{{key}}` and `{{value}}` placeholders
- `clonePath`: Path to the UI template GameObject to clone
- `uGuiTxtName`: Name of the text component GameObject under the clone
- `order`: Display order in the UI (lower numbers appear first)
- `imgCompPath`: Path to Image component under the cloned UI
- `imgRsrcPath`: Path in Resources folder for dynamic sprite loading
- `imgName`: Name of image to load from Resources folder
- `defaultImg`: Default sprite to show
- `valueTxtFunc`: Custom function for formatting the value text

## UI Template Setup

### Example Template Structure

```
UIRoot/
  └─ Template/
     ├─ Text (TMP_Text component)
     └─ Icon_Box/
        └─ Icon_Img (Image component)
```

### Example Template Reference

```cs
  public static partial class _ {
    public const string cp = "/VarImage_Canvas/Panel/Items/InvItem";
    public const string icp = "Icon_Box/Icon_Img";
    public const string fs = "<color=#4ff>{{value}}</color>";
  }

  [SynqVarUI(
    imgRsrcPath = "Icons",
    clonePath = _.cp,
    imgCompPath = _.icp,
    formatStr = _.fs
  )]
  public int coins = 0;
```

## Advanced Features

### Custom Text Formatting

You can use the `formatStr` property to create custom text layouts:

```cs
  public static partial class _ {
    public const string fmt = "<b>{{key}}</b>\n<color=#4ff>{{value}}</color>";
  }

  [SynqVarUI(formatStr = _.fmt, labelTxt = "G<color=yellow>L</color>ass")] 
  public int glass = 64;
```

### Dynamic Image Loading

Set up dynamic image loading from the Resources folder:

```cs
  [SynqVarUI(
    imgRsrcPath = "Icons",
    imgName = "coins",
    imgCompPath = "Icon_Box/Icon_Img"
  )]
  public int teamCoins = 0;
```

### Ordering UI Elements

Use the `order` property to control the layout of UI elements:

```cs
  [SynqVarUI(order = 5)]  public int firstItem  = 0;
  [SynqVarUI(order = 10)] public int secondItem = 0;
  [SynqVarUI(order = 20)] public int thirdItem  = 0;
```

## Best Practices

1. **Template Organization**
   - Keep UI templates in a dedicated folder
   - Use consistent naming conventions for template paths
   - Create constants for commonly used paths and formats

2. **Performance**
   - Minimize the number of UI updates by using appropriate update intervals
   - Use efficient formatting strings
   - Cache frequently used components

3. **Design**
   - Use clear and consistent formatting across similar UI elements
   - Implement proper scaling for different screen sizes
   - Consider UI element placement and ordering

## Troubleshooting

### Common Issues

1. **UI Elements Not Appearing**
   - Verify the `clonePath` is correct
   - Ensure the template GameObject exists in the scene
   - Check that the template has the required components

2. **Images Not Loading**
   - Confirm sprites are in the correct Resources folder
   - Verify `imgRsrcPath` and `imgName` are set correctly
   - Check that the Image component path is valid

3. **Text Not Updating**
   - Ensure TMP_Text component is present
   - Verify `formatStr` syntax
   - Check that the text component is properly referenced

## Integration with SynqRPC

SynqVarUI works seamlessly with SynqRPC for triggering UI updates:

```cs
  [SynqVarUI(formatStr = _.fs)] 
  public int coins = 0;

  [SynqRPC]
  void ShowPlusOneForHalfSec() {
    timer = 0.5f;
  }

  void Update() {
    if (Input.GetKeyDown(KeyCode.C)) {
      coins += 1;
      RPC(ShowPlusOneForHalfSec, RpcTarget.All);
    }
  }
```

This allows for coordinated UI updates across all clients when values change.