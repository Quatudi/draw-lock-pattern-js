"use strict";

function isValid(sequence) {
    if (sequence==null) {
        return false;
    }
    let n = 0;
    let middleNode = '';
    let previousNodes = '';
    let straightLinesExtremum = ["13","17","19","28","31","37","39","46","64","71","73","79","82","91","93","97"];
    for (const node of sequence) {
        if (!('123456789'.includes(node)) || previousNodes.includes(node)) {
            return (false);
        } else if (n > 0) {
            if (straightLinesExtremum.includes(sequence[n-1]+sequence[n])) {
                middleNode = ((+(sequence[n-1]) + +(sequence[n]))/2).toString();
                if (!(previousNodes.includes(middleNode))) {
                    return false;
                }
            }
        }
        previousNodes += node;
        n++;
    }
    if (n<4) {
        return false;
    }
    return true;
}

function getCoordinateX(n) {
    return (1/6+((+n-1)%3)/3)*100;
}

function getCoordinateY(n) {
    return (1/6+(Math.ceil(+n/3-1))/3)*100;
}

function setPoints(sequence) {
    let points = '';
    for (const n of sequence) {
        const x = getCoordinateX(n);
        const y = getCoordinateY(n);
        points += `${x},${y} `;
    }
    return points.trim();
}

function setPathStyle(path) {
    path.setAttribute("stroke","url(#grad1)");
    path.setAttribute("stroke-width","5");
    path.setAttribute("stroke-linecap","square");
    path.setAttribute("stroke-linejoin","round");
    path.setAttribute("fill","white");
    path.setAttribute("marker-start","url(#start)");
    return;
}

function strokePath(sequence) {
    const svg = document.querySelector('svg');
    const path = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    const points = setPoints(sequence);
    path.setAttribute("points",points);
    setPathStyle(path);
    svg.appendChild(path);
    return;
}

function getRemainingNodes(sequence) {
    let remainingNodes = '123456789';
    if (sequence==undefined) {
        sequence='';
    }
    for (const node of sequence) {
        remainingNodes = remainingNodes.replace(node,'');
    }
    return remainingNodes;
}

function strokeDots(sequence) {
    const svg = document.querySelector('svg');
    const remainingNodes = getRemainingNodes(sequence);
    for (const node of remainingNodes) {
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const cx = getCoordinateX(node).toString();
        const cy = getCoordinateY(node).toString();
        dot.setAttribute("cx",cx);
        dot.setAttribute("cy",cy);
        dot.setAttribute("r","3");
        dot.setAttribute("fill","lightgrey");
        svg.appendChild(dot);
    }
    return;
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

function main() {
    const sequence = prompt("pattern sequence?");
    if (isValid(sequence)) {
        strokePath(sequence);
    } else {
        alert("invalid pattern sequence");
    }
    strokeDots(sequence);
    linkDownloadButton(sequence);
    return;
}

main();