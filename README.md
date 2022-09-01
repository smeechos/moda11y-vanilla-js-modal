# moda11y-vanilla-js-modal
![GitHub](https://img.shields.io/github/license/smeechos/moda11y-vanilla-js-modal)
![GitHub package.json version](https://img.shields.io/github/package-json/v/smeechos/moda11y-vanilla-js-modal)
![GitHub JS file size in bytes](https://img.shields.io/github/size/smeechos/moda11y-vanilla-js-modal/index.js?label=JS%20File%20Size)
![GitHub CSS file size in btyes](https://img.shields.io/github/size/smeechos/moda11y-vanilla-js-modal/dist/styles/moda11y-css.min.css?label=CSS%20File%20Size)

Simple vanilla JS modal library based on [WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/) guidelines, specifically
as it relates to [dialogs / modals](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/).

Please find the demo [here](https://smeechos.github.io/moda11y-vanilla-js-modal/).

## Installation

1. Package can be installed via [npm](https://www.npmjs.com/package/@smeechos/moda11y-vanilla-js-modal):

```shell
npm i @smeechos/moda11y-vanilla-js-modal
```

2. Include the packages' JavaScript:

```javascript
import Moda11y from "@smeechos/moda11y-vanilla-js-modal";
```

3. Include base CSS:
```css
@import "~@smeechos/moda11y-vanilla-js-modal/dist/styles/moda11y-css.min.css";
```

4. Initialize the class:

```javascript
let moda11y = new Moda11y();
moda11y.init();
```

## Usage

Below is some sample markup for using the library:

#### Modal Trigger
```html
<button class="moda11y-trigger"
        data-moda11y-target="moda11y-modal-1"
        aria-haspopup="dialog">
    Modal Trigger
</button>
```

#### Modal Content
```html
<div class="moda11y-modal-content" id="moda11y-modal-1">
    <!-- Modal Markup Goes Here-->
</div>
```

#### Methods
| Method      | Description | Use Case |
| ----------- | ----------- | ----------- |
| `init()`    | Initializes the library and sets all event listeners. | This is necessary to ensure the modal triggers have the event listeners setup to trigger the modal when clicked. |
| `reinit()`  | Re-initializes the library and resets all event listeners. | AJAX is being used to manipulate the DOM, and new triggers are added to the page. Because they weren't present during original `init()`, we must setup event listeners for those _new_ elements. |


## How It Works

Once a modal trigger has been clicked, the modal will be added to the page via JavaScript.

Since there is only ever a single modal at a time, as it is being generated on the fly, you need to
ensure that the `moda11y-modal-content` element is present, and its `id` matches the `data-moda11y-target`
attribute on the button trigger. This is how the library knows what content to place into the modal once
it is generated.

The modal's content will contain all the HTML from within the `moda11y-modal-content`.

