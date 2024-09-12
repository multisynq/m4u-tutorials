using System;
using UnityEngine;

public class DamageFlash : SyncedBehaviour {
  private float timer = 0;
  private bool showDamagePanel = false;
  private string damageMessage = "";
  
  void Start() {
  }

  void OnGUI() {
    if (showDamagePanel) {
      int scale = (int)(Screen.width / 800.0f);
      GUI.color = new Color(1, 0, 0, 0.5f); // Semi-transparent red
      GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Texture2D.whiteTexture);

      GUIStyle style = new GUIStyle();
      style.alignment = TextAnchor.MiddleCenter;
      style.fontSize = 40 * scale;
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
      if (Input.GetKeyDown(KeyCode.T)) {
        Debug.Log("<color=red>Torso</color> T key pressed");
        // TakeDamage("Torso"); // local call only
        CallSyncCommand(TakeDamage, "Torso"); // calls on all Views
      }
      else if (Input.GetKeyDown(KeyCode.H)) {
        Debug.Log("<color=red>Head</color> H key pressed");
        // TakeDamage("Head"); // local call only
        // CallSyncCommand(TakeDamage, "Head");
        RPC("TakeDamage", RpcTarget.All, "Legs"); // calls on all Views
      }
      else if (Input.GetKeyDown(KeyCode.L)) {
        Debug.Log("<color=red>Legs</color> L key pressed");
        // TakeDamage("Legs");
        // CallSyncCommand(TakeDamage, "Legs");
        RPC(TakeDamage, RpcTarget.All, "Legs");
      }
  }

  [SyncRPC]
  public void TakeDamage(string bodyPart) {
    showDamagePanel = true;
    timer = Time.time;
    damageMessage = $"Damage: {bodyPart}";
    Debug.Log($"[SyncCommand] DamageFlash.TakeDamage( {bodyPart} ) ");
  }
}