/* ====================================================
   FAVICON.JS — Cross-Browser Animated Favicon Engine
   Loops through the 5 pixel-art animation frames (200ms)
   Guarantees smooth animation in Chrome, Edge, Safari & Firefox
   ==================================================== */

(() => {
  const FRAMES = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQ0lEQVR4nOVXO47EIAx1UI5C4aO4mKOk8FEocpQUPgpFjhJpVxqwVngho4y0ikf7GgTOj+f3bDLFGL/gRgS4GdNxHF0G8LE3c4qxmcvexvPWxj+XAcS1f2WkP2EkgFsNYMtEImnmvKcuE5YRZUKfl/Pii4F5FNAvtUwQFS0k4ecosJ2+wLrJIoBXBnDkhl8aaNdTWQbm2LrDuOgD6kCsX7zLpXowqgt6nUjrhgBeNICP81zZ9VTtrASs55IBovJ8MYQGuBkzFzv/wObcQHOpO9dR1T/qogOpwP0MSFXlu0DE55hz7nZBjS9LiRN56wXZdCeRkkNmOff3OkjqRUYDeD0PMJsdV3fouUC74gjIfSZUK/67oZhafhW5lkqxpc8ggDcN8CD3FvaM+AqUNp8MzHZhtHNbL2qBewl7nzsGpn//d/wNlLyS2ScDCr0AAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABEUlEQVR4nOWXMQ7DIAxFHStH8cBRGHqUDDlKhh6lg4/CkKNEalWwkSBFpO1AUN4QJwSs8O0YGIjoCQ1BaMywbdu1FRjzBp5v3lri9MW0feU4+lkenSmgMDlvZ5mJ064VJYoKdqeAteTtIjE0uRIK7Ub6K6/BQiUXEM6qQK6Em1Y4grUh9sw2mXnpr0A4ayXko9m8y4HMT0UJhLPnQJG8HrC4stJ+/+z6dDkw/jtzY4y3bkmfF5vGvgRCtzmQo7GHoMBREBqDtQ7vmh7reosPaFYJjWazZDFRKHliquh4xbmwv+hHgV+VWGXRXOVGV9MSCL2cC0wW0xKlWPerAMv6rcT9QWF3HNeGg0ogNGa4/On4BeTJbt+1ne9aAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQElEQVR4nOWXMa7DIBBEl5WPQuGjUOQoFByFIkdx4aO44ChIiRR2IrExdn70JYjyGkcYcGZ2wNhYa2/UEabOmJzzbzswnXVI0/zRxDZvX56B9KZy69zh/bSuh44wjeZA+rTm2oklluslHDrBNOoqsKII/1y3t3gqVcpbMI2SgSS1bym/qoF+q2tpQ1EMWsrTsjyuztlBHQDaiZYDtgiheS7jN1tnBOMv0m9TzjF1ZjqrfRNRTGpdpxirTGjnsC9gn2DqjMnO3/ZqHZUjyZciupN94IxV5nNx+ZLzAFivCb9qJ5xHB9pjDnV7lPUPmDpjNqpPxXhbBVkdOgvQ4yQTfwVORnkOU2cmKJJKvhBEOe5H5RDa9xPwin4OU2eMVxmAQgClWsG7p97WPMNkwOBt+Ex9Q5muOf2TE0ydMT//dXwHakCYwc6v3GMAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJElEQVR4nOVXO47FIAw0iKO4eEeheEeh4CguOAqFj5KCo6y0KwVThI1DUqxC9k1DLMhnxh5DDCJ+w42wcDMMEHy2Au7swlz8pQe/kf+JAlmYe98p4MM25rS9j88pYWFWF2SN+UUw86ESFp7iAoaqRIzvdVwoXJrXYOFmOIrKTEegMdOgzZdUc0/Tu4A0Jf4IkWZzQUJcx1DKqRsx+N1cj9DeA1DmUMC0E5HGHPOyjt7XL4+x9nwSn4/i5NyhEhZuhmsXfd/ilmMWe/i8uzdoMUtfaLXiuxppe6eFm2G+YHAmFL++Us0ZSS1oiFxraQlSU4P+YmFaBaiLhfgrHiuwkDDvTRXhqecB3DIfdcq2TlXiOQrgPvPhOUfW/VJiVgXMx/8d/wBXDGqlRSmZCwAAAABJRU5ErkJggg==",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAByElEQVR4nOWXUUoDMRCGZ4OwV1AQNj71EkLzIHiM3YKwZxCF7oLiGRYKjeAlCoXmwUv0qVkQzBX6tEIyU0jciA9CU/xfBnaTtvNl5s80ExwGOKIYHFnZMAx/QqC9mtkouLBxcnNr4/56760rpkVaBM5+u9A8Gxu7xb17oKX3vn76HN0nq8YjA43wSDBItQYMZrxdr/wzvexslI22sZIuw/w9//GLqBZ0o2ycbspEa8AEmSvtfvEEHAFS1XDvjOu7F+897SfRfo41QGKQCgETyVxjDJV/1DYKvhqtFZJUjhDHz6kBSU1TI7ANMo+JMqf1OjhTaHwSVUCC9p0/lCfiA93jxajTHTzeNQMUhXO2vu9tzN/yUVIau2a+W56ID0SFmUvp7gSFjrjZOaDtYuZ1kYDx2mKQqg+ECvuczpwyD8XxuaoQVUQMUiHQ0T0f0cEf1uD1scCqDkmUeN/T1CCoZgIiDFKfCVuc9UhcuDlACJxsyvnovv61tVG65d8IUbcwSHUmNNgVNMuRl1eC3N2pzTL3PNINdOQciYVicCoTEUkpdDbMSIA/GYUkaD2pXG4S7QITccKQwMHb8XCJRCzjWObpEBD//d/xF6ON3ApdCGkcAAAAAElFTkSuQmCC",
  ];

  let frameIdx = 0;
  let timer = null;

  // Preload all frames into memory so transitions are instant
  FRAMES.forEach((url) => {
    const img = new Image();
    img.src = url;
  });

  const renderFrame = () => {
    frameIdx = (frameIdx + 1) % FRAMES.length;
    const currentUrl = FRAMES[frameIdx];

    // Replace the icon link to force Chromium / WebKit / Gecko repaint
    const oldLink = document.getElementById("favicon-animated");
    const newLink = document.createElement("link");
    newLink.id = "favicon-animated";
    newLink.rel = "icon";
    newLink.type = "image/png";
    newLink.href = currentUrl;

    if (oldLink && oldLink.parentNode) {
      oldLink.parentNode.replaceChild(newLink, oldLink);
    } else {
      document.head.appendChild(newLink);
    }
  };

  const startAnimation = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(renderFrame, 200);
  };

  const stopAnimation = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  // Start immediately
  startAnimation();

  // Pause when the tab is hidden/minimized to save CPU; resume when active
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
      renderFrame();
    }
  });
})();
