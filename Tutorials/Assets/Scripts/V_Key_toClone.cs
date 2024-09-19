using UnityEngine;
using Multisynq;

class V_Key_toClone: SyncBehaviour {

  void CloneMe() {
    SyncClones_Mgr.SyncClone(gameObject);
    // disable self so we done clone again with keypress
    enabled = false;
  }

  public void Update() {
    if (Input.GetKeyDown(KeyCode.V)) {
      CloneMe();
    }
  }
}