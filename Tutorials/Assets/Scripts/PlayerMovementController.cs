using UnityEngine;
using Multisynq;

public class PlayerMovementController : SynqBehaviour {
    [SynqVar(OnChangedCallback = nameof(OnPosChange))] 
    public Vector3 synqPos;
    public Vector3 synqVelocity; // Added to store server velocity

    [SerializeField] private string playerId;
    [SerializeField] private float lerpSpeed = 15f;
    [SerializeField] private float rotationSpeed = 10f;
    private Transform playerTransform;
    
    private Vector3 lastInput = Vector3.zero;
    private Vector3 targetPosition;
    private Vector3 targetVelocity;

    [SerializeField] private bool initialized = false;

    void Start() {
        playerTransform = transform;
        synqPos = transform.position;
        targetPosition = transform.position;
    }

    void Update() {
        // Get input
        Vector3 currentInput = new Vector3(Input.GetAxisRaw("Horizontal"), 0f, Input.GetAxisRaw("Vertical")).normalized;

        // Only send input if it changed
        if (currentInput != lastInput) {
            CallSynqCommand(SendInputChange, $"{playerId}__{currentInput.x}__{currentInput.z}");
            lastInput = currentInput;
        }

        // Handle jump input
        if (Input.GetKeyDown(KeyCode.Space)) RPC(SendJump, RpcTarget.All, playerId);

        // Handle movement interpolation
        playerTransform.position = Vector3.Lerp(playerTransform.position, targetPosition, Time.deltaTime * lerpSpeed);

        // Rotate towards movement direction
        if (synqVelocity.magnitude > 0.1f) {
            Quaternion targetRotation = Quaternion.LookRotation(new Vector3(synqVelocity.x, 0, synqVelocity.z));
            playerTransform.rotation = Quaternion.Slerp(playerTransform.rotation, targetRotation, Time.deltaTime * rotationSpeed);
        }

        if (!initialized) {
            initialized = true;
            RPC(InitializePlayer);
        }
    }

    void OnSessionStart(string viewID) {
        Debug.Log($"[C#][OnSessionStart] Player [{viewID}] joined the session");
        playerId = viewID;
        RPC(InitializePlayer);
        Croquet.Subscribe("PlayerMove", "positionUpdate", OnPositionUpdate);
    }

    [SynqRPC]
    void InitializePlayer() {
        Debug.Log($"[C#][InitializePlayer] Player [{playerId}] initialized");
        string input = $"{playerId}__{transform.position.x}__{transform.position.y}__{transform.position.z}";
        Croquet.Publish("PlayerMove", "initPlayer", input);
    }

    [SynqRPC] void SendInputChange(string input) { Croquet.Publish("PlayerMove", "inputChange", input); }
    [SynqRPC] void SendJump(       string id   ) { Croquet.Publish("PlayerMove", "jump",        id   ); }

    void OnPositionUpdate(string msg) {
        Debug.Log($"[C#][OnPositionUpdate] Received: {msg}");

        string[] parts = msg.Split("__");
        if (parts[0] != playerId) return;

        // Update position and velocity from server
        targetPosition = new Vector3(float.Parse(parts[1]), float.Parse(parts[2]), float.Parse(parts[3]));
        synqVelocity   = new Vector3(float.Parse(parts[4]), float.Parse(parts[5]), float.Parse(parts[6]));
        synqPos = targetPosition;
    }

    void OnPosChange(Vector3 newPos) { targetPosition = newPos; }
}