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

struct FragmentInput {
  @location(0) normal: vec3f,
  @location(1) worldPosition: vec3f,
}

fn calculateAttenuation(distance: f32, range: f32, attenuationType: f32, param: f32) -> f32 {
  let normalizedDist = distance / range;
  
  if (attenuationType < 0.5) {
    // Linear: 1 - d/range
    return max(1.0 - normalizedDist, 0.0);
  } else if (attenuationType < 1.5) {
    // Quadratic: (1 - d/range)^2
    let linear = max(1.0 - normalizedDist, 0.0);
    return linear * linear;
  } else {
    // Physical: 1 / (1 + (d/range)^2 * k)
    return 1.0 / (1.0 + normalizedDist * normalizedDist * param);
  }
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
  let normal = normalize(input.normal);
  let viewDir = normalize(uniforms.cameraPosition.xyz - input.worldPosition);
  
  var lightDir: vec3f;
  var attenuation: f32 = 1.0;
  
  let lightType = uniforms.lightTypes.x;
  let attenuationType = uniforms.lightTypes.y;
  
  if (lightType < 0.5) {
    // Directional light: use direction directly (negate for incoming direction)
    lightDir = normalize(-uniforms.lightPosition.xyz);
  } else {
    // Point light: calculate direction from position to fragment
    let lightVec = uniforms.lightPosition.xyz - input.worldPosition;
    let distance = length(lightVec);
    lightDir = normalize(lightVec);
    
    // Calculate attenuation
    let range = uniforms.lightParams.x;
    let param = uniforms.lightParams.y;
    attenuation = calculateAttenuation(distance, range, attenuationType, param);
  }
  
  let ambient = 0.1;
  
  // Diffuse (Lambertian)
  let NdotL = max(dot(normal, lightDir), 0.0);
  let diffuse = NdotL * uniforms.lightColor.rgb * uniforms.lightColor.a * attenuation;
  
  // Specular (Blinn-Phong)
  let halfVector = normalize(lightDir + viewDir);
  let NdotH = max(dot(normal, halfVector), 0.0);
  let shininess = uniforms.colorAndShininess.a;
  let specular = pow(NdotH, shininess) * uniforms.lightColor.rgb * uniforms.lightColor.a * attenuation;
  
  let materialColor = uniforms.colorAndShininess.rgb;
  let finalColor = materialColor * (ambient + diffuse) + specular;
  
  return vec4f(finalColor, 1.0);
}
