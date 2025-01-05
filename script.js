  // Initialize grid
  const grid = document.getElementById('grid');

  // Create 16x16 grid
  function createGrid() {
      grid.innerHTML = '';
      for (let i = 0; i < 256; i++) {
          const pixel = document.createElement('div');
          pixel.classList.add('pixel');

          // Add click event to toggle pixel color
          pixel.addEventListener('click', () => {
              const colorPicker = document.getElementById('color');
              pixel.style.backgroundColor = colorPicker.value;
              pixel.classList.add('active');
          });

          grid.appendChild(pixel);
      }
  }

  createGrid();

  // Clear grid for new favicon
  document.getElementById('new-favicon').addEventListener('click', createGrid);

  // Reset grid colors
  document.getElementById('reset-grid').addEventListener('click', () => {
      const pixels = document.querySelectorAll('.pixel');
      pixels.forEach(pixel => {
          pixel.style.backgroundColor = '#f4f4f4';
          pixel.classList.remove('active');
      });
  });

  // Import image and convert to favicon
  const imageInput = document.getElementById('image-input');
  imageInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const img = new Image();
              img.src = e.target.result;
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = 16;
                  canvas.height = 16;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0, 16, 16);

                  const imageData = ctx.getImageData(0, 0, 16, 16).data;
                  const pixels = document.querySelectorAll('.pixel');

                  for (let i = 0; i < pixels.length; i++) {
                      const r = imageData[i * 4];
                      const g = imageData[i * 4 + 1];
                      const b = imageData[i * 4 + 2];
                      const a = imageData[i * 4 + 3];

                      if (a > 0) {
                          pixels[i].style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                          pixels[i].classList.add('active');
                      }
                  }
              };
          };
          reader.readAsDataURL(file);
      }
  });

  // Download the favicon
  document.getElementById('download-icon').addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const pixels = document.querySelectorAll('.pixel');

      pixels.forEach((pixel, index) => {
          const x = index % 16;
          const y = Math.floor(index / 16);
          const color = window.getComputedStyle(pixel).backgroundColor;
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
      });

      const link = document.createElement('a');
      link.download = 'favicon.ico';
      link.href = canvas.toDataURL('image/x-icon');
      link.click();
  });