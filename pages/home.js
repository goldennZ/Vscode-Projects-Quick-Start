const { ipcRenderer } = require('electron')
  
  const listProjects = ipcRenderer.sendSync('refreshApp')
  CreateList(listProjects);


function ClosePage() {
  ipcRenderer.send('closeApp')
}

function MinimizePage() {
  ipcRenderer.send('minimizeApp')
}

function CreateList(listProjects) {
  let projectsHtml = `
    <h6>Nenhum Projeto Adicionado</h6>
  `;

  if (listProjects.length > 0) {
    projectsHtml = '';
    for(let i = 0; i < listProjects.length; i++) {
      projectsHtml += `
      <h6>${listProjects[i].name}
        <span>
          <img src="../assets/toque 1.png" class="img-1" onclick= "ClickProject(${i})">
          <img src="../assets/lixo 1.png" class="img-2" onclick= "RemoveProject(${i})">
        </span>
      </h6>
      <div class="list-line"></div>
      `;
    }
  }

  document.getElementById('list-proj').innerHTML = projectsHtml;
}

function AddPath() {
  const listProjects = ipcRenderer.sendSync('pathApp');
  CreateList(listProjects);
}

function ClickProject(path) {
  ipcRenderer.send('clickApp',path);
}

function RemoveProject(path) {
  const listProjects = ipcRenderer.sendSync('removeApp',path)
  CreateList(listProjects);
}

