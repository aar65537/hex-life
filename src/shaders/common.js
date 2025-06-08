export const prefix = `
uniform int boardSize;
uniform sampler2D cellData;

int cellCount() {
    return 3 * boardSize * boardSize - 3 * boardSize + 1;
}

int qStep() {
    return 3 * boardSize - 2;
}

int imod(int a, int b) {
    if(a>=0) {
        return a % b;
    }
    return (b - ((-a) % b)) % b;
}

bool getCell(int index) {
    int width = textureSize(cellData, 0).x;
    ivec2 texCoord = ivec2(imod(index, width), index / width);
    return texelFetch(cellData, texCoord, 0).r > 0.5;
}
`
