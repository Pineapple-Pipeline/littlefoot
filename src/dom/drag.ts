// This file contains the makeDraggable function, which adds event listeners to a
// given element (typically a footnote popover) to make it draggable by the user.
// The function sets up event listeners for mousedown, mousemove, and mouseup, and
// uses these events to determine the distance the user has moved the mouse and
// update the position of the element accordingly.

export const makeDraggable = (popover: HTMLElement) => {
  let isDragging = false;
  let startX: number;
  let startY: number;
  let initialX: number;
  let initialY: number;

  // Add event listeners for mousedown, mousemove, and mouseup
  popover.addEventListener("mousedown", (e) => {
    isDragging = true;
    initialX = popover.offsetLeft;
    initialY = popover.offsetTop;
    startX = e.clientX;
    startY = e.clientY;
    popover.classList.add("dragging");
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      popover.style.left = `${initialX + dx}px`;
      popover.style.top = `${initialY + dy}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      popover.classList.remove("dragging");
    }
  });
};
