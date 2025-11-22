---
title: "Curriculum Learning for Mathematical Reasoning: Why Design Matters More Than You Think"
date: 2025-11-13
permalink: /blog/2025/11/curriculum-learning-math-reasoning/
tags:
  - curriculum-learning
  - large-language-models
  - mathematical-reasoning
  - deep-learning
  - gsm8k
excerpt: "I trained two language models on math problems using curriculum learning with different difficulty estimation methods. The surprising finding? The wrong curriculum can actually hurt performance. Here's what I learned about training LLMs for mathematical reasoning."
---

# TL;DR
I fine-tuned two models (PHI-2 and a 135M smolLM2) using curriculum learning, and here’s what stood out:

- Curriculum design matters — the complexity-based curriculum consistently outperformed the naive answer-length curriculum.

- PHI-2 improved notably: the advanced curriculum boosted answer accuracy by +1.37% and even slightly improved formatting accuracy (+0.59%) at the Normal stage.

- Naive (answer-length) curriculum hurt performance, reducing PHI-2 answer accuracy by up to -3.51% and formatting accuracy by -12% depending on stage.

- Small models (135M) didn’t benefit — smolLM2 showed no positive gains across any curriculum or stage, implying curriculum learning is more effective for medium-sized models.

# Introduction
Curriculum-learning based fine-tuning is an approach that is inspired by traditional human studying fashion: incrementally increase the difficulty of studying materials. For example: first kids learn basic math operations in school, then they study more complex concepts like functions, then more complex operations like derivation and integration.
Current project is built on the same principle: split math tasks by difficulty and fine-tune the model in a complexity increasing curriculum. This small study tries to answer the question: Does curriculum-learning improve fine-tuning performance of LLMs?

# Dataset

I was interested to know how well can LLMs solve maths tasks, so gsm8k was chosen as a dataset because it's popular, contains enough samples and good answers. Also, it doens't contain very complex operations, but rather tests the resononing ability of models.

Gsm8k has 2 variations: main and socratic with loger reasoning and socratic-style questions. Each of variations contains 7473 train samples and 1319 test samples. For my experiments main version was chosen as the importance of socratic-style questions in resoning chain is a subject to investigate in the future. For now, I wanted a more simple setup.

Example of train sample from main variant of gsm8k dataset
```python
{
    'question': 'Natalia sold clips to 48 of her friends in April, and then she sold half as many clips in May. How many clips did Natalia sell altogether in April and May?',
    'answer': 'Natalia sold 48/2 = <<48/2=24>>24 clips in May.\nNatalia sold 48+24 = <<48+24=72>>72 clips altogether in April and May.\n#### 72',
}
```

# Curriculum composition

As will be evident from experimental results in the following sections, composition of the curriculum, i.e. the condition for splitting the dataset samples into categories of difficulty can either improve model's fine-tuning performance or make model worse than the baseline, so it's cruscial to develop a strategy for effective dataset split.

## 1. Naive approach - Answer Length

One of the first ideas that came up was to split the dataset based on the answer length, as it seems intuitive that the logner the qustion the more difficult it is. After creating a histogram of quesntion lenghts in the dataset, it looked like a normal distibution, so I decieded to split dataset lengths into percentiles where the 50% of samples belong to 'normal' difficulty and 25% for 'easy' and 'difficult'.

![Answer Length Distribution](/images/blog/curriculum-learning/Answer_Length_distribution.png "Answer Length Distribution")
```plotly
{
  "data": [
    {
      "x": [69.6, 108.9, 148.2, 187.4, 226.7, 266.0, 305.2, 344.5, 383.8, 423.0, 462.3, 501.6, 540.8, 580.1, 619.4, 658.6, 697.9, 737.2, 776.4, 815.7, 855.0, 894.2, 933.5, 972.8, 1012.0, 1051.3, 1090.6, 1129.9, 1169.1, 1208.4],
      "y": [107, 519, 862, 1022, 994, 825, 708, 616, 469, 357, 249, 210, 156, 110, 76, 55, 31, 38, 25, 10, 10, 5, 5, 7, 4, 0, 0, 1, 0, 2],
      "type": "bar",
      "name": "Frequency",
      "marker": {
        "color": "rgba(31, 119, 180, 0.75)"
      }
    }
  ],
  "layout": {
    "title": {
      "text": "Answer Length Distribution",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": "Answer Length"
    },
    "yaxis": {
      "title": "Frequency",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "shapes": [
      {
        "type": "line",
        "x0": 168,
        "x1": 168,
        "y0": 0,
        "y1": 1,
        "yref": "paper",
        "line": {
          "color": "red",
          "width": 2,
          "dash": "dash"
        }
      },
      {
        "type": "line",
        "x0": 280,
        "x1": 280,
        "y0": 0,
        "y1": 1,
        "yref": "paper",
        "line": {
          "color": "orange",
          "width": 2,
          "dash": "dash"
        }
      }
    ],
    "annotations": [
      {
        "x": 168,
        "y": 1,
        "yref": "paper",
        "text": "Easy–Normal (168)",
        "showarrow": false,
        "yshift": 10,
        "font": {
          "color": "red"
        }
      },
      {
        "x": 280,
        "y": 1,
        "yref": "paper",
        "text": "Normal–Difficult (280)",
        "showarrow": false,
        "yshift": 10,
        "font": {
          "color": "orange"
        }
      }
    ]
  }
}
```
Number of samples in each category:
```python
easy: 1488 samples
normal: 2737 samples
difficult: 3248 samples
```


## 2. Composed approach - Complexity Score

For the more advanced option, I decided to use some kind of a composition of several scores. More specifically, to me it seemed resonable to use length of the answer (l_a), difficulty of mathematical operations in question (op_q), and amount of numbers in question (n_q).
Eventually I came up with this formula for the question difficulty estimation:

```
sample_difficulty = l_a + (op_q * n_q)
```

also, difficulty of mathematical operations (op_q) is a weighted composition of amounts of different math operations:

```
op_q = additions + subtractions + (multiplications * 1.5) + (divisions * 1.5).
```

After calculating the score of each sample, all samples were equally splitted into 3 categories ('easy','normal','difficult') with 2491 sampels in each category.

Samples difficulties range from 3 to 137, where lower score represents easier task.
Distribution of samples difficulties is presented in the follwoing figure:

![Complexity Score Distribution](/images/blog/curriculum-learning/Complexity_Score_distribution.png "Complexity Score Distribution")
```plotly
{
  "data": [
    {
      "x": [5.2, 9.7, 14.2, 18.6, 23.1, 27.6, 32.0, 36.5, 41.0, 45.4, 49.9, 54.4, 58.9, 63.3, 67.8, 72.2, 76.7, 81.2, 85.6, 90.1, 94.6, 99.0, 103.5, 108.0, 112.4, 116.9, 121.3, 125.8, 130.3, 134.8],
      "y": [1872, 2332, 1332, 657, 440, 252, 181, 105, 75, 50, 52, 38, 24, 13, 15, 7, 4, 5, 1, 3, 2, 3, 1, 0, 4, 0, 1, 2, 0, 2],
      "type": "bar",
      "name": "Frequency",
      "marker": {
        "color": "rgba(31, 119, 180, 0.75)"
      }
    }
  ],
  "layout": {
    "title": {
      "text": "Complexity Score Distribution",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": "Complexity Score"
    },
    "yaxis": {
      "title": "Frequency",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "shapes": [
      {
        "type": "line",
        "x0": 8,
        "x1": 8,
        "y0": 0,
        "y1": 1,
        "yref": "paper",
        "line": {
          "color": "red",
          "width": 2,
          "dash": "dash"
        }
      },
      {
        "type": "line",
        "x0": 14,
        "x1": 14,
        "y0": 0,
        "y1": 1,
        "yref": "paper",
        "line": {
          "color": "orange",
          "width": 2,
          "dash": "dash"
        }
      }
    ],
    "annotations": [
      {
        "x": 8,
        "y": 1,
        "yref": "paper",
        "text": "Easy–Normal (8)",
        "showarrow": false,
        "yshift": 10,
        "font": {
          "color": "red"
        }
      },
      {
        "x": 14,
        "y": 1,
        "yref": "paper",
        "text": "Normal–Difficult (14)",
        "showarrow": false,
        "yshift": 10,
        "font": {
          "color": "orange"
        }
      }
    ]
  }
}
```
Number of samples in each category:
```python
easy: 2491 samples
normal: 2491 samples
difficult: 2491 samples
```

Sample from 'easy' category:
```python
{
    'question': 'A carpenter made ten tables for this month. Last month, he made three fewer tables than this month. How many tables did the carpenter make in total?', 
    'answer': 'The carpenter made 10 - 3 = <<10-3=7>>7 tables last month.\nSo, the carpenter made 10 + 7 = <<10+7=17>>17 tables in all.\n#### 17'
}
copmlexity_score = 3.0
```


Sample from 'normal' category:
```python
{
    'question': 'Michael bought 6 crates of egg on Tuesday. He gave out 2 crates to Susan, who he admires and bought another 5 crates on Thursday. If one crate holds 30 eggs, how many eggs does he have now?', 
    'answer': 'He had 6 crates and then gave out 2 so he now has 6-2 = <<6-2=4>>4 crates left\nHe bought an additional 5 crates for a total of 4+5 = <<4+5=9>>9 crates\nEach crate has 30 eggs so he has 30*9 = <<30*9=270>>270 eggs\n#### 270'
}
copmlexity_score = 8
```

Sample from 'difficult' category:
```python
{
    'question': 'Mr. Ha owns 5 more silver dollars than Mr. Phung. Mr. Phung has 16 more silver dollars than Mr. Chiu has. If Mr. Chiu has 56 silver dollars, how many silver dollars the three have in total?', 
    'answer': 'Mr. Chiu has 56 silver dollars.\nIf Mr. Phung has 16 more silver dollars than Mr. Chiu, then his total silver dollars is 56+16 = <<16+56=72>>72\nThe total number of silver dollars that Mr. Ha owns is 72 +5= <<72+5=77>>77\nCombined, together they have 77+72+56 = <<77+72+56=205>>205 silver dollars\n#### 205'
}
copmlexity_score = 14.0
```


# Experiments

## Fine-tuning

Models were fine-tuned with Huggingface SFTTrainer with the following settings:

```python
training_args = SFTConfig(
        per_device_train_batch_size=16,
        gradient_accumulation_steps=4,
        learning_rate=3e-4,
        num_train_epochs=2,
        fp16=True,
        max_length=512,
        packing=False,
        dataset_text_field="text",
        load_best_model_at_end=False,
        gradient_checkpointing=True,
        gradient_checkpointing_kwargs={"use_reentrant": False}
    )
```

Also I used the following configuration of LoRA using PEFT:

```python
lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.1,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"]
    )
```


## Models selection
For comparison, 2 models were chosen:
small smolLm2 with 135M parameters and middle-size model - phi2 from microsoft with 2.7B parameters.


## Evaluation

For evaluation, we used comparison of model's prediction with the actual answer. In order to use this evaluation model had to learn a dataset formatting - '####' in the end after wich the numerical answer is provided.


# Results

## Baseline
Baseline results are based on the regular fine-tuning of models on the whole dataset.
PHI2 demonstrated 30.27% answer accuracy and 97.07% formatting accuracy, whereas smolLM2 2.54% answer accuracy and 72.46% formatting accuracy

![Baseline Fine-Tuning Results](/images/blog/curriculum-learning/Baseline.png "Baseline Fine-Tuning Results")

```plotly
{
  "data": [
    {
      "x": ["PHI-2", "SmolLM2"],
      "y": [30.27, 2.54],
      "type": "bar",
      "name": "Exact Match",
      "marker": {
        "color": "rgba(31, 119, 180, 0.85)"
      },
      "text": ["30.3", "2.5"],
      "textposition": "outside"
    },
    {
      "x": ["PHI-2", "SmolLM2"],
      "y": [97.07, 72.46],
      "type": "bar",
      "name": "Correct Formatting",
      "marker": {
        "color": "rgba(255, 127, 14, 0.85)"
      },
      "text": ["97.1", "72.5"],
      "textposition": "outside"
    }
  ],
  "layout": {
    "title": {
      "text": "Baseline Fine-Tuning Results",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": ""
    },
    "yaxis": {
      "title": "Percentage",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "barmode": "group"
  }
}
```

## Curriculum learning

The naive (answer length-based) fine-tuning approach has shown the following results:

- After 'easy' stage:
smolLM2: 0.98 (-1.56%) - answer accuracy, 11.72 (-60.74%) - formatting accuracy; 
PHI2: 26.76 (-3.51%) - answer accuracy, 84.77 (-12.30%) - formatting accuracy

- After 'normal' stage:
smolLM2: 1.56 (-0.98%) - answer accuracy, 58.40 (-14.06%) - formatting accuracy
PHI2: 29.49 (-0.78%) - answer accuracy, 85.94 (-11.13%) - formatting accuracy


- After 'difficult' stage:
smolLM2: 0.98 (-1.56%) - answer accuracy, 68.36 (-4.10%) - formatting accuracy
PHI2: 29.88 (-0.39%) - answer accuracy, 91.6 (-5.47%) - formatting accuracy

![Answer Length Training Results](/images/blog/curriculum-learning/Answer_Length.png "Answer Length Training Results")

```plotly
{
  "data": [
    {
      "x": ["PHI-2", "SmolLM2"],
      "y": [29.88, 0.98],
      "type": "bar",
      "name": "Exact Match",
      "marker": {
        "color": "rgba(31, 119, 180, 0.85)"
      },
      "text": ["29.9", "1.0"],
      "textposition": "outside"
    },
    {
      "x": ["PHI-2", "SmolLM2"],
      "y": [91.60, 68.36],
      "type": "bar",
      "name": "Correct Formatting",
      "marker": {
        "color": "rgba(255, 127, 14, 0.85)"
      },
      "text": ["91.6", "68.4"],
      "textposition": "outside"
    }
  ],
  "layout": {
    "title": {
      "text": "Answer Length Training Results",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": ""
    },
    "yaxis": {
      "title": "Percentage",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "barmode": "group"
  }
}
```

For the more advanced curriculum results are:

- After 'easy' stage:
smolLM2: 1.17 (-1.37%) - answer accuracy, 24.80 (-47.66%) - formatting accuracy;
PHI2: 27.34 (-2.93%) - answer accuracy, 93.95 (-3.12%) - formatting accuracy

- After 'normal' stage:
smolLM2: 1.37 (-1.17%) - answer accuracy, 54.88 (-17.58%) - formatting accuracy;
PHI2: 28.91 (-1.36%) - answer accuracy, 97.66 (+0.59%) - formatting accuracy

- After 'difficult' stage:
smolLM2: 1.56 (-0.98%) - answer accuracy, 65.63 (-6.83%) - formatting accuracy;
PHI2: 31.64 (+1.37%) - answer accuracy, 96.29 (-0.78%) - formatting accuracy

![Complexity Score Training Results](/images/blog/curriculum-learning/Complexity_Score.png "Complexity Score Training Results")

```plotly
{
  "data": [
    {
      "x": ["PHI-2", "SmolLM2"],
      "y": [31.64, 1.56],
      "type": "bar",
      "name": "Exact Match",
      "marker": {
        "color": "rgba(31, 119, 180, 0.85)"
      },
      "text": ["31.6", "1.6"],
      "textposition": "outside"
    },
    {
      "x": ["PHI-2", "SmolLM2"],
      "y": [96.29, 65.63],
      "type": "bar",
      "name": "Correct Formatting",
      "marker": {
        "color": "rgba(255, 127, 14, 0.85)"
      },
      "text": ["96.3", "65.6"],
      "textposition": "outside"
    }
  ],
  "layout": {
    "title": {
      "text": "Complexity Score Training Results",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": ""
    },
    "yaxis": {
      "title": "Percentage",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "barmode": "group"
  }
}
```


### Naive (Answer Length-Based) Fine-Tuning Results

| Stage      | Model     | Answer Accuracy | Change (%) | Formatting Accuracy | Change (%) |
|-----------|----------|----------------|------------|-------------------|------------|
| Easy      | smolLM2  | 0.98           | -1.56%     | 11.72             | -60.74%    |
|           | PHI2     | 26.76          | -3.51%     | 84.77             | -12.30%    |
| Normal    | smolLM2  | 1.56           | -0.98%     | 58.40             | -14.06%    |
|           | PHI2     | 29.49          | -0.78%     | 85.94             | -11.13%    |
| Difficult | smolLM2  | 0.98           | -1.56%     | 68.36             | -4.10%     |
|           | PHI2     | 29.88          | -0.39%     | 91.60             | -5.47%     |

### Advanced Curriculum Fine-Tuning Results

| Stage      | Model     | Answer Accuracy | Change (%) | Formatting Accuracy | Change (%) |
|-----------|----------|----------------|------------|-------------------|------------|
| Easy      | smolLM2  | 1.17           | -1.37%     | 24.80             | -47.66%    |
|           | PHI2     | 27.34          | -2.93%     | 93.95             | -3.12%     |
| Normal    | smolLM2  | 1.37           | -1.17%     | 54.88             | -17.58%    |
|           | PHI2     | 28.91          | -1.36%     | 97.66             | **+0.59%**     |
| Difficult | smolLM2  | 1.56           | -0.98%     | 65.63             | -6.83%     |
|           | PHI2     | 31.64          | **+1.37%**     | 96.29             | -0.78%     |

```plotly
{
  "data": [
    {
      "x": ["Baseline", "Answer Length", "Complexity Score"],
      "y": [30.27, 29.88, 31.64],
      "type": "bar",
      "name": "PHI-2",
      "marker": {
        "color": "rgba(46, 134, 171, 0.85)"
      },
      "text": ["30.27%", "29.88%", "31.64%"],
      "textposition": "outside"
    },
    {
      "x": ["Baseline", "Answer Length", "Complexity Score"],
      "y": [2.54, 0.98, 1.56],
      "type": "bar",
      "name": "SmolLM2",
      "marker": {
        "color": "rgba(162, 59, 114, 0.85)"
      },
      "text": ["2.54%", "0.98%", "1.56%"],
      "textposition": "outside"
    }
  ],
  "layout": {
    "title": {
      "text": "Exact Match Accuracy: Baseline vs Curriculum Learning",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": "Training Method"
    },
    "yaxis": {
      "title": "Exact Match Accuracy (%)",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "barmode": "group"
  }
}
```

![Answer Length Training Progression](/images/blog/curriculum-learning/Answer_Length_iterative.png "Answer Length Training Progression")
```plotly
{
  "data": [
    {
      "x": ["Easy", "Normal", "Difficult"],
      "y": [26.76, 29.49, 29.88],
      "type": "bar",
      "name": "Exact Match",
      "marker": {
        "color": "rgba(31, 119, 180, 0.8)"
      },
      "text": ["26.8", "29.5", "29.9"],
      "textposition": "outside"
    },
    {
      "x": ["Easy", "Normal", "Difficult"],
      "y": [84.77, 85.94, 91.60],
      "type": "bar",
      "name": "Correct Formatting",
      "marker": {
        "color": "rgba(255, 127, 14, 0.8)"
      },
      "text": ["84.8", "85.9", "91.6"],
      "textposition": "outside"
    }
  ],
  "layout": {
    "title": {
      "text": "PHI-2: Answer Length Progression",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": ""
    },
    "yaxis": {
      "title": "Percentage",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "barmode": "group",
    "shapes": [
      {
        "type": "line",
        "x0": -0.5,
        "x1": 2.5,
        "y0": 30.27,
        "y1": 30.27,
        "line": {
          "color": "magenta",
          "width": 2,
          "dash": "dash"
        }
      },
      {
        "type": "line",
        "x0": -0.5,
        "x1": 2.5,
        "y0": 97.07,
        "y1": 97.07,
        "line": {
          "color": "rgba(31, 119, 180, 0.7)",
          "width": 2,
          "dash": "dash"
        }
      }
    ],
    "annotations": [
      {
        "x": 2.5,
        "y": 30.27,
        "text": "Baseline Exact Match",
        "showarrow": false,
        "xshift": 100,
        "font": {
          "size": 10,
          "color": "magenta"
        }
      },
      {
        "x": 2.5,
        "y": 97.07,
        "text": "Baseline Formatting",
        "showarrow": false,
        "xshift": 90,
        "font": {
          "size": 10,
          "color": "rgba(31, 119, 180, 0.7)"
        }
      }
    ]
  }
}
```
```plotly
{
  "data": [
    {
      "x": ["Easy", "Normal", "Difficult"],
      "y": [0.98, 1.56, 0.98],
      "type": "bar",
      "name": "Exact Match",
      "marker": {
        "color": "rgba(31, 119, 180, 0.8)"
      },
      "text": ["1.0", "1.6", "1.0"],
      "textposition": "outside"
    },
    {
      "x": ["Easy", "Normal", "Difficult"],
      "y": [11.72, 58.40, 68.36],
      "type": "bar",
      "name": "Correct Formatting",
      "marker": {
        "color": "rgba(255, 127, 14, 0.8)"
      },
      "text": ["11.7", "58.4", "68.4"],
      "textposition": "outside"
    }
  ],
  "layout": {
    "title": {
      "text": "SmolLM2: Answer Length Progression",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": ""
    },
    "yaxis": {
      "title": "Percentage",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "barmode": "group",
    "shapes": [
      {
        "type": "line",
        "x0": -0.5,
        "x1": 2.5,
        "y0": 2.54,
        "y1": 2.54,
        "line": {
          "color": "magenta",
          "width": 2,
          "dash": "dash"
        }
      },
      {
        "type": "line",
        "x0": -0.5,
        "x1": 2.5,
        "y0": 72.46,
        "y1": 72.46,
        "line": {
          "color": "rgba(31, 119, 180, 0.7)",
          "width": 2,
          "dash": "dash"
        }
      }
    ],
    "annotations": [
      {
        "x": 2.5,
        "y": 2.54,
        "text": "Baseline Exact Match",
        "showarrow": false,
        "xshift": 100,
        "font": {
          "size": 10,
          "color": "magenta"
        }
      },
      {
        "x": 2.5,
        "y": 72.46,
        "text": "Baseline Formatting",
        "showarrow": false,
        "xshift": 90,
        "font": {
          "size": 10,
          "color": "rgba(31, 119, 180, 0.7)"
        }
      }
    ]
  }
}
```


![Complexity Score Training Progression](/images/blog/curriculum-learning/Complexity_Score_iterative.png "Complexity Score Training Progression")

```plotly
{
  "data": [
    {
      "x": ["Easy", "Normal", "Difficult"],
      "y": [27.34, 28.91, 31.64],
      "type": "bar",
      "name": "Exact Match",
      "marker": {
        "color": "rgba(31, 119, 180, 0.8)"
      },
      "text": ["27.3", "28.9", "31.6"],
      "textposition": "outside"
    },
    {
      "x": ["Easy", "Normal", "Difficult"],
      "y": [93.95, 97.66, 96.29],
      "type": "bar",
      "name": "Correct Formatting",
      "marker": {
        "color": "rgba(255, 127, 14, 0.8)"
      },
      "text": ["94.0", "97.7", "96.3"],
      "textposition": "outside"
    }
  ],
  "layout": {
    "title": {
      "text": "PHI-2: Complexity Score Progression",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": ""
    },
    "yaxis": {
      "title": "Percentage",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "barmode": "group",
    "shapes": [
      {
        "type": "line",
        "x0": -0.5,
        "x1": 2.5,
        "y0": 30.27,
        "y1": 30.27,
        "line": {
          "color": "magenta",
          "width": 2,
          "dash": "dash"
        }
      },
      {
        "type": "line",
        "x0": -0.5,
        "x1": 2.5,
        "y0": 97.07,
        "y1": 97.07,
        "line": {
          "color": "rgba(31, 119, 180, 0.7)",
          "width": 2,
          "dash": "dash"
        }
      }
    ],
    "annotations": [
      {
        "x": 2.5,
        "y": 30.27,
        "text": "Baseline Exact Match",
        "showarrow": false,
        "xshift": 100,
        "font": {
          "size": 10,
          "color": "magenta"
        }
      },
      {
        "x": 2.5,
        "y": 97.07,
        "text": "Baseline Formatting",
        "showarrow": false,
        "xshift": 90,
        "font": {
          "size": 10,
          "color": "rgba(31, 119, 180, 0.7)"
        }
      }
    ]
  }
}
```

```plotly
{
  "data": [
    {
      "x": ["Easy", "Normal", "Difficult"],
      "y": [1.17, 1.37, 1.56],
      "type": "bar",
      "name": "Exact Match",
      "marker": {
        "color": "rgba(31, 119, 180, 0.8)"
      },
      "text": ["1.2", "1.4", "1.6"],
      "textposition": "outside"
    },
    {
      "x": ["Easy", "Normal", "Difficult"],
      "y": [24.80, 54.88, 65.63],
      "type": "bar",
      "name": "Correct Formatting",
      "marker": {
        "color": "rgba(255, 127, 14, 0.8)"
      },
      "text": ["24.8", "54.9", "65.6"],
      "textposition": "outside"
    }
  ],
  "layout": {
    "title": {
      "text": "SmolLM2: Complexity Score Progression",
      "font": {
        "size": 16,
        "weight": "bold"
      }
    },
    "xaxis": {
      "title": ""
    },
    "yaxis": {
      "title": "Percentage",
      "gridcolor": "rgba(128, 128, 128, 0.2)"
    },
    "barmode": "group",
    "shapes": [
      {
        "type": "line",
        "x0": -0.5,
        "x1": 2.5,
        "y0": 2.54,
        "y1": 2.54,
        "line": {
          "color": "magenta",
          "width": 2,
          "dash": "dash"
        }
      },
      {
        "type": "line",
        "x0": -0.5,
        "x1": 2.5,
        "y0": 72.46,
        "y1": 72.46,
        "line": {
          "color": "rgba(31, 119, 180, 0.7)",
          "width": 2,
          "dash": "dash"
        }
      }
    ],
    "annotations": [
      {
        "x": 2.5,
        "y": 2.54,
        "text": "Baseline Exact Match",
        "showarrow": false,
        "xshift": 100,
        "font": {
          "size": 10,
          "color": "magenta"
        }
      },
      {
        "x": 2.5,
        "y": 72.46,
        "text": "Baseline Formatting",
        "showarrow": false,
        "xshift": 90,
        "font": {
          "size": 10,
          "color": "rgba(31, 119, 180, 0.7)"
        }
      }
    ]
  }
}
```



# Conclusion
Overall, these experiments showed that curriculum learning can help—but only when the curriculum actually reflects task difficulty. The naive answer-length approach consistently hurt both models, confirming that not all “easy-to-hard” progressions are meaningful.

The advanced, complexity-based curriculum did work: PHI-2 gained +1.37% answer accuracy in the final stage and even saw a small formatting boost at the Normal stage. In contrast, the 135M model showed no improvements anywhere, suggesting that very small models just don’t benefit from staged training and may even get confused by it.

The main takeaway: curriculum design matters a lot, and when it’s done right, medium-sized models like PHI-2 can squeeze out measurable gains that standard fine-tuning doesn’t provide.



---

**Have you tried curriculum learning in your projects? What difficulty estimation methods have worked for you? I'd love to hear your thoughts - feel free to reach out via email or connect with me on [GitHub](https://github.com/KhrTim)!**
