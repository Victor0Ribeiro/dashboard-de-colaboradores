// Lista em memória (simulação de banco de dados)
let employees = [];

// Referências
const form = document.getElementById('create-form');
const tableBody = document.querySelector('#manage-table tbody');

// --- Criar funcionário ---
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('new-name').value.trim();
  const area = document.getElementById('new-area').value.trim();
  const patience = parseInt(document.getElementById('new-patience').value, 10);
  const versatility = parseInt(document.getElementById('new-versatility').value, 10);
  const communication = parseInt(document.getElementById('new-communication').value, 10);

  if (!validateSkills(patience, versatility, communication)) {
    alert('As habilidades devem estar entre 0 e 10.');
    return;
  }

  const newEmployee = { id: Date.now(), name, area, patience, versatility, communication };
  employees.push(newEmployee);
  renderTable();

  form.reset();
});

// --- Renderizar tabela ---
function renderTable() {
  tableBody.innerHTML = '';

  employees.forEach(emp => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.area}</td>
      <td>${emp.patience}</td>
      <td>${emp.versatility}</td>
      <td>${emp.communication}</td>
      <td>
        <button class="edit-btn" data-id="${emp.id}">Editar</button>
        <button class="delete-btn" data-id="${emp.id}">Remover</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Ativar botões
  document.querySelectorAll('.edit-btn').forEach(btn =>
    btn.addEventListener('click', () => editEmployee(btn.dataset.id))
  );
  document.querySelectorAll('.delete-btn').forEach(btn =>
    btn.addEventListener('click', () => deleteEmployee(btn.dataset.id))
  );
}

// --- Editar funcionário ---
function editEmployee(id) {
  const employee = employees.find(emp => emp.id == id);
  if (!employee) return;

  // Substitui a linha por inputs editáveis
  const row = [...tableBody.children].find(r => r.querySelector('.edit-btn').dataset.id == id);
  row.innerHTML = `
    <td><input type="text" id="edit-name" value="${employee.name}"></td>
    <td><input type="text" id="edit-area" value="${employee.area}"></td>
    <td><input type="number" id="edit-patience" value="${employee.patience}" min="0" max="10"></td>
    <td><input type="number" id="edit-versatility" value="${employee.versatility}" min="0" max="10"></td>
    <td><input type="number" id="edit-communication" value="${employee.communication}" min="0" max="10"></td>
    <td>
      <button class="save-btn">Salvar</button>
      <button class="cancel-btn">Cancelar</button>
    </td>
  `;

  row.querySelector('.save-btn').addEventListener('click', () => {
    const updated = {
      id: employee.id,
      name: document.getElementById('edit-name').value.trim(),
      area: document.getElementById('edit-area').value.trim(),
      patience: parseInt(document.getElementById('edit-patience').value, 10),
      versatility: parseInt(document.getElementById('edit-versatility').value, 10),
      communication: parseInt(document.getElementById('edit-communication').value, 10),
    };

    if (!validateSkills(updated.patience, updated.versatility, updated.communication)) {
      alert('As habilidades devem estar entre 0 e 10.');
      return;
    }

    const index = employees.findIndex(emp => emp.id == id);
    employees[index] = updated;
    renderTable();
  });

  row.querySelector('.cancel-btn').addEventListener('click', renderTable);
}

// --- Remover funcionário ---
function deleteEmployee(id) {
  employees = employees.filter(emp => emp.id != id);
  renderTable();
}

// --- Validar habilidades ---
function validateSkills(patience, versatility, communication) {
  return [patience, versatility, communication].every(v => v >= 0 && v <= 10);
}
