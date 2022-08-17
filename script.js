var map;
var height = 99;
var width = 99;
var maxRooms = 150;
var midX = Math.floor(width/2) +1;
var midY = Math.floor(height/2) +1;
var mapBounds = [];

// creates multilevel array on load
window.onload = function () {
  map = createArray(height,width);
  for(let i = 0; i < maxRooms; i++) {
    createRoom();
  }
}

// creates an table with named cells with a 4 number array the first two for row and second 2 for column
// sets the class of all to bounds
function createArray(height, width) {
  let container = document.getElementById("map");
  if (height > 100) {
    height = 100;
  }
  if (width > 100) {
    width = 100;
  }
  let map = [];
  for(let i = 0; i < height; i++) {
    let tmpArray = [];
    let tr = document.createElement('tr');
    container.appendChild(tr);
    for(let j = 0; j < width; j++) {
      let row = i.toString();
      let col = j.toString();
      if (i < 10) {
        row = "0" + i
      }
      if (j < 10) {
        col = "0" + j
      }
      let td = document.createElement("td");
      tr.appendChild(td);
      td.setAttribute('id', row+col);
      td.setAttribute('row', row);
      td.setAttribute('col', col);
      td.setAttribute('class', "bounds");
      tmpArray.push(row+col);
    }
    map.push(tmpArray);
  }
  return map;
}

// creates a room of random size 2-7 in the middle of the map
// creates random sized rooms in a random direction away from the wall of the previous rooms
function createRoom() {
  if (mapBounds.length == 0) {
    let middle = midX.toString()+midY;
    document.getElementById(middle).setAttribute('class', "room");
    let xtmp = Math.floor(Math.random() * 5 + 2);
    let ytmp = Math.floor(Math.random() * 5 + 2);
    let xup = (midX + xtmp);
    let xdn = (midX - xtmp);
    let yup = (midY + ytmp);
    let ydn = (midY - ytmp);

    let xupTmp = xup;
    for(let i = 0; xupTmp >= xdn; i++) {
      let yupTmp = yup
      for(let i = 0; yupTmp >= ydn; i++) {
      document.getElementById(xupTmp.toString() + yupTmp).setAttribute('class', "room");
        yupTmp--;
      }
      xupTmp--;
    }
    getBounds();
  }
  else {
    let start = Math.floor(Math.random() * mapBounds.length);
    let origin = mapBounds[start];
    let row = origin.getAttribute("row");
    let col = origin.getAttribute("col");
    let directions = [1, -1];

    let xDirection = directions[Math.floor(Math.random() * 2)];
    let yDirection = directions[Math.floor(Math.random() * 2)];
    let xMagnitude = (Math.floor(Math.random() * 6) + 3);
    let yMagnitude = (Math.floor(Math.random() * 6) + 3);
    
    let nextX = document.getElementById(row + (parseInt(col) + xDirection));
    let nextY = document.getElementById((parseInt(row) + yDirection) + col);

    if(nextX.getAttribute('class') == "room" && nextY.getAttribute('class') == "room") {
      getBounds()
      createRoom()
    }
    else {
      let xs = [];
      let ys = [];
      for (let i = 0; i < xMagnitude; i++) {
        if (xDirection == -1) {
          xs.push(parseInt(col) - i)
        }
        else {
          xs.push(parseInt(col) + i)
        }
      }
      for (let j = 0; j < yMagnitude; j++) {
        if (yDirection == -1) {
          ys.push(parseInt(row) - j)
        }
        else {
          ys.push(parseInt(row) + j)
        }
      }
      for(let i = 0; i < xs.length; i++) {
        for(let j = 0; j < ys.length; j++) {
          if (document.getElementById(ys[j].toString() + xs[i])) {
           document.getElementById(ys[j].toString() + xs[i]).setAttribute('class', "room"); 
          }
        }
      }
    }
    getBounds();
  }
}

function getBounds() {
  mapBounds = [];
  let cells = document.querySelectorAll(".room");
  cells.forEach(e => {
    let bounds = []
    let row = e.getAttribute("row");
    let col = e.getAttribute("col");

    let tl = (parseInt(row) - 1) + (parseInt(col) - 1).toString();
    let tm = (parseInt(row) - 1) + col;
    let tr = (parseInt(row) - 1) + (parseInt(col) + 1).toString();
    let l = (parseInt(row, 10) - 1) + col;
    let r = (parseInt(row, 10) + 1) + col;
    let bl = (parseInt(row) + 1) + (parseInt(col) - 1).toString();
    let bm = (parseInt(row) + 1) + col;
    let br = (parseInt(row) + 1) + (parseInt(col) + 1).toString();
    bounds.push(tl);
    bounds.push(tm);
    bounds.push(tr);
    bounds.push(l);
    bounds.push(r);
    bounds.push(bl);
    bounds.push(bm);
    bounds.push(br);

    let bound = bounds.findIndex(function test(e) {
      if(document.getElementById(e)) {
        let className = document.getElementById(e).getAttribute('class');
        return className == "bounds"; 
      }
    });
    if (bound != -1) {
      mapBounds.push(e);
      // mapIds.push(e.getAttribute('id'))
    }
  })
}