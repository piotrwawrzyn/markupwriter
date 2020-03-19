# markupwriter &middot; [![npm version](https://badge.fury.io/js/markupwriter.svg)](https://www.npmjs.com/package/markupwriter) [![](https://img.shields.io/bundlephobia/min/markupwriter)](https://www.npmjs.com/package/markupwriter)

markupwriter is a javascript library that lets you animate your html code snippet as raw text and render it at the same time, just as if you were writing it live. It's super lightweight, written in pure JS, using ES6 promises and native asynchronous functions to get the animation effect.

## Example

Before anything, please check out [this example page](https://piotrwawrzyn.github.io/mwexample/ 'this example page') I put together to better understand what effect can you achieve by using this library.

## Installation and usage with npm

*Note: basic webpack configuration is required when using npm with this library.*

### Instalation
```
npm install markupwriter
```

### Usage

index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>markupwriter - basic usage</title>
  </head>
  <body>
    <div class="rendered-html"></div>
    <div class="raw-html"></div>
	
	<!-- Path to your bundled script -->
	<script src="./build/bundle.js" type="text/javascript"></script>
  </body>
</html>
```

index.js

```javascript
import MarkupWriter from 'markupwriter';

const renderedHtmlContainer = document.querySelector('.rendered-html');
const rawHtmlContainer = document.querySelector('.raw-html');
const htmlString = `
<div class="container">
	<h1>Hey there</h1>
	<p>This is some cool stuff going on here</p>
</div>
`;

const markupWriter = new MarkupWriter(
  renderedHtmlContainer,
  rawHtmlContainer,
  htmlString
);

markupWriter.start();
```

Open index.html file in the browser enviroment to see the result.

## Usage with CDN

This approach doesn't require webpack or even an npm project.

index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <title>markupwriter - basic usage</title>
  </head>
  <body>
    <div class="rendered-html"></div>
    <div class="raw-html"></div>
	
	<!-- markupwriter lib -->
    <script
      src="https://cdn.jsdelivr.net/npm/markupwriter"
      type="text/javascript"
    ></script>
	
    <script src="index.js" type="text/javascript"></script>
  </body>
</html>
```

index.js
```javascript
const renderedHtmlContainer = document.querySelector('.rendered-html');
const rawHtmlContainer = document.querySelector('.raw-html');
const htmlString = `
<div class="container">
	<h1>Hey there</h1>
	<p>This is some cool stuff going on here</p>
</div>
`;

/* MarkupWriter is a global object existing in the browser */

const markupWriter = new MarkupWriter(
  renderedHtmlContainer,
  rawHtmlContainer,
  htmlString
);

markupWriter.start();

```

Open index.html file in the browser enviroment to see the result.

## Usage with configuration

As a fourth argument to the MarkupWriter constructor you can optionally pass a configuration object.

### Possible config options

| Property                          | Type     | Description                                                                                           | Default value                                                         |
| --------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| charInterval                      | number   | Interval in miliseconds between each character rendered                                               | 90                                                                    |
| charactersPerLine                 | number   | Number of characters per line after which script will look to make a break to new line                | 50                                                                    |
| displayCursor                     | boolean  | Whether to display cursor in raw html animation or not                                                | true                                                                  |
| cursorOptions                     | object   | More configuration around cursor                                                                      | -                                                                     |
| cursorOptions.cursorString        | string   | String which will be rendered as cursor, can contain html                                             | &lt;span class=&quot;markupwriter-cursor&quot;&gt;&#124;&lt;/span&gt; |
| cursorOptions.color               | string   | Valid css color string for the cursor                                                                 | rgb(252, 186, 3)                                                      |
| cursorOptions.animationSpeed      | number   | Blinking animation duration in seconds                                                                | 1                                                                     |
| cursorOptions.isStatic            | boolean  | Whether or not cursor should render just once or rerender with every character animated               | false                                                                 |
| pauseBeforeTagOpen                | number   | Pause in miliseconds before opening new html tag                                                      | 500                                                                   |
| pauseAfterTagClose                | number   | Pause in miliseconds after closing html tag                                                           | 180                                                                   |
| increasingPace                    | object   | Configuration of increasing animation speed with every new character in the same node                 | -                                                                     |
| increasingPace.use                | boolean  | Whether or not to use this effect at all                                                              | true                                                                  |
| increasingPace.multiplier         | number   | Multiplier of charInterval, less = faster increase with every new character rendered in the same node | 0.99                                                                  |
| increasingPace.maximumTimesChange | number   | Times speed increase cap                                                                              | 2.2                                                                   |
| onFinish                          | function | Callback when animation finishes                                                                      | () =&gt; {}                                                           |

### Example usage with configuration object

index.js

```javascript
import MarkupWriter from 'markupwriter';

const renderedHtmlContainer = document.querySelector('.rendered-html');
const rawHtmlContainer = document.querySelector('.raw-html');
const htmlString = `
<div class="container">
	<h1>Hey there</h1>
	<p>This is some cool stuff going on here</p>
</div>
`;

const config = {
  charInterval: 150,
  cursorOptions: {
    cursorString: '<h1>!</h1>',
    color: 'red'
  },
  onFinish: () => {
    alert('End of story');
  }
};

const markupWriter = new MarkupWriter(
  renderedHtmlContainer,
  rawHtmlContainer,
  htmlString,
  config
);

markupWriter.start();
```
