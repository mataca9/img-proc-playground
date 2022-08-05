import React, { Context, createContext, useEffect, useRef, useState } from 'react'
import './App.scss'
import { drawImage } from './utils';
import { brighten, grayscale, threshold, blur, sharpen, sobel, median } from './filters';
import Filter from './Filter/Filter';
import { IFilter } from './model';

export const FilterContext = createContext({});

function App() {
  const [filters, updateFilters] = useState<IFilter>({
    brighten: 0, 
    grayscale: false, 
    threshold: 0, 
    blur: false, 
    sharpen: false
  });

  const originalRef = useRef(null);
  const resultRef = useRef(null);
  const image = 'eevee.jpg';

  function getImageUrl(name: string) {
    return new URL(`./assets/${name}`, import.meta.url).href
  }

  function loadImage(canvas: HTMLCanvasElement, imageName: string) {
    return new Promise(resolve => {
      const img = new Image();
      img.src = getImageUrl(imageName);
      img.crossOrigin = "Anonymous";
      img.addEventListener("load", () => {
        drawImage(canvas, img);
        resolve(null);
      });
    })
  }

  function process(filter: IFilter, canvasOriginal: HTMLCanvasElement, canvasResult: HTMLCanvasElement) {
    const getCurrentCanvas = (isFirst: boolean) => isFirst ? canvasOriginal : canvasResult;
    let first = true;

    if (filter.brighten) {
      brighten(getCurrentCanvas(first), canvasResult, filter.brighten);
      first = false;
    }

    if (filter.grayscale) {
      grayscale(getCurrentCanvas(first), canvasResult);
      first = false;
    }

    if (filter.threshold) {
      threshold(getCurrentCanvas(first), canvasResult, filter.threshold);
      first = false;
    }

    if (filter.blur) {
      blur(getCurrentCanvas(first), canvasResult);
      first = false;
    }

    if (filter.sharpen) {
      sharpen(getCurrentCanvas(first), canvasResult);
      first = false;
    }

    if (filter.sobel) {
      sobel(getCurrentCanvas(first), canvasResult);
      first = false;
    }

    if (filter.median) {
      median(getCurrentCanvas(first), canvasResult, 5);
      first = false;
    }
  }

  useEffect(() => {
    const canvasOriginal = originalRef.current as any;
    const canvasResult = resultRef.current as any;

    Promise.all([
      loadImage(canvasOriginal, image),
      loadImage(canvasResult, image)
    ]).then(() => {
      process(filters, canvasOriginal, canvasResult);
    })
  }, [filters])

  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      <div className="content">
        <Filter></Filter>
        <canvas ref={originalRef}></canvas>
        <canvas ref={resultRef}></canvas>
      </div>
    </FilterContext.Provider>
  )
}

export default App
