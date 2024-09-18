using UnityEngine;

class StartNudged : MonoBehaviour {

  public Vector3 nudgePos = new Vector3(1f, 0f, 0f);
  public bool randomColor = true;

  void Start() {
    transform.position = transform.position + nudgePos;
    if (randomColor) {
      GetComponent<Renderer>().material.color = new Color(Random.value, Random.value, Random.value);
    }
  }

}