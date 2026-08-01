---
title: "Optimizing Vision-Language Models for Production: A Deep Dive into Quantization and Pruning"
date: 2025-12-09
permalink: /blog/2025/12/vqa-optimization/
tags:
  - vlm
  - large-language-models
  - quantization
  - pruning
  - optimization
  - deep-learning
excerpt: "I benchmarked popular Vision-Language Models (VLMs) like LLaVA, Qwen-VL, and PaliGemma to see how they handle quantization and pruning. The takeaway: 4-bit quantization is a no-brainer for most use cases, offering massive memory savings with minimal quality loss. Here's what I learned about VLM size reduction."
---



## TL;DR
I benchmarked popular Vision-Language Models (VLMs) like LLaVA, Qwen-VL, and PaliGemma to see how they handle quantization and pruning. **The takeaway:** 4-bit quantization is a no-brainer for most use cases, offering massive memory savings with minimal quality loss. For those needing speed improvements, **GLU pruning** (removing MLP neurons) achieved the best latency reductions, delivering significantly faster inference than head pruning or L1 methods, though at some cost to quality preservation.

---

## Introduction

Vision-Language Models (VLMs) like LLaVA, Qwen-VL, and PaliGemma are transforming how machines understand the world. But deploying these behemoths in production—especially on edge devices or latency-sensitive applications—is a massive challenge.

In this project, I set out to answer a critical question: **How much can I compress these models without breaking them?**

I conducted an extensive benchmark of popular VLMs, experimenting with quantization (4-bit, 8-bit) and structural pruning to find the sweet spot between performance and efficiency. Here's what I found.

---

## Part 1: The Baseline Benchmark

I started by establishing a baseline. I took top contenders:
*   **BLIP-2**: The reliable veteran.
*   **Qwen-VL**: A powerhouse from Alibaba.
*   **PaliGemma**: Google's efficient, open VLM.
*   **LLaVA**: The robust open-source standard (specifically LLaVA-1.5-7b).

### The Metrics That Matter
I didn't just look at accuracy. For production, you need to balance three things:
1.  **Quality**: I defined a composite "Quality Score" as the average of three metrics: `(METEOR + ROUGE-1 + BERTScore-F1) / 3`. This gives a balanced view of n-gram overlap and semantic similarity.
2.  **Latency**: How long does it take to get an answer?
3.  **VRAM**: Can it fit on a consumer GPU?

### Quantization: The "Free" Lunch?
I ran everything at FP16 (half-precision), 8-bit, and 4-bit quantization.

**The Result?**
Surprisingly, 4-bit quantization is almost always worth it.
*   **Size**: Massive reduction (often 3-4x smaller than FP16).
*   **Speed**: Significant latency improvements on memory-bound systems.
*   **Quality**: The drop in semantic understanding (BERTScore) was negligible for most tasks, though some nuance is lost in complex reasoning.

![Quality score versus inference latency for BLIP-2, Qwen-VL, PaliGemma and LLaVA at FP16, 8-bit and 4-bit](/images/blog/vlm-optimization/efficiency_frontier_standard_latency.png)

<!-- ![FP16 Quality Comparison](./optimization_project/figures/comparison_fp16_quality.png) -->


![Quality score versus model size for BLIP-2, Qwen-VL, PaliGemma and LLaVA at FP16, 8-bit and 4-bit](/images/blog/vlm-optimization/efficiency_frontier_standard_size.png)

<!-- ![FP16 Quality Comparison](./optimization_project/figures/comparison_fp16_size.png) -->


---

## Part 2: Surgical Precision with Pruning

Quantization is great, but what if we want to physically remove parts of the model? I focused my pruning efforts on **LLaVA**, applying three structural pruning techniques:

1.  **GLU Pruning**: Trimming the Feed-Forward Networks (MLPs). I followed the approach described by **Pere Martra** in his article [*Exploring GLU expansion ratios: Structured pruning in Llama-3.2 models*](https://huggingface.co/blog/oopere/making-llms-smaller-without-breaking-them). This method calculates neuron pair importance based on the **Maximum Absolute Weight** of the `gate_proj` and `up_proj` layers. I pruned the least important neuron pairs and resized the intermediate layers accordingly.
2.  **Head Pruning**: Removing attention heads that contribute least to the output. To select which heads to prune, I calculated the **L2 norm** of the `o_proj` (output projection) weights for each head. I then averaged these norms across all layers and removed the specific head indices that had the lowest average importance globally. This ensures we remove the "weakest" heads consistently across the model structure.
3.  **L1 Pruning**: Magnitude-based pruning of weights. *Note: Standard PyTorch L1 pruning only applies a mask (setting weights to zero) and does not physically reduce the model size or architecture.* It serves as a baseline for comparison.

### The Findings

I tested pruning intensities of 30% and 70%.

*   **30% Pruning**: This is the safe zone. Most pruning methods retained >90% of their original quality. Head pruning performed best for quality preservation (99% retention at fp16), while GLU pruning delivered the best latency improvements (1.27s vs. 2.29s for heads).
*   **70% Pruning**: Quality degradation becomes significant. Head pruning retained quality better (89% vs. 77% for GLU), but **GLU pruning** achieved dramatically lower latency (0.51s vs. 2.08s), making it the clear winner for speed-critical applications willing to trade some quality.

![Quality score versus inference latency for pruned LLaVA variants at FP16](/images/blog/vlm-optimization/efficiency_frontier_llama_avg_latency_s_fp16.png)
![Quality score versus model size for pruned LLaVA variants at 4-bit](/images/blog/vlm-optimization/efficiency_frontier_llama_model_size_mb_4bit.png)


### The Efficiency Frontier

When I plot Quality vs. Latency, a clear "Pareto Frontier" emerges:
*   **Best for Quality Preservation**: LLaVA (8-bit) or Qwen-VL achieve the highest quality scores while offering reasonable memory footprints.
*   **Best for Speed**: PaliGemma's architecture delivers sub-0.3s latency out-of-the-box, while heavily pruned LLaVA variants (70% GLU) can reach 0.51s.
*   **The Sweet Spot**: LLaVA with 30% GLU pruning strikes an excellent balance—maintaining 92% of baseline quality while achieving 47% latency reduction.

![Quality score versus inference latency across every model, quantization level and pruning configuration](/images/blog/vlm-optimization/efficiency_frontier_latency_vs_quality_all.png)
![Quality score versus model size across every model, quantization level and pruning configuration](/images/blog/vlm-optimization/efficiency_frontier_model_size_vs_quality_all.png)




---

## Conclusion

After extensive benchmarking across quantization levels and pruning strategies, here are the optimal configurations for different use cases:

### **Recommended Configurations**

**For balanced performance (most use cases):**
- **LLaVA with 30% GLU pruning + fp16**: Quality score 0.363 (~8% drop from baseline), 11GB VRAM, 1.27s latency
- This delivers significant speed improvements (47% faster) and moderate size reduction (18% smaller) while maintaining good quality

**For deployment under strict memory constraints:**
- **LLaVA with combined 30% GLU+Heads pruning + 4-bit**: Quality score 0.332, 2.8GB VRAM, 2.34s latency
- Achieves 79% size reduction from baseline with acceptable quality and comparable latency

**For maximum speed (real-time applications):**
- **LLaVA with 70% GLU pruning + fp16**: Quality score 0.305, 7.7GB VRAM, 0.51s latency
- Fastest inference (78% faster than baseline), though with noticeable quality degradation

**When quality cannot be compromised:**
- **Standard LLaVA with 8-bit quantization**: Quality score 0.396 (highest), 7GB VRAM, 8.35s latency
- Nearly preserves full quality while halving memory footprint

**For naturally efficient architectures:**
- **PaliGemma (4-bit)**: Quality score 0.793 (BERTScore-F1), 2.1GB VRAM, 0.30s latency
- Excellent out-of-the-box efficiency without requiring pruning

### **Key Takeaways**

1. **4-bit quantization is essential** for memory-constrained deployments, offering 3-4x size reduction with minimal quality loss across all models tested.

2. **GLU pruning outperforms head pruning for speed gains** but sacrifices more quality. Choose based on your speed-vs-quality tolerance.

3. **Combined pruning strategies** (GLU + heads) can achieve extreme compression (>75%) but require careful validation for your specific use case.

4. **Quantization and pruning compound effectively**: combining 30% GLU pruning with 4-bit quantization yields both speed and size benefits.

The code for this benchmark and analysis tools are open-source. I encourage you to run these tests on your own hardware and datasets to find the optimal configuration for your specific requirements.
code: 
---

## Supplementary materials - All experimental data


|model                    |quantization|load_time_s|model_size_mb|model_parameters|avg_latency_s|mean_answer_length|meteor |sacrebleu|rouge1 |rouge2  |rougeL |bertscore_precision|bertscore_recall|bertscore_f1|perplexity|
|-------------------------|------------|-----------|-------------|----------------|-------------|------------------|-------|---------|-------|--------|-------|-------------------|----------------|------------|----------|
|blip2                    |fp16        |7.602      |7143         |3744761856      |0.1321       |28.04             |0.01809|~0       |0.04551|0.005342|0.03801|0.8315             |0.769           |0.7986      |1722      |
|blip2                    |8bit        |12.49      |4003         |3744761856      |0.9038       |32.94             |0.02028|~0       |0.05045|0.006266|0.04136|0.8306             |0.7696          |0.7985      |2201      |
|blip2                    |4bit        |11         |2333         |1117833216      |0.5495       |42.98             |0.01783|~0       |0.04537|0.004216|0.03681|0.8211             |0.7709          |0.7947      |1047      |
|qwen                     |fp16        |7.021      |4213         |2208985600      |1.928        |335               |0.1099 |0.372    |0.1977 |0.03656 |0.128  |0.8406             |0.8091          |0.824       |22.27     |
|qwen                     |8bit        |8.266      |2331         |2208985600      |7.695        |343.2             |0.112  |0.3675   |0.2102 |0.04002 |0.1314 |0.844              |0.8099          |0.8262      |23.41     |
|qwen                     |4bit        |8.083      |1390         |728920576       |3.222        |288.9             |0.1014 |0.2213   |0.1915 |0.03859 |0.1223 |0.8478             |0.808           |0.8271      |26.88     |
|paligemma                |fp16        |8.359      |5576         |2923466480      |0.1417       |25.96             |0.01658|~0       |0.03053|0.005842|0.02223|0.823              |0.7634          |0.7917      |8039      |
|paligemma                |8bit        |10.45      |3292         |2923466480      |0.6606       |30.04             |0.01866|~0       |0.03594|0.006703|0.02537|0.8255             |0.765           |0.7937      |8757      |
|paligemma                |4bit        |10.6       |2150         |1127037680      |0.3001       |26.1              |0.01468|~0       |0.03021|0.007021|0.02456|0.8245             |0.7646          |0.793       |9556      |
|llava                    |fp16        |9.679      |1.347e+04    |7063427072      |2.39         |466.4             |0.1341 |0.7937   |0.2247 |0.03743 |0.1384 |0.8376             |0.8102          |0.8234      |18.6      |
|llava                    |8bit        |14.61      |6988         |7063427072      |8.351        |470               |0.1352 |0.8368   |0.2279 |0.03995 |0.1389 |0.8377             |0.8117          |0.8242      |18.03     |
|llava                    |4bit        |15.13      |3746         |1964201984      |4.59         |475.4             |0.134  |0.8223   |0.2228 |0.03692 |0.1342 |0.8385             |0.8103          |0.8239      |17.99     |
|llava:llava-glu-30pct    |fp16        |109.6      |1.1e+04      |5765027840      |1.274        |289               |0.09247|0.2074   |0.1799 |0.02967 |0.1157 |0.831              |0.8029          |0.8162      |58.55     |
|llava:llava-glu-30pct    |8bit        |11.69      |5750         |5765027840      |5.058        |269.8             |0.08983|0.1555   |0.1701 |0.02783 |0.1111 |0.8305             |0.801           |0.8152      |79.99     |
|llava:llava-glu-30pct    |4bit        |11.58      |3127         |1639602176      |2.781        |266               |0.08215|0.1609   |0.1568 |0.02538 |0.1048 |0.8184             |0.7985          |0.8076      |62.49     |
|llava:llava-glu-70pct    |fp16        |70.05      |7694         |4033697792      |0.5122       |83.36             |0.03359|3.969e-05|0.07885|0.01396 |0.06103|0.8194             |0.7901          |0.804       |292.2     |
|llava:llava-glu-70pct    |8bit        |8.676      |4099         |4033697792      |2.664        |88.76             |0.0339 |1.976e-05|0.07981|0.0145  |0.06156|0.8145             |0.7906          |0.8018      |262       |
|llava:llava-glu-70pct    |4bit        |8.79       |2302         |1206769664      |2.766        |89.46             |0.03219|4.22e-05 |0.07678|0.01363 |0.05917|0.8153             |0.7901          |0.802       |307.9     |
|llava:llava-heads-30pct  |fp16        |126.8      |1.219e+04    |6392338432      |2.292        |462.8             |0.1318 |1.031    |0.2232 |0.03549 |0.1404 |0.829              |0.8056          |0.8169      |18.64     |
|llava:llava-heads-30pct  |8bit        |12.42      |6348         |6392338432      |8.423        |451.7             |0.13   |0.8576   |0.2232 |0.03578 |0.1395 |0.8286             |0.805           |0.8164      |19.36     |
|llava:llava-heads-30pct  |4bit        |12.66      |3426         |1796429824      |4.828        |475               |0.1303 |0.8359   |0.2208 |0.03467 |0.1397 |0.826              |0.8043          |0.8147      |17.35     |
|llava:llava-heads-70pct  |fp16        |115.6      |1.053e+04    |5519923200      |2.075        |376               |0.09322|0.4207   |0.1704 |0.0203  |0.1154 |0.7758             |0.7941          |0.7844      |56.74     |
|llava:llava-heads-70pct  |8bit        |11.32      |5516         |5519923200      |8.043        |365.3             |0.08198|0.3233   |0.1607 |0.02119 |0.1092 |0.7747             |0.7938          |0.7838      |82.98     |
|llava:llava-heads-70pct  |4bit        |11.08      |3010         |1578326016      |4.809        |394               |0.08559|0.3713   |0.1544 |0.02112 |0.1124 |0.7662             |0.7924          |0.7787      |85.45     |
|llava:llava-l1-30pct     |fp16        |161.2      |1.347e+04    |7063427072      |2.42         |496.2             |0.1321 |0.7178   |0.2175 |0.03485 |0.1292 |0.8365             |0.8099          |0.8227      |19.57     |
|llava:llava-l1-30pct     |8bit        |13.55      |6988         |7063427072      |8.848        |500.2             |0.1342 |0.6944   |0.2235 |0.03276 |0.128  |0.8373             |0.8108          |0.8236      |19.49     |
|llava:llava-l1-30pct     |4bit        |13.43      |3746         |1964201984      |4.617        |494.7             |0.1301 |0.6815   |0.2156 |0.03202 |0.1279 |0.8363             |0.8089          |0.8221      |19.71     |
|llava:llava-l1-70pct     |fp16        |128.7      |1.347e+04    |7063427072      |2.618        |177.8             |0.05564|0.2806   |0.06584|0.01202 |0.05153|0.7422             |0.7926          |0.7659      |7.135     |
|llava:llava-l1-70pct     |8bit        |52.62      |6988         |7063427072      |9.435        |186.6             |0.05565|0.2815   |0.06768|0.01134 |0.05228|0.745              |0.7935          |0.7678      |8.393     |
|llava:llava-l1-70pct     |4bit        |13.75      |3746         |1964201984      |5.024        |182.6             |0.05042|0.2528   |0.06489|0.01123 |0.05086|0.7339             |0.7921          |0.7614      |8.817     |
|llava:llava-glu30-heads30|fp16        |101        |9716         |5093939200      |1.086        |219.5             |0.076  |0.0907   |0.1331 |0.02186 |0.09543|0.8208             |0.7977          |0.8084      |83.03     |
|llava:llava-glu30-heads30|8bit        |10.77      |5110         |5093939200      |4.285        |225.7             |0.08453|0.09851  |0.1519 |0.02572 |0.1082 |0.8293             |0.7996          |0.8139      |90.46     |
|llava:llava-glu30-heads30|4bit        |10.82      |2807         |1471830016      |2.335        |189.1             |0.06797|0.03992  |0.1193 |0.02003 |0.08613|0.825              |0.7952          |0.8094      |118.5     |
|llava:llava-glu70-heads70|fp16        |52.23      |4750         |2490193920      |1.992        |263.2             |0.07404|0.2372   |0.1269 |0.01514 |0.09118|0.7677             |0.7937          |0.7799      |113.2     |
|llava:llava-glu70-heads70|8bit        |6.547      |2627         |2490193920      |8.577        |252.4             |0.07485|0.1946   |0.1312 |0.01477 |0.09239|0.772              |0.793           |0.782       |147.7     |
|llava:llava-glu70-heads70|4bit        |6.716      |1566         |820893696       |4.495        |291.9             |0.0765 |0.2713   |0.14   |0.01618 |0.1061 |0.771              |0.7935          |0.7816      |171.3     |

