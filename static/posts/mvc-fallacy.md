---
id: c29c5d4a-b241-460b-80d1-2f1fcecfa7ef
url: mvp-fallacy
title: The MVP fallacy
desc: ""
updated: 1610892080697
created: 1610890082223
---

## The MVP fallacy

Inspired by this post [Sounds Easy by Dan Luu](https://danluu.com/sounds-easy/)

> Businesses that actually care about turning a profit will spend a lot of time (hence, a lot of engineers) working on optimizing systems, even if an MVP for the system could have been built in a weekend.

Far too often companies and especially startups prioritise speed over careful engineering. 'Proof of concepts' (POCs) and 'Minimum Viable Products' (MVPs) often become the products without the necessary work needed to make them client-ready.

As an R&D developer, I've seen it too often and there is no real solution to it apart from a frank discussion with those in charge.

MVPs allow us to prove a point, solve a problem, and then get the funding for it. That feature should not be considered 'done' until we've received the tender and redesigned the solution.

When it comes to R&D project I like to think of the build through the lens of [Martin Kleppmann's ](https://martin.kleppmann.com/) maintainbility principles: Evolvability, Simplicity, and Operability.

## Evolvability

The ability of a project to be easily updated or features can easily be added. The most important build goal for R&D projects and often the one that gets neglected.

But should we note prioritise speed at all cost?

We can, but the cost of that is exponential - usually a 'act first, think later' MVP end up being rewritten. Yes it takes time to plan a solid foundation for an MVP, but the cost of that is too often discounted as wasteful. In reality a bit of planning negates a rewrite.

## Simplicity

Keeping a project lean is actually different depending on who you ask.

Firstly it's important to simplify the ask from a product perspective. As developers we must realise what a user will value and incite dialogue with the product teams. A simple product is not always a simple build, but it reduces some of the 'purpose' questions that we get during a difficult build.

Secondly the source-code must be simple and to simplify the source-code we must abstract, organise, and make use of modules where possible.

MVPs are vehicles for change, they spark change or progress. Usually they trigger new features and improvements, and most of time these changes and improvements are critical. If we can already predict this then it makes sense to prioritise abstraction at build time.

## Operability

Making sure that the MVP can operate under different conditions.

It all starts with documentation and moves on to logging, monitoring, and error handling.

An MVP that cannot be operated is a waste of resources.

## Culture

Culture also has a huge part to play in this MVP fallacy. When we product an MVP developers prove that something is possible and to management that also translates as 'feature X is done'.

The language we use contributes to this when in reality developers skirt around what we 'didn't do' to reach a deadline for the MVP.

This is a simple problem to solve. Developers must have the tools to explain if required for the feature to be complete and managers should never equate an MVP to a completed feature.

Consistently delivering MVPs that get mistaken for full features by management is a bad product scenario since the product over time starts to resemble a 'house of cards'.

## Summary

A completed MVP should never equate a completed feature. It's important that both developers and managers agree on this.

Equally important is that MVP maintainability is prioritised in parallel with speed.

After all 'haste makes waste'.
