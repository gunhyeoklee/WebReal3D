struct Uniforms {
  mvpMatrix: mat4x4f,
  color: vec4f,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct FragmentInput {
  @location(0) normal: vec3f,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
  return uniforms.color;
}
