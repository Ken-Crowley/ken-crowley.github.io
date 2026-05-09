emcc checkers.cpp ^
    -s EXPORTED_FUNCTIONS=_click ^
    -s EXPORTED_RUNTIME_METHODS=ccall,cwrap ^
    -o emsdk/checkers.js