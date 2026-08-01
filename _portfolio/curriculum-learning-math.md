---
title: "Curriculum Learning Fine-Tuning for Mathematical Reasoning"
excerpt: "Fine-tuning SmolLM2 and Phi-2 on GSM8K using complexity-based curriculum learning, achieving 1.37% accuracy improvement after the difficult curriculum stage"
collection: portfolio
date: 2025-11-13
category: ml-research
---


**Technologies:** Python, PyTorch, Transformers, LoRA, HuggingFace, Weights & Biases
**Duration:** November 2025
**Links:** [GitHub](https://github.com/KhrTim/Curriculum-Learning-Fine-Tuning) | [Blog Post](/blog/2025/11/curriculum-learning-math-reasoning/) | [Interactive Notebook](/files/curriculum_learning_blog_post.ipynb)

## Project Overview

Investigated whether curriculum learning—training models progressively from easy to hard problems—improves LLM mathematical reasoning capabilities. Compared two curriculum strategies against baseline random-order training.

## Key Results

**Complexity-Based Curriculum (✅ Success):**
- **+1.37% accuracy improvement** after the difficult curriculum stage (Phi-2 2.7B)
- Validates multi-factor difficulty estimation approach

**Answer-Length Curriculum (❌ Failure):**
- **-0.39% to -3.51% degradation** across model sizes
- Proves naive heuristics can hurt performance
- Important negative result for the field

**Model Size Dependency:**
- Medium models (2.7B) benefit most from curriculum learning
- Tiny models (135M) show no improvement (insufficient capacity)
- Suggests curriculum learning effectiveness scales with model size

## Technical Implementation

**Models Fine-Tuned:**
- **Phi-2 (2.7B parameters)** - best curriculum learning gains
- **SmolLM2 (135M parameters)** - baseline for small model behavior

**Dataset:**
- **GSM8K:** 8.5K grade school math word problems
- Split into 3 curriculum stages: Easy (33%) → Normal (33%) → Difficult (34%)

**Curriculum Strategies:**

1. **Naive Answer-Length Strategy:**
   - Sort by answer length (short → long)
   - Hypothesis: longer answers = harder problems
   - Result: Degraded performance (wrong assumption)

2. **Complexity-Based Strategy (Novel):**
   - Multi-factor scoring: `complexity = answer_length + (operation_difficulty × number_count)`
   - Accounts for reasoning chains and mathematical operations
   - Result: Improved performance after the difficult curriculum stage

**Training Approach:**
- **LoRA fine-tuning** for parameter efficiency (r=16, alpha=32)
- **Progressive training:** Train stage 1 → merge → train stage 2 → merge → train stage 3
- **Model merging** between stages preserves learned knowledge
- Weights & Biases for experiment tracking and visualization

## Experimental Design

**Baselines:**
- Random-order training (standard fine-tuning)
- Checkpointed evaluation at 10%, 25%, 50%, 75%, 100% of training

**Evaluation Metrics:**
- Exact match accuracy on GSM8K test set
- Per-difficulty-level breakdown
- Training efficiency (accuracy vs. training steps)

**Reproducibility:**
- Complete code on GitHub with documentation
- Fixed random seeds for reproducibility
- Hyperparameter configurations documented
- Interactive Jupyter notebook with visualizations

## Key Findings

1. **Curriculum design matters more than curriculum usage**
   - Well-designed curriculum: +1.37% improvement
   - Poorly-designed curriculum: -3.51% degradation

2. **Multi-factor difficulty estimation is crucial**
   - Complexity score (answer length + operations × numbers) works
   - Simple heuristics (answer length) fail

3. **Model capacity threshold exists**
   - 135M parameters: insufficient capacity for curriculum benefit
   - 2.7B parameters: sweet spot for curriculum learning
   - Suggests larger models may not need curriculum

4. **Progressive merging is essential**
   - Merging model weights between stages preserves knowledge
   - Without merging, catastrophic forgetting occurs

## Honest Reporting

**What Worked:**
- Complexity-based curriculum improved accuracy after the difficult stage
- Model merging strategy effective for knowledge retention
- Reproducible pipeline with comprehensive logging

**What Didn't Work:**
- Answer-length curriculum degraded performance
- SmolLM2 showed no improvement (too small)
- Curriculum benefit smaller than expected (1-2% vs. hoped 5-10%)

**Published negative results** to help researchers avoid failed approaches.

## Resources

- [Full Blog Post](/blog/2025/11/curriculum-learning-math-reasoning/) - Detailed analysis, visualizations, and insights
- [Interactive Jupyter Notebook](/files/curriculum_learning_blog_post.ipynb) - Executable analysis with Plotly charts
- [GitHub Repository](https://github.com/KhrTim/Curriculum-Learning-Fine-Tuning) - Complete training and evaluation code
- Training logs and curriculum difficulty distributions

## Impact & Lessons

**Scientific Contribution:**
- Demonstrates curriculum learning viability for LLM reasoning tasks
- Identifies model size threshold for curriculum effectiveness
- Provides negative results (answer-length heuristic) to guide future research

**Practical Takeaway:**
- Spend time on curriculum design (difficulty estimation)
- Not all curricula help—some hurt performance
- Consider model capacity when applying curriculum learning

**ML Engineering:**
- Complete end-to-end pipeline from hypothesis to deployment
- Comprehensive evaluation and honest reporting of failures
- Reproducible research with public code

---

*This project showcases research experimentation skills: hypothesis testing, rigorous evaluation, honest reporting of negative results, and sharing reproducible code with the community.*
