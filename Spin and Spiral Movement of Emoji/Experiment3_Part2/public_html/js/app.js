
"use strict";
window.onload = function () {
    init();
};
function init() {

    var canvas = document.querySelector("#glCanvas");
    
    
    var buttonStartSpin = document.querySelector("#StartSpin");
    var buttonStopSpin = document.querySelector("#StopSpin");
    var buttonStartScale = document.querySelector("#StartScale");
    var buttonStopScale = document.querySelector("#StopScale");
    var buttonStartSpiral = document.querySelector("#StartSpiral");
    var buttonStopSpiral = document.querySelector("#StopSpiral");
    var gl = canvas.getContext("webgl2");
    while (!gl)
    {
        alert("WebGL2 is not working on this browser!");
        return;
    }
    //Loading Vertex Shader
    var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, v_shader_2);
    gl.compileShader(vertex_shader);
    while (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(vertex_shader);
        alert("Could not compile vertex shader. \n\n" + info);
        return;
    }
    //Loading Fragment Shader
    var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_shader, f_shader_2);
    gl.compileShader(fragment_shader);
    while (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(fragment_shader);
        alert("Could not compile fragment shader. \n\n" + info);
        return;
    }

    //Create program
    var program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    while (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        var info = gl.getProgramInfoLog(program);
        alert("Could not link WebGL2 program. \n\n" + info);
        return;
    }

    var numComponents = 2;  // pull out 2 values per iteration
    var type = gl.FLOAT;    // the data in the buffer is 32bit floats
    var normalize = false;  // don't normalize
    var stride = 0;         // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    var offset = 0;         // how many bytes inside the buffer to start from
    var circle_angle = 0;  // Rotating angle per one Rotate Animation  
    var isScale =0;
    var small_or_big =1;
    var rotation_angle = 1.5;
    var control_spiral =0;
    var spiral_value = 0.0;
    
    var vertex_location = gl.getAttribLocation(program, "a_position"); //get the vertex position
    var transformation_matrix = gl.getUniformLocation(program, "transformation_matrix"); //get the transformation matrix of shape's coordinates
    var color_location = gl.getAttribLocation(program, "a_color"); //get the color position
    var angle=gl.getUniformLocation(program,"angle");
    var spiral = gl.getUniformLocation(program,"spiral");


    gl.useProgram(program);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background
    gl.clear(gl.COLOR_BUFFER_BIT);

    function Buffer(gl, shape, shape_color)
    {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.concat(shape_color)), gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(shape));
        gl.bufferSubData(gl.ARRAY_BUFFER, shape.length * 4, new Float32Array(shape_color));
        return buffer;
    }
    //Buffering for Face Circle
    

    //Function for drawing the all Shapes
    function drawShape(gl, shape, shape_buffer, shape_mode, vertex_number)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, shape_buffer);
        gl.vertexAttribPointer(vertex_location, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(vertex_location);
        gl.vertexAttribPointer(color_location, 3, type, normalize, stride, shape.length * 4);
        gl.enableVertexAttribArray(color_location);
        gl.drawArrays(shape_mode, offset, vertex_number);
    }

    new Render(render).start(); //Render is for animationRequest
    var spin = false; // For Animation Control boolean for Step2 and Step3
    var spiral1 = 0;
    document.addEventListener('keypress', (event) => detechkey(event.key)); //Listen the keypresses
    buttonStartSpin.onclick = function () {
            spin = true;
            
    };
    buttonStopSpin.onclick = function () {
            spin = false;
            
    };
    buttonStartScale.onclick = function(){
            isScale = 1;
    };
    buttonStopScale.onclick = function(){
            isScale = 0;
    };
    buttonStartSpiral.onclick = function(){
            spiral1 = 1;
    };
    buttonStopSpiral.onclick = function(){
            spiral1 = 0;
            spiral_value =0;
            
            
    };
    
    
    
    /*
     render() function is the logic function for adjusting the animation features. If the user press 3, animation starts and rotating angle changing
    per animation. And also the color changing value increasing and decreasing according to the movement of the shape. If the user press 2,
   just  the animation starts and rotating angle changing.If the user press 1 , there is no changing in the shape and no animation.
     */
    function render(deltaTime) {
        
        if (spin) {
            var speed_spin = parseInt(document.getElementById("SpeedSpin").value);
            circle_angle += speed_spin/2;
        }
        if(isScale){
            if(scale<0.215 && small_or_big == 0){
                small_or_big = 1;
                scale+=0.01;
            }
            else if(scale>=0.215 && small_or_big ==0){
                small_or_big = 0;
                scale-=0.01;
                
            }
            else if(scale >0.65 && small_or_big ==1){
                small_or_big = 0;
                scale -=0.01;
            }
            else if(scale <=0.65 && small_or_big == 1){
                small_or_big = 1;
                scale +=0.01;
            }
            
        }
        if(spiral1){
            var speed_spiral = parseInt(document.getElementById("SpeedSpiral").value);
            rotation_angle +=radian*90*speed_spiral*deltaTime;
            if(speed_spiral<0){
                if(spiral_value>-1 && control_spiral ==0){

                    spiral_value +=speed_spiral/10*deltaTime;
                }
                else if(spiral_value>0){
                    control_spiral = 0
                }

                else{
                    control_spiral =1;
                    spiral_value -=speed_spiral/10*deltaTime;
                }
                
            }
            else if (speed_spiral>0){
      
                if(spiral_value<1 && control_spiral ==0){

                    spiral_value +=speed_spiral/10*deltaTime;
                }
                else if(spiral_value<0){
                    control_spiral = 0
                }

                else{
                    control_spiral =1;
                    spiral_value -=speed_spiral/10*deltaTime;
                }
                
            }
            
            
        }
        
        
        
        var radianTransformation = Math.PI * circle_angle / 180; //Transformation value calculation
        var cosB = Math.cos(radianTransformation);  //Cos of transformation value
        var sinB = Math.sin(radianTransformation);  //Sin of transformation value
        var t_matrix = new Float32Array([scale*cosB, scale*sinB, 0, 0, scale*-sinB, scale*cosB, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); // Array of transformation
        
        gl.uniform1f(spiral,spiral_value);
        gl.uniform1f(angle,rotation_angle);
        gl.uniformMatrix4fv(transformation_matrix, false, t_matrix) //Pass the transformation matrix 
        
        
        /* drawShape is the function which pass the buffers and draws the shapes. The last parameter of this function for SHAPE ID. Shape Id is
          0 for FACE CIRCLE,the others 1. Because, in the fragment shader, if shape id 0 => there is color change according to the color change value.
         If shape id 1 => there is no change in the color.*/
        var face_circle_buffer = [];
        face_circle_buffer = face_circle_buffer.concat(Buffer(gl, face_circle, face_color));

        //Buffering for Mask Square
        var buffer_mask = Buffer(gl, mask, mask_color);

        //Buffering for Eyes
        var eyes_buffer = [];
        for (var i = 0; i < 2; i++) {
            eyes_buffer = eyes_buffer.concat(Buffer(gl, eyes_circles[i], eyes_color));
        }

        //Buffering for Strings of Mask
        var buffer_strings_of_mask = [];
        for (var i = 0; i < 4; i++) {
            buffer_strings_of_mask = buffer_strings_of_mask.concat(Buffer(gl, strings_of_mask[i], strings_of_mask_color));
        }

        //Buffering for Curved Shape for Mask
        var curve_positions_buffer = [];
        for (var i = 0; i < 2; i++) {
            curve_positions_buffer = curve_positions_buffer.concat(Buffer(gl, curve_positions[i], curve_color));
        }

        drawShape(gl, face_circle, face_circle_buffer[0], gl.TRIANGLE_FAN, 360, 0); //Drawing Face Circle
        drawShape(gl, mask, buffer_mask, gl.TRIANGLE_STRIP, 4, 1); //Drawing the Mask
        //Loop for drawing the four Strings of Mask
        for (var i = 0; i < 4; i++) {
            drawShape(gl, strings_of_mask[i], buffer_strings_of_mask[i], gl.TRIANGLE_STRIP, 4, 1);
        }

        //Loop for drawing the two Eyes
        for (var i = 0; i < 2; i++) {
            drawShape(gl, eyes_circles[i], eyes_buffer[i], gl.TRIANGLE_FAN, 360, 1);
        }

        //Loop for drawing the two Curved Shape for Mask
        for (var i = 0; i < 2; i++) {
            drawShape(gl, curve_positions[i], curve_positions_buffer[i], gl.TRIANGLE_FAN, 2000, 1);
        }

    }

}