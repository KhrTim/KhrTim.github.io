---
title: "ChainImputer: A Neural Network-Based Iterative Imputation Method Using Cumulative Features"
collection: publications
category: manuscripts
permalink: /publication/2025-chainimputer-journal
excerpt: 'A neural network–based missing value imputation method that incrementally builds a cumulative feature set during training, avoiding reliance on naively imputed data and achieving superior performance across 25 benchmark datasets compared to conventional methods.'
date: 2025-05-13
venue: 'MDPI Symmetry'
paperurl: 'https://www.mdpi.com/2073-8994/17/6/869'
citation: 'Seo, W.; Khairulov, T.; Baek, H.-J.; Lee, J. ChainImputer: A Neural Network-Based Iterative Imputation Method Using Cumulative Features. Symmetry 2025, 17, 869. https://doi.org/10.3390/sym17060869'
---

The goal of missing value imputation is to replace the missing values in the dataset with specific values. In particular, this preprocessing step plays a crucial role in knowledge discovery and data mining, as most data analysis methods assume complete data and cannot be applied directly to datasets with missing entries. Among various approaches, the neural network-based missing value imputation method has recently gained significant attention due to its superior prediction accuracy based on its excellent capability to fit the given training dataset. Specifically, these approaches conventionally begin by applying a naive missing value imputation to fill all missing entries in the dataset and then train the network on the completed data. Thus, the performance of missing value imputation can be limited because the neural network is trained on an unreliable dataset filled with roughly guessed values. Instead, we may consider an alternative strategy to use only the features without missing values or carefully imputed features obtained during the imputation process, which can be regarded as an asymmetric process because it progressively adds the newly imputed features into the training dataset. In this study, we propose an effective neural network-based imputation method that incrementally constructs a cumulative feature set during training. The experimental results on 25 publicly available datasets showed that the proposed method outperforms conventional methods significantly.

[Download paper here](https://www.mdpi.com/2073-8994/17/6/869)