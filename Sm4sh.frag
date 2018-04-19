// Specifying a version won't compile in Substance Painter but is needed
// for development purposes.
// #version 330

import lib-env.glsl

// Stuff to make the shader compile outside Substance Painter.
// struct V2F
// {
//   vec3 normal;
//   vec3 tangent;
//   vec3 bitangent;
// } v2f;
//
// vec3 envSampleLOD(vec3 R, float x)
// {
//     return vec3(1);
// }
//
// vec3 envIrradiance(vec3 R)
// {
//     return vec3(1);
// }


//: param auto mvp_matrix
uniform mat4 mvpMatrix;

// TODO: Use proper matrix.
//: param auto mvp_matrix
uniform mat4 modelViewMatrix;

/****************************************************/
// NU_ Material Properties
/****************************************************/
// NU_ Material Properties
uniform vec4 colorOffset;

//: param custom { "group": "Diffuse", "default": 0, "label": "NU_aoMinGain", "widget": "color" }
uniform vec4 aoMinGain;

//: param custom { "group": "Fresnel", "default": 0, "label": "NU_fresnelColor", "widget": "color" }
uniform vec4 fresnelColor;

//: param custom { "group": "Specular", "default": 0, "label": "NU_specularColor", "widget": "color" }
uniform vec4 specularColor;

//: param custom { "group": "Specular", "default": 1, "label": "NU_specularColorGain", "widget": "color" }
uniform vec4 specularColorGain;

//: param custom { "group": "Diffuse", "default": 1, "label": "NU_diffuseColor", "widget": "color" }
uniform vec4 diffuseColor;

//: param custom { "group": "Diffuse","default": 1, "label": "NU_colorGain", "widget": "color" }
uniform vec4 colorGain;

uniform vec4 finalColorGain = vec4(1);
uniform vec4 finalColorGain2 = vec4(1);
uniform vec4 finalColorGain3= vec4(1);

//: param custom { "group": "Reflection", "default": 1, "label": "NU_reflectionColor", "widget": "color" }
uniform vec4 reflectionColor;

uniform vec4 fogColor = vec4(1);
uniform vec4 effColorGain = vec4(1);
uniform vec4 zOffset = vec4(0);

// NU_ material params
//: param custom { "group": "Fresnel", "default": 0, "label": "NU_fresnelParams", "min": 0.0, "max": 10.0, "step": 0.1 }
uniform vec4 fresnelParams;

//: param custom { "group": "Specular", "default": 0, "label": "NU_specularParams", "min": 0.0, "max": 100.0, "step": 0.1 }
uniform vec4 specularParams;

//: param custom { "group": "Reflection", "default": 0, "label": "NU_reflectionParams", "min": 0.0, "max": 100.0, "step": 0.1 }
uniform vec4 reflectionParams;

uniform vec4 fogParams = vec4(0);
uniform vec4 normalParams = vec4(1,0,0,0);
uniform vec4 angleFadeParams = vec4(0);
uniform vec4 dualNormalScrollParams = vec4(0);
uniform vec4 alphaBlendParams = vec4(0);
uniform vec4 softLightingParams = vec4(0);
uniform vec4 customSoftLightParams = vec4(0);
uniform vec4 effUniverseParam = vec4(0);
/****************************************************/


/****************************************************/
// TEXTURES
/****************************************************/
//: param auto channel_basecolor
uniform sampler2D dif;

//: param auto channel_basecolor
uniform sampler2D ramp;

//: param auto channel_basecolor
uniform sampler2D dummyRamp;

//: param auto channel_normal
uniform sampler2D normalMap;

//: param auto channel_ambientocclusion
uniform sampler2D ao;

//uniform samplerCube cube;
//uniform samplerCube stagecube;

//: param auto channel_basecolor
uniform sampler2D spheremap;
//uniform samplerCube cmap;
uniform sampler2D UVTestPattern;
/****************************************************/

/****************************************************/
// MISC
/****************************************************/
// flags tests
uniform int hasDif = 1;
uniform int hasDif2 = 0;
uniform int hasDif3 = 0;
uniform int hasStage = 1;
uniform int hasCube = 0;
uniform int hasNrm = 1;
uniform int hasRamp = 1;
uniform int hasAo = 0;
uniform int hasSphereMap = 0;
uniform int hasDummyRamp = 1;

// flags tests
uniform int hasColorGainOffset = 0;
uniform int hasSpecularParams = 1;
uniform int useDiffuseBlend = 0;
uniform int hasDualNormal = 0;
uniform int hasSoftLight = 0;
uniform int hasCustomSoftLight = 0;
uniform int hasFinalColorGain = 0;
uniform int useDifRefMask = 0;
uniform int hasBayoHair = 0;
uniform int softLightBrighten = 0;
uniform int hasUniverseParam = 0;

// Da Flags
// const uint flags = 0xFFFFFFFF;

// Check if src, dst, alpha function are non zero.
uniform int isTransparent = 0;

// Render Settings
uniform int renderDiffuse = 1;
uniform int renderSpecular = 1;
uniform int renderFresnel = 1;
uniform int renderReflection = 1;
uniform int renderType = 0;
uniform int renderLighting = 1;
uniform int renderVertColor = 1;
uniform int renderNormal = 1;
uniform int useNormalMap = 1;
// Wireframe Rendering
uniform int colorOverride = 0;

// Channel Toggles
uniform int renderAlpha = 1;

// Render Pass Intensities
uniform float diffuseIntensity = 1;
uniform float ambientIntensity = 1;
uniform float specularIntensity = 1;
uniform float fresnelIntensity = 1;
uniform float reflectionIntensity = 1;

// Not found in game yet.
uniform vec3 refLightColor = vec3(1);

// Misc Mesh Attributes
uniform  float zBufferOffset = 0;
uniform vec3 cameraPosition = vec3(0);
uniform  float bloomThreshold = 1;
/****************************************************/


/****************************************************/
// Stage Lighting
/****************************************************/
int lightSet = 0;
int isStage = 0;
int renderStageLighting = 1;

// Character Lighting
vec3 difLightColor= vec3(1);
vec3 ambLightColor= vec3(0);
vec3 difLightDirection= vec3(0,1,0);

vec3 difLight2Color= vec3(0);
vec3 ambLight2Color= vec3(0);
vec3 difLight2Direction= vec3(0);

vec3 difLight3Color= vec3(0);
vec3 ambLight3Color= vec3(0);
vec3 difLight3Direction = vec3(0);

vec3 specLightColor = vec3(1);
vec3 specLightDirection = vec3(0);

//Sharedd by characters and stages.
vec3 fresGroundColor = vec3(0);
vec3 fresSkyColor = vec3(1);
vec3 fresSkyDirection = vec3(0,1,0);
vec3 fresGroundDirection = vec3(0,-1,0);
/****************************************************/


/****************************************************/
// Vertex Shader Attributes
// These are part of the V2F struct for Substance Painter.
vec2 texCoord = vec2(0);
vec3 tangent = vec3(0);
vec3 bitangent = vec3(0);
vec3 viewNormal = vec3(0);
vec3 N = vec3(0);
vec3 I = vec3(0);
vec3 objectPosition = vec3(0);
/****************************************************/


/****************************************************/
// Constants
/****************************************************/
#define gamma 2.2
#define PI 3.14159
/****************************************************/

 float Luminance(vec3 rgb)
{
	const vec3 W = vec3(0.2125, 0.7154, 0.0721);
	return dot(rgb, W);
}

 vec3 TintColor(vec3 diffuseColor, float tintAmount)
{
	// Approximates an overlay blend mode. Cheaper than converting to HSV/HSL.
	// Normalize the color to avoid color tint making the model darker.
	if (Luminance(diffuseColor) < 0.01)
		return vec3(1);
	vec3 colorTint = mix(vec3(1.0), (normalize(diffuseColor) * 2.0), min(tintAmount * 0.5, 1.0));
	return colorTint;
}

 vec3 RampColor(float rampCoord, sampler2D ramp, int hasRamp)
{
	// TODO: Vertical component is always 0?
	rampCoord = clamp(rampCoord, 0.01, 0.99);
	return texture(ramp, vec2(1.0 - rampCoord, 0.0)).rgb * hasRamp;
}

vec3 SphereMapColor(vec3 N)
{
	// Calculate UVs based on view space normals.
	vec2 sphereTexcoord = vec2(viewNormal.x, (1 - viewNormal.y));
	return texture(spheremap, sphereTexcoord).xyz * hasSphereMap;
}

float Fresnel(vec3 I, vec3 N)
{
	return max(1 - max(dot(I, N), 0), 0);
}

vec3 BayoHairDiffuse(vec3 diffuseMap)
{
	vec3 diffuseColor = (colorOffset.rgb + diffuseMap.rrr) * colorGain.rgb;
	diffuseColor *= alphaBlendParams.w; // #justbayothings
	return diffuseColor;
}

vec3 ColorOffsetGain(vec3 diffuseMap)
{
	if (hasBayoHair == 1)
		return BayoHairDiffuse(diffuseMap);

	// Offset the shadows first before adjusting the gain.
	vec3 resultingColor = vec3(Luminance(diffuseMap));
	resultingColor += colorOffset.rgb;
	resultingColor *= colorGain.rgb;
	return resultingColor;
}

vec3 SoftLighting(vec3 diffuse, vec4 params, float darkenMultiplier, float saturationMultiplier,
   float halfLambert)
{
	// Higher blend values make the dark region smoother and larger.
	float edgeL = 0.5;
	float edgeR = 0.5 + (params.z / 2);
	float smoothLambert = smoothstep(edgeL, edgeR, halfLambert);

	// Controls ambient brightness.
	float ambientGain = max(1 - (darkenMultiplier * params.y), 0);

	// Controls ambient saturation.
	// TODO: Need to check the math.
	// This next level math hacking may or may not be right.
	vec3 ambientTintColor = normalize(pow(diffuse, vec3(params.x * 0.3)));

	// Creates a custom diffuse gradient rather than using lighting?
	vec3 result = diffuse * mix(ambientTintColor * ambientGain, vec3(1), smoothLambert);
	return result;
}

vec3 FresnelPass(vec3 N, vec3 I, vec4 diffuseMap, float aoBlend, vec3 tintColor)
{
	// hemisphere fresnel with fresnelParams exponent
	float hemiBlendSky = dot(N, fresSkyDirection) * 0.5 + 0.5;
	vec3 hemiColorSky = mix(vec3(0), fresSkyColor, hemiBlendSky);

	float hemiBlendGround = dot(N, fresGroundDirection) * 0.5 + 0.5;
	vec3 hemiColorGround = mix(vec3(0), fresGroundColor, hemiBlendGround);

	vec3 hemiColorTotal = hemiColorSky + hemiColorGround;

	// TODO: Find a more accurate value.
	float exponentOffset = 2.75;
	float fresnelExponent = exponentOffset + fresnelParams.x;

	float fresnelTerm = clamp(pow(Fresnel(I, N), fresnelExponent), 0, 1);

	vec3 fresnelPass = hemiColorTotal * fresnelColor.rgb * fresnelTerm;
	fresnelPass *= aoBlend * fresnelIntensity * tintColor;
	return fresnelPass;
}

vec3 ReflectionPass(vec3 N, vec3 I, vec4 diffuseMap, float aoBlend, vec3 tintColor)
{
    vec3 reflectionPass = vec3(0);
	// cubemap reflection
	vec3 R = reflect(I, N);
	R.y *= -1.0;
    vec3 stageCubeColor = envSampleLOD(R, 0);

    reflectionPass += reflectionColor.rgb * stageCubeColor.rgb * tintColor;

	//reflectionPass += SphereMapColor(normal.xyz) * reflectionColor.xyz * tintColor;

    // It sort of conserves energy for low values.
    reflectionPass -= 0.5 * Luminance(diffuseMap.rgb);
    reflectionPass = max(vec3(0), reflectionPass);

    reflectionPass *= aoBlend;
    reflectionPass *= refLightColor;
    reflectionPass *= reflectionIntensity;

    if (useDifRefMask == 1)
        reflectionPass *= diffuseMap.a;

    reflectionPass = pow(reflectionPass, vec3(gamma));
    return reflectionPass;
}

float AnisotropicSpecExponent(vec3 halfAngle, vec2 params)
{
    // Blinn-phong with some anistropic bits stolen from an anistropic GGX BRDF.
    vec3 X = normalize(tangent);
    vec3 Y = normalize(bitangent);
    float xComponent = max(pow((dot(halfAngle, X) / params.x), 2), 0);
    float yComponent = max(pow((dot(halfAngle, Y) / params.y), 2), 0);

    return xComponent + yComponent;
}

vec3 BayoHairSpecular(vec3 diffuseMap, vec3 I, vec3 tangent, vec3 bitangent)
{
    float specMask = diffuseMap.b;

    vec3 halfAngle = normalize(I + specLightDirection);
    float exponent = AnisotropicSpecExponent(halfAngle, reflectionParams.zw);
    float specularTerm = pow(dot(bitangent.xyz, halfAngle), exponent);

    // TODO: Find proper constants.
    vec3 specularColorTotal = vec3(1) * specularTerm * specMask;
    return specularColorTotal;
}

vec3 SpecularPass(vec3 N, vec3 I, vec4 diffuseMap, float aoBlend, vec3 tintColor)
{
	vec3 specularPass = vec3(0);

	// Only uses the anisotropic exponent for mats without NU_specularParams.
	vec3 halfAngle = normalize(I + specLightDirection);
	float exponent = AnisotropicSpecExponent(halfAngle, reflectionParams.zw);
	if (hasSpecularParams == 1)
		exponent = specularParams.y;

	float blinnPhongSpec = dot(halfAngle, N);
	blinnPhongSpec = pow(blinnPhongSpec, exponent);

	vec3 specColorTotal = specularColor.rgb * blinnPhongSpec;

	// TODO: Fix bayo hair calculations.
    if (hasBayoHair == 1)
    	specColorTotal = BayoHairSpecular(diffuseMap.rgb, I, tangent, bitangent);

	if (hasColorGainOffset == 1)
    	specColorTotal *= specularColorGain.rgb;

	// It sort of conserves energy for low values.
	specularPass += max(specColorTotal - vec3(0.5 * Luminance(diffuseMap.rgb)), vec3(0));
	specularPass *= aoBlend;

	specularPass *= tintColor;
	specularPass *= specLightColor;
	specularPass *= specularIntensity;

	specularPass = pow(specularPass, vec3(1));
	return specularPass;
}

vec3 CharacterDiffuseLighting(float halfLambert)
{
	// vec3 ambient = ambLightColor * ambientIntensity;
	// vec3 diffuse = difLightColor * diffuseIntensity;
	// return mix(ambient, diffuse, halfLambert);
	// Use more realistic lighting for Substance.
	vec3 I = normalize(vec3(0,0,-1) * mat3(mvpMatrix));
	vec3 R = reflect(I, N);
	return envIrradiance(R);
}

vec3 DiffuseAOBlend()
{
	// Calculate the effect of NU_aoMinGain on the ambient occlusion map.
	// TODO: Max should be 1 but doesn't look correct.
	float maxAOBlendValue = 1.25;
	float aoMap = 1;
	if (hasNrm == 1)
		aoMap = pow(texture(normalMap, texCoord).a, gamma);
	vec3 aoBlend = vec3(aoMap);
	return min((aoBlend + aoMinGain.rgb), vec3(maxAOBlendValue));
}

float AmbientOcclusionBlend(vec4 diffuseMap, vec4 aoMinGain, int useDiffuseBlend, int hasColorGainOffset)
{
	// Ambient occlusion uses sRGB gamma.
	// Not all materials have an ambient occlusion map.
	float aoMap = pow(texture(normalMap, texCoord).a, gamma);
	if (hasNrm != 1)
		aoMap = 1;

	// The diffuse map for colorGain/Offset materials does a lot of things.
	if (hasColorGainOffset == 1 || useDiffuseBlend == 1)
		aoMap = Luminance(pow(diffuseMap.rgb, vec3(1 / gamma)));

	float aoMixIntensity = aoMinGain.w;
	if (useDiffuseBlend == 1) // aomingain but no ao map (mainly for trophies)
		aoMixIntensity = 0;

	return mix(aoMap, 1, aoMixIntensity);
}

vec3 DiffusePass(vec3 N, vec4 diffuseMap)
{
	vec3 diffusePass = vec3(0);

	// Diffuse uses a half lambert for softer lighting.
	float halfLambert = dot(difLightDirection, N) * 0.5 + 0.5;
	vec3 diffuseColorFinal = vec3(0); // result of diffuse map, aoBlend, and some NU_values

	if (hasColorGainOffset == 1) // probably a more elegant solution...
    	diffuseColorFinal = ColorOffsetGain(diffuseMap.rgb);
	else
    	diffuseColorFinal = diffuseMap.rgb * DiffuseAOBlend() * diffuseColor.rgb;

	// Stage lighting
	vec3 lighting = CharacterDiffuseLighting(halfLambert);

	vec3 softLightDif = diffuseColorFinal * difLightColor;
	vec3 softLightAmb = diffuseColorFinal * ambLightColor;

	diffusePass = diffuseColorFinal * lighting;

    if (hasSoftLight == 1)
		diffusePass = SoftLighting(softLightDif, softLightingParams, 0.3, 0.0561, halfLambert);
    else if (hasCustomSoftLight == 1)
        diffusePass = SoftLighting(softLightDif, customSoftLightParams, 0.3, 0.114, halfLambert);

	// Flags used for brightening diffuse for softlightingparams.
	if (softLightBrighten == 1)
		diffusePass *= 1.5;

	diffusePass = pow(diffusePass, vec3(1));
	return diffusePass;
}

vec4 DiffuseMapTotal()
{
    // Simplified for use in substance
    return texture(dif, texCoord);
}

vec3 RenderPasses(vec4 diffuseMap, vec3 N, vec3 I)
{
    // Separate render pass calculations.
    vec3 diffusePass = DiffusePass(N, diffuseMap);
    // Use total diffuse pass instead of just diffuse map color for tint.
    vec3 specTintColor = TintColor(diffusePass, specularColor.a);
    vec3 fresTintColor = TintColor(diffusePass, fresnelColor.a);
    vec3 reflTintColor = TintColor(diffusePass, reflectionColor.a);

    // The ambient occlusion calculations for diffuse are done separately.
    float ambientOcclusionBlend = AmbientOcclusionBlend(diffuseMap, aoMinGain, useDiffuseBlend,
    hasColorGainOffset);
    ambientOcclusionBlend = 1;
    vec3 specularPass = SpecularPass(N, I, diffuseMap, ambientOcclusionBlend, specTintColor);
    vec3 fresnelPass = FresnelPass(N, I, diffuseMap, ambientOcclusionBlend, fresTintColor);
    vec3 reflectionPass = ReflectionPass(N, I, diffuseMap, ambientOcclusionBlend, reflTintColor);

    vec3 resultingColor = vec3(0);

    // Prevent negative colors for some GPUs.
    resultingColor += max((diffusePass * renderDiffuse), 0);
    resultingColor += max((fresnelPass * renderFresnel), 0);
    resultingColor += max((specularPass * renderSpecular), 0);
    resultingColor += max((reflectionPass * renderReflection), 0);
    resultingColor = pow(resultingColor, vec3(1 / gamma));

    return resultingColor;
}

vec4 SmashShader(vec3 I, vec3 N, vec3 tangent, vec3 bitangent, vec4 vertexColor)
{
    // Material lighting done in SmashShader
    vec3 renderPasses = RenderPasses(DiffuseMapTotal(), N, I);
    return vec4(renderPasses, 1);
}

vec4 shade(V2F inputs)
{
    vec4 result = vec4(1);
    N = inputs.normal;
    I = normalize(vec3(0,0,-1) * mat3(mvpMatrix));
    result.rgb = SmashShader(I, N, inputs.tangent, inputs.bitangent, vec4(1)).rgb;
    return result;
}

void shadeShadow(V2F inputs)
{
}
