// ===== Construction Calculators =====

// ===== Ceiling Calculator =====
function calculateCeiling() {
    const length = parseFloat(document.getElementById('ceilingLength').value);
    const width = parseFloat(document.getElementById('ceilingWidth').value);
    const thickness = parseFloat(document.getElementById('ceilingThickness').value);
    const type = document.getElementById('ceilingType').value;

    if (!Utils.validateInput(length) || !Utils.validateInput(width) || !Utils.validateInput(thickness)) {
        Utils.showNotification('يرجى إدخال قيم صحيحة لجميع الحقول', 'error');
        return;
    }

    const area = length * width;
    const volume = area * (thickness / 100); // Convert cm to meters

    // Calculate materials based on ceiling type
    let materials = {};
    
    switch(type) {
        case 'normal':
            materials = calculateNormalCeiling(volume, area);
            break;
        case 'flat':
            materials = calculateFlatSlab(volume, area);
            break;
        case 'beams':
            materials = calculateBeamsAndSlabs(volume, area);
            break;
    }

    displayCeilingResults(materials, area, volume);
}

function calculateNormalCeiling(volume, area) {
    const cementKg = volume * 350; // kg per m³
    const cementBags = Math.ceil(cementKg / 50); // Convert to bags (50kg each)
    const sandM3 = Math.ceil(volume * 0.45); // Round up to whole m³
    const gravelM3 = Math.ceil(volume * 0.8); // Round up to whole m³
    const steelKg = area * 80; // kg per m²
    const steelRods = Math.ceil(steelKg / 7.4); // Assuming 12mm rods (7.4kg per 12m rod)

    return {
        concrete: volume * 1.05, // 5% waste
        cement: cementBags, // bags
        sand: sandM3, // m³
        gravel: gravelM3, // m³
        water: Math.ceil(volume * 180), // liters
        steel: steelKg, // kg per m²
        steelRods: steelRods, // number of rods
        cost: volume * 1200 // EGP per m³
    };
}

function calculateFlatSlab(volume, area) {
    const cementKg = volume * 380;
    const cementBags = Math.ceil(cementKg / 50);
    const sandM3 = Math.ceil(volume * 0.42);
    const gravelM3 = Math.ceil(volume * 0.85);
    const steelKg = area * 120;
    const steelRods = Math.ceil(steelKg / 7.4);

    return {
        concrete: volume * 1.05,
        cement: cementBags,
        sand: sandM3,
        gravel: gravelM3,
        water: Math.ceil(volume * 190),
        steel: steelKg,
        steelRods: steelRods,
        cost: volume * 1400
    };
}

function calculateBeamsAndSlabs(volume, area) {
    const cementKg = volume * 400;
    const cementBags = Math.ceil(cementKg / 50);
    const sandM3 = Math.ceil(volume * 0.4);
    const gravelM3 = Math.ceil(volume * 0.9);

    const steelKg = area * 150;
    const steelRods = Math.ceil(steelKg / 7.4);

    return {
        concrete: volume * 1.08,
        cement: cementBags,
        sand: sandM3,
        gravel: gravelM3,
        water: Math.ceil(volume * 200),
        steel: steelKg,
        steelRods: steelRods,
        cost: volume * 1600
    };
}

function displayCeilingResults(materials, area, volume) {
    const resultsDiv = document.getElementById('ceilingResults');
    resultsDiv.innerHTML = `
        <div class="results-card">
            <h5><i class="fas fa-chart-bar"></i> نتائج حساب السقف</h5>
            <div class="results-grid">
                <div class="result-item">
                    <span class="label">المساحة:</span>
                    <span class="value">${Utils.formatNumber(area)} متر مربع</span>
                </div>
                <div class="result-item">
                    <span class="label">حجم الخرسانة:</span>
                    <span class="value">${Utils.formatNumber(volume)} متر مكعب</span>
                </div>
                <div class="result-item">
                    <span class="label">الأسمنت:</span>
                    <span class="value">${materials.cement} شكارة</span>
                </div>
                <div class="result-item">
                    <span class="label">الرمل:</span>
                    <span class="value">${materials.sand} متر</span>
                </div>
                <div class="result-item">
                    <span class="label">السن (الزلط):</span>
                    <span class="value">${materials.gravel} متر مكعب</span>
                </div>
                <div class="result-item">
                    <span class="label">المياه:</span>
                    <span class="value">${materials.water} لتر</span>
                </div>
                <div class="result-item">
                    <span class="label">الحديد:</span>
                    <span class="value">${Utils.formatNumber(materials.steel)} كيلو</span>
                </div>
                <div class="result-item">
                    <span class="label">عدد الأسياخ:</span>
                    <span class="value">${materials.steelRods} سيخ</span>
                </div>
                <div class="result-item total">
                    <span class="label">التكلفة التقريبية:</span>
                    <span class="value">${Utils.formatNumber(materials.cost)} جنيه</span>
                </div>
            </div>
            <div class="steel-note">
                <small><i class="fas fa-info-circle"></i> ملاحظة: الحساب على أساس أسياخ 12 متر طول</small>
            </div>
            <div class="action-buttons">
                <button onclick="downloadCeilingPDF()" class="download-btn">
                    <i class="fas fa-download"></i> تحميل PDF
                </button>
                <button onclick="saveCeilingCalculation()" class="save-btn">
                    <i class="fas fa-save"></i> حفظ الحساب
                </button>
            </div>
        </div>
    `;
}

// ===== Brick Calculator =====
function calculateBrick() {
    const area = parseFloat(document.getElementById('wallArea').value);
    const brickType = document.getElementById('brickType').value;
    const thickness = parseFloat(document.getElementById('wallThickness').value);

    if (!Utils.validateInput(area)) {
        Utils.showNotification('يرجى إدخال مساحة صحيحة', 'error');
        return;
    }

    const brickData = getBrickData(brickType);
    const bricksPerM2 = brickData.perM2;
    const totalBricks = Math.ceil(area * bricksPerM2 * 1.05); // 5% waste

    // Calculate mortar
    const mortarVolume = area * (thickness / 100) * 0.3; // 30% mortar
    const cementKg = mortarVolume * 300; // kg per m³
    const cementBags = Math.ceil(cementKg / 50); // Convert to bags
    const sandM3 = Math.ceil(mortarVolume * 1.2); // m³

    const results = {
        bricks: totalBricks,
        cement: cementBags,
        sand: sandM3,
        cost: totalBricks * brickData.price + cementKg * 2.5 + sandM3 * 80
    };

    displayBrickResults(results, brickData, area);
}

function getBrickData(type) {
    const brickTypes = {
        red: { name: 'طوب أحمر', perM2: 55, price: 1.2 },
        block: { name: 'بلوك أسمنتي', perM2: 12.5, price: 3.5 },
        hollow: { name: 'طوب مفرغ', perM2: 12.5, price: 2.8 }
    };
    return brickTypes[type];
}

function displayBrickResults(results, brickData, area) {
    const resultsDiv = document.getElementById('brickResults');
    resultsDiv.innerHTML = `
        <div class="results-card">
            <h5><i class="fas fa-th-large"></i> نتائج حساب الطوب</h5>
            <div class="results-grid">
                <div class="result-item">
                    <span class="label">نوع الطوب:</span>
                    <span class="value">${brickData.name}</span>
                </div>
                <div class="result-item">
                    <span class="label">المساحة:</span>
                    <span class="value">${Utils.formatNumber(area)} متر مربع</span>
                </div>
                <div class="result-item">
                    <span class="label">عدد الطوب:</span>
                    <span class="value">${Utils.formatNumber(results.bricks)} طوبة</span>
                </div>
                <div class="result-item">
                    <span class="label">الأسمنت للمونة:</span>
                    <span class="value">${results.cement} شكارة</span>
                </div>
                <div class="result-item">
                    <span class="label">الرمل للمونة:</span>
                    <span class="value">${results.sand} متر</span>
                </div>
                <div class="result-item total">
                    <span class="label">التكلفة التقريبية:</span>
                    <span class="value">${Utils.formatNumber(results.cost)} جنيه</span>
                </div>
            </div>
            <div class="action-buttons">
                <button onclick="downloadBrickPDF()" class="download-btn">
                    <i class="fas fa-download"></i> تحميل PDF
                </button>
                <button onclick="saveBrickCalculation()" class="save-btn">
                    <i class="fas fa-save"></i> حفظ الحساب
                </button>
            </div>
        </div>
    `;
}

// ===== Plaster Calculator =====
function calculatePlaster() {
    const area = parseFloat(document.getElementById('plasterArea').value);
    const thickness = parseFloat(document.getElementById('plasterThickness').value);
    const type = document.getElementById('plasterType').value;

    if (!Utils.validateInput(area) || !Utils.validateInput(thickness)) {
        Utils.showNotification('يرجى إدخال قيم صحيحة', 'error');
        return;
    }

    const volume = area * (thickness / 100);
    const plasterData = getPlasterData(type);

    const cementKg = volume * plasterData.cement;
    const cementBags = Math.ceil(cementKg / 50);
    const sandM3 = Math.ceil(volume * plasterData.sand);

    const results = {
        cement: cementBags,
        sand: sandM3,
        additives: Math.ceil(volume * plasterData.additives),
        cost: volume * plasterData.costPerM3
    };

    displayPlasterResults(results, plasterData, area, volume);
}

function getPlasterData(type) {
    const plasterTypes = {
        cement: { 
            name: 'محارة أسمنتية', 
            cement: 250, 
            sand: 1.3, 
            additives: 0,
            costPerM3: 400 
        },
        gypsum: { 
            name: 'محارة جبسية', 
            cement: 0, 
            sand: 0, 
            additives: 800,
            costPerM3: 300 
        },
        lime: { 
            name: 'محارة جيرية', 
            cement: 150, 
            sand: 1.2, 
            additives: 100,
            costPerM3: 350 
        }
    };
    return plasterTypes[type];
}

function displayPlasterResults(results, plasterData, area, volume) {
    const resultsDiv = document.getElementById('plasterResults');
    resultsDiv.innerHTML = `
        <div class="results-card">
            <h5><i class="fas fa-paint-roller"></i> نتائج حساب المحارة</h5>
            <div class="results-grid">
                <div class="result-item">
                    <span class="label">نوع المحارة:</span>
                    <span class="value">${plasterData.name}</span>
                </div>
                <div class="result-item">
                    <span class="label">المساحة:</span>
                    <span class="value">${Utils.formatNumber(area)} متر مربع</span>
                </div>
                <div class="result-item">
                    <span class="label">الحجم:</span>
                    <span class="value">${Utils.formatNumber(volume)} متر مكعب</span>
                </div>
                ${results.cement > 0 ? `
                <div class="result-item">
                    <span class="label">الأسمنت:</span>
                    <span class="value">${results.cement} شكارة</span>
                </div>` : ''}
                ${results.sand > 0 ? `
                <div class="result-item">
                    <span class="label">الرمل:</span>
                    <span class="value">${results.sand} متر</span>
                </div>` : ''}
                ${results.additives > 0 ? `
                <div class="result-item">
                    <span class="label">المواد الإضافية:</span>
                    <span class="value">${Utils.formatNumber(results.additives)} كيلو</span>
                </div>` : ''}
                <div class="result-item total">
                    <span class="label">التكلفة التقريبية:</span>
                    <span class="value">${Utils.formatNumber(results.cost)} جنيه</span>
                </div>
            </div>
            <div class="action-buttons">
                <button onclick="downloadPlasterPDF()" class="download-btn">
                    <i class="fas fa-download"></i> تحميل PDF
                </button>
                <button onclick="savePlasterCalculation()" class="save-btn">
                    <i class="fas fa-save"></i> حفظ الحساب
                </button>
            </div>
        </div>
    `;
}

// ===== Tiles Calculator =====
function calculateTiles() {
    const area = parseFloat(document.getElementById('tilesArea').value);
    const tileSize = document.getElementById('tileSize').value;
    const wastePercentage = parseFloat(document.getElementById('wastePercentage').value);
    const installMethod = document.getElementById('installMethod').value;

    if (!Utils.validateInput(area)) {
        Utils.showNotification('يرجى إدخال مساحة صحيحة', 'error');
        return;
    }

    const tileData = getTileData(tileSize);
    const tilesNeeded = Math.ceil(area / tileData.areaPerTile * (1 + wastePercentage / 100));
    
    const installData = getInstallData(installMethod, area);
    
    const results = {
        tiles: tilesNeeded,
        boxes: Math.ceil(tilesNeeded / tileData.tilesPerBox),
        cement: installData.cement,
        sand: installData.sand,
        adhesive: installData.adhesive,
        cost: tilesNeeded * tileData.pricePerTile + installData.cost
    };

    displayTilesResults(results, tileData, area);
}

function getTileData(size) {
    const tileSizes = {
        '60x60': { areaPerTile: 0.36, tilesPerBox: 4, pricePerTile: 25 },
        '50x50': { areaPerTile: 0.25, tilesPerBox: 6, pricePerTile: 18 },
        '40x40': { areaPerTile: 0.16, tilesPerBox: 9, pricePerTile: 12 },
        '30x30': { areaPerTile: 0.09, tilesPerBox: 12, pricePerTile: 8 },
        '20x20': { areaPerTile: 0.04, tilesPerBox: 25, pricePerTile: 4 }
    };
    return tileSizes[size];
}

function getInstallData(method, area) {
    if (method === 'adhesive') {
        return {
            cement: 0,
            sand: 0,
            adhesive: Math.ceil(area * 5), // kg per m²
            cost: area * 25
        };
    } else {
        const cementKg = area * 15; // kg per m²
        const cementBags = Math.ceil(cementKg / 50);
        const sandM3 = Math.ceil(area * 0.02); // m³ per m²
        return {
            cement: cementBags,
            sand: sandM3,
            adhesive: 0,
            cost: area * 15
        };
    }
}

function displayTilesResults(results, tileData, area) {
    const resultsDiv = document.getElementById('tilesResults');
    resultsDiv.innerHTML = `
        <div class="results-card">
            <h5><i class="fas fa-border-all"></i> نتائج حساب البلاط</h5>
            <div class="results-grid">
                <div class="result-item">
                    <span class="label">المساحة:</span>
                    <span class="value">${Utils.formatNumber(area)} متر مربع</span>
                </div>
                <div class="result-item">
                    <span class="label">عدد البلاطات:</span>
                    <span class="value">${Utils.formatNumber(results.tiles)} بلاطة</span>
                </div>
                <div class="result-item">
                    <span class="label">عدد الكراتين:</span>
                    <span class="value">${Utils.formatNumber(results.boxes)} كرتونة</span>
                </div>
                ${results.cement > 0 ? `
                <div class="result-item">
                    <span class="label">الأسمنت:</span>
                    <span class="value">${results.cement} شكارة</span>
                </div>` : ''}
                ${results.sand > 0 ? `
                <div class="result-item">
                    <span class="label">الرمل:</span>
                    <span class="value">${results.sand} متر</span>
                </div>` : ''}
                ${results.adhesive > 0 ? `
                <div class="result-item">
                    <span class="label">اللاصق:</span>
                    <span class="value">${Utils.formatNumber(results.adhesive)} كيلو</span>
                </div>` : ''}
                <div class="result-item total">
                    <span class="label">التكلفة التقريبية:</span>
                    <span class="value">${Utils.formatNumber(results.cost)} جنيه</span>
                </div>
            </div>
            <div class="action-buttons">
                <button onclick="downloadTilesPDF()" class="download-btn">
                    <i class="fas fa-download"></i> تحميل PDF
                </button>
                <button onclick="saveTilesCalculation()" class="save-btn">
                    <i class="fas fa-save"></i> حفظ الحساب
                </button>
            </div>
        </div>
    `;
}

// ===== Columns Calculator =====
function calculateColumns() {
    const elementType = document.getElementById('elementType').value;
    const length = parseFloat(document.getElementById('elementLength').value);
    const width = parseFloat(document.getElementById('elementWidth').value);
    const height = parseFloat(document.getElementById('elementHeight').value);
    const count = parseInt(document.getElementById('elementCount').value);

    if (!Utils.validateInput(length) || !Utils.validateInput(width) || !Utils.validateInput(height) || !Utils.validateInput(count, 1)) {
        Utils.showNotification('يرجى إدخال قيم صحيحة لجميع الحقول', 'error');
        return;
    }

    const volume = length * width * height * count;
    const elementData = getElementData(elementType);

    const cementKg = volume * elementData.cement;
    const cementBags = Math.ceil(cementKg / 50);
    const sandM3 = Math.ceil(volume * elementData.sand);
    const gravelM3 = Math.ceil(volume * elementData.gravel);
    const steelKg = volume * elementData.steel;
    const steelRods = Math.ceil(steelKg / 7.4);

    const results = {
        volume: volume,
        concrete: volume * 1.05,
        cement: cementBags,
        sand: sandM3,
        gravel: gravelM3,
        steel: steelKg,
        steelRods: steelRods,
        cost: volume * elementData.costPerM3
    };

    displayColumnsResults(results, elementData, count);
}

function getElementData(type) {
    const elementTypes = {
        column: { 
            name: 'عمود', 
            cement: 400, 
            sand: 0.4, 
            gravel: 0.8, 
            steel: 120,
            costPerM3: 1800 
        },
        foundation: { 
            name: 'قاعدة', 
            cement: 350, 
            sand: 0.45, 
            gravel: 0.85, 
            steel: 80,
            costPerM3: 1500 
        },
        beam: { 
            name: 'كمرة', 
            cement: 380, 
            sand: 0.42, 
            gravel: 0.82, 
            steel: 150,
            costPerM3: 1700 
        }
    };
    return elementTypes[type];
}

function displayColumnsResults(results, elementData, count) {
    const resultsDiv = document.getElementById('columnsResults');
    resultsDiv.innerHTML = `
        <div class="results-card">
            <h5><i class="fas fa-columns"></i> نتائج حساب ${elementData.name}</h5>
            <div class="results-grid">
                <div class="result-item">
                    <span class="label">نوع العنصر:</span>
                    <span class="value">${elementData.name}</span>
                </div>
                <div class="result-item">
                    <span class="label">العدد:</span>
                    <span class="value">${count}</span>
                </div>
                <div class="result-item">
                    <span class="label">الحجم الإجمالي:</span>
                    <span class="value">${Utils.formatNumber(results.volume)} متر مكعب</span>
                </div>
                <div class="result-item">
                    <span class="label">الخرسانة:</span>
                    <span class="value">${Utils.formatNumber(results.concrete)} متر مكعب</span>
                </div>
                <div class="result-item">
                    <span class="label">الأسمنت:</span>
                    <span class="value">${results.cement} شكارة</span>
                </div>
                <div class="result-item">
                    <span class="label">الرمل:</span>
                    <span class="value">${results.sand} متر</span>
                </div>
                <div class="result-item">
                    <span class="label">السن:</span>
                    <span class="value">${results.gravel} متر مكعب</span>
                </div>
                <div class="result-item">
                    <span class="label">الحديد:</span>
                    <span class="value">${Utils.formatNumber(results.steel)} كيلو</span>
                </div>
                <div class="result-item">
                    <span class="label">عدد الأسياخ:</span>
                    <span class="value">${results.steelRods} سيخ</span>
                </div>
                <div class="result-item total">
                    <span class="label">التكلفة التقريبية:</span>
                    <span class="value">${Utils.formatNumber(results.cost)} جنيه</span>
                </div>
            </div>
            <div class="steel-note">
                <small><i class="fas fa-info-circle"></i> ملاحظة: الحساب على أساس أسياخ 12 متر طول</small>
            </div>
            <div class="action-buttons">
                <button onclick="downloadColumnsPDF()" class="download-btn">
                    <i class="fas fa-download"></i> تحميل PDF
                </button>
                <button onclick="saveColumnsCalculation()" class="save-btn">
                    <i class="fas fa-save"></i> حفظ الحساب
                </button>
            </div>
        </div>
    `;
}
