const v_shader_2 = `#version 300 es
    in vec4 a_position;
    in vec4 a_color;
    out vec4 color;
    
    
    uniform mat4 transformation_matrix;
    
   
    void main() {
        
        gl_Position = transformation_matrix*vec4(a_position.x,
                                                 a_position.y,
                                                 a_position.z,1.0);
        color = a_color;
    }
`;

const f_shader_2 = `#version 300 es
    precision mediump float;
    in vec4 color;
    out vec4 o_color;
    
    uniform float color_g;
    uniform int shape_id;
    void main() {
        if(shape_id==0){
        o_color = vec4(color[0],color[1]+ color_g,color[2],1);
        }
        else{
            o_color = color;
        }
    }
`;


