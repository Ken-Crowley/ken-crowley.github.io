#include <cstdio>

extern "C" {
    void click(int x, int y)
    {
        printf("Clicked: %d %d\n", x, y);
    }
}