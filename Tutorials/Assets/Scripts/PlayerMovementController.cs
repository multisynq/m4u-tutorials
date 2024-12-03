using UnityEngine;
using Multisynq;

public class PlayerMovementController : SynqBehaviour {
    [SynqVar(OnChangedCallback = nameof(OnPosChange))] 
    public Vector3 synqPos;

    [SerializeField] private string playerId;
    [SerializeField] private float lerpSpeed = 15f;
    [SerializeField] private float rotationSpeed = 10f;
    private Transform playerTransform;
    private Vector3 lastInput = Vector3.zero;
    private Vector3 targetPosition;
    private Vector3 currentVelocity;

    void Start() {
        playerTransform = transform;
        synqPos = transform.position;
        targetPosition = transform.position;
    }

    void Update() {
        Vector3 currentInput = new Vector3(Input.GetAxisRaw("Horizontal"), 0f, Input.GetAxisRaw("Vertical")).normalized;

        if (currentInput != lastInput) {
            CallSynqCommand(SendInput, $"{playerId}__{currentInput.x}__{currentInput.z}");
            lastInput = currentInput;
        }

        if (Input.GetKeyDown(KeyCode.Space)) CallSynqCommand(SendJump, playerId);

        // Position interpolation
        playerTransform.position = Vector3.Lerp( playerTransform.position, targetPosition, Time.deltaTime * lerpSpeed);

        // Rotation based on velocity
        if (currentVelocity.x != 0 || currentVelocity.z != 0) {
            Vector3 horizontalVelocity = new Vector3(currentVelocity.x, 0, currentVelocity.z);
            if (horizontalVelocity.magnitude > 0.1f) {
                Quaternion targetRotation = Quaternion.LookRotation(horizontalVelocity);
                playerTransform.rotation = Quaternion.Slerp(playerTransform.rotation, targetRotation, Time.deltaTime * rotationSpeed);
            }
        }
    }

    void OnSessionStart(string viewID) {
        Debug.Log($"PlayerMovementController: OnSessionStart: {viewID}");
        playerId = viewID;
        RPC(InitializePlayer);
        CallSynqCommand(InitializePlayer);
        Croquet.Subscribe("PlayerMove", "positionUpdate", OnPositionUpdate);
    }

    [SynqRPC]
    void InitializePlayer() {
        string input = $"{playerId}__{transform.position.x}__{transform.position.y}__{transform.position.z}";
        Croquet.Publish("PlayerMove", "initPlayer", input);
        // Croquet.Publish("PlayerMove", "initPlayer", a, b, c);
        // Croquet.Publish("PlayerMove", "initPlayer", $"{playerId}|{transform.position.x}|{transform.position.y}|{transform.position.z}");
    }

    [SynqRPC] void SendInput(string input) { Croquet.Publish("PlayerMove", "input", input); }
    [SynqRPC] void SendJump( string id   ) { Croquet.Publish("PlayerMove", "jump",  id   ); }

    void OnPositionUpdate(string msg) {
        string[] parts = msg.Split("__");
        if (parts[0] != playerId) return;

        targetPosition  = new Vector3(float.Parse(parts[1]), float.Parse(parts[2]), float.Parse(parts[3]));
        currentVelocity = new Vector3(float.Parse(parts[4]), float.Parse(parts[5]), float.Parse(parts[6]));

        synqPos = targetPosition;
    }

    void OnPosChange(Vector3 newPos) { targetPosition = newPos; }
}