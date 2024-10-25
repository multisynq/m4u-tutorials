using UnityEngine;
using Multisynq;

public static partial class _ {
    public const string inv = "/VarInventory_Canvas/Panel/Inventory_Lay/InvItem";
    public const string fmt = "<b>{{key}}</b>\n<color=#4ff>{{value}}</color>";
}
//========== ||||||||||||||| ====================
public class PlayerInventory : SynqBehaviour {

  [SynqVarUI(order= 5, clonePath=_.inv, formatStr=_.fmt)] public int wood = 0;
  [SynqVarUI(order=10, clonePath=_.inv, formatStr=_.fmt)] public int gold = 0;
  [SynqVarUI(order=20, clonePath=_.inv, formatStr=_.fmt)] public int sand = 42;
  [SynqVarUI(order=30, clonePath=_.inv, formatStr=_.fmt)] public int dirt = 64;
  [SynqVarUI(order=40, clonePath=_.inv, formatStr=_.fmt, labelTxt="G<color=yellow>L</color>ass")] public int glass = 64;
  float timer = 0f;

  // SynqVar<string> beacon = new("[*]-----==----====------");
  
  void Start() {
    // beacon = new( this, "beacon", "[*]-----==----====------" );
    // beacon.Set("Hello World!");
  }

  void Update() {
    KeyDo(KeyCode.G, ref gold);
    KeyDo(KeyCode.S, ref sand);
    KeyDo(KeyCode.D, ref dirt);
    KeyDo(KeyCode.L, ref glass);
    KeyDo(KeyCode.W, ref wood);
    if (timer > 0) { timer -= Time.deltaTime; } // if timer > 0, show yellow "+1" in OnGUI
  }

  void KeyDo(KeyCode key, ref int var) {
    if (Input.GetKeyDown(key)) {
      int orig = var;
      var += 1;
      RPC( ShowPlusOneForHalfSec, RpcTarget.All ); // Remote Procedure Call (RPC)
      Debug.Log($"<color=#ffaa00>[<color=#5577ff>Synq</color>VarUI]</color> <color=#fff>[{key}]</color> <color=cyan>{orig}</color> + 1 = <color=cyan>{var}</color>");
    }
  }

  [SynqRPC]
  void ShowPlusOneForHalfSec() {
    Debug.Log("<color=#ffdd55><b>[[ +1 ]]</b></color> <===== Remote Procedure Call (RPC) ");
    timer = 0.5f;
  }

}