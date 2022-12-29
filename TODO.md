## Rubiks cube

### Player

The user can play with a 3d Rubiks cube.

Controls:

- Can rotate the cube
- Can move the pieces/sides of the cube

Layout:

- 3d Cube
- Small unfolded map of the cube

### Solver

The user can input their cube's layout by coloring in the cube's squares.

The algorithm can be A\*, where the proximity function is:

- the amount of colors in the right positions or
- the amount of pieces in the right orientation

While coloring the Rubiks cube, there "Solve" button will be disabled until the cube is solvable. (Boundary conditions, color count, ...)

Controls:

- Can select a color, and apply it to a square.
- Can trigger the solving process

Layout:

- Color palette
- "Solve" button
- Breakdown of the steps to solve the cube
