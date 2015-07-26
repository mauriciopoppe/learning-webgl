## Intro

A WebGL program requires two shaders:

- vertex shader: works per vertex and describe the position/size/color of a vertex
- fragment shader: a program that deals per-pixel processing e.g. lighting per pixel

The structure of the a program is:

- get the canvas
- get its webgl context
- initialize shaders
- sets the positions of the vertices
- clear the canvas
- draw in the canvas

So WebGL consists of a JS program executed by the browser and shader programs executed by the WebGL system (gpu)

## Shaders

### Vertex shader

The vertex shader modifies the properties of vertices which were created by JS code, it's required that the program writes the built-in variable `gl_Position`

Built in variables available:

- `gl_Position {vec4}` (x, y, z, w) an homogeneous vector which allows the representation of a 3d point in the form `(x/w, y/w, z/w)`
- `gl_PointSize {float}`

Available type of variables:

- `attributes` data that differs per vertex
- `uniform` data that is the same in each vertex

## Fragment shader

The fragment shader modifies the properties of a fragment (a pixel with additional information like its position and color), it's required that the fragment shader sets the property `gl_FragColor`

Built in variables available:

- `gl_FragColor {vec4}` (rgba)

Available type of variables:

- `uniform` data that is the same in each vertex