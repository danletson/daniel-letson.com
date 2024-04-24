// let logo = Snap.select('svg#logo');
// let d = logo.select('.d');
// let l = logo.select('.l');
// logo.mouseover(function() {
//     console.log(l);
//     l.animate(
//       { transform: 'R90,275,275t0,65'},120);
//     d.animate(
//       { transform: 'R-45,97,97'},120);
//   });
// logo.mouseout(function() {
//     console.log(l);
//     l.animate(
//        { transform: 'R0,275,275t0,0'},120);
//     d.animate(
//        { transform: 'R0,97,97'},120);
//   });

// Glide

const slider = new Glide(".glide", {
  type: "carousel",
  startAt: 1,
  perView: 1
}).mount();

document.querySelector(".glide__arrow--right").addEventListener("click", () => {
  slider.go(">");
});

document.querySelector(".glide__arrow--left").addEventListener("click", () => {
  slider.go("<");
});

