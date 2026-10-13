# Writing for the blog: Beyond the Lab

The blog lives at **https://drnurdianaabidin.github.io/blog/**

Each article is one folder with a text file and its photos. You never need to touch the design: when you add an article, the site makes its page, puts it on the Blog page, in its topic, in the archive, in the RSS feed and (for the newest three) on the home page.

**Contents**

1. [Create a new article](#1-create-a-new-article)
2. [Write the text and headings](#2-write-the-text-and-headings)
3. [Add photographs and figures](#3-add-photographs-and-figures)
4. [Add links and references](#4-add-links-and-references)
5. [Save an unfinished draft](#5-save-an-unfinished-draft)
6. [Preview before publishing](#6-preview-before-publishing)
7. [Publish the article](#7-publish-the-article)
8. [Edit an existing article](#8-edit-an-existing-article)
9. [Add or change a topic](#9-add-or-change-a-topic)
10. [Choosing pictures](#10-choosing-pictures)
11. [Writing style](#11-writing-style)
12. [Ideas for future articles](#12-ideas-for-future-articles)
13. [Blog settings](#13-blog-settings)
14. [Optional later: writing in the browser](#14-optional-later-writing-in-the-browser)
15. [If something goes wrong](#15-if-something-goes-wrong)

Your first article, **Welcome to Beyond the Lab**, is waiting as a draft in `src/content/blog/welcome-to-beyond-the-lab/index.md`.

---

## 1. Create a new article

1. Open the `templates` folder and copy the `new-blog-post` folder.
2. Paste it into `src/content/blog/`.
3. Rename the folder to the web address you want, in lower case with hyphens between the words. For example, a folder called `why-muscle-strength-matters` becomes **/blog/why-muscle-strength-matters/**. Keep it short; you cannot easily change it once people have shared the link.
4. Open `index.md` inside the folder in a text editor (Notepad, TextEdit or VS Code).
5. Fill in the lines at the top, between the two `---` lines. The notes beside each line (starting with `#`) explain what to write.
6. Write the article below the second `---` line.
7. Delete the example photo `photo-1.jpg` if you are not using it.

**The lines at the top**

| Line | Needed? | What it is |
| --- | --- | --- |
| `title` | Yes | The headline |
| `description` | Yes | One or two sentences shown on cards, in Google and in shared links |
| `date` | Yes | The publication date, year-month-day, for example `2026-11-03` |
| `category` | Yes | One of the five topics, spelled exactly as in `src/blog.yaml` |
| `draft` | No | `true` keeps the article off the published site. Leave it out, or write `false`, to publish |
| `subtitle` | No | A short line under the title. Without it, the description is shown there |
| `tags` | No | A few keywords, for example `[sarcopenia, exercise]`. Articles that share tags are suggested together |
| `cover` and `coverAlt` | No | A cover photo and a description of it (see section 3). Without a cover, the drawing for the topic is used |
| `coverCredit` and `coverCreditUrl` | No | Who took the photo, and a link to where it came from |
| `featured` | No | `true` puts the article in the large Featured spot. Otherwise the newest article is featured |
| `updated` | No | The date of a later revision, shown as "Updated ..." |
| `related` | No | Pages that go with the article, listed under "Further reading" (see section 4) |
| `toc` | No | A contents list beside the article: `true` or `false`. Articles with four or more `##` headings get one automatically |
| `author` | No | Only for a guest article. It is you unless you say otherwise |

Put text inside "double quotes" if it contains a colon, for example `title: "Sarcopenia: what is it?"`

---

## 2. Write the text and headings

The article is written in Markdown, which is plain text with a few symbols:

| You type | You get |
| --- | --- |
| A blank line between paragraphs | A new paragraph |
| `## Why it matters` | A section heading (also listed in the contents) |
| `### A smaller point` | A smaller heading inside a section |
| `**strong**` | **strong** |
| `*emphasis*` | *emphasis* |
| `- first item` on separate lines | A bulleted list |
| `1. first step` on separate lines | A numbered list |
| `> A memorable sentence` | A quotation, shown large and elegant |
| `---` on its own line, with a blank line above | A quiet divider |
| `H<sub>2</sub>O` and `10<sup>3</sup>` | Subscript and superscript |

Tables are written with vertical bars:

```
| Measure | Before | After |
| --- | --- | --- |
| Grip strength (kg) | 22 | 25 |
```

The first letter of the article appears as a large capital, so start with a strong opening sentence.

---

## 3. Add photographs and figures

1. Put the photo in the article's folder, for example `grip-test.jpg`. JPEG photos straight from a phone or camera are fine; the site makes small, fast copies itself.
2. Where you want it, on a line of its own, write:

   ```
   ![Describe the photo for people who cannot see it](./grip-test.jpg "Caption shown under the photo. Photo: your name.")
   ```

   - The words in square brackets are the description read aloud to people who cannot see the picture. Always write one.
   - The words in quotation marks become the caption under the picture. Leave them out for no caption.

**A cover photo** goes at the top of the article and on its card. Put the file in the folder and add, at the top:

```
cover: ./cover.jpg
coverAlt: "Older adults doing resistance exercises in a community hall"
coverCredit: "Photo: Jane Smith"
```

A wide (landscape) photo works best. Without a cover, the article uses the drawing for its topic, labelled as a conceptual illustration.

Only use photos of people who have agreed to appear on the site, and never photos that could identify research participants.

---

## 4. Add links and references

**Links** go in the text like this:

```
Read more in [my publications](/publications/), or on the [WHO website](https://www.who.int/).
```

Links to your own pages start with `/`. Links to other websites start with `https://`.

**References.** Put a marker where the claim is, and the reference anywhere below (the end of the article is tidiest):

```
Muscle strength declines faster than muscle mass in older age.[^1]

[^1]: Goodpaster BH, et al. The loss of skeletal muscle strength, mass, and quality in older adults. *J Gerontol A Biol Sci Med Sci*. 2006;61(10):1059–1064. https://doi.org/10.1093/gerona/61.10.1059
```

The marker becomes a small clickable number, and the references are collected under a **References** heading at the end, each with a link back to where it was cited. Use `[^2]`, `[^3]` and so on for more. Please check every reference against the original paper.

**Further reading.** To point readers to your research, publications or newspaper articles, list them at the top:

```
related:
  - label: "Screening cut-off values for osteosarcopenia (2021)"
    href: /research/2021-osteosarcopenia-cut-off-values/
  - label: "The silent health crisis hidden by the scales"
    href: /community/2026-silent-health-crisis-hidden-by-the-scales/
```

They appear in a "Further reading" box after the article. Each page of your own site listed there also links back to the article automatically, under "On the blog".

---

## 5. Save an unfinished draft

At the top of the article, write:

```
draft: true
```

A draft appears when you preview on your own computer (section 6), with a yellow "Draft" label, but never on the published site: no page, no card, no RSS entry and no listing for Google.

**Keeping a draft private.** Your website's files on GitHub are public, so anyone who browses the repository on GitHub could read a draft that has been uploaded, even though it is not on the website. To keep a draft entirely on your own computer, start its folder name with `private-`, for example `src/content/blog/private-muscle-strength/`. Folders named this way are never uploaded. When the article is ready, rename the folder without `private-` and set `draft: false`.

---

## 6. Preview before publishing

Follow section 3 of HOW-TO-UPDATE.md: in Terminal, in the website folder, type `npm run preview`. Then open **http://localhost:4321/blog/** in your browser. Drafts are included and marked, and the page updates every time you save the file.

You can also ask Claude to show you screenshots of a draft.

---

## 7. Publish the article

1. At the top of the article, change `draft: true` to `draft: false` (or delete the line).
2. Set `date:` to the day you publish.
3. Publish as usual (section 4 of HOW-TO-UPDATE.md): in Terminal, type `npm run publish` and give a short note such as `New blog article on muscle strength`.

The site is updated in about two minutes. The article appears at the top of the Blog page, in its topic, in the archive, in the RSS feed and on the home page under "Latest From the Blog".

You can also publish from the GitHub website (section 10 of HOW-TO-UPDATE.md), or ask Claude: *"Publish my blog article on muscle strength."*

---

## 8. Edit an existing article

1. Open its folder in `src/content/blog/` and edit `index.md`.
2. For a meaningful change after publishing, add `updated: 2026-12-01` (the date of the change). Readers then see "Updated 1 December 2026".
3. Preview and publish as above.

Avoid renaming the folder of a published article, because that changes its web address and breaks links people have shared.

To take an article down, set `draft: true` and publish, or delete its folder.

---

## 9. Add or change a topic

The topics are listed in `src/blog.yaml`:

```
categories:
  - name: Science Made Simple
    description: How the body works, and what the evidence really says, in plain language.
    colour: teal
    image: musculoskeletal
```

- **To add a topic,** copy one of these blocks and change it. `colour` is one of teal, violet, blue, amber or sage. `image` is the drawing used for articles without a cover photo: musculoskeletal, bone, prediction, exercise, digital, microneedle, community, physioverse, quiz, fibres or journal.
- **To rename a topic,** change the name here and in every article that uses it. The site tells you if an article still uses the old name.
- A topic only appears to visitors once it has a published article.

---

## 10. Choosing pictures

Pictures make articles inviting, but they must be honest:

- **Best:** your own photographs, such as your laboratory, equipment, prototypes, teaching and community events, with permission from anyone shown.
- **Free photo libraries** such as Unsplash, Pexels and Wikimedia Commons are fine. Check the licence, and credit the photographer in `coverCredit` (and the caption for photos inside the article).
- **The topic drawings** on this site are original conceptual illustrations. They are used automatically when there is no cover photo and are labelled as illustrations.
- **Never** use a picture that could be mistaken for your own research when it is not, such as a stock photo of a laboratory presented as yours, a made-up chart presented as real data, or an AI-generated picture of a patient or participant.

Always describe each picture in its description (`coverAlt`, or the words in square brackets) for people who use screen readers.

---

## 11. Writing style

A few reminders, in the spirit of the blog:

- Write as a scientist explaining something interesting to a friend, not as a journal manuscript.
- Open with a question, a puzzle or an everyday moment that makes people curious.
- Use "I" for your own experience and views, and plain words for the science. Explain a technical term the first time you use it, or leave it out.
- Keep paragraphs short to medium, and use headings so readers can find their way.
- Back research claims with a reference (section 4), and say clearly what is known, what is likely and what is still uncertain.
- Choose clear, honest headlines rather than dramatic ones.
- Every article says, at the end, that blog posts are personal writing and not peer-reviewed, so readers can tell them apart from your publications.

---

## 12. Ideas for future articles

A list to draw on. None of these are written yet.

**Science Made Simple**
- Why Your Weight Doesn't Tell the Whole Story
- What Happens to Our Muscles as We Age?
- Why Muscle Strength Matters More Than You Think
- Exercise and Inflammation: What Does the Science Say?

**Behind the Research**
- From an Idea to a Microneedle Patch: My Research Journey
- What Happens Before a Research Paper Gets Published?
- How Research Questions Become Research Projects
- The Unexpected Challenges of Experimental Research

**AI, Technology & Innovation**
- Can AI Help Us Detect Muscle Loss?
- What Machine Learning Really Means in Healthcare
- Can Virtual Reality Help Older Adults Stay Active?
- When Does a Research Idea Become an Innovation?

**Life in Academia**
- What Nobody Tells You About Publishing Research
- Lessons From Supervising Postgraduate Students
- What Teaching Has Taught Me
- Why Good Research Takes Time

**Healthy Ageing & Everyday Life**
- Is Walking Enough to Maintain Muscle Strength?
- Why Resistance Exercise Matters as We Age
- Understanding Sarcopenic Obesity
- What Does Healthy Ageing Really Mean?

Good pairings for "Further reading": an article on sarcopenic obesity could link to your osteosarcopenia papers and to *The silent health crisis hidden by the scales* on the Media page; an article on the microneedle patch could link to the project page and the Innovations page.

---

## 13. Blog settings

`src/blog.yaml` also holds:

| Setting | What it does |
| --- | --- |
| `title`, `tagline`, `heroLine`, `introduction` | The words at the top of the Blog page |
| `postsOnBlogPage` | How many articles the Blog page shows before pointing to the archive (12) |
| `archivePageSize` | How many articles each archive page lists (40) |
| `searchFrom` | The search box appears once there are this many published articles (6) |
| `wordsPerMinute` | Reading speed for the "5 min read" estimate (220) |

---

## 14. Optional later: writing in the browser

If you would rather write in a web page than in text files, a free editor can be added later without changing how the site works. **Pages CMS** (pagescms.org) is the simplest fit: you sign in with your GitHub account and get forms for the article details and a text editor, and it saves straight to the repository, which then publishes as usual. **Sveltia CMS** is a similar option. Both are outside services that need permission to change your repository, so they are worth adding only if you find the text files awkward. Claude can set one up for you.

---

## 15. If something goes wrong

The site checks every article when it builds, and explains any problem in plain words, naming the article's folder. The most common ones:

- **"... is not one of the blog topics"**: the `category` is spelled differently from `src/blog.yaml`. Capital letters matter.
- **"This article has a cover photo but no coverAlt"**: add a description of the cover photo.
- **"needs a date"** or **"is not understood"**: write the date as year-month-day, for example `2026-11-03`.
- **A photo cannot be found**: check the file name, including capital letters and the ending (`.jpg` or `.jpeg`), and that the photo is in the same folder.
- **The field ... is not recognised**: a line at the top is misspelled; compare it with the template.
- **The article does not appear on the site**: check that `draft` is `false` or deleted, and that the folder name does not start with `private-` or `_`.
