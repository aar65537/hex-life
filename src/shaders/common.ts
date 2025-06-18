export const common = /*glsl*/ `

int imod(int a, int b) {
    if(a>=0) {
        return a % b;
    }
    return (b - ((-a) % b)) % b;
}

int cellCount() {
    return 3 * boardSize * boardSize - 3 * boardSize + 1;
}

int rStep() {
    return -3 * boardSize + 2;
}

int axialToIndex(ivec2 axial) {
    return imod(axial.x + axial.y * rStep(), cellCount());
}

bool inCore(ivec2 axial) {
    int q = abs(axial.x);
    int r = abs(axial.y);
    int s = abs(axial.x + axial.y);
    return q < boardSize && r < boardSize && s < boardSize;
}

bool getCell(int index) {
    int width = textureSize(cellData, 0).x;
    ivec2 texCoord = ivec2(imod(index, width), index / width);
    return texelFetch(cellData, texCoord, 0).r > 0.5;
}
`
