using UnityEngine;

public class DamageFlash : SyncedBehaviour {
  private float timer = 0;
  private bool showDamagePanel = false;
  private string damageMessage = "";
  SyncCommandMgr syncCommandMgr;

  [SyncCommand]
  public void TakeDamage(string bodyPart) {
    showDamagePanel = true;
    timer = Time.time;
    damageMessage = $"Damage: {bodyPart}";
    Debug.Log($"[SyncCommand] DamageFlash.TakeDamage( {bodyPart} ) ");
  }
  
  void Start() {
    syncCommandMgr = FindObjectOfType<SyncCommandMgr>();
  }

  void OnGUI() {
    if (showDamagePanel) {
      GUI.color = new Color(1, 0, 0, 0.5f); // Semi-transparent red
      GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Texture2D.whiteTexture);

      GUIStyle style = new GUIStyle();
      style.alignment = TextAnchor.MiddleCenter;
      style.fontSize = 40;
      // bright red
      style.normal.textColor = new Color(1, 0.8f, 0.6f, 1);
      GUI.color = style.normal.textColor;

      GUI.Label(new Rect(0, 0, Screen.width, Screen.height), damageMessage, style);
    }
  }

  void Update() {
    if (showDamagePanel && Time.time - timer > 0.8f) {
      showDamagePanel = false;
    }

    // Check for key presses and call TakeDamage via SyncCommandMgr
    if (syncCommandMgr != null) {
      if (Input.GetKeyDown(KeyCode.T)) {
        Debug.Log("<color=red>Torso</color> T key pressed");
        TakeDamage("Torso");
        // syncCommandMgr.ExecuteCommand($"{netId}_TakeDamage", "Torso");
      }
      else if (Input.GetKeyDown(KeyCode.H)) {
        Debug.Log("<color=red>Head</color> H key pressed");
        TakeDamage("Head");
        // syncCommandMgr.ExecuteCommand($"{netId}_TakeDamage", "Head");
      }
      else if (Input.GetKeyDown(KeyCode.L)) {
        Debug.Log("<color=red>Legs</color> L key pressed");
        TakeDamage("Legs");
        // syncCommandMgr.ExecuteCommand($"{netId}_TakeDamage", "Legs");
      }
    }
    else {
      Debug.LogError("SyncCommandMgr not found in the scene!");
    }
  }
}