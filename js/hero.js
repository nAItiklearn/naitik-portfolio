// Initialize GSAP Draggable for hero photos
document.addEventListener("DOMContentLoaded", () => {
  // Ensure Draggable is registered
  gsap.registerPlugin(Draggable);

  const photos = document.querySelectorAll(".hero__photo");
  let highestZ = 10;

  // Initial random scatter animation
  gsap.from(photos, {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "back.out(1.2)",
    delay: 0.2
  });

  // Make them draggable
  Draggable.create(photos, {
    type: "x,y",
    bounds: "#hero-canvas",
    edgeResistance: 0.65,
    onPress: function() {
      // Bring to front on click
      highestZ++;
      gsap.set(this.target, { zIndex: highestZ });
      
      // Slight scale up while dragging
      gsap.to(this.target, { scale: 1.05, duration: 0.2 });
    },
    onRelease: function() {
      // Scale back down when dropped
      gsap.to(this.target, { scale: 1, duration: 0.2, ease: "back.out(1.5)" });
    }
  });
});
 
