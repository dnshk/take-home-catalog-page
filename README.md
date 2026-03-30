Catalog Page Take-Home

A responsive catalog page built with Next.js, TypeScript, Chakra UI, and Contentful. The page supports CMS-driven display mappings, role-based catalog visibility, and server-side authentication-specific pricing.

Deployment: https://dnshk-catalog.netlify.app/

Tech Stack:
- Next.js (App Router) for SSR and routing
- TypeScript for type safety
- Chakra UI for responsive UI components
- Contentful as the headless CMS
- Netlify for deployment

Why I chose this stack:
I chose Next.js because the assignment required the correct audience price to be determined server-side and included in the initial render. Next.js made that straightforward through server-rendered routes and cookie-based request handling.

I used Contentful because it has a free tier, is quick to model, and lets display mappings be managed through CMS content rather than hardcoded in the frontend as required by the instructions.

I used Chakra UI to move quickly while still keeping the interface polished, responsive, and consistent.

Features

Catalog list with:
title
image
price
category
attributes
Filtering by category
Text search
CMS-driven display mappings
Logged out state:
shows Set A only
shows logged-out price
Logged in state:
shows Set A and Set B
shows logged-in price
Mapping selection persists across refresh
Responsive layout from mobile to desktop
Loading skeleton
Empty state for no matching results
How server-side pricing works

The current viewer state is stored in a cookie (authState).

On the server:

the page reads the authState cookie
products are fetched from Contentful
the visible card sets are filtered based on auth state
the correct price is resolved before rendering:
priceLoggedOut for logged-out viewers
priceLoggedIn for logged-in viewers

This means the rendered output already contains the correct price for the current auth state, rather than switching prices on the client side.

Content model in Contentful
Content type: item

Fields:

title — short text
slug — short text
author — short text
category — short text
imageUrl — short text
cardSet — short text (A or B)
priceLoggedOut — decimal number
priceLoggedIn — decimal number
description — short text (short description to be shown on a card)
attributes — JSON object

Example attributes value:

{
  "format": "Hardcover",
  "language": "English",
  "pages": "320",
  "year": "2024",
  "rating": "4.7",
}
Content type: displayMapping

Fields:

label — short text
key — short text (price_first or specs_first)
showPrice — boolean
showSubtitle — boolean
subtitleField — short text
badgeKeys — JSON object

Example displayMapping entries:

price_first
showPrice: true
showSubtitle: true
subtitleField: "price"
badgeKeys: ["format", "rating", "language"]
specs_first
showPrice: false
showSubtitle: false
subtitleField: "none"
badgeKeys: ["pages", "year", "audience"]
How display mapping works

Display mappings are stored in Contentful and fetched with the catalog data.

The selected mapping controls:

whether price is emphasized
whether subtitle is shown
which field is used as subtitle
which attributes are rendered as badges

This allows the same item data to be presented differently without changing frontend code.


Note: the Contentful environment is currently set to master in code for simplicity.


To stay within the assignment timebox, I kept image management simple by using imageUrl as a text field in Contentful rather than a native media asset field.

I also standardized attribute keys by convention and normalized them in the application layer rather than introducing a more complex CMS schema (which is not suported natively) for dynamic attributes.

These choices kept the implementation focused while still meeting the core functional requirements.

What I’d do next:
Move from imageUrl to native Contentful media assets for image metadata, editor-friendly asset management, and better long-term scalability
Add stronger validation for attributes, either through explicit modeling or a more structured attribute system
Add pagination for larger catalogs
Add tests for:
audience-based filtering
server-side price resolution
display mapping rendering
Add preview mode for unpublished CMS content
Add richer accessibility polish and keyboard/focus-state refinements
Add structured data for the catalog page

Notes
Authentication is intentionally lightweight and simulated through a cookie-based toggle in order to focus on the core assignment requirements:

role-based visibility
server-side price resolution
CMS-driven presentation

To run it locally, the regular steps are to be taken:
add .env.local to the parent folder (I will send the keys)
npm install
npm run dev