using UnityEngine;
using Multisynq;
using System;

// public class ModelVar<T> {
//     private string modelName;
//     private string variableName;

//     public T value {
//         get {
//             // if (!Croquet.IsReady) return value;
//             // return Croquet.GetModelValue($"{modelName}.{variableName}");
//             return value;
//         }
//     }

//     public ModelVar(string modelName, string variableName) {
//         this.modelName = modelName;
//         this.variableName = variableName;

//         Croquet.Subscribe(modelName, variableName, OnModelUpdate);
//     }

//     void OnModelUpdate(string jsonValue) {
//         value = JsonUtility.FromJson<T>(jsonValue);
//     }
// }

[Serializable]
public class PlayerState {
  public Vector3 position;
  public Vector3 velocity;
  public bool isGrounded;
  public bool jumping;
  public Vector2? input;
  public double lastUpdate;

  public static PlayerState FromJson(string jsonData) {
    return JsonUtility.FromJson<PlayerState>(jsonData);
  }

  public string ToJson() { return JsonUtility.ToJson(this); }
}

public class PlayerMovementController : SynqBehaviour {
  [SerializeField] private string playerId;
  [SerializeField] private float lerpSpeed = 15f;
  [SerializeField] private float rotationSpeed = 10f;

  // [ModelVar("PlayerMovement_Mgr_Model", "player")] private PlayerState currentState;
  // ModelVar<PlayerState> pState = new ("PlayerMovement_Mgr_Model", "player");

  private Transform playerTransform;
  private Vector3 lastInput = Vector3.zero;
  private PlayerState currentState;

  void Start() {
    playerTransform = transform;
    currentState = new PlayerState {
      position = transform.position,
      velocity = Vector3.zero,
      isGrounded = true,
      jumping = false,
      input = null,
      lastUpdate = Time.time
    };
  }

  void Update() {
    UpdateFromModel();

    Vector3 currentInput = new Vector3(Input.GetAxisRaw("Horizontal"), 0f, Input.GetAxisRaw("Vertical")).normalized;

    // Only send input changes
    if (currentInput != lastInput) {
      RPC(SendInput, $"{playerId}__{currentInput.x}__{currentInput.z}");
      lastInput = currentInput;
    }

    if (Input.GetKeyDown(KeyCode.Space)) RPC(SendJump, playerId);

    // Position interpolation
    playerTransform.position = Vector3.Lerp(playerTransform.position, currentState.position, Time.deltaTime * lerpSpeed);

    // Rotation based on velocity
    if (currentState.velocity.magnitude > 0.1f) {
      Vector3 horizontalVelocity = new Vector3(currentState.velocity.x, 0, currentState.velocity.z);
      if (horizontalVelocity.magnitude > 0.1f) {
        Quaternion targetRotation = Quaternion.LookRotation(horizontalVelocity);
        playerTransform.rotation = Quaternion.Slerp(playerTransform.rotation, targetRotation, Time.deltaTime * rotationSpeed);
      }
    }
  }

  void UpdateFromModel() {
    // if (!Croquet.IsReady) return;

    // var playerJson = Croquet.GetModelValue($"PlayerMovement_Mgr_Model.getPlayer('{playerId}')");
    // if (string.IsNullOrEmpty(playerJson)) return;

    // currentState = PlayerState.FromJson(playerJson);
  }

  void OnSessionStart(string viewID) {
    playerId = viewID;
    RPC(InitializePlayer);
    // Only subscribe to critical updates
    Croquet.Subscribe("PlayerMove", "stateUpdated", OnStateUpdate);
  }

  [SynqRPC]
  void InitializePlayer() {
    string input = $"{playerId}__{transform.position.x}__{transform.position.y}__{transform.position.z}";
    Croquet.Publish("PlayerMove", "initPlayer", input);
  }

  [SynqRPC] void SendInput(string input) { Croquet.Publish("PlayerMove", "input", input); }
  [SynqRPC] void SendJump( string id   ) { Croquet.Publish("PlayerMove", "jump",  id   ); }

  void OnStateUpdate(string jsonUpdate) {
    var updateData = JsonUtility.FromJson<PlayerStateUpdate>(jsonUpdate);
    if (updateData.id != playerId) return;

    currentState = PlayerState.FromJson(JsonUtility.ToJson(updateData.data));
  }
}

[Serializable]
public class PlayerStateUpdate {
  public string id;
  public PlayerState data;
}