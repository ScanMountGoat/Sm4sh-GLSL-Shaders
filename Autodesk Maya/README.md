# Autodesk Maya GLSL Viewport Shader
## Introduction
GLSL 3.30 shaders for use in Autodesk Maya. This shader is designed for accurate display of how
materials and textures will display in game while modeling, rigging, etc. The shaders were tested in
the latest version of Autodesk Maya 2018. It should work in previous versions as long as they
support the appropriate plugin.

## Installation
Make sure the shader plugin is loaded by enabling it in
`Windows > Settings/Preferences > Plug-in Manager > glslShader.mll`.
In addition, Viewport 2.0 must be set to use OpenGL Core Profile mode. This setting
can be changed in `Windows > Settings/Preferences > Preferences > Display
Viewport 2.0 > Rendering engnie: OpenGL - Core Profile (Compatibility)`.

To apply the shader to a model, simply assign a new "GLSL Shader." In the attribute editor for the
GLSL Shader, change the shader file to the `Sm4sh.ogfsx` file. This is a container format for the
fragment and vertex shaders.

Be sure the display mode is set to textured to see the effects of the
shader. For rendering, only Maya Hardware will work.
