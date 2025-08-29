precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 vUv;

// Noise function for procedural generation
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Fractional Brownian Motion for more complex noise
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    // Normalize UV coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
    
    // Time-based animation
    float t = time * 0.5;
    
    // Create multiple layers of animated noise
    vec2 q = vec2(0.0);
    q.x = fbm(uv + 0.1 * t);
    q.y = fbm(uv + vec2(1.0));
    
    vec2 r = vec2(0.0);
    r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
    r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);
    
    // Color mixing
    float f = fbm(uv + r);
    
    // Cosmic color palette
    vec3 color = mix(
        vec3(0.0, 0.1, 0.3),  // Deep space blue
        vec3(0.2, 0.0, 0.4),  // Cosmic purple
        clamp((f * f) * 4.0, 0.0, 1.0)
    );
    
    color = mix(
        color,
        vec3(0.0, 0.3, 0.6),  // Nebula blue
        clamp(length(q), 0.0, 1.0)
    );
    
    color = mix(
        color,
        vec3(0.8, 0.2, 0.6),  // Stellar pink
        clamp(length(r.x), 0.0, 1.0)
    );
    
    // Add stars
    vec2 grid = fract(uv * 50.0);
    float star = 1.0 - smoothstep(0.0, 0.1, length(grid - 0.5));
    star *= 1.0 - smoothstep(0.5, 1.0, fbm(uv * 10.0 + t));
    
    // Add glow effect
    float glow = 0.0;
    glow += sin(uv.x * 5.0 + t) * 0.5 + 0.5;
    glow += cos(uv.y * 7.0 + t * 1.3) * 0.5 + 0.5;
    glow = glow * 0.5;
    
    // Combine all effects
    color += vec3(star * 0.8, star * 0.5, star * 1.0);
    color += vec3(glow * 0.2, glow * 0.1, glow * 0.3);
    
    // Vignette effect
    vec2 vignetteUV = vUv - 0.5;
    float vignette = 1.0 - dot(vignetteUV, vignetteUV) * 1.5;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
}