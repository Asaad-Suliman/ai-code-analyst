import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

export default function Hero() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 12;

    // Particle field
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 40;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.06,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4 Agent nodes
    const agentColors = [0xf59e0b, 0x00e5ff, 0x7c3aed, 0x10b981];
    const agentPositions = [
      [-5, 1.5, 0],
      [-1.5, -1.5, 1],
      [1.5, 1.5, -1],
      [5, -1.5, 0],
    ];

    const nodes = agentPositions.map((pos, i) => {
      const geo = new THREE.SphereGeometry(0.45, 32, 32);
      const mat = new THREE.MeshBasicMaterial({ color: agentColors[i] });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);

      // Glow ring
      const ringGeo = new THREE.RingGeometry(0.55, 0.7, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: agentColors[i],
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      mesh.add(ring);

      scene.add(mesh);
      return mesh;
    });

    // Connection beams between nodes
    const beamGroup = new THREE.Group();
    scene.add(beamGroup);

    const connections = [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 2],
      [1, 3],
    ];

    const beamMeshes = connections.map(([a, b]) => {
      const posA = new THREE.Vector3(...agentPositions[a]);
      const posB = new THREE.Vector3(...agentPositions[b]);
      const dir = new THREE.Vector3().subVectors(posB, posA);
      const len = dir.length();
      const geo = new THREE.CylinderGeometry(0.015, 0.015, len, 6);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const mid = new THREE.Vector3()
        .addVectors(posA, posB)
        .multiplyScalar(0.5);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize(),
      );
      beamGroup.add(mesh);
      return { mesh, mat };
    });

    // Flowing dots along beams
    const flowDots = connections.flatMap(([a, b]) => {
      return Array.from({ length: 3 }, (_, k) => {
        const geo = new THREE.SphereGeometry(0.06, 8, 8);
        const mat = new THREE.MeshBasicMaterial({
          color: 0x00e5ff,
          transparent: true,
          opacity: 0.9,
        });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
        return { mesh, a, b, t: k / 3 };
      });
    });

    let frameId;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.008;

      // Gentle scene rotation
      scene.rotation.y = time * 0.06 + mouseRef.current.x * 0.3;
      scene.rotation.x = mouseRef.current.y * 0.15;

      // Node pulse
      nodes.forEach((node, i) => {
        const s = 1 + 0.08 * Math.sin(time * 1.5 + i * 1.2);
        node.scale.setScalar(s);
        node.children[0].rotation.z = time * 0.5 + i;
      });

      // Beam pulse
      beamMeshes.forEach(({ mat }, i) => {
        mat.opacity = 0.12 + 0.12 * Math.sin(time * 2 + i);
      });

      // Dots flowing
      flowDots.forEach((dot, i) => {
        dot.t = (dot.t + 0.004) % 1;
        const posA = new THREE.Vector3(...agentPositions[dot.a]);
        const posB = new THREE.Vector3(...agentPositions[dot.b]);
        dot.mesh.position.lerpVectors(posA, posB, dot.t);
        dot.mesh.material.opacity = 0.4 + 0.5 * Math.sin(dot.t * Math.PI);
      });

      particles.rotation.y = time * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      renderer.dispose();
    };
  }, []);

  const wordVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.6 + i * 0.12, duration: 0.7, ease: "easeOut" },
    }),
  };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(5,8,16,0.3) 0%, rgba(5,8,16,0.75) 100%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#00e5ff",
            marginBottom: "28px",
            opacity: 0.85,
          }}
        >
          Enterprise-Grade · AI-Powered Code Intelligence
        </motion.div>

        <div style={{ overflow: "hidden" }}>
          {["Autonomous AI Code", "Analyst"].map((line, li) => (
            <div key={li} style={{ display: "block" }}>
              {line.split(" ").map((word, wi) => (
                <motion.span
                  key={wi}
                  custom={li * 3 + wi}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: "inline-block",
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(32px, 5vw, 68px)",
                    lineHeight: 1.05,
                    color: li === 1 ? "transparent" : "#ffffff",
                    background:
                      li === 1
                        ? "linear-gradient(135deg, #00e5ff 0%, #7c3aed 100%)"
                        : "none",
                    WebkitBackgroundClip: li === 1 ? "text" : "initial",
                    backgroundClip: li === 1 ? "text" : "initial",
                    WebkitTextFillColor: li === 1 ? "transparent" : "initial",
                    marginRight: "0.25em",
                    textShadow: "none",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "#94a3b8",
            lineHeight: 1.7,
            marginTop: "24px",
            maxWidth: "680px",
            margin: "24px auto 0",
          }}
        >
          A multi-agent AI pipeline that detects bugs, measures real
          performance, generates optimized code, and validates every improvement
          with Docker sandbox execution.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginTop: "40px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#architecture"
            style={{
              padding: "13px 32px",
              borderRadius: "8px",
              background: "#00e5ff",
              color: "#050810",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
              transition: "all 0.2s",
              boxShadow: "0 0 24px rgba(0,229,255,0.35)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 40px rgba(0,229,255,0.6)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 24px rgba(0,229,255,0.35)")
            }
          >
            View Architecture
          </a>
          <a
            href="https://github.com/Fl2vio/ai-code-analyst"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "13px 32px",
              borderRadius: "8px",
              background: "transparent",
              color: "#e2e8f0",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#00e5ff";
              e.currentTarget.style.color = "#00e5ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "#e2e8f0";
            }}
          >
            GitHub →
          </a>
        </motion.div>

        {/* Tech stack pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.7 }}
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            marginTop: "28px",
            flexWrap: "wrap",
          }}
        >
          {[
            "Python",
            "FastAPI",
            "React",
            "Gemini 2.0",
            "Docker",
            "OpenRouter",
          ].map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "10.5px",
                color: "#4b5563",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "4px 13px",
                background: "rgba(255,255,255,0.02)",
                letterSpacing: "0.04em",
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "36px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.15em",
            color: "#6b7a99",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, #00e5ff, transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
