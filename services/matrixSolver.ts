
// Solves a system of linear equations Ax = B using Gaussian elimination.
export function solveLinearSystem(A: number[][], B: number[]): number[] | null {
  const n = A.length;
  const Aug: number[][] = A.map((row, i) => [...row, B[i]]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(Aug[k][i]) > Math.abs(Aug[maxRow][i])) {
        maxRow = k;
      }
    }
    [Aug[i], Aug[maxRow]] = [Aug[maxRow], Aug[i]];

    // Check for singular matrix
    if (Math.abs(Aug[i][i]) < 1e-12) {
      return null; // No unique solution
    }

    // Make pivot 1
    const pivot = Aug[i][i];
    for (let j = i; j < n + 1; j++) {
      Aug[i][j] /= pivot;
    }

    // Eliminate other rows
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = Aug[k][i];
        for (let j = i; j < n + 1; j++) {
          Aug[k][j] -= factor * Aug[i][j];
        }
      }
    }
  }

  // Back substitution (in this Gauss-Jordan form, solution is just the last column)
  const x: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    x[i] = Aug[i][n];
  }

  return x;
}
