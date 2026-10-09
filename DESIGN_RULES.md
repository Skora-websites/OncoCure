# Design Rules

Rules that apply to every section of the Onco Cure Clinic site. Add to this
list; never silently break one.

## 1. Mobile section flow — title → image → description

In **mobile view**, every content section must present in this order:

1. **Title** (section label/heading, or the item's own heading)
2. **Image** (if the section/item has one)
3. **Description** (body copy)

So on small screens the reader always meets *what this is* first, then the
visual, then the detail. Desktop may arrange columns freely, but the mobile
stack must follow this sequence — check it whenever a section renders
differently below the `lg` breakpoint (grid re-ordering, `order-*` classes,
or DOM order that differs per breakpoint).

## 2. Cards animate on their own trigger per input type

Interactive card animations (lift, reveal, flip) must have a non-hover
trigger wherever hover cannot exist:

- **Fine pointer / desktop:** hover may drive the animation.
- **Touch / mobile:** the same animation triggers **on scroll** (as the card
  enters the viewport), and the resting state must still show the card's
  designed look (e.g. card-in-slot), so nothing depends on a hover that will
  never happen.
