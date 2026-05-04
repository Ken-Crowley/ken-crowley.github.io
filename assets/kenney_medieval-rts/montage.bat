magick montage^
 -background transparent    ^%= keeps transparent pixels =%
 -geometry 128x128          ^%= 128x128 + border         =%
 -filter point              ^%= don't smooth             =%
 -tile 8x                   ^%= 8 columns                =%
 source/*.png               ^%= input                    =%
 output/atlas.full.png      ^%= output                   =%