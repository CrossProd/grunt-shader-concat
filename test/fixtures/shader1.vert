//#shader-concat-group default
//#shader-concat-name shader1

precision mediump float;

uniform mat4 uModelViewProjMat;

attribute vec3 aPosition;

void main() {
    gl_Position = uModelViewProjMat * vec4(aPosition, 1);
}
