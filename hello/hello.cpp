#include <emscripten/emscripten.h>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    const char* hello() {
        return "Hello from C++ WASM!";
    }
}