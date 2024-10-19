export const makeDraggable = (popover: HTMLElement) => {
  let isDragging = false;
  let startX: number; // Explicitly typed as number
  let startY: number; // Explicitly typed as number
  let initialX: number; // Explicitly typed as number
  let initialY: number; // Explicitly typed as number

  popover.addEventListener("mousedown", (e) => {
    isDragging = true;
    initialX = popover.offsetLeft;
    initialY = popover.offsetTop;
    startX = e.clientX;
    startY = e.clientY;
    popover.classList.add("dragging"); // Optional: add a dragging class for styling
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
      popover.classList.remove("dragging"); // Optional: remove the dragging class
    }
  });
};
