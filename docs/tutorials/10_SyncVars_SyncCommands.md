# Tutorial 10 - SyncVars & SyncCommands


![](images/image24.png)

## Table of Contents
- [Tutorial 10 - SyncVars \& SyncCommands](#tutorial-10---syncvars--synccommands)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Full code example](#full-code-example)
  - [Key Components](#key-components)
  - [SyncVar Attribute](#syncvar-attribute)
    - [Syntax](#syntax)
    - [Options](#options)
  - [SyncVarMgr Class](#syncvarmgr-class)
  - [Usage Guide](#usage-guide)
  - [Advanced Features](#advanced-features)
    - [Custom Serialization](#custom-serialization)
    - [Performance Optimization](#performance-optimization)
  - [Best Practices](#best-practices)
  - [Troubleshooting](#troubleshooting)

## Introduction

The SyncVar system is a powerful tool for automatically synchronizing variables across a network in Croquet for Unity. It simplifies the process of keeping game state consistent across multiple clients by allowing developers to mark specific variables for synchronization using a simple attribute.

## Full code example

```cs
  using UnityEngine;

  public class PlayerHealth : SyncedBehaviour {

    [SyncVar(CustomName = "hp", OnChangedCallback = nameof(OnHealthChanged) )] 
    public int health = 100;

    [SyncVar] public int legHealth = 100;
    [SyncVar] public int torsoHealth = 100;
    [SyncVar(updateInterval=0.5f)] public int headHealth = 100;

    private void OnHealthChanged(int newValue) {
      Debug.Log($"[SyncVar] Player health changed to {newValue}");
      if      (newValue <= 0) Die();
      else if (newValue < 70) LowHealthWarning();
    }

    void CalcHealth() { health = (legHealth + torsoHealth + headHealth) / 3; }
    void Die() {              Debug.Log($"<color=red>Player died</color> health:{health}"); }
    void LowHealthWarning() { Debug.Log($"<color=yellow>Player health is low</color> health:{health}"); }

    void Update() {
      // Each key "damages" a body part, L, T, H, or heal all parts with R!
      if (Input.GetKeyDown(KeyCode.L)) legHealth   -= 3;
      if (Input.GetKeyDown(KeyCode.T)) torsoHealth -= 3;
      if (Input.GetKeyDown(KeyCode.H)) headHealth  -= 3; 
      if (Input.GetKeyDown(KeyCode.R)) { // Reset (Heal)
        health = 100;
        legHealth = 100;
        torsoHealth = 100;
        headHealth = 100;
      }
      CalcHealth();
    }

    //-- ||||| ----------------------------------------
    void OnGUI() { // Old school Unity UI! Yuck. But self-contained!   =]
      var scaleFactor = Screen.height / 400f; // bottom edge y
      // var y = Screen.height - (100 * scaleFactor);
      var y = 10 * scaleFactor;
      GUI.backgroundColor = new Color(0f, 0f, 0f, 0.5f);
      GUI.Box(new Rect(0, y, 150 * scaleFactor, 100 * scaleFactor), ""); // panel background
      GUI.contentColor = Color.white;

      GUIStyle style = new GUIStyle();
      style.alignment = TextAnchor.MiddleCenter;
      style.fontSize = (int)(20 * scaleFactor);
      style.normal.textColor = new Color(0.5f, 1f, 0.5f, 1f); // lime green
      GUI.Label(new Rect(20 * scaleFactor, y + (10 * scaleFactor), 100 * scaleFactor, 20 * scaleFactor), $" Health: {health.ToString("F1")}",      style);
      GUI.Label(new Rect(20 * scaleFactor, y + (30 * scaleFactor), 100 * scaleFactor, 20 * scaleFactor), $" Leg:    {legHealth.ToString("F1")}",   style);
      GUI.Label(new Rect(20 * scaleFactor, y + (50 * scaleFactor), 100 * scaleFactor, 20 * scaleFactor), $" Torso:  {torsoHealth.ToString("F1")}", style);
      GUI.Label(new Rect(20 * scaleFactor, y + (70 * scaleFactor), 100 * scaleFactor, 20 * scaleFactor), $" Head:   {headHealth.ToString("F1")}",  style);
    }
  }
```

## Key Components

The SyncVar system consists of several key components:

1. **SyncVarAttribute**: An attribute used to mark fields or properties for synchronization.
2. **SyncVarMgr**: A manager class that handles the detection, registration, and synchronization of SyncVar-marked variables.
3. **SyncVarInfo**: A class (and its subclasses SyncFieldInfo and SyncPropInfo) that stores information about synchronized variables.
4. **JavaScript Integration**: A JS plugin that facilitates communication with the Croquet model.

## SyncVar Attribute

The `[SyncVar]` attribute is used to mark fields or properties that should be synchronized across the network. It can be applied to both public and private members of classes that inherit from `SyncedBehaviour`.

### Syntax

```csharp
[SyncVar]
public int health = 100;

[SyncVar(CustomName = "pos", OnChangedCallback = "OnPositionChanged", updateInterval = 0.5f)]
private Vector3 position;
```

### Options

- `CustomName`: A custom name for the variable (useful for shortening network messages).
- `updateInterval`: Minimum time between syncs in seconds (default is 0.1f).
- `updateEveryInterval`: If true, forces update every interval even if the value hasn't changed.
- `OnChangedCallback`: Name of a method to call when the value changes.

## SyncVarMgr Class

The `SyncVarMgr` class is responsible for managing the synchronization of all SyncVar-marked variables. It handles:

- Detection and registration of SyncVars
- Sending and receiving synchronization messages
- Applying received updates to local variables
- Invoking change callbacks when values are updated

## Usage Guide

1. Ensure your class inherits from `SyncedBehaviour` instead of `MonoBehaviour`.
2. Mark the variables you want to synchronize with the `[SyncVar]` attribute.
3. Optionally, implement callback methods for when synchronized values change.

Example:

```csharp
public class Player : SyncedBehaviour
{
    [SyncVar(OnChangedCallback = nameof(OnHealthChanged))]
    public int health = 100;

    [SyncVar(CustomName = "pos")]
    public Vector3 position;

    private void OnHealthChanged(int newHealth)
    {
        Debug.Log($"Player health changed to {newHealth}");
    }
}
```

## Advanced Features

### Custom Serialization

For complex types, you may need to implement custom serialization. Extend the `SerializationExtensions` class to add support for your custom types:

```csharp
public static class SerializationExtensions
{
    public static string Serialize(this Vector3 vector)
    {
        return $"{vector.x},{vector.y},{vector.z}";
    }

    public static Vector3 DeserializeVector3(this string serialized)
    {
        var parts = serialized.Split(',');
        return new Vector3(
            float.Parse(parts[0]),
            float.Parse(parts[1]),
            float.Parse(parts[2])
        );
    }
}
```

### Performance Optimization

Use the `updateInterval` option to control how often a variable is synchronized. For less critical variables, you can increase this value to reduce network traffic.

## Best Practices

1. Only synchronize essential game state variables.
2. Use appropriate update intervals based on the variable's importance and how quickly it changes.
3. Implement change callbacks for variables that require immediate action when changed.
4. Be cautious when synchronizing large data structures or complex objects.

## Troubleshooting

- **Variables not synchronizing**: Ensure the class inherits from `SyncedBehaviour` and the `[SyncVar]` attribute is correctly applied.
- **Performance issues**: Check if you're synchronizing too many variables or using too small update intervals.
- **Inconsistent state**: Verify that all clients are running the same version of the game and that no desynchronization is occurring due to frame rate differences or network latency.

For more complex issues, enable debugging by setting `dbg = true` in the `SyncVarMgr` class and check the Unity console for detailed logs.