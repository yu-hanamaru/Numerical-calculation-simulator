document.addEventListener('DOMContentLoaded', function() {
    updateMethodSettings();
    updateValue('a');
    updateValue('b');
    updateValue('x0');
    updateValue('epsilon');
    updateValue('max-iterations');
    drawInitialGraph();
});

function updateMethodSettings() {
    const method = document.getElementById('method').value;
    document.getElementById('bisection-settings').style.display = (method === 'bisection') ? 'block' : 'none';
    document.getElementById('newton-settings').style.display = (method === 'newton') ? 'block' : 'none';
    document.getElementById('bisection-explanation').style.display = (method === 'bisection') ? 'block' : 'none';
    document.getElementById('newton-explanation').style.display = (method === 'newton') ? 'block' : 'none';
    drawInitialGraph();
}

function updateValue(id) {
    const value = document.getElementById(id).value;
    document.getElementById(`${id}-value`).textContent = value;
    drawInitialGraph();
}

function reset() {
    document.getElementById('method').value = 'bisection';
    document.getElementById('a').value = -5;
    document.getElementById('b').value = 5;
    document.getElementById('x0').value = 0;
    document.getElementById('epsilon').value = 0.001;
    document.getElementById('max-iterations').value = 50;
    updateMethodSettings();
    updateValue('a');
    updateValue('b');
    updateValue('x0');
    updateValue('epsilon');
    updateValue('max-iterations');
    drawInitialGraph();
}

function clearGraph() {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startSimulation() {
    const method = document.getElementById('method').value;
    const epsilon = parseFloat(document.getElementById('epsilon').value);
    const maxIterations = parseInt(document.getElementById('max-iterations').value);

    startTime = performance.now();

    if (method === 'bisection') {
        const a = parseFloat(document.getElementById('a').value);
        const b = parseFloat(document.getElementById('b').value);
        bisectionMethod(a, b, epsilon, maxIterations);
    } else if (method === 'newton') {
        const x0 = parseFloat(document.getElementById('x0').value);
        newtonMethod(x0, epsilon, maxIterations);
    }
}

function displayCalculationTime(method) {
    endTime = performance.now();  
    const calculationTime = endTime - startTime;
    const timeElement = document.getElementById('calculation-time');
    timeElement.textContent = `${method}の計算時間： ${calculationTime.toFixed(2)} ミリ秒`;
}

function drawInitialGraph() {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    clearGraph();

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.beginPath();
    for (let px = 0; px < width; px++) {
        const x = (px - width / 2) / 30;
        const y = f(x);
        const py = height / 2 - y * 30;
        if (px === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    const method = document.getElementById('method').value;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    if (method === 'bisection') {
        const a = parseFloat(document.getElementById('a').value);
        const b = parseFloat(document.getElementById('b').value);
        ctx.moveTo(a * 30 + width / 2, height / 2);
        ctx.lineTo(a * 30 + width / 2, height / 2 - f(a) * 30);
        ctx.moveTo(b * 30 + width / 2, height / 2);
        ctx.lineTo(b * 30 + width / 2, height / 2 - f(b) * 30);
    } else if (method === 'newton') {
        const x0 = parseFloat(document.getElementById('x0').value);
        ctx.arc(x0 * 30 + width / 2, height / 2 - f(x0) * 30, 3, 0, 2 * Math.PI);
    }
    ctx.stroke();
}

function drawGraph(data, color = 'green') {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.beginPath();
    data.forEach((point, index) => {
        const px = point.x * 50 + width / 2;
        const py = height / 2 - point.y * 50;
        if (index === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    });
    ctx.strokeStyle = color;
    ctx.stroke();
}

function bisectionMethod(a, b, epsilon, maxIterations) {
    const data = [];
    let mid;

    for (let i = 0; i < maxIterations; i++) {
        mid = (a + b) / 2;
        data.push({ x: mid, y: f(mid) });

        if (Math.abs(f(mid)) < epsilon || Math.abs(b - a) < epsilon) break;

        if (f(a) * f(mid) < 0) {
            b = mid;
        } else {
            a = mid;
        }
    }

    drawInitialGraph();
    drawGraph(data);
    displayCalculationTime('二分法'); 
}

function newtonMethod(x0, epsilon, maxIterations) {
    const data = [{ x: x0, y: f(x0) }];
    let x = x0;

    for (let i = 0; i < maxIterations; i++) {
        const fx = f(x);
        const fpx = fp(x);

        if (Math.abs(fx) < epsilon) break;

        x = x - fx / fpx;
        data.push({ x: x, y: f(x) });
    }

    drawInitialGraph();
    drawGraph(data);
    displayCalculationTime('ニュートン法'); 
}

function f(x) {
    return Math.pow(x, 3) - x - 2;  
}

function fp(x) {
    return 3 * Math.pow(x, 2) - 1;  
}