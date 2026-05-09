emcc hello.cpp ^
    -s EXPORTED_FUNCTIONS="['_hello']" ^
    -s EXPORTED_RUNTIME_METHODS="['ccall']" ^
    -o hello.js