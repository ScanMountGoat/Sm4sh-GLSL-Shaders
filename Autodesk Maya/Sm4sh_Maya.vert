// Uncomment this line when compiling the shader outside Maya.
// #version 330

#if !HIDE_OGSFX_UNIFORMS

#if OGSFX

// transform object vertices to world-space:
uniform mat4 gWorldXf : World < string UIWidget="None"; >;

// transform object normals, tangents, & binormals to world-space:
uniform mat4 gWorldITXf : WorldInverseTranspose < string UIWidget="None"; >;

// transform object vertices to view space and project them in perspective:
uniform mat4 gWvpXf : WorldViewProjection < string UIWidget="None"; >;

// provide tranform from "view" or "eye" coords back to world-space:
uniform mat4 gViewIXf : ViewInverse < string UIWidget="None"; >;


#else

// transform object vertices to world-space:
uniform mat4 gWorldXf;

// transform object normals, tangents, & binormals to world-space:
uniform mat4 gWorldITXf;

// transform object vertices to view space and project them in perspective:
uniform mat4 gWvpXf;

// provide tranform from "view" or "eye" coords back to world-space:
uniform mat4 gViewIXf;

#endif // OGSFX

#endif // HIDE_OGSFX_UNIFORMS

#if !HIDE_OGSFX_STREAMS

#if OGSFX

/************* DATA STRUCTS **************/

/* data from application vertex buffer */
attribute appdata {
    vec3 Position    : POSITION;
    vec2 UV        : TEXCOORD0;
    vec3 Normal    : NORMAL;
};

/* data passed from vertex shader to pixel shader */
attribute Sm4sh_MayaVertexOutput {
    vec2 texCoord : TEXCOORD0;
    vec3 WorldNormal    : TEXCOORD1;
    vec3 WorldEyeVec    : TEXCOORD2;
    vec4 ObjPos    : TEXCOORD3;
    vec4 DCol : COLOR0;
};

#else

in vec3 Position;
in vec2 UV;
in vec3 Normal;


out vec2 texCoord
out vec3 WorldNormal;
out vec3 WorldEyeVec;
out vec4 ObjPos;
out vec4 DCol;

#endif
#endif

//**********
//	Code handling:
//
//	The OGSFX specifications requires code blocks to be defined
//	inside GLSLShader sections. This is handled by the master
//	Sm4sh_Maya.ogsfx file, but could also be added here protected between
//	#if OGSFX preprocessor directives.
//

#if !HIDE_OGSFX_CODE

void main()
{
    texCoord = UV;
    vec3 Nw = normalize((gWorldITXf * vec4(Normal,0.0)).xyz);
    WorldNormal = Nw;
    vec4 Po = vec4(Position.xyz,1);
    vec3 Pw = (gWorldXf*Po).xyz;
    WorldEyeVec = normalize(gViewIXf[3].xyz - Pw);
    vec4 hpos = gWvpXf * Po;
    gl_Position = hpos;
}

#endif
