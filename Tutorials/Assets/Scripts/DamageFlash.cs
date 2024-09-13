using System;
using UnityEngine;

public class DamageFlash : SyncedBehaviour {
  private float timer = 0;
  private bool showDamagePanel = false;
  private string damageMessage = "";
  
  void Start() {
  }


  void Update() {

    if (showDamagePanel && Time.time - timer > 0.8f) {
      showDamagePanel = false;      // after   0.8 seconds, hide the damage panel
    }

    // Check for key presses and call TakeDamage() three identical ways: Variant A, B, C
    // These variants make porting from legacy networking easier.
    if (Input.GetKeyDown(KeyCode.T)) {
      Debug.Log("Torso damage");
      RPC("TakeDamage", RpcTarget.All, "Torso"); // calls on all Views (Variant A)
    }
    else if (Input.GetKeyDown(KeyCode.H)) {
      Debug.Log("Head damage");
      RPC(TakeDamage, RpcTarget.All, "Head");    // calls on all Views (Variant B)
    }
    else if (Input.GetKeyDown(KeyCode.L)) {
      Debug.Log("Legs damage");
      CallSyncCommand(TakeDamage, "Legs");       // calls on all Views (Variant C)
    }
    else if (Input.GetKeyDown(KeyCode.R)) {
      Debug.Log("Heal!");
      CallSyncCommand(Heal);       // calls on all Views (Variant C)
    }
  }
  // Methods must be marked with [SyncCommand] or [SyncRPC] to be called from RPC() or CallSyncCommand()
  // These two Attributes variants are identical in functionality to make porting from legacy networking easier.
  [SyncRPC] // identical to [SyncCommand] (Variant A)
  public void TakeDamage(string bodyPart) {
    showDamagePanel = true;
    timer = Time.time;
    damageMessage = $"Damage: {bodyPart}";
    Debug.Log($"[SyncCommand] DamageFlash.TakeDamage( {bodyPart} ) ");
  }

  [SyncCommand] // identical to [SyncRPC] (Variant B)
  public void Heal() {
    showDamagePanel = true;
    timer = Time.time;
    damageMessage = $"Heal all";
    Debug.Log($"[SyncCommand] DamageFlash.Heal() ");
  }

  void OnGUI() { // Old school Unity UI! Yuck. But self-contained!
    if (showDamagePanel) {
      // A fullscreen transparent red or green panel with text
      int scale = (int)(Screen.width / 800.0f);
      int left = Screen.width / 2 * scale;
      var isHeal = damageMessage.Contains("Heal");
      GUI.color = (isHeal) ?  new Color(0, 1, 0, 0.8f) : new Color(1, 0, 0, 0.8f); // Semi-transparent green or red
      GUI.DrawTexture(new Rect(left, 0, Screen.width/2, Screen.height), Texture2D.whiteTexture); // Fullscreen panel
      GUIStyle style = new() { alignment = TextAnchor.MiddleCenter, fontSize = 45 * scale };
      style.normal.textColor = (isHeal) ? Color.white : Color.white; // Green or red text
      GUI.color = style.normal.textColor;
      GUI.Label(new Rect(left, 0, Screen.width/2, Screen.height), damageMessage, style); // Text: "Heal" or Damage: ______
    }
  }

}