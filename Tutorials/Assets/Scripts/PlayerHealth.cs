using UnityEngine;
using Multisynq;

public class PlayerHealth : SynqBehaviour {

  [SynqVar(CustomName = "hp", OnChangedCallback = nameof(OnHealthChanged) )] 
  public int health = 100;

  [SynqVar] public int legHealth = 100;
  [SynqVar] public int torsoHealth = 100;
  [SynqVar(updateInterval=0.5f)] public int armHealth = 100;

  private void OnHealthChanged(int newValue) {
    Debug.Log($"<color=#ffaa00>[<color=#5577ff>Synq</color>Var]</color> Player health changed to <color=cyan>{newValue}</color>");
    if      (newValue <= 0) Die();
    else if (newValue < 70) LowHealthWarning();
  }

  void CalcHealth() { health = (legHealth + torsoHealth + armHealth) / 3; }
  void Die() {              Debug.Log($"<color=red>Player died</color> health: <color=cyan>{health}</color>"); }
  void LowHealthWarning() { Debug.Log($"<color=yellow>Player health is low</color> health: <color=cyan>{health}</color>"); }

  void Update() {
    // Each key "damages" a body part, L, T, A, or heal all parts with H!
    KeyDo(KeyCode.L, ref legHealth,   -3);
    KeyDo(KeyCode.T, ref torsoHealth, -3);
    KeyDo(KeyCode.A, ref armHealth,   -3);
    if (Input.GetKeyDown(KeyCode.H)) { // Heal all parts
      health = 100;
      legHealth = 100;
      torsoHealth = 100;
      armHealth = 100;
      CalcHealth();
    }
  }

  void KeyDo(KeyCode key, ref int var, int mod) {
    if (Input.GetKeyDown(key)) {
      var += mod;
      CalcHealth();
    }
  }

}

