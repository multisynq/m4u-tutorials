using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Multisynq;

public class SessionStats : SynqBehaviour {
    // Start is called before the first frame update

    public SynqVarUIAttribute SynqVarUITheme = new SynqVarUIAttribute(
        theme: "Stats",
        clonePath: "/VarScore_Canvas/Panel/Scores_Lay/ScoreItem",
        formatStr: "<b>{{key}}:</b>  <color=#4ff>{{value}}</color>"
    );

    [SynqVarUI(theme = "Stats", updateInterval=0.5f)] public int viewCount = 0;


    void Start() {
        
    }

    // Update is called once per frame
    void Update() {
        viewCount = Mq_Bridge.Instance.croquetViewCount;
    }
}
