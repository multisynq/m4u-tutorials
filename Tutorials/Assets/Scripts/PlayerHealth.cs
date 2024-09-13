using UnityEngine;

public class PlayerHealth : SyncedBehaviour {

  [SyncVar(CustomName = "hp", OnChangedCallback = nameof(OnHealthChanged) )] 
  public int health = 100;

  [SyncVar(updateInterval=0.5f)] public int legHealth = 100;
  [SyncVar] public int torsoHealth = 100;
  [SyncVar] public int headHealth = 100;

  private void OnHealthChanged(int newValue) {
    int newHealth = newValue;
    Debug.Log($"[SyncVar] Player health changed to {newValue}");
    if        (newHealth <= 0) {
      Die();
    } else if (newHealth < 70) {
      ShowLowHealthWarning();
    }
  }

  private void Die() { 
    Debug.Log($"<color=red>Player died</color> health:{health}");
  }
  private void ShowLowHealthWarning() {
    Debug.Log($"<color=yellow>Player health is low</color> health:{health}");
  }

  void OnGUI() {
    // bottom edge y
    var scaleFactor = Screen.height / 400f;
    // var y = Screen.height - (100 * scaleFactor);
    var y = 10;
    GUI.backgroundColor = new Color(0f, 0f, 0f, 0.5f);
    GUI.Box(new Rect(0, y, 170 * scaleFactor, 100 * scaleFactor), ""); // panel background
    GUI.contentColor = Color.white;

    GUIStyle style = new GUIStyle();
    style.alignment = TextAnchor.MiddleCenter;
    style.fontSize = (int)(20 * scaleFactor);
    style.normal.textColor = new Color(0.5f, 1f, 0.5f, 1f); // lime green
    GUI.Label(new Rect(30 * scaleFactor, y + (10 * scaleFactor), 100 * scaleFactor, 20 * scaleFactor), $" Health: {health.ToString("F1")}", style);
    GUI.Label(new Rect(30 * scaleFactor, y + (30 * scaleFactor), 100 * scaleFactor, 20 * scaleFactor), $" Leg:    {legHealth.ToString("F1")}", style);
    GUI.Label(new Rect(30 * scaleFactor, y + (50 * scaleFactor), 100 * scaleFactor, 20 * scaleFactor), $" Torso:  {torsoHealth.ToString("F1")}", style);
    GUI.Label(new Rect(30 * scaleFactor, y + (70 * scaleFactor), 100 * scaleFactor, 20 * scaleFactor), $" Head:   {headHealth.ToString("F1")}", style);
  }
  void CalcHealth() {
    health = (legHealth + torsoHealth + headHealth) / 3;
  }
  void Update() {
    // each key loses healt on a body part, l,t,h
    if (Input.GetKeyDown(KeyCode.L)) {
      legHealth -= 3;
    }
    if (Input.GetKeyDown(KeyCode.T)) {
      torsoHealth -= 3;
    }
    if (Input.GetKeyDown(KeyCode.H)) {
      headHealth -= 3;
    }
    if (Input.GetKeyDown(KeyCode.R)) {
      health = 100;
      legHealth = 100;
      torsoHealth = 100;
      headHealth = 100;
    }
    CalcHealth();
  }
}

