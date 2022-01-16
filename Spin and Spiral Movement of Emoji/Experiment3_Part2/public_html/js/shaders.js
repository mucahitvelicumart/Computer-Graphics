const v_shader_2 = `#version 300 es
    in vec4 a_position;
    in vec4 a_color;
    out vec4 color;
    
    uniform float angle;
    uniform float spiral;
    uniform mat4 transformation_matrix;
    
   
    void main() {
        
        gl_Position = transformation_matrix*vec4(sin(angle)*spiral+a_position.x,
                                                 cos(angle)*spiral+a_position.y,
                                                 a_position.z,1.0);
        color = a_color;
    }
`;

const f_shader_2 = `#version 300 es
    precision mediump float;
    in vec4 color;
    out vec4 o_color;
    void main() {
        o_color = color;
    }
`;