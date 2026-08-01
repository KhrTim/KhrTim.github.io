---
title: "VLM Compression: Optimization Techniques for Vision-Language Models"
excerpt: "Implementing quantization and structural pruning for BLIP-2 and LLaVA, achieving 50% model size reduction with less than 2% accuracy loss"
collection: portfolio
date: 2025-12-01
category: ml-engineering
---


**Technologies:** Python, PyTorch, BitsAndBytes, Gradio, HuggingFace
**Duration:** December 2025
**Links:** [GitHub](https://github.com/KhrTim/VLM-compression-project) | [Blog Post](/blog/2025/12/vqa-optimization/)

## Project Overview

Implemented and benchmarked multiple compression techniques for Vision-Language Models (BLIP-2, LLaVA, PaliGemma) to enable efficient deployment in production environments with limited compute resources.

## Key Results

**Quantization Performance:**
- **50% model size reduction** using 8-bit quantization with less than 2% accuracy loss
- **74% model size reduction** using 4-bit quantization (3-4x smaller models)
- **20% latency reduction** across quantized models compared to FP16 baseline

**Structural Pruning:**
- **47% latency reduction** with 30% GLU pruning on LLaVA while maintaining 92% of baseline quality
- GLU pruning significantly outperformed attention head pruning for inference speed

**Optimal Configuration:**
- LLaVA with 8-bit quantization + 30% GLU pruning provides best balance
- Deployable on consumer GPUs with minimal quality degradation

## Technical Implementation

**Models Benchmarked:**
- LLaVA-1.5-7B (most balanced performance)
- BLIP-2 OPT-2.7B (smallest baseline)
- PaliGemma (latest architecture)
- Qwen-VL (multilingual capabilities)

**Compression Techniques:**
1. **Quantization:** FP16 → INT8 → INT4 using BitsAndBytes library
2. **Structural Pruning:** GLU neuron pruning and attention head pruning
3. **Combined Approach:** Quantization + pruning for maximum compression

**Evaluation Methodology:**
- Composite quality score: METEOR + ROUGE-1 + BERTScore-F1
- Comprehensive benchmarking on VQA tasks
- Latency measurements on consumer hardware (RTX 3090)
- Size-speed-accuracy tradeoff analysis

## Deployment

**Interactive Demo:**
- Built Gradio interface comparing inference speed across compression levels
- Real-time visualization of quality vs. speed tradeoffs

**Production-Ready Code:**
- Reproducible pipeline for model compression
- Automated benchmarking framework
- Comprehensive documentation and example usage

## Business Impact

- **Democratizes VLM deployment** on consumer hardware (3090, 4090)
- **Reduces inference costs** by 50-75% through smaller model sizes
- **Enables real-time applications** with 47% faster inference
- **Minimal quality loss** (<2%) maintains production viability

## Key Findings

1. **4-bit quantization is production-viable** for most VLM applications
2. **GLU pruning >> Head pruning** for latency reduction
3. **Combined techniques stack multiplicatively** (quantization + pruning)
4. **Model-specific optimization** required (LLaVA ≠ BLIP-2 ≠ PaliGemma)

## Resources

- [Full Blog Post](/blog/2025/12/vqa-optimization/) - Detailed benchmark results and visualizations
- [GitHub Repository](https://github.com/KhrTim/VLM-compression-project) - Complete implementation
- Benchmark data and efficiency frontier plots

---

*This project demonstrates practical ML engineering skills: benchmarking multiple approaches, quantifying tradeoffs, and delivering production-ready compression solutions with measurable impact.*
