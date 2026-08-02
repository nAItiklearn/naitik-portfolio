document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(MotionPathPlugin, Draggable, InertiaPlugin, ScrollTrigger);

    const images = gsap.utils.toArray("#designs .image");
    const container = document.querySelector("#designs-circle");
    
    if (!container || images.length === 0) return;

    // Distribute images evenly along the SVG circle path
    gsap.set(images, {
        motionPath: {
            path: "#circle",
            align: "#circle",
            alignOrigin: [0.5, 0.5],
            end: (i) => i / images.length,
            autoRotate: true
        }
    });

    // Make the circle draggable (rotating)
    Draggable.create(container, {
        type: "rotation",
        inertia: true,
    });

    // Tie rotation to the page scroll when scrolling past #designs
    ScrollTrigger.create({
        trigger: "#designs",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
            // Self.progress goes from 0 to 1 as it moves through the viewport.
            // We rotate the wheel 360 degrees over the course of the section scroll.
            gsap.to(container, {
                rotation: self.progress * 360,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    });
});
