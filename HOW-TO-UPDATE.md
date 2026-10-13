# How to update your website

Your website lives at **https://drnurdianaabidin.github.io**

This guide explains, step by step, how to add new work, look at the site on your own computer before anyone else sees it, and publish your changes. You do not need to know any code.

**Contents**

1. [How the site is organised](#1-how-the-site-is-organised)
2. [Add a new piece of work](#2-add-a-new-piece-of-work)
3. [Preview the site on your computer](#3-preview-the-site-on-your-computer)
4. [Publish your changes](#4-publish-your-changes)
5. [Change the categories in a section](#5-change-the-categories-in-a-section)
6. [Replace your CV and portrait](#6-replace-your-cv-and-portrait)
7. [Change your details and remove placeholder highlighting](#7-change-your-details-and-remove-placeholder-highlighting)
8. [Photos and videos](#8-photos-and-videos)
9. [Making changes on the GitHub website instead](#9-making-changes-on-the-github-website-instead)
10. [Setting up your computer (once only)](#10-setting-up-your-computer-once-only)
11. [Using your own domain later](#11-using-your-own-domain-later)
12. [Limits and privacy](#12-limits-and-privacy)
13. [If something goes wrong](#13-if-something-goes-wrong)

---

## 1. How the site is organised

You will only ever need to touch these files and folders:

| What | Where |
| --- | --- |
| Your name, email, affiliations and other details | `src/settings.yaml` |
| The four sections and their categories | `src/sections.yaml` |
| Academic work | `src/content/academic/` |
| Research work | `src/content/research/` |
| Community work | `src/content/community/` |
| Industry work | `src/content/industry/` |
| Your biography, portrait and CV | `src/content/about/` |
| A blank template for new work | `templates/new-work/` |
| The picture shown when someone shares a link to your home page | `public/og-default.jpg` |

**Each piece of work is one folder.** Inside the folder there is a text file called `index.md` and the photos for that piece of work. For example:

```
src/content/research/2026-sarcopenia-screening/
    index.md        the words
    cover.jpg       the main photo
    photo-1.jpg     extra photos for the gallery
    clip.mp4        a short video (optional)
```

The folder name becomes the web address of the page. The example above appears at
`https://drnurdianaabidin.github.io/research/2026-sarcopenia-screening/`

**Placeholder text.** Anything inside `[[double square brackets]]` is placeholder text and shows up highlighted in yellow. When you replace it, remove the brackets too.

---

## 2. Add a new piece of work

1. **Copy the template.** Open the `templates` folder, copy the `new-work` folder, and paste it into the right section folder, for example `src/content/research/`.
2. **Rename the folder.** Use the year first, lower-case letters, and hyphens instead of spaces, for example `2026-grip-strength-study`. Avoid spaces and special characters.
3. **Add your photos.** Put the cover photo in the folder and name it `cover.jpg`, replacing the placeholder. Add any gallery photos as `photo-1.jpg`, `photo-2.jpg` and so on.
4. **Fill in the text.** Open `index.md` in a text editor (see the note below). Fill in each line. The notes starting with `#` explain each field. Delete any optional parts you do not need.
5. **Write the longer description** below the second line of three dashes (`---`).
6. **Preview** (section 3), then **publish** (section 4).

**The fields at a glance**

| Field | Required? | What to write |
| --- | --- | --- |
| `title` | Yes | The title of the work |
| `date` | Yes | Year-month-day, for example `2026-03-14` |
| `type` | Yes | One of the categories for that section, spelled exactly as in `src/sections.yaml` |
| `summary` | Yes | One or two sentences |
| `cover` | Yes | The cover photo file name, for example `./cover.jpg` |
| `coverAlt` | Yes | A short description of the cover photo for people who cannot see it |
| `featured` | No | `true` to show it under "Selected work" on the home page |
| `collaborators` | No | The people and partners involved. They are shown on the page. |
| `collaboratorsLabel` | No | The heading above them, for example `Co-authors` |
| `links` | No | DOI, PDF, slides, news article or any web page |
| `gallery` | No | Extra photos, each with a description |
| `video` | No | A YouTube or Vimeo link, or a short MP4 file in the folder |

**Which program to use for editing.** Any plain text editor works. On Windows, Notepad is fine. A free editor called Visual Studio Code (code.visualstudio.com) is easier because it colours the different parts and shows the folders on the left.

**Text with a colon in it.** If your text contains a colon (`:`), put the whole text inside double quotes, like this:

```
title: "Sarcopenia: a community screening study"
```

---

## 3. Preview the site on your computer

This lets you see your changes before anyone else does. Nothing is published.

1. Open the website folder in **Windows Terminal**. In File Explorer, go into the folder, right-click an empty space and choose **Open in Terminal**. (On Windows 10, click the folder's address bar, type `cmd` and press Enter.)
2. Type this and press Enter:

   ```
   npm run preview
   ```

3. Your web browser opens the site at `http://localhost:4321`. Only your computer can see this address.
4. Leave the Terminal window open. Every time you save a file, the page in your browser updates by itself.
5. When you have finished, go back to Terminal and press **Ctrl** and **C** together to stop the preview.

If you made a mistake in a file, the browser shows a message explaining what to fix and in which file.

---

## 4. Publish your changes

When you are happy with the preview:

1. In Terminal, in the website folder, type:

   ```
   npm run publish
   ```

2. It asks: *In a few words, what did you change?* Type a short note, for example `Added grip strength paper`, and press Enter.
3. The command then:
   - removes location data from your photos and shrinks very large ones
   - checks no file is too large
   - builds the site to check for mistakes
   - saves your changes and sends them to GitHub
4. GitHub rebuilds the live site. It is updated in about **two minutes**.

If anything is wrong, nothing is published and the message tells you what to fix.

To check on progress, open your repository on GitHub and click the **Actions** tab. A green tick means the site is live. A red cross means something went wrong (see section 13).

---

## 5. Change the categories in a section

1. Open `src/sections.yaml`.
2. Each section has a list of categories under `categories:`. Each category is on its own line, starting with a hyphen and a space:

   ```
   research:
     title: Research
     description: Studies of muscle, fat and physical function as people age.
     categories:
       - Publications
       - Current projects
       - Grants
       - Conference presentations
   ```

3. **To add a category,** add a new line in the same style, with the same spacing at the start.
4. **To rename a category,** change it here and also change the `type:` line in every piece of work that uses it. The site will tell you if any piece of work still uses the old name.
5. **To remove a category,** delete its line. First move any work in that category to another one.
6. You can also change each section's one-line `description` here. It appears on the home page panel and at the top of the section page.

Do not change the four section names on the left (`academic:`, `research:`, `community:`, `industry:`) because they match the folder names. You can change the `title:` lines, which are what visitors see.

Filter buttons only appear for categories that have at least one piece of work.

---

## 6. Replace your CV and portrait

Both live in `src/content/about/`.

**CV**
1. Save your CV as a PDF.
2. Name it `cv.pdf`.
3. Put it in `src/content/about/`, replacing the old one.
4. Publish. Visitors download it as `Nurdiana-Zainol-Abidin-CV.pdf`.

Remember that anyone can download your CV. Leave out your home address, phone number, date of birth and identity card number.

**Portrait**
1. Choose a photo, ideally upright (portrait shape). It is shown small, about 5 cm wide.
2. Name it `portrait.jpg`.
3. Put it in `src/content/about/`, replacing the old one.
4. In `src/content/about/index.md`, update the `portraitAlt` line, for example `portraitAlt: "Dr Nurdiana Zainol Abidin"`.

**Biography, positions and education** are also in `src/content/about/index.md`. The biography goes below the second `---` line.

---

## 7. Change your details and remove placeholder highlighting

Open `src/settings.yaml`. It contains your name, institution, affiliations, research interests line, email, the sentence on the Contact page, and the site description used by search engines.

**To list the placeholder text still left**, run this in Terminal:

```
npm run placeholders
```

It lists each file and line that still has text in `[[double square brackets]]`.

**When all the text is real**, turn off the yellow highlighting. In `src/settings.yaml`, change

```
highlightPlaceholders: true
```

to

```
highlightPlaceholders: false
```

and publish.

---

## 8. Photos and videos

**Photos**
- JPEG is best. Phone photos are fine.
- iPhones sometimes save photos as HEIC. Change this under **Settings > Camera > Formats > Most Compatible**, or send the photos to your computer as JPEG.
- You do not need to resize photos. The site makes smaller copies in modern formats, in several sizes, so pages load quickly on phones.
- **Location data.** Photos from phones often contain the GPS location where they were taken. The copies shown on the website never include it. `npm run publish` also removes it from your original files before they are uploaded.
- Every photo needs a short description (`coverAlt` or `alt`) for people who use screen readers.
- Only include photos of people who have agreed to appear on the site.

**Videos**
- **Short clips under about 10 MB** (compressed MP4) can go in the work folder. Write the line as `url: ./my-clip.mp4`
- **Anything longer** should go on YouTube (Unlisted is fine) or Vimeo. Paste the address into the `url:` line, for example `url: https://www.youtube.com/watch?v=abc123xyz`
- YouTube and Vimeo videos only load when a visitor presses play, so pages stay fast. YouTube videos use the privacy-enhanced version of YouTube.
- Add a `poster:` photo to choose the still image shown before the video plays. Otherwise the cover photo is used.

---

## 9. Making changes on the GitHub website instead

You can make small changes without installing anything, directly on github.com:

1. Go to **https://github.com/drnurdianaabidin/drnurdianaabidin.github.io** and sign in.
2. Click through the folders to the file you want, for example `src/settings.yaml`.
3. Click the **pencil icon** (Edit this file), make your change, then click **Commit changes**.
4. The site rebuilds automatically in about two minutes.

To add photos, open the right folder, then choose **Add file > Upload files**.

**Important:** photos uploaded this way go straight into the public repository with their location data still inside the original file. The website copies are still clean, but the original can be downloaded from GitHub. Before uploading on the GitHub website, remove the data on Windows: right-click the photo, choose **Properties > Details > Remove Properties and Personal Information**, then **Create a copy with all possible properties removed**. Upload the copy.

For adding new pieces of work, using your computer (sections 2 to 4) is easier.

You can also ask Claude to make changes for you, for example: *"Add a new research item about my 2026 grant, here is the text and the photos."*

---

## 10. Setting up your computer (once only)

You only need to do this once, on your Windows computer.

**Step 1. Install three free programs.** Accept the default options in each installer.
- **Git** from https://git-scm.com/download/win
- **Node.js** (choose the version marked **LTS**) from https://nodejs.org
- **GitHub CLI** from https://cli.github.com

**Step 2. Check they installed.** Open **Windows Terminal** (search for "Terminal" in the Start menu) and type each line, pressing Enter after each one. Each should print a version number.

```
git --version
node --version
gh --version
```

If one says "not recognised", close Terminal, open it again and retry. If it still fails, restart the computer.

**Step 3. Sign in to GitHub.**

```
gh auth login
```

Choose **GitHub.com**, then **HTTPS**, then **Yes** to authenticate Git, then **Login with a web browser**. Copy the code shown, press Enter, paste the code in the browser page that opens, and approve.

**Step 4. Tell Git your name** (used to label your changes):

```
git config --global user.name "Nurdiana Zainol Abidin"
git config --global user.email "your-email@example.com"
```

Use the email address of your GitHub account.

**Step 5. Download the website to your computer.** This creates a folder in your Documents:

```
cd Documents
gh repo clone drnurdianaabidin/drnurdianaabidin.github.io
cd drnurdianaabidin.github.io
npm install
```

`npm install` takes a minute or two. From now on, the website lives in `Documents\drnurdianaabidin.github.io`.

**Step 6. Try it.** Type `npm run preview`. Your browser should open the site.

**Working on more than one computer, or after editing on github.com?** Before you start making changes, open Terminal in the website folder and type `git pull` to fetch the latest version.

---

## 11. Using your own domain later

You can connect your own address, such as nurdiana.com, at any time. Nothing needs to be rebuilt.

1. **Buy the domain** from a registrar such as Namecheap, Cloudflare or Exabytes (about RM 50 to RM 100 a year for a .com).
2. **Point it at GitHub.** In the registrar's DNS settings, add these records:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | drnurdianaabidin.github.io |

3. **Tell GitHub.** In your repository on github.com, go to **Settings > Pages > Custom domain**, type the domain, and click **Save**. Wait for the check to pass (it can take up to a day), then tick **Enforce HTTPS**.
4. **Tell the website.** In `src/settings.yaml`, change `siteUrl` to the new address, for example `siteUrl: https://nurdiana.com`, and publish. This keeps search engines and shared links pointing to the right place.

The old github.io address will forward to the new one automatically.

---

## 12. Limits and privacy

**GitHub Pages limits** (all free):
- The published site must stay under **1 GB**.
- No single file can be over **100 MB**.
- Visitors can download about **100 GB a month** in total, which is plenty for a site like this, but not for long videos. This is why longer videos go on YouTube or Vimeo.

`npm run publish` warns you before you reach any of these limits.

**Everything in the repository is public.** Anyone can see every file in it, including old versions. Never put any of these in it:
- unpublished data or results
- drafts you are not ready to share
- student records, marks or personal details
- ethics documents, contracts or other private files
- photos of people who have not agreed

If something private is ever uploaded by mistake, deleting it is not enough because old versions stay visible. Ask for help to remove it from the history.

---

## 13. If something goes wrong

**The preview or publish shows an error.** Read the message. It names the file and says what is missing or misspelled. Common causes:
- a required line is missing, such as `coverAlt:`
- the `type:` does not exactly match a category in `src/sections.yaml`
- a photo file name in `index.md` does not match the actual file name (check capital letters and `.jpg` against `.jpeg`)
- text containing a colon is not inside double quotes
- the spaces at the start of a line do not line up with the lines around it

**The Actions tab on GitHub shows a red cross.** Click on it to see the message. The live site keeps showing the last working version until the problem is fixed, so visitors never see a broken site.

**You want to undo a change.** On GitHub, the **History** button on any file shows earlier versions, and you can copy back the old text.

**Still stuck?** Ask Claude, and paste the error message.
