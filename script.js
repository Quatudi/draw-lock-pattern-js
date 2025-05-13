"use strict";

function coordX(n) {
    return (1/6+((+n-1)%3)/3)*100;
}

function coordY(n) {
    return (1/6+(Math.ceil(+n/3-1))/3)*100;
}

function setAttributes(element, attributes) {
    for(const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    return;
}

function addElementToSVG(element) {
    const svg = document.querySelector('svg');
    svg.appendChild(element);
    return;
}

function drawSvgElement(svgElement,attributes) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", svgElement);
    setAttributes(element, attributes);
    addElementToSVG(element);
    return;
}

function getFreeNodesOf(sequence) {
    let nodes = '123456789';
    for (const node of sequence) {
        nodes = nodes.replace(node,'');
    }
    return nodes;
}

function drawFreeNodes(sequence) {
    const nodes = getFreeNodesOf(sequence);
    for (const node of nodes) {
        drawSvgElement("circle",{
            id:node,
            class:"permanent",
            cx:coordX(node),
            cy:coordY(node),
            r:'3',
            fill:'lightgrey'
        });
    }
    return;
}

function resetSVG() {
    const svg = document.querySelector('svg');
    svg.querySelectorAll('*:not(.permanent, .permanent *)').forEach(svg => svg.remove());
    return;
}

function resetErrorMessages() {
    const input = document.querySelector("#sequence");
    const errorMessage = document.querySelector("#errorMessage");
    input.setCustomValidity('');
    errorMessage.textContent='';
    return;
}

function appendErrorMessage(errorMessage) {
    const message = document.createElement("p");
    message.textContent = errorMessage;
    document.querySelector("#errorMessage").appendChild(message);
    return;
}

function getMiddleNodeOf(a,b) {
    return ((+a + +b)/2).toString();
}

function hasJustSkippedAFreeNode(sequence,n) {
    let straightLinesExtremum = [
            "13","17","19","28",
            "31","37","39","46",
            "64","71","73","79",
            "82","91","93","97"];
    if (n>0) {
        if (straightLinesExtremum.includes(sequence[n-1]+sequence[n])) {
            if (!(sequence.slice(0,n).includes(getMiddleNodeOf(sequence[n-1],sequence[n])))) {
                return true;
            }
        }
    }
    return false;
}

function printPotentialErrorMessages(sequence) {
    const input = document.querySelector("#sequence");
    for (let n=0; n<sequence.length; n++) {
        if (!('123456789'.includes(sequence[n]))) {
            appendErrorMessage(`> ${sequence[n]}: invalid caracter`);
        } else if (sequence.slice(0,n).includes(sequence[n])) {
            appendErrorMessage(`> ${sequence[n]}: invalid repetition`);
        }
        if (hasJustSkippedAFreeNode(sequence,n)) {
            appendErrorMessage(`> ${sequence[n-1]}${sequence[n]}: missing ${getMiddleNodeOf(sequence[n-1],sequence[n])} in between`);
        }
    }
    if (sequence.length<4) {
        appendErrorMessage(`> length: too short`);
    }
    if (errorMessage.textContent!=='') {
        input.setCustomValidity("invalid sequence");
    }
    return;
}

function getOnlyValidCaractersOf(sequence) {
    return sequence
                .split('')
                .filter((caracter) => '123456789'.includes(caracter))
                .join('');
}

function drawPath(data) {
    const sequence = data.sequence;
    const color = data.colorLine;
    let widthLine = '';
    let markerStart = '';
    let markerEnd = '';
    data.outline ? widthLine="5" : widthLine="6";
    data.arrow ? markerStart="url(#arrowMarker)" : markerStart="none";
    data.cross ? markerEnd="url(#crossMarker)" : markerEnd="none";
    if (sequence.length==1) {
        if (data.outline) {
            drawSvgElement("line",{
                x1:coordX(sequence[0]),
                y1:coordY(sequence[0]),
                x2:coordX(sequence[0]),
                y2:coordY(sequence[0]),
                stroke:"black",
                'stroke-width':"6",
                'stroke-linecap':"square",
            });
        }
        drawSvgElement("line",{
            x1:coordX(sequence[0]),
            y1:coordY(sequence[0]),
            x2:coordX(sequence[0]),
            y2:coordY(sequence[0]),
            stroke:color,
            'stroke-width':widthLine,
            'stroke-linecap':"square",
            'marker-start':markerStart,
            'marker-end':markerEnd
        });
    }
    if (sequence.length==2) {
        if (data.outline) {
            drawSvgElement("line",{
                x1:coordX(sequence[0]),
                y1:coordY(sequence[0]),
                x2:coordX(sequence[1]),
                y2:coordY(sequence[1]),
                stroke:"black",
                'stroke-width':"6",
                'stroke-linecap':"square",
            });
        }
        drawSvgElement("line",{
            x1:coordX(sequence[0]),
            y1:coordY(sequence[0]),
            x2:coordX(sequence[1]),
            y2:coordY(sequence[1]),
            stroke:color,
            'stroke-width':widthLine,
            'stroke-linecap':"square",
            'marker-start':markerStart,
            'marker-end':markerEnd
        });
    }
    if (sequence.length>=3) {
        if (data.outline) {
            drawSvgElement("line",{
                x1:coordX(sequence[0]),
                y1:coordY(sequence[0]),
                x2:coordX(sequence[1]),
                y2:coordY(sequence[1]),
                stroke:"black",
                'stroke-width':"6",
                'stroke-linecap':"round"
            });
            drawSvgElement("line",{
                x1:coordX(sequence[0]),
                y1:coordY(sequence[0]),
                x2:0.5*(coordX(sequence[0])+coordX(sequence[1])),
                y2:0.5*(coordY(sequence[0])+coordY(sequence[1])),
                stroke:"black",
                'stroke-width':"6",
                'stroke-linecap':"square"
            });
        }
        for (let i=0; i<sequence.length-2 ;i++) {
            if (data.outline) {
                drawSvgElement("line",{
                    x1:coordX(sequence[i+1]),
                    y1:coordY(sequence[i+1]),
                    x2:coordX(sequence[i+2]),
                    y2:coordY(sequence[i+2]),
                    stroke:"black",
                    'stroke-width':"6",
                    'stroke-linecap':"round"
                });
                if (i == sequence.length-3) {
                    drawSvgElement("line",{
                        x1:0.5*(coordX(sequence[i+1])+coordX(sequence[i+2])),
                        y1:0.5*(coordY(sequence[i+1])+coordY(sequence[i+2])),
                        x2:coordX(sequence[i+2]),
                        y2:coordY(sequence[i+2]),
                        stroke:"black",
                        'stroke-width':"6",
                        'stroke-linecap':"square"
                    });
                }
            }
            if (i==0) {
                drawSvgElement("line",{
                    x1:coordX(sequence[0]),
                    y1:coordY(sequence[0]),
                    x2:0.5*(coordX(sequence[0])+coordX(sequence[1])),
                    y2:0.5*(coordY(sequence[0])+coordY(sequence[1])),
                    stroke:color,
                    'stroke-width':widthLine,
                    'stroke-linecap':"square"
                });
            }
            if (i==sequence.length-3) {
                drawSvgElement("line",{
                    x1:0.5*(coordX(sequence[i+1])+coordX(sequence[i+2])),
                    y1:0.5*(coordY(sequence[i+1])+coordY(sequence[i+2])),
                    x2:coordX(sequence[i+2]),
                    y2:coordY(sequence[i+2]),
                    stroke:color,
                    'stroke-width':widthLine,
                    'stroke-linecap':"square"
                });
            }
            drawSvgElement("line",{
                x1:coordX(sequence[i]),
                y1:coordY(sequence[i]),
                x2:coordX(sequence[i+1]),
                y2:coordY(sequence[i+1]),
                stroke:color,
                'stroke-width':widthLine,
                'stroke-linecap':"round"
            });
        }
        drawSvgElement("line",{
            x1:coordX(sequence[sequence.length-2]),
            y1:coordY(sequence[sequence.length-2]),
            x2:coordX(sequence[sequence.length-1]),
            y2:coordY(sequence[sequence.length-1]),
            stroke:color,
            'stroke-width':widthLine,
            'stroke-linecap':"round",
            'marker-end':markerEnd
        });
        drawSvgElement("line",{
            x1:coordX(sequence[0]),
            y1:coordY(sequence[0]),
            x2:coordX(sequence[1]),
            y2:coordY(sequence[1]),
            stroke:color,
            'stroke-width':0,
            'stroke-linecap':"round",
            'marker-start':markerStart
        });
    }
    return;
}

function drawTextNumber(sequence,textNumber,i,color) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = textNumber;
    setAttributes(text,{
        'font-family':"monospace",
        'font-size':"6",
        fill:color,
        x:coordX(sequence[i]),
        y:coordY(sequence[i]),
        dx:"-2",
        dy:"2"
    })
    addElementToSVG(text);
    return;
}

function drawFirstNumber(data) {
    let text = '';
    if (data.numbersOption == "strokeOrder") {
        text = 1;
    } else {
        text = data.sequence[0];
    }
    if (data.arrow) {
        drawSvgElement("circle",{
            cx:coordX(data.sequence[0]),
            cy:coordY(data.sequence[0]),
            r:"4",
            fill:"black",
            stroke:"white",
            'stroke-width':"0.5"
        });
        drawTextNumber(data.sequence,text,0,"white");
    } else {
        drawSvgElement("rect",{
            x:coordX(data.sequence[0])-5,
            y:coordY(data.sequence[0])-5,
            width:"10",
            height:"10",
            fill:"white",
            stroke:"black",
            'stroke-width':"0.5"
        });
        drawTextNumber(data.sequence,text,0);
    }
    return;
}

function drawIntermediateNumbers(data) {
    if (data.numbersOption == "strokeOrder") {
        for (let i=1; i<data.sequence.length-1; i++) {
            drawSvgElement("circle",{
                cx:coordX(data.sequence[i]),
                cy:coordY(data.sequence[i]),
                r:"5",
                fill:"white",
                stroke:"black",
                'stroke-width':"0.5"
            });
            drawTextNumber(data.sequence,i+1,i);
        }
    } else if (data.numbersOption == "keypadLayout") {
        for (let i=1; i<data.sequence.length-1; i++) {
            drawSvgElement("circle",{
                cx:coordX(data.sequence[i]),
                cy:coordY(data.sequence[i]),
                r:"5",
                fill:"white",
                stroke:"black",
                'stroke-width':"0.5"
            });
            drawTextNumber(data.sequence,data.sequence[i],i);
        }
    }
    return;
}

function drawLastNumber(data) {
    let text = '';
    if (data.numbersOption == "strokeOrder") {
        text = data.sequence.length;
    } else {
        text = data.sequence[data.sequence.length-1];
    }
    if (data.cross) {
        drawSvgElement("circle",{
            cx:coordX(data.sequence[data.sequence.length-1]),
            cy:coordY(data.sequence[data.sequence.length-1]),
            r:"4",
            fill:"black",
            stroke:"white",
            'stroke-width':"0.5"
        });
        drawTextNumber(data.sequence,text,data.sequence.length-1,"white");
    } else {
        drawSvgElement("rect",{
            x:coordX(data.sequence[data.sequence.length-1])-5,
            y:coordY(data.sequence[data.sequence.length-1])-5,
            width:"10",
            height:"10",
            fill:"white",
            stroke:"black",
            'stroke-width':"0.5"
        });
        drawTextNumber(data.sequence,text,data.sequence.length-1);
    }
    return;
}

function drawNumbers(data) {
    if (data.sequence.length>0) {
        drawFirstNumber(data);
        drawIntermediateNumbers(data);
        drawLastNumber(data);
    }
    return;
}

function drawFreeNodesNumbers(sequence) {
    const freeNodes = getFreeNodesOf(sequence);
    for (let i=0; i<freeNodes.length; i++) {
        drawSvgElement("circle",{
            cx:coordX(freeNodes[i]),
            cy:coordY(freeNodes[i]),
            r:"5",
            fill:"white",
            stroke:"black",
            'stroke-width':"0.5"
        });
        drawTextNumber(freeNodes,freeNodes[i],i);
    }
}

function linkDownloadButton(sequence) {
    if (sequence=='') {
        sequence=null;
    }
    const obj = document.querySelector("svg").outerHTML;
    const blob = new Blob([obj], {type : 'image/svg+xml'});
    let url=URL.createObjectURL(blob);
    const downloadLink = document.querySelector("#downloadLink");
    downloadLink.setAttribute("href",url);
    downloadLink.setAttribute("download",`${sequence}.svg`);
    return;
}

function drawNewPattern(data) {
    resetSVG();
    resetErrorMessages();
    printPotentialErrorMessages(data.sequence);
    data.sequence = getOnlyValidCaractersOf(data.sequence);
    drawPath(data);
    data.numbers ? drawNumbers(data) : null;
    if (data.fullKeypadLayout && data.numbersOption == "keypadLayout" && data.numbers) {
        drawFreeNodesNumbers(data.sequence);
    }
    linkDownloadButton(data.sequence);
    return;
}

function makePatternDrawable() {
    const circles = document.querySelectorAll("circle.permanent");
    const handlers = new Map();

    let inputEvent = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    const sequenceInput = document.querySelector("#sequence");
    
    circles.forEach(function (circle) {
        const handler = function () {
            sequenceInput.value+=`${circle.id}`;
            sequenceInput.dispatchEvent(inputEvent);
            circle.removeEventListener("mouseenter", handlers.get(circle));
        };
        handlers.set(circle, handler);
    
        circle.addEventListener("mousedown", function () {
            sequenceInput.value=`${circle.id}`;
            sequenceInput.dispatchEvent(inputEvent);
            circles.forEach(function (c) {
                if (!(c.id==circle.id)) {
                    c.addEventListener("mouseenter", handlers.get(c));
                };
            });
        });
    });

    document.addEventListener("mouseup", function () {
        circles.forEach(function (circle) {
            circle.removeEventListener("mouseenter", handlers.get(circle));
        });
    });
}

function makeSvgUpdateOnInput() {
    document.querySelector('form').oninput = function() {
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        drawNewPattern(data);
        document.querySelector("#sequence").focus();     
    }
}

function resetSvgOnEscapeKey() {
    document.body.addEventListener('keydown', function(e) {
        if (e.key == "Escape") {
            document.querySelector("#sequence").value ="";
            resetSVG();
            resetErrorMessages();
        }
    });
}

function handleClickOnThemeButton() {
    const themeButton = document.querySelector("button");
    const r = document.querySelector(':root');
    let rs = getComputedStyle(r);
    themeButton.addEventListener("click", function () {
        if (themeButton.textContent == 'Light mode') {
            themeButton.textContent = "Dark mode";
            r.style.setProperty('--background-color', '#2c2c2c');
            r.style.setProperty('--text-color', '#d3d3d3');
        } else if (themeButton.textContent == 'Dark mode') {
            themeButton.textContent = "Light mode";
            r.style.setProperty('--background-color', 'white');
            r.style.setProperty('--text-color', 'black');
        }
    })
}

function main() {
    drawFreeNodes('');
    makePatternDrawable();
    makeSvgUpdateOnInput();
    resetSvgOnEscapeKey();
    handleClickOnThemeButton();
}

main();