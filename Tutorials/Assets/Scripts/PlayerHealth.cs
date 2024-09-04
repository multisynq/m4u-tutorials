using UnityEngine;

public class PlayerHealth : MonoBehaviour {

  [SyncVar(CustomName = "hp"   )] public int health = 100;
  [SyncVar(MinSyncInterval=0.5f)] public int legHealth = 100;
  [SyncVar] public int torsoHealth = 100;
  [SyncVar] public int headHealth = 100;

  private void OnHealthChanged(int newValue) {
    int newHealth = newValue;
    Debug.Log($"[SyncVar] Player health changed to {newValue}");
    if (newHealth <= 0) {
      Die();
    }
    else if (newHealth < 20) {
      ShowLowHealthWarning();
    }
  }

  private void Die() { /* ... */ }
  private void ShowLowHealthWarning() { /* ... */ }

  void OnGUI() {
    GUI.backgroundColor = new Color(0f, 0f, 0f, 0.2f);
    GUI.Box(new Rect(0, 0, 120, 100), ""); // panel background
    GUI.contentColor = Color.white;
    GUI.Label(new Rect(10, 10, 100, 20), $"Health: {health.ToString("F1")}");
    GUI.Label(new Rect(10, 30, 100, 20), $"Leg:    {legHealth.ToString("F1")}");
    GUI.Label(new Rect(10, 50, 100, 20), $"Torso:  {torsoHealth.ToString("F1")}");
    GUI.Label(new Rect(10, 70, 100, 20), $"Head:   {headHealth.ToString("F1")}");
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

