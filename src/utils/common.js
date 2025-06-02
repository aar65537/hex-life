const prefix = `
int worldSize = 4;
uniform sampler2D cellData;

struct Cell {
    int q;
    int r;
};

bool inWorld(Cell cell) {
    int q = cell.q - worldSize + 1;
    int r = cell.r - worldSize + 1;
    int s = -q - r;
    return abs(q) < worldSize && abs(r) < worldSize && abs(s) < worldSize;
}

bool isCellAlive(Cell cell) {
    float maxIndex = float(2 * (worldSize - 1));
    return texture(cellData, vec2(cell.q, cell.r) / maxIndex).r > 0.5;
}
`

export { prefix }