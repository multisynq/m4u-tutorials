using UnityEngine;
using Multisynq;

public class PlayerMovementController : SynqBehaviour {
#region Fields

    [SynqVar(OnChangedCallback = nameof(OnPosChange))] 
    public Vector3 synqPos;

    [SerializeField] private string playerId;
    private readonly float lerpSpeed = 15f;
    private Transform playerTransform;

    [SerializeField] private bool initialized = true;

#endregion
#region Unity Handlers

    void Start() {
        playerTransform = transform;
        synqPos = transform.position;
    }

    void Update() {
        // Get input
        Vector3 input = new Vector3(Input.GetAxisRaw("Horizontal"), 0f, Input.GetAxisRaw("Vertical")).normalized;

        // Only send input if there's actual input to send
        if (input != Vector3.zero) CallSynqCommand(SendInput, $"{playerId}__{input.x}__{input.z}");

        // Handle jump input
        if (Input.GetKeyDown(KeyCode.Space)) RPC(SendJump, RpcTarget.All, playerId);

        if (initialized == false) {
            initialized = true;
            RPC(InitializePlayer); //? But here it works (after the session has started)
        }
    }

#endregion
#region Croquet Handlers

    // Called by Croquet when self joins a session. (not when others join)
    void OnSessionStart(string viewID) {
        Debug.Log($"[C#][OnSessionStart] Player [{viewID}] joined the session");

        playerId = viewID;
        RPC(InitializePlayer); //! For some reason when this is called here there is no RECEIVED message

        Croquet.Subscribe("PlayerMove", "positionUpdate", OnPositionUpdate);
    }

    void OnUserJoin(string viewID) { Debug.Log($"[C#][OnUserJoin] Player [{viewID}] joined the session"); }
    void OnUserExit(string viewID) { Debug.Log($"[C#][OnUserExit] Player [{viewID}] left the session"  ); }

#endregion
#region Synq Commands

    [SynqRPC]
    void InitializePlayer() {
        Debug.Log($"[C#][InitializePlayer] Player [{playerId}] initialized");
        string input = $"{playerId}__{transform.position.x}__{transform.position.y}__{transform.position.z}";
        Croquet.Publish("PlayerMove", "initPlayer", input);
    }

    // [SynqRPC] void SendInput(string[] input) { Croquet.Publish("PlayerMove", "input", input); }
    [SynqRPC] void SendInput(string input) { Croquet.Publish("PlayerMove", "input", input); }
    [SynqRPC] void SendJump( string id   ) { Croquet.Publish("PlayerMove", "jump",  id   ); }

#endregion
#region Synq Callbacks

    void OnPosChange(Vector3 newPos) {
        playerTransform.position = Vector3.Lerp(playerTransform.position, newPos, Time.deltaTime * lerpSpeed);
    }

    void OnPositionUpdate(string msg) {
        Debug.Log($"[C#][OnPositionUpdate] Received: {msg}");
        // Parse position update message from Croquet
        string[] parts = msg.Split("__");
        if (parts[0] != playerId) return; // Not for this player
        synqPos = new Vector3(
            float.Parse(parts[1]),
            float.Parse(parts[2]),
            float.Parse(parts[3])
        );
    }

#endregion
}