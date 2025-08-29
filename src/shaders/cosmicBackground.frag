precision mediump float;

uniform float time;
uniform vec2 resolution;

uniform vec3 baseColor;
uniform vec3 accentA;
uniform vec3 accentB;
uniform vec3 starColor;
uniform float intensity;
uniform float alpha;
uniform float exposure;

varying vec2 vUv;

/* Simple 2D hash */
float hash21(vec2 p){
  p = fract(p*vec2(123.34, 456.21));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}

/* Star layer: jittered cell star with twinkle */
float starLayer(vec2 uv, float scale, float threshold, float size){
  vec2 p = uv * scale;
  vec2 ip = floor(p);
  vec2 fp = fract(p) - 0.5;

  float rnd = hash21(ip);
  vec2 jitter = (vec2(hash21(ip + 1.3), hash21(ip + 2.7)) - 0.5) * 0.6;

  float d = length(fp + jitter * 0.35);
  float s = smoothstep(size, 0.0, d);
  s *= step(threshold, rnd);

  float twinkle = 0.7 + 0.3 * sin(time * (0.8 + rnd * 1.8) + rnd * 6.2831);
  return s * twinkle;
}

void main(){
  // Normalized coordinates maintaining aspect ratio
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.x, resolution.y);
  float t = time;

  // Near-black space with a slight theme tint
  vec3 base = mix(vec3(0.0), baseColor, 0.02);

  // Parallax starfield (no nebula, no grids)
  float stars = 0.0;
  vec2 uv1 = uv + vec2(-t * 0.010, 0.0); // far stars
  vec2 uv2 = uv + vec2(-t * 0.020, 0.0); // mid stars
  vec2 uv3 = uv + vec2(-t * 0.040, 0.0); // near stars

  stars += starLayer(uv1, 60.0, 0.80, 0.035) * 1.2;   // large
  stars += starLayer(uv2, 120.0, 0.86, 0.025) * 0.95; // medium
  stars += starLayer(uv3, 220.0, 0.92, 0.018) * 0.75; // small
  stars += starLayer(uv3, 360.0, 0.96, 0.010) * 0.50; // micro

  // Gentle cool tint for stars
  vec3 starTint = mix(starColor, mix(accentA, accentB, 0.5), 0.15 * clamp(intensity, 0.0, 1.0));
  vec3 color = base + starTint * stars * 1.8;

  // Subtle vignette
  float vignette = 1.0 - dot(uv, uv) * 0.25;
  color *= clamp(vignette, 0.0, 1.0);

  // Filmic-like exposure
  color = 1.0 - exp(-color * max(exposure, 0.001));

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}