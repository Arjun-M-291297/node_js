/*
Throttling ensures that a function executes at most once in a given time interval
(e.g., once every 1000ms).

Even if a user triggers the event 100 times, the throttled function runs only once per interval.
Below is an improved version that supports:

leading: run immediately

trailing: also run one more time after the throttle window ends (if calls happened during the window)

Full Leading + Trailing Throttle (applied to your example)
*/
let out = "";
let tempVal = "";

let timer = null;
let lastCall = 0;
const throttleDelay = 1000;

function throttle(val) {
  tempVal += val;
  const now = Date.now();

  const remaining = throttleDelay - (now - lastCall);

  if (remaining <= 0) {
    // Leading execution
    out = tempVal;
    console.log(out);
    lastCall = now;
  } else if (!timer) {
    // Trailing execution
    timer = setTimeout(() => {
      out = tempVal;
      console.log(out);
      lastCall = Date.now();
      timer = null;
    }, remaining);
  }
}

throttle("A");
throttle("R");
throttle("J");
throttle("U");
throttle("N");