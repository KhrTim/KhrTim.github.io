# TODO

Open items from the site review. Everything else from that review is already fixed and on master.

## Fix — content is wrong or contradicts itself

- [ ] **`files/curriculum_learning_blog_post.ipynb` contradicts the pages that link to it.**
  It still reports `+2.34%` / `62.50%` baseline and "small models showed **minimal** improvement".
  The blog post's own table says `| Normal | PHI2 | 28.91 | -1.36% |`, and
  `_portfolio/curriculum-learning-math.md` was corrected to `+1.37%` (difficult stage) / "no improvement".
  The notebook is served at `/files/curriculum_learning_blog_post.ipynb` and linked from
  `_portfolio/curriculum-learning-math.md:12` and `:115`.
  → Regenerate the notebook from the real results, or drop both links.

- [ ] **Degree status is stale** (it is 2026).
  `_publications/2025-masters-thesis.md:14` — `**Expected Completion:** 2025`
  `_pages/cv.md:20` — `(Expected 2025)`
  `_pages/cv.md:17` — still `February 2024--Present`
  → Set the actual completion month/year, or push the expectation forward.

- [ ] **Three claims on `_portfolio/curriculum-learning-math.md` appear nowhere in the linked post.**
  Line 66 "checkpointed at 10/25/50/75/100% of training"; lines 58-60 and 94-97 on model merging and
  catastrophic forgetting.
  → Confirm against the experiment and cite it, or cut.

- [ ] **`_portfolio/feature-selection-research.md` — "Development Period: August 2025"** contradicts the
  same file's claim of supporting 2024 publications.

## Check — needs your judgement

- [ ] **Interior nav wraps to two rows below 600px** (masthead becomes 105px tall).
  Verified correct and non-overlapping by measurement, but it is a design call — look at it on a real phone.
  `_sass/layout/_navigation.scss`, `_sass/layout/_masthead.scss:43`, `_includes/head/custom.html:37`

- [ ] **Two brand colours shifted to pass WCAG AA.** Both old values failed at the sizes they are used
  (`.sec-h` 0.9rem, `.card .idx` 0.78rem, `.tag` 0.7rem — all well under the large-text threshold):
  `--c1` `#0891b2` → `#0e7490` (3.46:1 → 5.04:1)
  `--c3` `#db2777` → `#be185d` (4.32:1 → 5.68:1)
  → Keep, or revert in `_layouts/home.html:31,33` and accept the contrast miss.

## Add

- [ ] **Real HuggingFace Space URLs.** The `https://huggingface.co/spaces/...` placeholders shipped as live
  "Interactive Demo" links; they were removed along with the "Deployed on HuggingFace Spaces for public
  access" claim in `_portfolio/vlm-optimization.md`. Put them back if the Spaces exist.

- [ ] **`og_image`** — `_config.yml:142` is blank, so no page has a social preview image.
  Drop a 1200×630 PNG at `/images/og-default.png` and set the key; the fallback in
  `_includes/seo.html:130-139` already reads it.

- [ ] **Per-page `description:` front matter.** Six pages currently share the same site-wide description.

## Cleanup — dead since the jQuery removal

- [ ] `_includes/category-list.html`
- [ ] `assets/js/_main.js`, `assets/js/collapse.js`, `assets/js/plugins/jquery.greedy-navigation.js`
- [ ] `_includes/comments-providers/*` — jQuery-dependent, and `comments.provider` is unset
- [ ] `package.json:36` — the `uglify` script still bundles the deleted inputs

## Local dev

System ruby is broken (Homebrew ruby 4.0 cannot build `rdiscount`; the rbenv 3.1.2 install has an
incomplete stdlib). Use Homebrew's ruby 3.3:

```sh
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$HOME/.gem/ruby/3.3.0/bin:$PATH" GEM_HOME="$HOME/.gem/ruby/3.3.0"
bundle exec jekyll serve --livereload
```
