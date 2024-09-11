using UnityEngine;

public class DamageFlash : SyncedBehaviour
{
    private float timer = 0;
    private bool showDamagePanel = false;
    private string damageMessage = "";

    [SyncCommand]
    public void TakeDamage(string bodyPart)
    {
        showDamagePanel = true;
        timer = Time.time;
        damageMessage = $"Damage: {bodyPart}";
        Debug.Log($"[SyncCommand] TakeDamage called for {bodyPart}");
    }

    void OnGUI()
    {
        if (showDamagePanel)
        {
            GUI.color = new Color(1, 0, 0, 0.5f); // Semi-transparent red
            GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Texture2D.whiteTexture);
            
            GUIStyle style = new GUIStyle();
            style.alignment = TextAnchor.MiddleCenter;
            style.fontSize = 40;
            style.normal.textColor = new Color(0.5f, 1f, 0.5f, 1f); // lime green
            
            GUI.Label(new Rect(0, 0, Screen.width, Screen.height), damageMessage, style);
        }
    }

    void Update()
    {
        if (showDamagePanel && Time.time - timer > 0.8f)
        {
            showDamagePanel = false;
        }

        // Check for key presses and call TakeDamage via SyncCommandMgr
        SyncCommandMgr syncCommandMgr = FindObjectOfType<SyncCommandMgr>();
        if (syncCommandMgr != null)
        {
            if (Input.GetKeyDown(KeyCode.T))
            {
                syncCommandMgr.ExecuteCommand($"{netId}_TakeDamage", "Torso");
            }
            else if (Input.GetKeyDown(KeyCode.H))
            {
                syncCommandMgr.ExecuteCommand($"{netId}_TakeDamage", "Head");
            }
            else if (Input.GetKeyDown(KeyCode.L))
            {
                syncCommandMgr.ExecuteCommand($"{netId}_TakeDamage", "Legs");
            }
        }
        else
        {
            Debug.LogError("SyncCommandMgr not found in the scene!");
        }
    }
}