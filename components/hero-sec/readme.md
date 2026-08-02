## CSS
flex: 1;
width: 1px;
height: 100%;
display: block;
overflow: hidden;
background-image: url(/* image.png */);
background-size: cover;
background-repeat: no-repeat;
background-position: center;
position: absolute;
border-radius: 0px 0px 0px 0px;

## effects

Create a modern, playful freeform canvas website inspired by a scrapbook / mood-board / digital wall aesthetic.

Goal
Build a webpage where users can place, move, rotate, and resize photos anywhere on a large canvas. The experience should feel like a casual creative board, similar to a personal collage wall or pinned note board.

Core features
A full-screen canvas with a soft textured background.

Users can drag and drop photos onto the canvas.

Every photo should be movable freely after placement.

Photos should support:

dragging

rotation

resizing

layering with z-index

deleting

duplicating

Allow users to upload multiple images from their device.

Add a small toolbar with:

Upload image

Add text

Change background

Clear canvas

Undo / redo

Make the canvas feel infinite or very large, so items can be placed anywhere without feeling constrained.

Visual style
Background: deep red / maroon or another bold aesthetic color, with a subtle grid pattern or paper texture.

Photos should look like polaroids / printed cards / sticky notes.

Use rounded corners, soft shadows, slight tilt on each item for a natural collage look.

Add visual details like:

push pins

tape strips

paper shadows

handwritten labels

Keep the design energetic, creative, and youth-friendly.

The layout should resemble a personal scrapbook, community board, or freeform poster wall.

Interaction design
When a user clicks an image, show controls for:

drag

rotate handle

resize corners

delete icon

Selected items should have a visible outline or glow.

Items should snap lightly to grid only if enabled.

Include smooth transitions and subtle hover effects.

Make touch support work well on mobile too.

Text support
Users should be able to add text anywhere on the canvas.

Text should be editable, draggable, resizable, and rotatable like photos.

Allow different fonts, colors, and sizes.

Layout behavior
The canvas should start with a few sample photos already placed around the page in an artistic arrangement.

Leave a large open center area for the title or hero text.

Keep objects scattered naturally, not in a strict grid.

Let the user freely build a collage over time.

Important implementation details
Use a clean, modern front-end structure.

Make sure dragging is smooth and responsive.

Preserve item positions after refresh using local storage.

Ensure the editor is usable on desktop and mobile.

The site must feel polished, interactive, and visually rich.

Optional advanced features
Add a mini map or canvas overview.

Add keyboard shortcuts:

Ctrl/Cmd + Z for undo

Ctrl/Cmd + Shift + Z for redo

Delete for removing selected item

Add zoom in / zoom out support.

Add export as image / PNG.

Add shareable canvas state via URL.

Final output expectation
Generate a fully working freeform canvas website with a beautiful scrapbook-inspired interface, where users can freely move photos anywhere and arrange them creatively like a digital mood board.