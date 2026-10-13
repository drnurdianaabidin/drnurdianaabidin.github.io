---
# ================================================================
# NEW BLOG ARTICLE
# 1. Copy this whole "new-blog-post" folder into src/content/blog/
# 2. Rename the folder to the web address you want, in lower case with
#    hyphens, for example why-muscle-strength-matters
#    The article will be at /blog/why-muscle-strength-matters/
# 3. Fill in the lines below, then write the article under the second ---
# Lines starting with # are notes for you. They never appear on the site.
# Put text inside "double quotes" if it contains a colon (:).
# BLOG-GUIDE.md explains every step.
# ================================================================

# REQUIRED -------------------------------------------------------

title: "Why Muscle Strength Matters More Than You Think"

# One or two sentences that make people want to read on. Shown on the
# article cards, in Google results and in shared link previews.
description: "Strength is not only for athletes. Here is what the evidence says about muscle strength and healthy ageing."

# The publication date: year-month-day.
date: 2026-11-03

# One of the blog topics, spelled exactly as in src/blog.yaml:
#   Science Made Simple
#   Behind the Research
#   AI, Technology & Innovation
#   Life in Academia
#   Healthy Ageing & Everyday Life
category: "Science Made Simple"

# true while you are still writing: the article is then left off the
# published site. Change to false when it is ready.
draft: true

# OPTIONAL -------------------------------------------------------

# A short line shown under the title. Leave it out to show the description.
# subtitle: "What happens to our muscles as we age, and what we can do about it"

# A few keywords. Articles that share tags are suggested to readers together.
tags: [muscle strength, healthy ageing]

# The cover photo: put the file in this folder and write its name here.
# Leave these lines out to use the drawing for the article's topic instead.
# cover: ./cover.jpg
# coverAlt: "Describe the photo for people who cannot see it"
# Who took or made the photo, if it is not yours, and where it came from.
# coverCredit: "Photo: Jane Smith, Unsplash"
# coverCreditUrl: https://unsplash.com/photos/...

# true puts the article in the large Featured position at the top of the
# Blog page. If no article is featured, the newest one is.
featured: false

# The date of a later revision, shown as "Updated ...".
# updated: 2026-12-01

# Pages on this site (or elsewhere) that go with the article. They are
# listed under "Further reading", and pages on this site link back.
# related:
#   - label: "Screening cut-off values for osteosarcopenia (2021)"
#     href: /research/2021-osteosarcopenia-cut-off-values/
#   - label: "The silent health crisis hidden by the scales"
#     href: /community/2026-silent-health-crisis-hidden-by-the-scales/

# A contents list beside the article. Articles with four or more
# ## headings get one automatically; write true or false to choose.
# toc: true
---

Start with a paragraph that makes readers curious. The first letter of the article is shown as a large capital.

## A heading for each part

Write in short paragraphs, with a blank line between them. Use **bold** and *italics* where they help.

> A quotation goes on a line starting with >

A photo with a caption goes on a line of its own, with the caption in quotation marks:

![Describe the photo for people who cannot see it](./photo-1.jpg "Caption shown under the photo. Photo: your name.")

Links look like this: [my publications](/publications/) or [a website](https://www.who.int/).

A claim backed by research can have a numbered reference.[^1]

[^1]: Author A, Author B. Title of the paper. *Journal Name*. 2024;12(3):45–67. https://doi.org/10.xxxx/xxxxx
