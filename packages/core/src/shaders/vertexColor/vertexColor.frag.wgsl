struct FragmentInput {
  @location(0) color: vec3f,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
  return vec4f(input.color, 1.0);
}
