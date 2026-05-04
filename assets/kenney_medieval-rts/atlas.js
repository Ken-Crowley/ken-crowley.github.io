const IMAGE_WIDTH = 128;
const IMAGE_HEIGHT = 128;
const ATLAS_COLUMNS = 8;
const ATLAS_HEIGHT = 2048;
const ATLAS_WIDTH = 1024;

const files = `medievalEnvironment_01.png
medievalEnvironment_02.png
medievalEnvironment_03.png
medievalEnvironment_04.png
medievalEnvironment_05.png
medievalEnvironment_06.png
medievalEnvironment_07.png
medievalEnvironment_08.png
medievalEnvironment_09.png
medievalEnvironment_10.png
medievalEnvironment_11.png
medievalEnvironment_12.png
medievalEnvironment_13.png
medievalEnvironment_14.png
medievalEnvironment_15.png
medievalEnvironment_16.png
medievalEnvironment_17.png
medievalEnvironment_18.png
medievalEnvironment_19.png
medievalEnvironment_20.png
medievalEnvironment_21.png
medievalStructure_01.png
medievalStructure_02.png
medievalStructure_03.png
medievalStructure_04.png
medievalStructure_05.png
medievalStructure_06.png
medievalStructure_07.png
medievalStructure_08.png
medievalStructure_09.png
medievalStructure_10.png
medievalStructure_11.png
medievalStructure_12.png
medievalStructure_13.png
medievalStructure_14.png
medievalStructure_15.png
medievalStructure_16.png
medievalStructure_17.png
medievalStructure_18.png
medievalStructure_19.png
medievalStructure_20.png
medievalStructure_21.png
medievalStructure_22.png
medievalStructure_23.png
medievalTile_01.png
medievalTile_02.png
medievalTile_03.png
medievalTile_04.png
medievalTile_05.png
medievalTile_06.png
medievalTile_07.png
medievalTile_08.png
medievalTile_09.png
medievalTile_10.png
medievalTile_11.png
medievalTile_12.png
medievalTile_13.png
medievalTile_14.png
medievalTile_15.png
medievalTile_16.png
medievalTile_17.png
medievalTile_18.png
medievalTile_19.png
medievalTile_20.png
medievalTile_21.png
medievalTile_22.png
medievalTile_23.png
medievalTile_24.png
medievalTile_25.png
medievalTile_26.png
medievalTile_27.png
medievalTile_28.png
medievalTile_29.png
medievalTile_30.png
medievalTile_31.png
medievalTile_32.png
medievalTile_33.png
medievalTile_34.png
medievalTile_35.png
medievalTile_36.png
medievalTile_37.png
medievalTile_38.png
medievalTile_39.png
medievalTile_40.png
medievalTile_41.png
medievalTile_42.png
medievalTile_43.png
medievalTile_44.png
medievalTile_45.png
medievalTile_46.png
medievalTile_47.png
medievalTile_48.png
medievalTile_49.png
medievalTile_50.png
medievalTile_51.png
medievalTile_52.png
medievalTile_53.png
medievalTile_54.png
medievalTile_55.png
medievalTile_56.png
medievalTile_57.png
medievalTile_58.png
medievalUnit_01.png
medievalUnit_02.png
medievalUnit_03.png
medievalUnit_04.png
medievalUnit_05.png
medievalUnit_06.png
medievalUnit_07.png
medievalUnit_08.png
medievalUnit_09.png
medievalUnit_10.png
medievalUnit_11.png
medievalUnit_12.png
medievalUnit_13.png
medievalUnit_14.png
medievalUnit_15.png
medievalUnit_16.png
medievalUnit_17.png
medievalUnit_18.png
medievalUnit_19.png
medievalUnit_20.png
medievalUnit_21.png
medievalUnit_22.png
medievalUnit_23.png
medievalUnit_24.png`;

const output = files
.replace(/\.png/g, '')
.split('\n')
.reduce((c, filename, i) => {
    const col = i % ATLAS_COLUMNS;
    const row = Math.floor(i / ATLAS_COLUMNS);

    c[filename] = [
        (col * IMAGE_WIDTH) / ATLAS_WIDTH,
        (row * IMAGE_HEIGHT) / ATLAS_HEIGHT,
    ];

    return c;
}, {});
console.log(JSON.stringify(output,null,2));