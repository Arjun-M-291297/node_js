// Count till 5 with 1 sec delay
for (let i = 1; i <= 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}

// Count till 5 with n sec delay
let delay = 0;
for (let i = 1; i <= 5; i++) {
  delay += i * 1000;
  setTimeout(() => {
    console.log(i);
  }, delay);
}
