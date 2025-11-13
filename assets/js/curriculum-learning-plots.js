// Curriculum Learning Experiment Data and Plotting
// Data exported from experiments on 2025-11-13

const experimentData = {
  models: ['PHI-2', 'SmolLM2'],

  // Baseline and final results
  results: {
    'PHI-2': {
      baseline: 60.16,
      answerLength: 59.38,
      complexityScore: 62.50
    },
    'SmolLM2': {
      baseline: 2.15,
      answerLength: 2.73,
      complexityScore: 2.93
    }
  },

  // Curriculum progression by stage
  progression: {
    'PHI-2': {
      answerLength: {
        easy: 50.59,
        normal: 55.86,
        difficult: 59.38
      },
      complexityScore: {
        easy: 54.10,
        normal: 59.38,
        difficult: 62.50
      }
    },
    'SmolLM2': {
      answerLength: {
        easy: 2.54,
        normal: 3.71,
        difficult: 2.73
      },
      complexityScore: {
        easy: 3.32,
        normal: 2.54,
        difficult: 2.93
      }
    }
  }
};

// Color scheme
const colors = {
  baseline: '#2E86AB',
  answerLength: '#A23B72',
  complexityScore: '#F18F01',
  easy: '#06A77D',
  normal: '#F4B942',
  difficult: '#D62246'
};

// Plot 1: Baseline Comparison
function plotBaselineComparison() {
  const methods = ['Baseline', 'Answer Length\nCurriculum', 'Complexity Score\nCurriculum'];

  const phi2Trace = {
    x: methods,
    y: [
      experimentData.results['PHI-2'].baseline,
      experimentData.results['PHI-2'].answerLength,
      experimentData.results['PHI-2'].complexityScore
    ],
    name: 'PHI-2 (2.7B)',
    type: 'bar',
    marker: { color: colors.baseline },
    text: ['60.16%', '59.38%', '62.50%'],
    textposition: 'outside',
    hovertemplate: '<b>PHI-2</b><br>%{x}<br>Accuracy: %{y:.2f}%<extra></extra>'
  };

  const smollm2Trace = {
    x: methods,
    y: [
      experimentData.results['SmolLM2'].baseline,
      experimentData.results['SmolLM2'].answerLength,
      experimentData.results['SmolLM2'].complexityScore
    ],
    name: 'SmolLM2 (135M)',
    type: 'bar',
    marker: { color: colors.answerLength },
    text: ['2.15%', '2.73%', '2.93%'],
    textposition: 'outside',
    hovertemplate: '<b>SmolLM2</b><br>%{x}<br>Accuracy: %{y:.2f}%<extra></extra>'
  };

  const layout = {
    title: {
      text: 'Baseline vs Curriculum Learning Performance',
      font: { size: 18, family: 'Arial, sans-serif' }
    },
    xaxis: {
      title: 'Training Method',
      tickfont: { size: 12 }
    },
    yaxis: {
      title: 'Exact Match Accuracy (%)',
      tickfont: { size: 12 }
    },
    barmode: 'group',
    plot_bgcolor: '#f8f9fa',
    paper_bgcolor: 'white',
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#ccc',
      borderwidth: 1
    },
    margin: { t: 60, r: 20, b: 80, l: 60 },
    font: { family: 'Arial, sans-serif' }
  };

  const config = { responsive: true, displayModeBar: true, displaylogo: false };
  Plotly.newPlot('plot-baseline-comparison', [phi2Trace, smollm2Trace], layout, config);
}

// Plot 2: Curriculum Progression
function plotCurriculumProgression() {
  const stages = ['Easy', 'Normal', 'Difficult'];

  // PHI-2 Answer Length
  const phi2AnswerLength = {
    x: stages,
    y: [
      experimentData.progression['PHI-2'].answerLength.easy,
      experimentData.progression['PHI-2'].answerLength.normal,
      experimentData.progression['PHI-2'].answerLength.difficult
    ],
    name: 'PHI-2: Answer Length',
    type: 'scatter',
    mode: 'lines+markers',
    line: { width: 3, color: colors.answerLength },
    marker: { size: 10, color: colors.answerLength },
    hovertemplate: '<b>PHI-2 Answer Length</b><br>Stage: %{x}<br>Accuracy: %{y:.2f}%<extra></extra>'
  };

  // PHI-2 Complexity Score
  const phi2Complexity = {
    x: stages,
    y: [
      experimentData.progression['PHI-2'].complexityScore.easy,
      experimentData.progression['PHI-2'].complexityScore.normal,
      experimentData.progression['PHI-2'].complexityScore.difficult
    ],
    name: 'PHI-2: Complexity Score',
    type: 'scatter',
    mode: 'lines+markers',
    line: { width: 3, color: colors.complexityScore },
    marker: { size: 10, color: colors.complexityScore },
    hovertemplate: '<b>PHI-2 Complexity Score</b><br>Stage: %{x}<br>Accuracy: %{y:.2f}%<extra></extra>'
  };

  // Baseline reference line
  const baseline = {
    x: stages,
    y: [60.16, 60.16, 60.16],
    name: 'PHI-2 Baseline',
    type: 'scatter',
    mode: 'lines',
    line: { width: 2, dash: 'dash', color: colors.baseline },
    hovertemplate: '<b>PHI-2 Baseline</b><br>Accuracy: 60.16%<extra></extra>'
  };

  const layout = {
    title: {
      text: 'PHI-2 Performance Across Curriculum Stages',
      font: { size: 18, family: 'Arial, sans-serif' }
    },
    xaxis: {
      title: 'Curriculum Stage',
      tickfont: { size: 12 }
    },
    yaxis: {
      title: 'Exact Match Accuracy (%)',
      range: [48, 65],
      tickfont: { size: 12 }
    },
    plot_bgcolor: '#f8f9fa',
    paper_bgcolor: 'white',
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#ccc',
      borderwidth: 1
    },
    margin: { t: 60, r: 20, b: 60, l: 60 },
    font: { family: 'Arial, sans-serif' }
  };

  const config = { responsive: true, displayModeBar: true, displaylogo: false };
  Plotly.newPlot('plot-curriculum-progression', [phi2AnswerLength, phi2Complexity, baseline], layout, config);
}

// Plot 3: Method Comparison
function plotMethodComparison() {
  const methods = ['Baseline', 'Answer Length', 'Complexity Score'];

  const phi2Values = [
    experimentData.results['PHI-2'].baseline,
    experimentData.results['PHI-2'].answerLength,
    experimentData.results['PHI-2'].complexityScore
  ];

  const phi2Colors = phi2Values.map((val, idx) => {
    if (idx === 0) return colors.baseline;
    return val < phi2Values[0] ? '#D62246' : '#06A77D';
  });

  const phi2Trace = {
    x: methods,
    y: phi2Values,
    name: 'PHI-2',
    type: 'bar',
    marker: {
      color: phi2Colors,
      line: { color: '#333', width: 1.5 }
    },
    text: phi2Values.map(v => v.toFixed(2) + '%'),
    textposition: 'outside',
    hovertemplate: '<b>PHI-2</b><br>%{x}<br>Accuracy: %{y:.2f}%<extra></extra>'
  };

  const smollm2Values = [
    experimentData.results['SmolLM2'].baseline,
    experimentData.results['SmolLM2'].answerLength,
    experimentData.results['SmolLM2'].complexityScore
  ];

  const smollm2Colors = smollm2Values.map((val, idx) => {
    if (idx === 0) return colors.baseline;
    return val < smollm2Values[0] ? '#D62246' : '#06A77D';
  });

  const smollm2Trace = {
    x: methods,
    y: smollm2Values,
    name: 'SmolLM2',
    type: 'bar',
    marker: {
      color: smollm2Colors,
      line: { color: '#333', width: 1.5 }
    },
    text: smollm2Values.map(v => v.toFixed(2) + '%'),
    textposition: 'outside',
    hovertemplate: '<b>SmolLM2</b><br>%{x}<br>Accuracy: %{y:.2f}%<extra></extra>'
  };

  const layout = {
    title: {
      text: 'Final Performance Comparison by Method',
      font: { size: 18, family: 'Arial, sans-serif' }
    },
    xaxis: {
      title: 'Training Method',
      tickfont: { size: 12 }
    },
    yaxis: {
      title: 'Exact Match Accuracy (%)',
      tickfont: { size: 12 }
    },
    barmode: 'group',
    plot_bgcolor: '#f8f9fa',
    paper_bgcolor: 'white',
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#ccc',
      borderwidth: 1
    },
    margin: { t: 60, r: 20, b: 80, l: 60 },
    font: { family: 'Arial, sans-serif' },
    annotations: [
      {
        x: 1,
        y: experimentData.results['PHI-2'].answerLength,
        text: '-0.78%',
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -40,
        font: { color: '#D62246', size: 12, family: 'Arial, sans-serif' }
      },
      {
        x: 2,
        y: experimentData.results['PHI-2'].complexityScore,
        text: '+2.34%',
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -40,
        font: { color: '#06A77D', size: 12, family: 'Arial, sans-serif' }
      }
    ]
  };

  const config = { responsive: true, displayModeBar: true, displaylogo: false };
  Plotly.newPlot('plot-method-comparison', [phi2Trace, smollm2Trace], layout, config);
}

// Plot 4: Performance Heatmap
function plotPerformanceHeatmap() {
  const zData = [
    [60.16, 59.38, 62.50],  // PHI-2
    [2.15, 2.73, 2.93]       // SmolLM2
  ];

  const trace = {
    z: zData,
    x: ['Baseline', 'Answer Length', 'Complexity Score'],
    y: ['PHI-2 (2.7B)', 'SmolLM2 (135M)'],
    type: 'heatmap',
    colorscale: [
      [0, '#f7fbff'],
      [0.2, '#deebf7'],
      [0.4, '#c6dbef'],
      [0.6, '#9ecae1'],
      [0.8, '#6baed6'],
      [1, '#2171b5']
    ],
    text: zData.map(row => row.map(val => val.toFixed(2) + '%')),
    texttemplate: '%{text}',
    textfont: { size: 14, family: 'Arial, sans-serif' },
    hovertemplate: '<b>%{y}</b><br>Method: %{x}<br>Accuracy: %{z:.2f}%<extra></extra>',
    showscale: true,
    colorbar: {
      title: 'Accuracy (%)',
      titleside: 'right',
      tickfont: { size: 12 }
    }
  };

  const layout = {
    title: {
      text: 'Performance Heatmap: Model × Training Method',
      font: { size: 18, family: 'Arial, sans-serif' }
    },
    xaxis: {
      title: 'Training Method',
      tickfont: { size: 12 },
      side: 'bottom'
    },
    yaxis: {
      title: '',
      tickfont: { size: 12 }
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    margin: { t: 60, r: 120, b: 80, l: 120 },
    font: { family: 'Arial, sans-serif' }
  };

  const config = { responsive: true, displayModeBar: true, displaylogo: false };
  Plotly.newPlot('plot-performance-heatmap', [trace], layout, config);
}

// Plot 5: Improvement Over Baseline
function plotImprovementOverBaseline() {
  const methods = ['Answer Length', 'Complexity Score'];

  const phi2Improvements = [
    experimentData.results['PHI-2'].answerLength - experimentData.results['PHI-2'].baseline,
    experimentData.results['PHI-2'].complexityScore - experimentData.results['PHI-2'].baseline
  ];

  const phi2Colors = phi2Improvements.map(val => val < 0 ? '#D62246' : '#06A77D');

  const phi2Trace = {
    x: methods,
    y: phi2Improvements,
    name: 'PHI-2 (2.7B)',
    type: 'bar',
    marker: {
      color: phi2Colors,
      line: { color: '#333', width: 1.5 }
    },
    text: phi2Improvements.map(v => (v > 0 ? '+' : '') + v.toFixed(2) + '%'),
    textposition: 'outside',
    hovertemplate: '<b>PHI-2</b><br>%{x}<br>Change: %{y:.2f}%<extra></extra>'
  };

  const smollm2Improvements = [
    experimentData.results['SmolLM2'].answerLength - experimentData.results['SmolLM2'].baseline,
    experimentData.results['SmolLM2'].complexityScore - experimentData.results['SmolLM2'].baseline
  ];

  const smollm2Colors = smollm2Improvements.map(val => val < 0 ? '#D62246' : '#06A77D');

  const smollm2Trace = {
    x: methods,
    y: smollm2Improvements,
    name: 'SmolLM2 (135M)',
    type: 'bar',
    marker: {
      color: smollm2Colors,
      line: { color: '#333', width: 1.5 }
    },
    text: smollm2Improvements.map(v => (v > 0 ? '+' : '') + v.toFixed(2) + '%'),
    textposition: 'outside',
    hovertemplate: '<b>SmolLM2</b><br>%{x}<br>Change: %{y:.2f}%<extra></extra>'
  };

  const layout = {
    title: {
      text: 'Improvement Over Baseline',
      font: { size: 18, family: 'Arial, sans-serif' }
    },
    xaxis: {
      title: 'Curriculum Method',
      tickfont: { size: 12 }
    },
    yaxis: {
      title: 'Accuracy Change (%)',
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: '#333',
      tickfont: { size: 12 }
    },
    barmode: 'group',
    plot_bgcolor: '#f8f9fa',
    paper_bgcolor: 'white',
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#ccc',
      borderwidth: 1
    },
    margin: { t: 60, r: 20, b: 80, l: 60 },
    font: { family: 'Arial, sans-serif' }
  };

  const config = { responsive: true, displayModeBar: true, displaylogo: false };
  Plotly.newPlot('plot-improvement-over-baseline', [phi2Trace, smollm2Trace], layout, config);
}

// Initialize all plots when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Check if Plotly is loaded
  if (typeof Plotly === 'undefined') {
    console.error('Plotly.js is not loaded. Please include the Plotly.js library.');
    return;
  }

  // Render plots if containers exist
  if (document.getElementById('plot-baseline-comparison')) {
    plotBaselineComparison();
  }
  if (document.getElementById('plot-curriculum-progression')) {
    plotCurriculumProgression();
  }
  if (document.getElementById('plot-method-comparison')) {
    plotMethodComparison();
  }
  if (document.getElementById('plot-performance-heatmap')) {
    plotPerformanceHeatmap();
  }
  if (document.getElementById('plot-improvement-over-baseline')) {
    plotImprovementOverBaseline();
  }

  // Make plots responsive on window resize
  window.addEventListener('resize', function() {
    const plots = [
      'plot-baseline-comparison',
      'plot-curriculum-progression',
      'plot-method-comparison',
      'plot-performance-heatmap',
      'plot-improvement-over-baseline'
    ];

    plots.forEach(plotId => {
      const element = document.getElementById(plotId);
      if (element) {
        Plotly.Plots.resize(element);
      }
    });
  });
});
