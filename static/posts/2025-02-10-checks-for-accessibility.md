---
title: W3C, easy checks for accessibility
url: 2025-02-10-checks-for-accessibility
desc: ''
updated: 10/02/2025
created: 10/02/2025
tags: ['web', 'frontend']
---

# W3C, easy checks for accessibility

Accessibility is important and has been since working at [Code Computer Love](https://www.em-code.com/), a design and development agency from Manchester known for top notch Design and UX research.

Here is a rundown of the [W3C - preliminary check](https://www.w3.org/WAI/test-evaluate/preliminary/) as applied to my new portfolio redesign. 

## Title page

Test:

```md
[ ] each page contains a title that is visible in the browser
```

Test notes:

```
- Confirmed
```

Implement:
- Create a dynamic title component and load it into each page.
- This will allow for a dynamic title that always includes "Alan Ionita - " for search ranking purposes

```js
// PageTitle component

<script>
    const siteName = "Alan Ionita"
    let props = $props();
</script>

<svelte:head>
	<title>{siteName + " - " + props.text}</title>
</svelte:head>

```

```js
// *Page component
import PageTitle from '...'

<PageTitle text="Each page title" />

```

## Page headings

Test: 

```md
[ ] The page has a heading. In almost all pages there should be at least one heading.
[ ] All text that looks like a heading is marked up as a heading.
[ ] All text that is marked up as a heading is really a conceptual section heading.
[ ] The heading hierarchy is meaningful. 
    - Ideally the page starts with an "h1", which is usually similar to the page title
``` 

Test notes: 

```md
HomePage: 
- hierarchy is a bit odd with only "Alan Ionita," being marked up as h1
    - the whole section should be an h1 really
- rest of the hierarchy makes sense
- html structure for each section seems a bit overkill; too many nested elements

BlogPage: 
- headings are good

BlogPostPage: 
- markdown to html headings converted correctly
- needed to correct the source markdown to make sure that each post had an h1
```

## Contrast ratio

Test:

```md
[ ] minimum contrast: a contrast ratio of at least 4.5:1 for normal-size text.
[ ] provide support for high contrast
```

Test notes:

```md
BlogPostPage: 
- starting here, because it's the page with most content
- core font is rated as AAA compliant with a contrast of 6.77

BlogPage: 
- h1 is compliant to AAA (6.77)
- blog list main text is AA (3.09) 
- sub-text AA (3.84)

HomePage
- orange section is AA
- rest is AAA
- same scores as above

Nav: 
- not-visited links are not compliant (2.9)
```

Implement: 
- Find colour variant for orange to get to AAA adherence
- Missing support for "prefers-contrast" option, high contrast solution for users that need it. Will require some research on best colours to use to achieve a high contrast whilst still preserving the theme, as a fallback will just default to black,yellow combination
- `prefers-contrast` further reading [here](https://hacks.mozilla.org/2020/07/adding-prefers-contrast-to-firefox/)


### Check contrast

My preference is to use Firefox for personal development and will not cover Chrome. 

1. Inspect text element

2. Inspector: verify the correct html element is selected

3. Inspector: in the Styles side panel find the class that provides the color css

4. Inspector / Styles: click on the color round icon

5. Inspector / Styles: check the contrast in the pop-up  


## Text resize

Test:

```md
- [ ] make sure that resizing text doesn't cause page overflows, or stop interactive elements from being accessible
```

Test notes:

```md
- Overflowing was causing the Nav to no longer be accessible, so made a change to fix that.
- All other elements and pages are passing.
```

## Keyboard, and visual focus

Test:

```md
- [ ] test keyboard nav and visual focus
```

Test notes:

```md

HomePage: 
- keyboard navigation works correctly across links
- ideally the navigation should cover all the sections too
- will require a refactor to improve the page

BlogPage: 
- works as expected since the list is correctly styled as a list

BlogPostPage: 
- correctly navigates through links, but this is correct behavior here

- Tab all, Tab away, Tab order is fine
- All functionality works by keyboard
- Admittedly it's a very simple site with a low number of features
- Dropdown list navigation and image links considerations are not applicable here
```

Implement:
- Visual focus styling is a visually weak, somewhat clashing with the theme; will require a refactor

## Forms, labels, and errors

Not applicable here

## Moving, or Flashing Content

Test notes:
- Since the site is a static site, there's no perceivable load or layout shift.
- The only thing of note here is the transition from `/` to `/blog`, where `/` is a dark colour and `/blog` is a lighter colour. Here the design is such that on `/blog` there's colour degradation from top to bottom of page so the user is gradually moving from dark colours to lighter colours.

## Multimedia alternatives

Not applicable

## Basic structure check

Test:

```md
[ ] Turn off images and show the text alternatives.
[ ] Turn off style sheets (CSS), which specifies how the page is displayed with layout, colors, etc.
[ ] Linearize the page or the tables (depending on the toolbar).
```

Test notes:

```md
HomePage: 
- images are not applicable, CSS off looks ok
- already a fairly linear layout so working as expected 
- nav is off to right, should fix

BlogPage: 
- same nav issue, main text ok
- post list is completely white and invisible, should fix

BlogPostPage: 
- passing, same nav issue 

+ Both issues were down to poor testing, see the below script to correctly run the test
```

### Disabling CSS stylesheets

Run the following in the Developer Tools Console

```js
document.querySelectorAll('style, link[rel="stylesheet"]').forEach(e => e.remove());
```

## Summary

With the exception of the orange colour and the visual focus, we have a AAA compliant website. 
