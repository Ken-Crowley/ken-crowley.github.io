const canvas = document.getElementById("board");

canvas.addEventListener("click", (event) =>
{
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    console.log("clicked", x, y);

    Module.ccall(
        "click",
        null,
        ["number", "number"],
        [x, y]
    );
});