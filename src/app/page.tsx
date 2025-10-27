"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 6;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

// Function to create a guaranteed unsolvable puzzle state
const createUnsolvablePuzzle = (): number[] => {
  let tiles = Array.from({ length: TILE_COUNT }, (_, i) => i); // 0 to 35, 0 is empty

  // 1. Shuffle the array using Fisher-Yates algorithm
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // 2. Calculate inversions
  const countInversions = (arr: number[]): number => {
    let inversionCount = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
          inversionCount++;
        }
      }
    }
    return inversionCount;
  };
  
  let inversions = countInversions(tiles);

  // 3. Find the empty tile's row from the bottom
  const emptyTileIndex = tiles.indexOf(0);
  const emptyTileRow = Math.floor(emptyTileIndex / GRID_SIZE);
  const emptyTileRowFromBottom = GRID_SIZE - emptyTileRow;

  // 4. For an even grid (N=6), the puzzle is solvable if (inversions + row_from_bottom) is odd.
  // We want it to be unsolvable, so we want (inversions + row_from_bottom) to be even.
  const isSolvable = (inversions + emptyTileRowFromBottom) % 2 !== 0;

  if (isSolvable) {
    // It's currently solvable, so make it unsolvable by flipping inversion parity.
    // We swap two non-empty tiles. This changes the inversion count by an odd number.
    if (tiles[0] !== 0 && tiles[1] !== 0) {
      [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
    } else {
      // If 0 is in the first two positions, swap the next two, which are guaranteed not to be 0.
      [tiles[2], tiles[3]] = [tiles[3], tiles[2]];
    }
  }
  
  // Now, the puzzle is guaranteed to be unsolvable.
  return tiles;
};

export default function Home() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This runs only on the client, after hydration
    setIsClient(true);
    setTiles(createUnsolvablePuzzle());
  }, []);

  const handleTileClick = (index: number) => {
    const emptyTileIndex = tiles.indexOf(0);
    
    // Calculate row and col for both tiles
    const tileRow = Math.floor(index / GRID_SIZE);
    const tileCol = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyTileIndex / GRID_SIZE);
    const emptyCol = emptyTileIndex % GRID_SIZE;

    // Check for adjacency (not diagonal)
    const isAdjacent = Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyTileIndex]] = [newTiles[emptyTileIndex], newTiles[index]];
      setTiles(newTiles);
    }
  };

  // Render a loading skeleton on the server and initial client render to avoid hydration mismatch
  if (!isClient) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-8 tracking-wider">
          Unsolvable Slider
        </h1>
        <div className="grid grid-cols-6 gap-2 p-2 rounded-lg bg-card border-2 border-primary/20 shadow-lg" style={{width: 'min(90vw, 600px)', aspectRatio: '1 / 1'}}>
            {Array.from({ length: TILE_COUNT }).map((_, i) => (
                <div key={i} className="bg-background/50 rounded-md animate-pulse"></div>
            ))}
        </div>
         <p className="mt-8 text-muted-foreground text-center max-w-md">
            Initializing unsolvable puzzle...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 select-none">
      <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-8 tracking-wider">
        Unsolvable Slider
      </h1>
      <div className="grid grid-cols-6 gap-2 p-2 rounded-lg bg-card border-2 border-primary/20 shadow-lg" style={{width: 'min(90vw, 600px)', aspectRatio: '1 / 1'}}>
        {tiles.map((tile, index) => {
          const isEmpty = tile === 0;
          return (
            <Button
              key={index}
              onClick={() => handleTileClick(index)}
              variant="secondary"
              className={cn(
                "w-full h-full text-xl md:text-2xl lg:text-3xl font-bold font-headline rounded-md transition-all duration-300 ease-in-out focus:ring-accent focus:ring-2",
                isEmpty
                  ? "bg-transparent border-none shadow-none pointer-events-none"
                  : "bg-secondary hover:bg-muted text-primary shadow-[0_0_2px_hsl(var(--primary)/0.5),inset_0_0_2px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_15px_hsl(var(--primary)/0.7)] hover:-translate-y-1"
              )}
              aria-label={`Tile ${tile || 'Empty'}`}
              disabled={isEmpty}
            >
              {!isEmpty ? tile : ""}
            </Button>
          );
        })}
      </div>
       <p className="mt-8 text-muted-foreground text-center max-w-md">
        This 6x6 sliding puzzle has been mathematically generated to be unsolvable. Good luck.
      </p>
    </main>
  );
}
