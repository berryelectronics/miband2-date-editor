var ipcRenderer = require('electron').ipcRenderer;

var editorChar = null;
var editorArray = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

ipcRenderer.on('char-data', function (event, arg) {
    // console.log(arg); // DEV
    editorChar = arg;
    readEditorArray();
    drawEditorTable();
});

function readEditorArray() {
    // editorArray = [x][y];
    editorArray = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

    // Fill Array
    for(var i = 0; i != editorChar.width; i++) {
        for(var j = 0; j != 16; j++) {
            // console.log("clean | x: " + i + " | y: " + j); // DEV
            editorArray[i][j] = '0'
        }
    }

    var editorCharDataBuffer = (editorChar.charData + "g").replace('g', '');

    for(var y_offset = 7; y_offset != 23; y_offset += 8) {
        for(var x = 0; x != (editorChar.width); x++) {

            var thisRowData = editorCharDataBuffer.substring(0, 2);
            editorCharDataBuffer = editorCharDataBuffer.substring(2);
            // console.log("This Row: 0x" + thisRowData + " | Binary: " + parseInt(thisRowData, 2)); // DEV

            // Convert the row data to a character array filled with 0os where needed
            var rowBinaryString = ("00000000").split('');
            var rowRawBinaryString = parseInt(thisRowData, 16).toString(2).split('');
            var rowDataCopyOffset = rowBinaryString.length - rowRawBinaryString.length;

            for(var copy = 0; copy != rowRawBinaryString.length; copy++) {
                rowBinaryString[copy + rowDataCopyOffset] = rowRawBinaryString[copy];
            }

            // console.log(rowBinaryString.join('')) // DEV

            for(var y = y_offset; y != (y_offset - 8); y--) {
                var thisBitOn = false;
                var rowBinaryStringOffset = Math.sqrt(Math.pow((y - y_offset), 2));

                // console.log("x: " + x + " | y: "  + y); // DEV
                if (rowBinaryString[rowBinaryStringOffset] == '1') {
                    thisBitOn = true;
                    editorArray[x][y] = '1'
                } else {
                    editorArray[x][y] = '0'
                }

                // console.log("x: " + x + " | y: "  + y + " | rawY: " + (-(y - y_offset)).toString() + " | bit: " + thisBitOn); // DEV
            }
        }
    }
    
}

function drawEditorTable() {
    // output editor array
    var output = "<div class='container'><h4>Position: 0x" + editorChar.position + '</h4>';
    output += "<h4>Character: " + editorChar.representsChar + ' | Width: ' + editorChar.width + ' (max: ' + editorChar.defaultWidth +')</h4><table><tbody>';

    var curEditorWidth = editorChar.width;

    for(var i = 0; i != 16; i++) { //y
        output += '<tr id="editory_' + i + '">';

        for (var j = 0; j != curEditorWidth; j++) { //x


            if (editorArray[j][i] == '1') {
                output += '<td class="editorSquare editorSquareOn" id="editorx_' + j + '"></td>';
            } else {
                output += '<td class="editorSquare editorSquareOff" id="editorx_' + j + '"></td>';
            }
        }
        output += '</tr>';
    }

    output += "</tbody></table></div>";


    $('#editorTable').empty().append(output);

    // Insert input for new width
    var output2 = "";

    output2 += '<input type="number" class="form-control" id="input_newWidth" value="' + parseInt(editorChar.width) + '" max="' + parseInt(editorChar.defaultWidth) + '">'

    $('#newWidth_group').empty().append(output2);
}

$(document).on('click', '.editorSquare', function () {
    var editorX = $(this).attr('id').replace('editorx_', '');
    var editorY = $(this).parent().attr('id').replace('editory_', '');
    var squareStatus = $(this).attr('class').split(' ')[1]
    // console.log(squareStatus); // DEV
    if (squareStatus == "editorSquareOn") {
        editorArray[editorX][editorY] = '0';
    } else {
        editorArray[editorX][editorY] = '1';
    } 

    drawEditorTable();
})

$('#but_clearall').click(function() {
    // editorArray = [x][y];
    editorArray = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

    // Fill Array
    for(var i = 0; i != editorChar.width; i++) {
        for(var j = 0; j != 16; j++) {
            // console.log("clean | x: " + i + " | y: " + j); // DEV
            editorArray[i][j] = '0'
        }
    }

    drawEditorTable();
})

$('#but_reset').click(function() {
    readEditorArray();
    drawEditorTable();
})

$('#but_saveclose').click(function() {

    var editorCharDataBuffer = "";

    for(var y_offset = 7; y_offset != 23; y_offset += 8) {
        for(var x = 0; x != (editorChar.width); x++) {

            var charBinaryString = ("00000000").split('');

            for(var y = y_offset; y != (y_offset - 8); y--) {
                var rowBinaryStringOffset = Math.sqrt(Math.pow((y - y_offset), 2));

                charBinaryString[rowBinaryStringOffset] = editorArray[x][y];

                // ("x: " + x + " | y: "  + y + " | rawY: " + rowBinaryStringOffset.toString()); // DEV
            }
            charBinaryString = charBinaryString.join('')
            charBinaryString = parseInt(charBinaryString, 2).toString(16).toUpperCase()
            if (charBinaryString.length == 1) charBinaryString = "0" + charBinaryString;

            editorCharDataBuffer += charBinaryString;

            console.log("Binary: " + charBinaryString + " | Hex: 0x" + charBinaryString);
        }
    }

    // console.log("----------"); // DEV
    // console.log("Final Buffer: " + editorCharDataBuffer); // DEV
    // console.log("----------"); // DEV

    ipcRenderer.sendSync('saveEditor', {position: editorChar.position, charData: editorCharDataBuffer, width: editorChar.width});
})

$('#but_close').click(function() {
    ipcRenderer.sendSync('closeEditor');
})

$(document).on('click', '#but_saveNewWidth', function() {
    var newWidth = $(document).find('#input_newWidth').val();
    newWidth = parseInt(newWidth);

    if (newWidth <= parseInt(editorChar.defaultWidth)) {
        var newWidthString = newWidth.toString(10);
        if (newWidth < 10) newWidthString = "0" + newWidthString;

        editorChar.width = newWidthString;
    }

    var newData = "";
    for(var i = 0; i != newWidth; i++) {
        newData += "0000";
    }

    editorChar.charData = newData;


    readEditorArray();
    drawEditorTable();
})