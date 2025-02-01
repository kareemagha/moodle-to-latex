# moodle-to-latex
Converts moodle quiz questions into copy and paste LaTeX syntax

note: this was made to work specifically for UNSW physics 1131/1231 quizzes, ymmv

## Example Use
Following file contains all questions from the week 1 quiz for PHYS1231 in LaTeX and compiled PDF format.

[Week 1 Quiz (tex)](examples/week1.tex)  
[Week 1 Quiz (pdf)](examples/week1.pdf)  

nb: the ~ (tilde) above letters represents the vector hat. Read more about why this happens [here.](https://tex.stackexchange.com/questions/601333/i-have-a-problem-in-inserting-the-vector-symbol)

tl:dr - oversight in question typesetting by UNSW Physics

You can also enable the upload to imgur feature for images however it requrires the use of wget (i.e. wont work on overleaf, only local instances, read more about it [here](https://tex.stackexchange.com/questions/5433/can-i-use-an-image-located-on-the-web-in-a-latex-document)). Uploading requires a client-id and a delete hash (for the imgur album). Learn more about how to get one via the [Imgur API Docs](https://apidocs.imgur.com/) and [this nice guide](https://raddevon.com/articles/learn-read-api-documentation-building-imgur-album-specific-uploader/). 

Example use:  
[Uploaded URL Image (tex)](examples/embeded_url.tex)  
[Uploaded URL Image (pdf)](examples/embeded_url.pdf)  

nb: as of publishing this version, imgur api replies with a [429 HTTP error](https://http.cat/status/429), after only trying to upload 1 image.  

tl:dr - Imgur upload may not be the best

## Making Changes
This extension is written in typescript and is compiled to JS when run. Compilation is done by:

```bash
tsc src
```

This extension uses [roll-up](https://www.extend-chrome.dev/rollup-plugin), to allow for importing / exporting functions in the content scripts. The usable code is found in [dist](dist/), and can be compiled via:

```bash
npm run build
```
