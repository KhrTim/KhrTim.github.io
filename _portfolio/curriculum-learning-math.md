---
title: "Curriculum Learning for Mathematical Reasoning"
excerpt: "Investigating how progressive training on math problems affects LLM reasoning capabilities. Found that proper curriculum design can improve performance by 2.34%, but wrong curricula can hurt by 0.78%."
collection: portfolio
date: 2024-11-13
---

## Project Overview

This research project explores curriculum learning for training large language models on mathematical reasoning tasks. The key insight: **how you design your curriculum matters more than whether you use one at all**.

**Key Results:**
- ✅ Complexity-based curriculum: **+2.34% improvement** over baseline (PHI-2)
- ❌ Answer-length curriculum: **-0.78% degradation** (PHI-2)
- 📊 Model size matters: tiny models (135M) see minimal benefit

## Technical Details

**Models Tested:**
- PHI-2 (2.7B parameters)
- SmolLM2 (135M parameters)

**Dataset:**
- GSM8K: 8.5K grade school math word problems
- Curriculum stages: Easy → Normal → Difficult

**Training Approach:**
- LoRA fine-tuning for efficiency
- Model merging between curriculum stages
- Multi-factor difficulty estimation based on solution steps × operation complexity

**Technologies:**
- PyTorch, Hugging Face Transformers, PEFT
- Weights & Biases for experiment tracking
- Custom curriculum splitting algorithms

## Key Findings

1. **Curriculum design is critical** - Wrong difficulty estimation can degrade performance
2. **Multi-factor difficulty scores work better** than simple heuristics like text length
3. **Medium-sized models benefit most** - Very small models lack capacity, very large models may not need it
4. **Merge models between stages** - Essential for true progressive learning

## Resources

- 📝 [Full Blog Post](/blog/2024/11/curriculum-learning-math-reasoning/) - Detailed analysis and visualizations
- 💻 [GitHub Repository](https://github.com/KhrTim) - Code and experiments
- 📊 8 publication-quality visualizations showing results

## Impact

This work demonstrates that training methodology matters as much as model architecture or dataset size. As training costs increase, techniques like curriculum learning that improve efficiency become increasingly valuable.

The most surprising finding? **The wrong curriculum is worse than no curriculum at all** - highlighting the need for better automatic difficulty estimation methods.
