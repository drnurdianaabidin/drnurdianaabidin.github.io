---
# ================================================================
# NEW PIECE OF WORK
# 1. Copy this whole "new-work" folder into the right section folder:
#      src/content/academic/   src/content/research/
#      src/content/community/  src/content/industry/
# 2. Rename the folder, for example 2026-sarcopenia-screening
#    (year first, lower case, words joined with hyphens).
#    The folder name becomes the web address of the page.
# 3. Put your photos in the same folder and fill in the lines below.
# Lines starting with # are notes for you. They never appear on the site.
# Put text inside "double quotes" if it contains a colon (:).
# ================================================================

# REQUIRED -------------------------------------------------------

title: "Title of the work"

# Year-month-day
date: 2026-01-31

# Must match one of the categories for this section in src/sections.yaml,
# spelled exactly the same. For example: Publications
type: Publications

# One or two sentences. Shown on cards and in shared link previews.
summary: "One or two sentences describing what the work did and who it involved."

# The main photo. Put the file in this folder and write its name here.
cover: ./cover.jpg

# A short description of the cover photo for people who cannot see it.
coverAlt: "Describe what the cover photo shows."

# OPTIONAL: delete any section you do not need -------------------

# true shows this work under "Selected work" on the home page.
featured: false

# The heading above the list of people, for example Co-authors,
# Research team, Community partners. Leave out to use "Collaborators".
collaboratorsLabel: Collaborators

# One person or organisation per line. Role, affiliation and url are optional.
collaborators:
  - name: "Name of person or organisation"
    role: "Their role"
    affiliation: "Their institution"
  - "A name on its own also works"

# Links. The label is the text shown. To link a PDF, put it in this
# folder and write its name as ./my-file.pdf
links:
  - label: DOI
    url: https://doi.org/10.xxxx/xxxxx
  - label: News article
    url: https://www.example.com

# Photos shown in a gallery. Each needs a description (alt).
gallery:
  - image: ./photo-1.jpg
    alt: "Describe what the photo shows."
    caption: "Optional caption shown under the photo."

# One video. Use a YouTube or Vimeo link, or a short MP4 (under 10 MB)
# kept in this folder, written as ./my-clip.mp4
# poster is an optional still image shown before the video plays.
video:
  url: https://www.youtube.com/watch?v=xxxxxxxxxxx
  title: "What the video shows"
  poster: ./cover.jpg
---

Write the longer description here, below the line of three dashes.
Leave a blank line between paragraphs.

## A subheading

Use two hash signs and a space to make a subheading. Put **two stars**
around words to make them bold, and *one star* for italics.

- A line starting with a hyphen and a space becomes a bullet point.
- [Text for a link](https://www.example.com) makes a link.
