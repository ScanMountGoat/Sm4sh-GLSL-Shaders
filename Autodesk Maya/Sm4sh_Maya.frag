// Uncomment this line when compiling the shader outside Maya.
// #version 330


#if !HIDE_OGSFX_UNIFORMS

uniform vec4 NU_fresnelColor
#if OGSFX
	<
    string UIName = "NU_fresnelColor";
	string UIWidget = "Color";
> = {0.9, 0.5, 0.0, 1.0f};
#else
   = vec4(0.9, 0.5, 0.0, 1.0);
#endif

// Defining textures is only necessary in OGSFX since it
// can be assigned automatically to a sampler
#if OGSFX
uniform texture2D DiffuseTexture <
    string ResourceName = "";
    string ResourceType = "2D";
>;
#endif

uniform sampler2D diffuseSampler
#if OGSFX
	= sampler_state {
	Texture = <DiffuseTexture>;
}
#endif
	;

#endif


#if !HIDE_OGSFX_STREAMS
#if OGSFX

/************* DATA STRUCTS **************/

/* data passed from vertex shader to pixel shader */
attribute Sm4sh_MayaPixelInput {
	vec2 texCoord : TEXCOORD0;
    vec3 WorldNormal    : TEXCOORD1;
    vec3 WorldEyeVec    : TEXCOORD2;
    vec4 ObjPos    : TEXCOORD3;
    vec4 DCol : COLOR0;
};

/* data output by the fragment shader */
attribute pixelOut
{
    vec4 fragColor:COLOR0;
}

#else

in vec2 texCoord;
in vec3 WorldNormal;
in vec3 WorldEyeVec;
in vec4 ObjPos;
in vec4 DCol;

out vec4 fragColor;

#endif
#endif


#if !HIDE_OGSFX_CODE

void main()
{
	fragColor.rgb = pow(WorldNormal.xyz * 0.5 + 0.5, vec3(2.2));

	float fresnel = 1 - max(dot(WorldEyeVec, WorldNormal), 0);
	vec3 fresnelColor = vec3(pow(fresnel, 2)) * NU_fresnelColor.rgb;
	float halfLambert = dot(WorldEyeVec, WorldNormal) * 0.5 + 0.5;
	vec3 diffuseColor = pow(texture(diffuseSampler, texCoord).rgb, vec3(1)) * halfLambert;
	fragColor.rgb = diffuseColor + fresnelColor;

}

#endif
