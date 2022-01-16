const vertex_shader = `#version 300 es
precision mediump float;
in  vec3 vPosition;
uniform float is_it_Monkey;
uniform float theta;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() 
{
    if (is_it_Monkey == 1.0) {
        gl_Position.x = sin( theta ) * vPosition.z + cos( theta ) * vPosition.x;
        gl_Position.y = vPosition.y;
        gl_Position.z = -sin( theta ) * vPosition.x + cos( theta ) * vPosition.z;
        gl_Position.w = 1.0;
        gl_Position = projectionMatrix*modelViewMatrix*gl_Position;
    }
    else 
        gl_Position = projectionMatrix*modelViewMatrix*vec4(vPosition, 1.0);
}`;

const fragment_shader = `#version 300 es

precision mediump float;

uniform float is_it_Monkey;
out vec4 out_Color;

void main()
{
    if (is_it_Monkey == 1.0)
    {
        out_Color = vec4(0.500, 0.500, 0.500, 1.0);
    }
    else
    
        out_Color = vec4(0.1, 0.500, 0.1, 1.0);
}`;

