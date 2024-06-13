document.addEventListener('DOMContentLoaded', function() {
    const dataUrl = 'defaultOrderOfBattle.json';
    let data = {};

    async function loadData() {
        try {
            const response = await fetch(dataUrl);
            data = await response.json();
            populateForm(data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function populateForm(data) {
        document.getElementById('name').value = data.name;
        document.getElementById('supply_limit').value = data.supply_limit;
        document.getElementById('supply_used').value = data.supply_used;
        document.getElementById('battle_tally').value = data.battle_tally;
        document.getElementById('victories').value = data.victories;
        document.getElementById('requisition_points').value = data.resources.requisition_points;

        const unitsContainer = document.getElementById('unitsContainer');
        unitsContainer.innerHTML = '';

        data.units.forEach((unit, index) => {
            addUnitToForm(unit, index);
        });
    }

    function addUnitToForm(unit, index) {
        const unitsContainer = document.getElementById('unitsContainer');
        const unitDiv = document.createElement('div');
        unitDiv.classList.add('unit');
        unitDiv.innerHTML = `
            <h3>${unit.name} <button type="button" class="toggleUnitDetails" data-index="${index}">Show Details</button></h3>
            <div class="unitDetails" id="unit_details_${index}" style="display: none;">
                <label for="unit_name_${index}">Name:</label>
                <input type="text" id="unit_name_${index}" value="${unit.name}">
                <label for="point_cost_${index}">Point Cost:</label>
                <input type="number" id="point_cost_${index}" value="${unit.point_cost}">
                <label for="crusade_points_${index}">Crusade Points:</label>
                <input type="number" id="crusade_points_${index}" value="${unit.crusade_points}">
                <label for="experience_points_${index}">Experience Points:</label>
                <input type="number" id="experience_points_${index}" value="${unit.experience_points}">
                <label for="unit_type_${index}">Unit Type:</label>
                <input type="text" id="unit_type_${index}" value="${unit.unit_type}">
                <label for="model_count_${index}">Model Count:</label>
                <input type="number" id="model_count_${index}" value="${unit.model_count}">
                <label for="equipment_${index}">Equipment:</label>
                <input type="text" id="equipment_${index}" value="${unit.equipment}">
                <label for="enhancements_upgrades_${index}">Enhancements/Upgrades:</label>
                <input type="text" id="enhancements_upgrades_${index}" value="${unit.enhancements_upgrades}">
                <label for="battle_honours_${index}">Battle Honours:</label>
                <input type="text" id="battle_honours_${index}" value="${unit.battle_honours}">
                <label for="battle_scars_${index}">Battle Scars:</label>
                <input type="text" id="battle_scars_${index}" value="${unit.battle_scars}">
                <label for="battles_played_${index}">Battles Played:</label>
                <input type="number" id="battles_played_${index}" value="${unit.combat_tallies.battles_played}">
                <label for="battles_survived_${index}">Battles Survived:</label>
                <input type="number" id="battles_survived_${index}" value="${unit.combat_tallies.battles_survived}">
                <label for="enemy_units_destroyed_${index}">Enemy Units Destroyed:</label>
                <input type="number" id="enemy_units_destroyed_${index}" value="${unit.combat_tallies.enemy_units_destroyed}">
                <button type="button" class="removeUnit" data-index="${index}">Remove Unit</button>
            </div>
        `;
        unitsContainer.appendChild(unitDiv);

        // Add event listeners for the new buttons
        document.querySelector(`.toggleUnitDetails[data-index="${index}"]`).addEventListener('click', function() {
            toggleUnitDetails(index, this);
        });

        document.querySelector(`.removeUnit[data-index="${index}"]`).addEventListener('click', function() {
            removeUnit(index);
        });
    }

    function toggleUnitDetails(index, button) {
        const detailsDiv = document.getElementById(`unit_details_${index}`);
        if (detailsDiv.style.display === 'none') {
            detailsDiv.style.display = 'block';
            button.textContent = 'Hide Details';
        } else {
            detailsDiv.style.display = 'none';
            button.textContent = 'Show Details';
        }
    }

    function removeUnit(index) {
        data.units.splice(index, 1);
        populateForm(data);
    }

    function addUnit() {
        const newUnit = {
            name: 'New Unit',
            point_cost: 0,
            crusade_points: 0,
            experience_points: 0,
            unit_type: '',
            model_count: 0,
            equipment: '',
            enhancements_upgrades: '',
            battle_honours: '',
            battle_scars: '',
            combat_tallies: {
                battles_played: 0,
                battles_survived: 0,
                enemy_units_destroyed: 0
            }
        };
        data.units.push(newUnit);
        addUnitToForm(newUnit, data.units.length - 1);
    }

    function exportData() {
        const exportData = JSON.stringify(data, null, 2);
        const filename = document.getElementById('name').value || 'crusade_data';
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const importedData = JSON.parse(e.target.result);
                data = importedData;
                populateForm(data);
            };
            reader.readAsText(file);
        }
    }

    document.getElementById('addUnit').addEventListener('click', addUnit);
    document.getElementById('exportButton').addEventListener('click', exportData);
    document.getElementById('importInput').addEventListener('change', importData);
    document.getElementById('importButton').addEventListener('click', function() {
        document.getElementById('importInput').click();
    });

    loadData();
});
