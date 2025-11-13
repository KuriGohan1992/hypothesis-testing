function button_click(className, inputField) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', () => {
            inputField.value = elements[i].innerHTML;
            alternative_hypothesis.innerHTML = `μ ${get_alternative_operator(operator.value)} ${null_hypothesis_value.value}`
        })
    }
}

function showGraphArea(tail, value, z) {
    const left = document.getElementById('leftangle');
    const right = document.getElementById('rightangle');
    
    if (tail === 'left') {
        left.setAttribute('x', `${value * 150}`);
    } else if (tail === 'right') {
        right.setAttribute('x', `${600 + value * 150}`)
    }

    const line = document.getElementById('zline');
    const z_text = document.getElementById('z');
    console.log(z);
    line.setAttribute('x1', `${z * 150 + 600}`)
    line.setAttribute('x2', `${z * 150 + 600}`)
    z_text.setAttribute('x', `${z * 150 + 593}`)
}

function get_alternative_operator(null_operator) {
    if (null_operator === '=') {
        return '≠';
    } else if (null_operator === '≥') {
        return '<';
    } else if (null_operator === '≤') {
        return '>';
    } else {
        return 'Error';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const operator = document.getElementById('operator');
    const null_hypothesis_value = (document.getElementById('null_hypothesis_value'));
    const alternative_hypothesis = document.getElementById('alternative_hypothesis');

    
    button_click('alphas', significance_level);
    button_click('operators', operator);
    
    null_hypothesis_value.oninput = () => {
        alternative_hypothesis.innerHTML = `μ ${get_alternative_operator(operator.value)} ${null_hypothesis_value.value}`
    }
    
    const calculate = document.getElementById('calculate');

    const reset = document.getElementById('reset');

    reset.addEventListener('click', () => {
        document.querySelectorAll('input').forEach(element => {
            element.value = '=';
        });
        showGraphArea('left', -4);
        showGraphArea('right', 4);
        results.innerHTML = '';
        zstatistic.innerHTML = '';        
        critical_value.innerHTML = '';        
        decision.innerHTML = '';

        alternative_hypothesis.innerHTML = `μ ${get_alternative_operator(operator.value)} ${null_hypothesis_value.value}`;
    });
    
    calculate.addEventListener('click', () => {
        const sample_mean = parseFloat(document.getElementById('sample_mean').value);
        const sample_size = parseInt(document.getElementById('sample_size').value);
        const population_standard_deviation = parseFloat(document.getElementById('population_standard_deviation').value);
    
        const significance_level = document.getElementById('significance_level');
        const results = document.getElementById('results');
        const zstatistic = document.getElementById('zstatistic');
        const critical_value = document.getElementById('critical_value');
        const decision = document.getElementById('decision');


        const null_hypothesis = parseFloat(null_hypothesis_value.value);
        const alpha = parseFloat(significance_level.value);

        const z = (sample_mean - null_hypothesis) / (population_standard_deviation/Math.sqrt(sample_size));
        let reject = false;

        if (operator.value === '=') {
            critical = jStat.normal.inv(1 - (alpha / 2), 0, 1);
            showGraphArea('left', -critical, z);
            showGraphArea('right', critical, z);
            if (z <= -critical || z >= critical) {
                reject = true;
            }
        } else if (operator.value === '≥') {
            critical = -jStat.normal.inv(1 - alpha, 0, 1);
            showGraphArea('left', critical, z);
            if (z <= critical) {
                reject = true;
            }
        } else if (operator.value === '≤') {
            critical = jStat.normal.inv(1 - alpha, 0, 1);
            showGraphArea('right', critical, z);
            if (z >= critical) {
                reject = true;
            }
        }

        results.innerHTML = 'Results: ';
        zstatistic.innerHTML = `Z-Statistic: ${z.toFixed(4)}`;
        if (operator.value === '=') {            
            critical_value.innerHTML = `Critical Value: ±${critical.toFixed(4)}`;
        } else {
            critical_value.innerHTML = `Critical Value: ${critical.toFixed(4)}`;
        }
        if (reject === true) {
            decision.innerHTML = 'Decision: Reject Null Hypothesis';
        } else {
            decision.innerHTML = 'Decision: Fail to Reject Null Hypothesis';

        }
    })
})