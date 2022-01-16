let canvas;
let gl;
let tracker;
let is_it_Monkey, modLoc, thetaLoc;
let program;
let indices = [];
let vertices = [];

let plane = [
    1.0, 0.0, 1.0,
    -1.0, 0.0, 1.0,
    -1.0, 0.0, -2.0,
    1.0, 0.0, -2.0
];


let near = 0.1;
let far = 9.0;
let radius = 2.0;
let theta = 0.0;
let radian = 0.0;
let speed = 0.05;
let phi = 0.0;
let fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
let aspect;       // Viewport aspect ratio

let modelViewMatrix, projectionMatrix;
let modelViewMatrixLoc, projectionMatrixLoc;
let eye;
let eyeplus = vec3(0.0, 0.3, -0.0);
let at = vec3(0.0, 0.3, -0.0);
let up = vec3(0.0, 1.0, 0.0);


function init() {

    canvas = document.getElementById("gl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl = canvas.getContext('webgl2');
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect = canvas.width / canvas.height;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, vertex_shader, fragment_shader);
    gl.useProgram(program);


    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    modLoc = gl.getUniformLocation(program, "is_it_Monkey");
    thetaLoc = gl.getUniformLocation(program, "theta");


    tracker = document.getElementById('tracker');
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    window.onkeydown = input;
    draw();
}

function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
        console.log('The pointer lock status is now locked');
        document.addEventListener("mousemove", updateView, false);
    } else {
        console.log('The pointer lock status is now unlocked');
        document.removeEventListener("mousemove", updateView, false);
    }
}


let draw = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //console.log(tracker);
    eye = vec3(radius * Math.sin(theta) * Math.cos(phi) + eyeplus[0],
        radius * Math.sin(theta) * Math.sin(phi) + eyeplus[1], radius * Math.cos(theta) + eyeplus[2]);
    // console.log(eye);
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    radian += speed;
    gl.uniform1f(thetaLoc, radian);
    drawGround();
    drawMonkey();
    requestAnimationFrame(draw);
};


function input(event) {
    switch (event.keyCode) {
        case 69: { // pressed "e"
            if (document.pointerLockElement === canvas) {
                document.exitPointerLock()
            } else {
                canvas.requestPointerLock();
            }
            break;
        }
        case 38: {// pressed "up"
            eyeplus[2] = eyeplus[2] - 0.01;
            at[2] = at[2] - 0.01;

            break;
        }
        case 40: {// pressed "down"
            eyeplus[2] = eyeplus[2] + 0.01;
            at[2] = at[2] + 0.01;


            break;
        }
        case 39: {// pressed "right"
            eyeplus[0] = eyeplus[0] + 0.01;
            at[0] = at[0] + 0.01;

            break;
        }
        case 37: {// pressed "left"
            eyeplus[0] = eyeplus[0] - 0.01;
            at[0] = at[0] - 0.01;


            break;
        }
        case 33: {// pressed "page up"
            eyeplus[1] = eyeplus[1] + 0.01;
            at[1] = at[1] + 0.01;

            break;
        }
        case 34: {// pressed "page down"
            eyeplus[1] = eyeplus[1] - 0.01;
            at[1] = at[1] - 0.01;


            break;
        }
        case 107: {// pressed "+"
            speed = speed + 0.01;


            break;
        }
        case 109: {// pressed "-"
            speed = speed - 0.01;


            break;
        }
    }
}

function updateView(e) {
    let x = Math.PI / 180 * e.movementX;
    let y = Math.PI / 180 * e.movementY;
    theta = theta + x / 20;
    phi = phi + y / 20;
}

function load_Obj_File() {
    //reading file from.obj file
    $.get("monkey_head.obj", function (data) {
        let lines = data.split("\n");
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].split(" ");
            if (line[0].localeCompare("v") === 0) {
                vertices.push(parseFloat(line[1]) / 3);
                vertices.push(parseFloat(line[2]) / 3+0.35);
                vertices.push(parseFloat(line[3]) / 3);
            } else if (line[0].localeCompare("f") === 0) {
                indices.push(parseInt(line[1]) - 1);
                indices.push(parseInt(line[2]) - 1);
                indices.push(parseInt(line[3]) - 1);
            }
        }
        init();
    }, 'text');
}

function drawMonkey() {
    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    let teapotIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
    is_it_Monkey = 1.0;
    gl.uniform1f(modLoc, is_it_Monkey);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);
}

function drawGround() {

    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(plane), gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    is_it_Monkey = 0.0;

    gl.uniform1f(modLoc, is_it_Monkey);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

}

window.onload = load_Obj_File();
