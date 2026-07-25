---
layout: home
permalink: /
title: "Timur Khairulov — AI Researcher"
description: "M.S. researcher in AI at Chung-Ang University working on LLM/VLM compression and efficient machine learning."
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

<section class="hero">
  <div class="grid-spot" aria-hidden="true"></div>
  <div class="wrap">
    <div>
      <div class="prompt"><span class="greet">Привет</span> · timur@research ~ %<span class="caret"></span></div>
      <h1>Timur Khairulov</h1>
      <div class="native">// Тимур Хайрулов · St. Petersburg → Seoul</div>
      <div class="lines">
        <div><span class="k">&gt;</span> <span data-type="building efficient AI"></span></div>
        <div><span class="k">&gt;</span> <span data-type="model compression · unsupervised feature selection"></span></div>
      </div>
      <p class="intro">
        M.S. researcher at <strong>Chung-Ang University</strong>, Seoul. I make machine learning
        smaller, faster, and cheaper to run — <strong>compressing large vision-language models</strong>
        for real deployment. Before AI, I shipped real-time 4G LTE physical-layer software in C++ at YADRO.
      </p>
      <div class="cta">
        <a class="btn-x primary" href="/files/Timur_Khairulov_CV.pdf">View CV <span class="arw">↗</span></a>
        <a class="btn-x" href="/publications/">Publications</a>
        <a class="btn-x" href="https://github.com/KhrTim" target="_blank" rel="noopener">GitHub <span class="arw">↗</span></a>
        <a class="btn-x" href="mailto:timurkhairulov@cau.ac.kr">Email</a>
      </div>
    </div>

    <div class="term reveal">
      <div class="term-bar"><i class="r"></i><i class="y"></i><i class="g"></i><span>~/research — optimize.sh</span></div>
      <div class="term-body" id="term-body">
<div class="ln c-cmd">optimize --model llava-7b</div>
<div class="ln c-dim">  loading weights ........... <span class="c-am">14.2 GB</span></div>
<div class="ln c-dim">  quantize 4-bit <span class="bar">▓▓▓▓▓▓▓▓</span> <span class="c-ok">ok</span></div>
<div class="ln c-dim">  prune attention heads ..... <span class="c-ok">ok</span></div>
<div class="ln c-dim">  ────────────────────────────</div>
<div class="ln c-dim">  output .................... <span class="c-cy">7.1 GB</span></div>
<div class="ln c-cy">  size −50%  ·  accuracy −1.8%</div>
<div class="ln c-ok">  ✓ shipped to production</div>
      </div>
    </div>
  </div>
</section>

<div class="stats reveal">
  <div class="cell"><div class="num">~<span data-count="50" data-dec="0">50</span><span class="u">%</span></div><div class="lbl">smaller VLMs, &lt;2% accuracy loss</div></div>
  <div class="cell"><div class="num"><span data-count="5">5</span></div><div class="lbl">peer-reviewed publications</div></div>
  <div class="cell"><div class="num"><span data-count="4.22" data-dec="1">4.22</span><span class="u">/4.5</span></div><div class="lbl">M.S. GPA · CAYSS scholar</div></div>
  <div class="cell"><div class="num"><span data-count="200">200</span></div><div class="lbl">Yandex Bootcamp, top 200 / 2000</div></div>
</div>

<section class="blk">
  <div class="wrap reveal">
    <h2 class="sec-h">selected_work</h2>
    <p class="sec-sub">Research and engineering I'm most proud of.</p>
    <div class="cards">
      <a class="card" href="/portfolio/vlm-optimization/">
        <div class="idx">01 / vision-language</div>
        <h3>VLM Compression</h3>
        <p>Quantization and structural pruning for BLIP-2 and LLaVA — roughly half the size with under 2% accuracy loss.</p>
        <div class="tags"><span class="tag">PyTorch</span><span class="tag">Quantization</span><span class="tag">Pruning</span></div>
      </a>
      <a class="card" href="https://www.mdpi.com/2073-8994/17/6/869" target="_blank" rel="noopener">
        <div class="idx">02 / journal</div>
        <h3>ChainImputer</h3>
        <p>Neural-network iterative imputation using cumulative features for missing data. Published in MDPI Symmetry, 2025.</p>
        <div class="tags"><span class="tag">MDPI 2025</span><span class="tag">Imputation</span><span class="tag">Deep Learning</span></div>
      </a>
      <a class="card" href="https://github.com/KhrTim/Feature_Selection" target="_blank" rel="noopener">
        <div class="idx">03 / research code</div>
        <h3>Feature Selection Library</h3>
        <p>Unsupervised feature-selection algorithms and experiments behind several publications and my thesis.</p>
        <div class="tags"><span class="tag">Info Theory</span><span class="tag">scikit-learn</span><span class="tag">Research</span></div>
      </a>
    </div>
  </div>
</section>

<section class="blk" style="padding-top:0">
  <div class="wrap reveal">
    <h2 class="sec-h">the_path</h2>
    <p class="sec-sub">Russia to Korea, telecom to AI.</p>
    <div class="journey">
      <div class="stop"><span class="flag">🇷🇺</span><div class="yr">2018 — 2023</div><div class="place">LETI · St. Petersburg</div><div class="role">B.S. Computer Science</div></div>
      <div class="stop"><span class="flag">🇰🇷</span><div class="yr">2022 — 2023</div><div class="place">Inha · Incheon</div><div class="role">Exchange semester</div></div>
      <div class="stop"><span class="flag">🇷🇺</span><div class="yr">2023 — 2024</div><div class="place">YADRO</div><div class="role">C++ LTE L1 engineer</div></div>
      <div class="stop"><span class="flag">🇰🇷</span><div class="yr">2024 — now</div><div class="place">Chung-Ang · Seoul</div><div class="role">M.S. AI · AutoML Lab</div></div>
    </div>
  </div>
</section>

<section class="blk" style="padding-top:0">
  <div class="wrap reveal">
    <h2 class="sec-h">research_interests</h2>
    <p class="sec-sub">Where I spend my time.</p>
    <div class="chips">
      <span class="chip">LLM &amp; VLM compression</span>
      <span class="chip">Quantization &amp; pruning</span>
      <span class="chip">Unsupervised feature selection</span>
      <span class="chip">Information theory</span>
      <span class="chip">Efficient inference</span>
      <span class="chip">Data imputation</span>
    </div>
  </div>
</section>

<section class="blk" style="padding-top:0">
  <div class="wrap reveal">
    <div class="contact">
      <h2 class="sec-h">get_in_touch</h2>
      <p>Open to collaboration on LLM/VLM efficiency, unsupervised learning, and applied AI. The fastest way to reach me is email.</p>
      <div class="links">
        <a href="mailto:timurkhairulov@cau.ac.kr">timurkhairulov@cau.ac.kr</a>
        <a href="https://github.com/KhrTim" target="_blank" rel="noopener">GitHub</a>
        <a href="https://scholar.google.com/citations?user=-XrW5PAAAAAJ" target="_blank" rel="noopener">Scholar</a>
        <a href="https://linkedin.com/in/timur-khairulov-b09791250" target="_blank" rel="noopener">LinkedIn</a>
        <a href="/cv/">Full CV</a>
      </div>
    </div>
  </div>
</section>
