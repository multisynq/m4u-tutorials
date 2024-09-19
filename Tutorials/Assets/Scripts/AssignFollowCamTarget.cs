using UnityEngine;
using Multisynq;

public class AssignFollowCamTarget : MonoBehaviour {
  public FollowCam followCamToUpdate;

  void Start() {

  }

  // Update is called once per frame
  void Update() {
    Mq_Drivable_Comp a = Mq_Drivable_System.Instance.GetActiveDrivableComponent();

    if (a != null) {
      followCamToUpdate.target = a.transform;

      enabled = false;
    }
  }
}
