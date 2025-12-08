struct Uniforms {
  mvpMatrix: mat4x4f,
  modelMatrix: mat4x4f,
  normalMatrix: mat4x4f,      // inverse transpose of model matrix for correct normal transformation
  colorAndShininess: vec4f,
  lightPosition: vec4f,       // xyz = position (point) or direction (directional)
  lightColor: vec4f,          // rgb = color, a = intensity
  cameraPosition: vec4f,
  lightParams: vec4f,         // x = range, y = attenuation param
  lightTypes: vec4f,          // x = light type (0=directional, 1=point), y = attenuation type (0=linear, 1=quadratic, 2=physical)
  displacementParams: vec4f,  // x = scale, y = bias, zw = unused
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var displacementSampler: sampler;
@group(0) @binding(2) var displacementMap: texture_2d<f32>;

struct VertexInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) uv: vec2f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) normal: vec3f,
  @location(1) worldPosition: vec3f,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  
  // Sample displacement map (use LOD 0 since derivatives not available in vertex stage)
  let displacement = textureSampleLevel(displacementMap, displacementSampler, input.uv, 0.0).r;
  let displacementScale = uniforms.displacementParams.x;
  let displacementBias = uniforms.displacementParams.y;
  let displacementOffset = displacement * displacementScale + displacementBias;
  
  // Displace position along normal direction
  let displacedPosition = input.position + input.normal * displacementOffset;
  
  output.position = uniforms.mvpMatrix * vec4f(displacedPosition, 1.0);
  // Transform normal to world space using normal matrix (handles non-uniform scaling correctly)
  output.normal = (uniforms.normalMatrix * vec4f(input.normal, 0.0)).xyz;
  // Calculate world position for specular
  output.worldPosition = (uniforms.modelMatrix * vec4f(displacedPosition, 1.0)).xyz;
  return output;
}
