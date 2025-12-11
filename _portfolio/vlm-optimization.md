---
title: "Optimizing Vision-Language Models for Production"
excerpt: "A deep dive into quantization and pruning techniques for VLMs like LLaVA and Qwen-VL, achieving 4x size reduction and 47% lower latency."
collection: portfolio
---

# Optimizing Vision-Language Models for Production

**Goal:** Find the optimal balance between model size, inference speed, and output quality for deploying Vision-Language Models (VLMs) in production environments.

**Key Findings:**
*   **4-bit Quantization**: Offers massive memory savings (3-4x smaller) with minimal quality loss across most models.
*   **GLU Pruning**: Removing neurons from the MLP layers (GLU pruning) provided the best latency improvements, significantly outperforming head pruning for speed.
*   **The Sweet Spot**: LLaVA with 30% GLU pruning strikes an excellent balance, maintaining 92% of baseline quality while achieving a 47% latency reduction.

**Methodology:**
I benchmarked popular models including **LLaVA-1.5-7b**, **Qwen-VL**, and **PaliGemma** using a composite quality score (METEOR + ROUGE-1 + BERTScore-F1). I tested various configurations of FP16, 8-bit, and 4-bit quantization, alongside structural pruning techniques (GLU and Head pruning).

[Read the full case study and benchmark results in my blog post](/blog/2025/12/vqa-optimization/)
