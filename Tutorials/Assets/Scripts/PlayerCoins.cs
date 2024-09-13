using UnityEngine;

public class PlayerCoins : SyncedBehaviour {

  [SyncVar] 
  public int coins = 0;

  void OnGUI() {
    // bottom edge y
    var scaleFactor = Screen.height / 400f;
    // var y = Screen.height - (100 * scaleFactor);
    var y = 200;
    GUI.backgroundColor = new Color(0f, 0f, 0f, 0.5f);
    GUI.Box(new Rect(0, y, 170 * scaleFactor, 100 * scaleFactor), ""); // panel background
    GUI.contentColor = Color.white;

    GUIStyle style = new GUIStyle();
    style.alignment = TextAnchor.MiddleCenter;
    style.fontSize = (int)(20 * scaleFactor);
    style.normal.textColor = new Color(1f, 1f, 0.5f, 1f); // lime green
    GUI.Label(new Rect(30 * scaleFactor, y + (10 * scaleFactor), 100 * scaleFactor, 20 * scaleFactor), $" Coins: {coins.ToString("F1")}", style);
  }
  void Update() {
    // each key loses healt on a body part, l,t,h
    if (Input.GetKeyDown(KeyCode.C)) {
      coins += 1;
    }
  }
}

