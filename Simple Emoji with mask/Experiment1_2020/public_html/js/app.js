
"use strict";
window.onload = function() {
    init();
};
function init() {
    const canvas = document.querySelector("#glCanvas"); 
    const gl = canvas.getContext("webgl2"); 
    while(!gl) 
    {
        alert("WebGL2 is not working on this browser!");
        return;
    }
    //Loading Vertex Shader
    const vertex_shader = gl.createShader(gl.VERTEX_SHADER); 
    gl.shaderSource(vertex_shader, v_shader_2); 
    gl.compileShader(vertex_shader); 
    while ( !gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS) ) { 
        var info = gl.getShaderInfoLog(vertex_shader); 
        alert("Could not compile vertex shader. \n\n" + info);
        return;
    }
    //Loading Fragment Shader
    const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER); 
    gl.shaderSource(fragment_shader, f_shader_2); 
    gl.compileShader(fragment_shader); 
    while ( !gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS) ) {
        var info = gl.getShaderInfoLog(fragment_shader); 
        alert("Could not compile fragment shader. \n\n" + info);
        return;
    }
    
    //Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertex_shader); 
    gl.attachShader(program, fragment_shader); 
    gl.linkProgram(program); 
    while ( !gl.getProgramParameter(program, gl.LINK_STATUS) )
    { 
        var info = gl.getProgramInfoLog(program);
        alert("Could not link WebGL2 program. \n\n" + info);
        return;
    }
    
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    
    const vertex_location = gl.getAttribLocation(program, "a_position"); //get the vertex position
    const color_location = gl.getAttribLocation(program, "a_color"); //get the color position
    
    
    gl.useProgram(program);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background
    gl.clear(gl.COLOR_BUFFER_BIT); 
    
    function Buffer(gl, shape, shape_color)
    {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.concat(shape_color)), gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(shape));
        gl.bufferSubData(gl.ARRAY_BUFFER, shape.length *4, new Float32Array(shape_color));
        return buffer;
    }
    
    //Buffering for Face Circle
    var face_circle_buffer = [];
    face_circle_buffer = face_circle_buffer.concat(Buffer(gl, face_circle, face_color));
    
    //Buffering for Mask Square
    var buffer_mask=Buffer(gl,mask,mask_color);
    
    //Buffering for Eyes
    var eyes_buffer = [];
    for(var i=0;i<2;i++){
        eyes_buffer = eyes_buffer.concat(Buffer(gl,eyes_circles[i],eyes_color));
    }
    
    //Buffering for Strings of Mask
    var buffer_strings_of_mask = [];
    for(var i = 0;i<4;i++){
        buffer_strings_of_mask = buffer_strings_of_mask.concat(Buffer(gl,strings_of_mask[i],strings_of_mask_color));
    }
    
    //Buffering for Curved Shape for Mask
    var curve_positions_buffer = [];
    for(var i=0;i<2;i++){
        curve_positions_buffer = curve_positions_buffer.concat(Buffer(gl,curve_positions[i],curve_color));
    }
    
    
    //Function for drawing the all Shapes
    function drawShape(gl, shape, shape_buffer, shape_mode, vertex_number)
    {
       gl.bindBuffer(gl.ARRAY_BUFFER, shape_buffer);
       gl.vertexAttribPointer(vertex_location, numComponents, type, normalize, stride, offset);
       gl.enableVertexAttribArray(vertex_location);
       gl.enableVertexAttribArray(color_location);
       gl.vertexAttribPointer(color_location, 3, type, normalize, stride, shape.length * 4);
       gl.drawArrays(shape_mode, offset, vertex_number);
    }
        drawShape(gl, face_circle, face_circle_buffer[0], gl.TRIANGLE_FAN, 360); //Drawing Face Circle
        
        drawShape(gl,mask,buffer_mask,gl.TRIANGLE_STRIP,4); //Drawing the Mask
        
        //Loop for drawing the four Strings of Mask
        for(var i = 0; i<4;i++){
            drawShape(gl,strings_of_mask[i],buffer_strings_of_mask[i],gl.TRIANGLE_STRIP,4);
        }
        
        //Loop for drawing the two Eyes
        for(var i = 0;i<2;i++){
            drawShape(gl, eyes_circles[i],eyes_buffer[i],gl.TRIANGLE_FAN,360);
        }
        
        //Loop for drawing the two Curved Shape for Mask
        for(var i = 0; i<2;i++){
            drawShape(gl,curve_positions[i],curve_positions_buffer[i],gl.TRIANGLE_FAN,2000);
        }
        
}