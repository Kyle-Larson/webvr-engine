export function loadScene(sceneFile, onLoad) {
  let oReq = new XMLHttpRequest();
  oReq.onload = function(e) {
    onLoad(JSON.parse(this.responseText));
  }
  oReq.open("get", "../json/scenes/" + sceneFile + ".json", true);
  oReq.send();
}