let employees = {};

async function fetchEmployees() {
    const res = await fetch('http://localhost:3001/api/employees');
    employees = await res.json();
    renderTable();
}

async function saveEmployees() {
    await fetch('http://localhost:3001/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employees)
    });
}

const skillLabels = ["Área", "Paciência", "Versatilidade", "Comunicação"];

function renderSkillInputs(prefix, values = []) {
    return skillLabels.map((label, idx) => `
        <label>${label}: 
            <input type="number" min="0" max="10" id="${prefix}-skill-${idx}" 
                value="${values[idx] ?? 0}" required>
        </label>
    `).join('<br>');
}

function renderTable() {
    const tbody = document.querySelector('#manage-table tbody');
    tbody.innerHTML = '';
    Object.entries(employees).forEach(([id, emp]) => {
        const skills = emp.habilidades.map(val => `<td>${val}</td>`).join('');
        tbody.innerHTML += `
            <tr>
                <td>${emp.nome}</td>
                ${skills}
                <td>
                    <button onclick="editEmployee('${id}')">✏️ Editar</button>
                    <button onclick="removeEmployee('${id}')">🗑️ Remover</button>
                </td>
            </tr>
        `;
    });
}

document.getElementById('create-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('new-name').value.trim();
    const skills = skillLabels.map((_, idx) => {
        const val = parseInt(document.getElementById(`new-skill-${idx}`).value, 10);
        if (val < 0 || val > 10 || isNaN(val)) {
            alert('As habilidades devem estar entre 0 e 10.');
            throw new Error("Valor inválido");
        }
        return val;
    });

    const id = Date.now().toString();
    employees[id] = { nome: name, habilidades: skills };
    saveEmployees().then(renderTable);
    e.target.reset();
});

window.editEmployee = function(id) {
    const emp = employees[id];
    const tr = [...document.querySelectorAll('#manage-table tbody tr')].find(row => row.children[0].textContent === emp.nome);
    if (!tr) return;
    tr.innerHTML = `
        <td><input type="text" id="edit-name" value="${emp.nome}"></td>
        ${skillLabels.map((label, idx) => `
            <td>
                <input type="number" min="0" max="10" id="edit-skill-${idx}" 
                    value="${emp.habilidades[idx]}" required>
            </td>
        `).join('')}
        <td>
            <button onclick="saveEmployee('${id}')">💾 Salvar</button>
            <button onclick="renderTable()">❌ Cancelar</button>
        </td>
    `;
};

window.saveEmployee = function(id) {
    const name = document.getElementById('edit-name').value.trim();
    const skills = skillLabels.map((_, idx) => {
        const val = parseInt(document.getElementById(`edit-skill-${idx}`).value, 10);
        if (val < 0 || val > 10 || isNaN(val)) {
            alert('As habilidades devem estar entre 0 e 10.');
            throw new Error("Valor inválido");
        }
        return val;
    });

    employees[id] = { nome: name, habilidades: skills };
    saveEmployees().then(renderTable);
};

window.removeEmployee = function(id) {
    if (confirm('Tem certeza que deseja remover este colaborador?')) {
        delete employees[id];
        saveEmployees().then(renderTable);
    }
};

fetchEmployees();
