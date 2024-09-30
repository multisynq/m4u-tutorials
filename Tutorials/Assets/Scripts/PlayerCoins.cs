using UnityEngine;
using Multisynq;

//========== ||||||||||| ====================
public class PlayerCoins : SynqBehaviour {

  [SynqVar]
  public int coins = 0;

  void Update() {
    if (Input.GetKeyDown(KeyCode.C)) coins += 1;
  }
  //-- ||||| ----------------------------------------
  void OnGUI() { // Old school Unity UI! Yuck. But self-contained!   =]
    var scl   = Screen.height / 400f;
    int xOffset = 20;
    var y     = 185 * scl;
    var paneW = 150 * scl;
    var paneH = 40 * scl;
    var paneX = Screen.width - ((xOffset+10) * scl) - paneW;
    var txtW  = 100 * scl;
    var txtX  = Screen.width - ((xOffset+50) * scl) - txtW;
    var lineH = 20 * scl;

    GUI.backgroundColor = new Color(0f, 0f, 0f, 0.5f); // Black panel
    GUI.Box(new Rect(paneX, y, paneW, paneH), ""); // panel background
    GUI.contentColor = Color.white;

    GUIStyle style = new GUIStyle();
    style.alignment = TextAnchor.MiddleLeft;
    style.fontSize = (int)(20 * scl);
    style.normal.textColor = new Color(1f, 1f, 0.5f, 1f); // Yellow
    GUI.Label(new Rect(txtX, y + (10 * scl), txtW, lineH), $" Coins:     {coins}", style);
  }
}
