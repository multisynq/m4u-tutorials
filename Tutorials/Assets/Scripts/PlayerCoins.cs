using UnityEngine;
using Multisynq;

//========== ||||||||||| ====================
public class PlayerCoins : SynqBehaviour {

    [SynqVar]
    public int coins = 0;

    float timer = 0f;

    void Update() {
        if (Input.GetKeyDown(KeyCode.C)) {
            coins += 1;
            RPC( ShowPlusOneForHalfSec, RpcTarget.All ); // Remote Procedure Call (RPC)
        }
        if (timer > 0) { timer -= Time.deltaTime; } // if timer > 0, show yellow "+1" in OnGUI
    }

    [SynqRPC]
    void ShowPlusOneForHalfSec() {
      Debug.Log("<color=#ffdd55><b>[[ +1 ]]</b></color> <===== Remote Procedure Call (RPC)");
        timer = 0.5f;
    }

    void OnGUI() {
        float scale = Screen.height / 400f;
        Vector2 center = new Vector2(Screen.width / 2, Screen.height / 2);

        GUIStyle style = new GUIStyle(GUI.skin.label) {
            alignment = TextAnchor.MiddleCenter,
            fontSize = (int)(20 * scale),
            normal = { textColor = Color.yellow }
        };

        // Coin display
        GUI.backgroundColor = new Color(0, 0, 0, 0.5f);
        GUI.Box(new Rect(center.x - 75 * scale, center.y - 50 * scale, 150 * scale, 40 * scale), "");
        GUI.Label(new Rect(center.x - 75 * scale, center.y - 50 * scale, 150 * scale, 40 * scale), $"Coins: {coins}", style);

        // "+1" display when timer is active
        if (timer > 0f) {
            Rect plusOneRect = new Rect(center.x - 30 * scale, center.y + 0 * scale, 60 * scale, 30 * scale);
            
            // Draw yellow background
            GUI.color = Color.yellow;
            GUI.DrawTexture(plusOneRect, Texture2D.whiteTexture);
            
            // Draw "+1" text
            style.normal.textColor = Color.black;
            GUI.Label(plusOneRect, "+1", style);
        } else {
          // spacing to match
          GUI.Label(new Rect(center.x - 30 * scale, center.y + 0 * scale, 60 * scale, 30 * scale), "");
        }
        // button for +1
        if (GUI.Button(new Rect(center.x - 30 * scale, center.y + 30 * scale, 60 * scale, 30 * scale), "+1")) {
            coins += 1;
            RPC( ShowPlusOneForHalfSec, RpcTarget.All ); // Remote Procedure Call (RPC)
        }
    }
}