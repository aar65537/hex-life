export const prefix = `
uniform int boardSize;
uniform int wrap;
uniform sampler2D cellData;

bool inWorld(ivec2 cell) {
    cell -= boardSize - 1;
    int s = abs(cell.x + cell.y);
    cell = abs(cell);
    return cell.x < boardSize && cell.y < boardSize && s < boardSize;
}

bool isAlive(ivec2 cell) {
    return float(texelFetch(cellData, cell, 0)) > 0.5;
}
`
