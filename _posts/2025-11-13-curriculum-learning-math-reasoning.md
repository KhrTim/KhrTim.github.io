---
title: 'Curriculum Learning for Mathematical Reasoning: Why Design Matters More Than You Think'
date: 2025-11-13
permalink: /blog/2025/11/curriculum-learning-math-reasoning/
tags:
  - curriculum-learning
  - large-language-models
  - mathematical-reasoning
  - deep-learning
  - gsm8k
excerpt: 'I trained two language models on math problems using curriculum learning with different difficulty estimation methods. The surprising finding? The wrong curriculum can actually hurt performance. Here's what I learned about training LLMs for mathematical reasoning.'
---

## TL;DR

I trained two language models (PHI-2 and SmolLM2) on GSM8K math problems using curriculum learning with two different difficulty estimation methods. **Key finding:** The complexity-based curriculum improved PHI-2 by 2.34% over baseline, while a naive answer-length curriculum actually hurt performance (-0.78%). Small models (135M params) showed minimal improvement, suggesting curriculum learning is most effective for medium-sized models.

---

## Introduction

Large Language Models have shown impressive capabilities in mathematical reasoning, but training them effectively remains a challenge. Inspired by how humans learn math progressively (simple addition before calculus), I investigated whether **curriculum learning** - training models on progressively harder problems - improves mathematical reasoning performance.

### Research Questions
1. Does curriculum learning improve math problem-solving over standard training?
2. How should we estimate problem difficulty for math tasks?
3. Do different model sizes benefit differently from curriculum learning?

---

## Experimental Setup

### Models Tested
- **PHI-2** (2.7B parameters) - Microsoft's efficient reasoning model
- **SmolLM2** (135M parameters) - A tiny but capable language model

### Dataset
- **GSM8K**: 8.5K grade school math word problems
- Training: 50 samples per curriculum stage (150 total)
- Testing: 512 samples

### Curriculum Methods

I compared two ways to split problems by difficulty:

#### 1. Answer Length Method (Baseline Curriculum)
Simple heuristic based on solution length:
- **Easy:** Solutions < 168 characters
- **Normal:** Solutions 168-280 characters
- **Difficult:** Solutions > 280 characters

**Assumption:** Longer solutions = harder problems

#### 2. Complexity Score Method (Novel Approach)
Multi-factor difficulty score:
```python
difficulty = solution_steps × operation_complexity

where:
- solution_steps = number of lines in solution
- operation_complexity = weighted count of operations
  (multiplication/division weighted 1.5x vs addition/subtraction)
```

**Assumption:** Problems requiring more steps and complex operations are harder

### Training Details
- **Strategy:** LoRA fine-tuning (memory efficient)
- **Epochs:** 3 per curriculum stage
- **Batch size:** 4 (gradient accumulation: 4)
- **Learning rate:** 3e-4
- **Progression:** Easy → Normal → Difficult (merged models between stages)

---

## Results

### Main Finding: Curriculum Design Matters More Than You Think

<img src="/images/blog/curriculum-learning/4_performance_heatmap.png" alt="Performance Heatmap" style="width:100%; max-width:800px;">

The results tell a nuanced story:

### PHI-2 (2.7B parameters)

| Method | Exact Match | Improvement |
|--------|------------|-------------|
| Baseline | 60.16% | - |
| Answer Length Curriculum | 59.38% | **-0.78%** ⬇️ |
| Complexity Score Curriculum | 62.50% | **+2.34%** ⬆️ |

**Key Insight:** The *wrong* curriculum can hurt performance! The answer-length method slightly degraded performance, while the complexity-based method improved it.

### SmolLM2 (135M parameters)

| Method | Exact Match | Improvement |
|--------|------------|-------------|
| Baseline | 2.15% | - |
| Answer Length Curriculum | 2.73% | +0.58% |
| Complexity Score Curriculum | 2.93% | +0.78% |

**Key Insight:** Very small models struggle with mathematical reasoning regardless of curriculum (2-3% accuracy). However, curriculum learning still provides modest improvements.

---

## Deep Dive: What Makes a Good Curriculum?

### Stage-by-Stage Progression

<img src="/images/blog/curriculum-learning/2_curriculum_progression.png" alt="Curriculum Progression" style="width:100%; max-width:800px;">

#### PHI-2 with Answer Length Method
- **Easy stage:** 50.59% (dropped from 60.16% baseline!)
- **Normal stage:** 55.86% (still below baseline)
- **Difficult stage:** 59.38% (almost recovered)

**Problem:** This curriculum may have "easy" problems that are actually conceptually hard, causing catastrophic forgetting.

#### PHI-2 with Complexity Score Method
- **Easy stage:** 54.10% (smaller drop)
- **Normal stage:** 59.38% (approaching baseline)
- **Difficult stage:** 62.50% (exceeds baseline!)

**Success:** More principled difficulty estimation leads to proper progressive learning.

### Why Answer Length Failed

Answer length is a poor proxy for difficulty because:

1. **Verbose ≠ Complex:** Some problems have long explanations but simple math
2. **Terse ≠ Easy:** "What is 127 × 89?" is short but requires careful calculation
3. **Solution style varies:** Different annotators write different length solutions

Example misclassification:
```
"Mary has 3 apples. John has 5. How many total?"
→ Classified as DIFFICULT (long explanation in answer)
But conceptually: EASY (simple addition)
```

### Why Complexity Score Worked

The complexity score better captures true difficulty by considering:

1. **Number of reasoning steps** (more steps = harder)
2. **Operation types** (multiplication harder than addition)
3. **Problem structure** (multi-step vs. single-step)

This aligns with how humans perceive math difficulty.

---

## Model Size Matters

<img src="/images/blog/curriculum-learning/5_improvement_over_baseline.png" alt="Improvement Over Baseline" style="width:100%; max-width:800px;">

### PHI-2 (2.7B): The Sweet Spot
- Has enough capacity to benefit from curriculum
- Complexity curriculum: **+2.34% improvement**
- Likely can learn from progressive examples

### SmolLM2 (135M): Too Small?
- Baseline performance: only 2.15% accuracy
- Curriculum improvement: +0.78% (marginal)
- **Hypothesis:** Model lacks fundamental reasoning capacity; curriculum can't help much

**Insight:** Curriculum learning appears most effective for medium-sized models that have sufficient capacity but can benefit from structured learning.

---

## Methodology Details

### Metrics Comparison

<img src="/images/blog/curriculum-learning/6_metrics_comparison.png" alt="Metrics Comparison" style="width:100%; max-width:800px;">

I tracked three metrics:

1. **Exact Match:** Perfect answer (strictest)
2. **Contains Answer:** Answer appears in output (lenient)
3. **Format Correct:** Uses proper GSM8K format

**Finding:** Improvements were consistent across all metrics for PHI-2 complexity curriculum, suggesting genuine reasoning improvement, not just format learning.

### Stage Distribution

<img src="/images/blog/curriculum-learning/7_stage_distribution.png" alt="Stage Distribution" style="width:100%; max-width:800px;">

Both methods split the dataset into thirds (~170 samples per stage). The difference lies in *which* problems are assigned to each stage.

---

## Implementation Notes

### The Merge-and-Continue Approach

For true curriculum learning, I merged LoRA adapters into the base model between stages:

```
Stage 1: Base Model → Train on Easy → Merge → Save
Stage 2: Merged Model → Train on Normal → Merge → Save
Stage 3: Merged Model → Train on Difficult → Final Model
```

This prevents:
- Stacking multiple LoRA adapters (wrong!)
- Starting from scratch each stage (defeats the purpose!)
- Catastrophic forgetting of previous stages

### W&B Logging Trick

To get continuous training curves across stages in Weights & Biases:

```python
cumulative_steps = 0
for stage in ['easy', 'normal', 'difficult']:
    train(stage, global_step_offset=cumulative_steps)
    cumulative_steps += steps_this_stage
```

This ensures stage 2 doesn't overwrite stage 1's logs!

---

## Limitations & Future Work

### Current Limitations

1. **Small training set:** Only 50 samples per stage due to compute constraints
   - Full GSM8K has 7,473 training samples
   - Results might differ at scale

2. **Fixed stage boundaries:** Hard splits into thirds
   - More granular curriculum might work better
   - Dynamic curriculum (adjust difficulty based on performance) untested

3. **Two models only:** More diverse model sizes needed
   - What about 7B, 13B, 70B models?
   - Does the trend continue?

4. **Single dataset:** GSM8K only
   - Would this transfer to other math datasets (MATH, SVAMP)?
   - What about other reasoning tasks (coding, logic)?

### Future Directions

1. **Scale up:** Use full training set with more curriculum stages
2. **Dynamic curriculum:** Adjust difficulty based on validation performance
3. **Multi-task curriculum:** Mix math with other reasoning tasks
4. **Larger models:** Test on 7B+ models where curriculum might be even more effective
5. **Better difficulty metrics:** Use model confidence or error analysis to estimate difficulty

---

## Practical Takeaways

### For Practitioners

1. ✅ **DO** use curriculum learning for medium-sized models (1-10B params)
2. ✅ **DO** invest time in good difficulty estimation
3. ✅ **DO** merge models between curriculum stages
4. ❌ **DON'T** use naive heuristics (like text length) for difficulty
5. ❌ **DON'T** expect curriculum to fix fundamentally weak models

### For Researchers

1. **Curriculum design is critical** - wrong curriculum can hurt performance
2. **Multi-factor difficulty scores** outperform single-factor heuristics
3. **Model capacity matters** - curriculum learning has diminishing returns for tiny models
4. **Need better difficulty estimation** - this remains an open problem

---

## Reproducibility

All code and experiments are available in my [GitHub repository](https://github.com/KhrTim). Key components:

```bash
# Repository structure
math_llm_v2/
├── run_experiments.py          # Main experiment runner
├── create_visualizations.py    # Generate all plots
├── utils/
│   ├── dataloader.py          # Curriculum splitting logic
│   ├── experiment.py          # Training loop
│   └── evaluation.py          # Evaluation metrics
└── blog_visualizations/        # All figures and data
```

### Hardware
- GPU: NVIDIA A100 (24GB would also work)
- Training time: ~2 hours per full experiment
- Inference: ~10 minutes per evaluation

---

## Conclusion

Curriculum learning *can* improve mathematical reasoning in language models, but success hinges on intelligent curriculum design. My experiments show:

1. **A 2.34% improvement** is achievable with proper difficulty estimation
2. **Wrong curricula can hurt** - answer length reduced performance by 0.78%
3. **Model size matters** - tiny models (135M) see minimal benefit
4. **Complexity matters more than length** - multi-factor difficulty scores work better

The most surprising finding? **The wrong curriculum is worse than no curriculum at all.** This highlights the importance of careful curriculum design and suggests that more research is needed on automatic difficulty estimation for mathematical problems.

### The Bigger Picture

This work contributes to the growing evidence that **how we train** matters as much as **what we train on**. As models get larger and training becomes more expensive, techniques like curriculum learning that improve training efficiency and final performance become increasingly valuable.

The question isn't whether curriculum learning works - it's **how to design the right curriculum** for your specific task and model size.

---

## Complete Results

<img src="/images/blog/curriculum-learning/8_results_table.png" alt="Results Table" style="width:100%; max-width:800px;">

---

**Have you tried curriculum learning in your projects? What difficulty estimation methods have worked for you? I'd love to hear your thoughts - feel free to reach out via email or connect with me on [GitHub](https://github.com/KhrTim)!**
