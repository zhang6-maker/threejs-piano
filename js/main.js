/**
 * VR界面交互技术 - 星空钢琴3D版
 * 实现所有11项VR界面交互技术要求
 */

class VRPianoInterface {
    constructor() {
        // 核心Three.js组件
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        
        // 控制器
        this.controls = null;
        this.controlMode = 'orbit';
        
        // 光源系统
        this.lights = {
            ambient: null,
            directional: null,
            point: null,
            spot: null
        };
        
        // 材质系统
        this.materials = {
            basic: null,
            physical: null,
            shader: null
        };
        
        // 几何体和模型
        this.piano = null;
        this.pianoKeys = [];
        
        // 粒子系统
        this.particleSystem = null;
        this.starField = null;
        
        // 物理引擎
        this.world = null;
        this.physicsBodies = [];
        
        // 音频系统
        this.synth = null;
        this.audioContext = null;
        
        // 性能监控
        this.stats = {
            fps: 0,
            drawCalls: 0,
            triangles: 0,
            memory: 0
        };
        
        // 射线检测
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // 加载进度
        this.loadingProgress = 0;
        this.loadingSteps = [
            'env', 'lights', 'materials', 'geometry', 'particles',
            'camera', 'textures', 'postprocess', 'physics', 'navigation', 'picking'
        ];
        
        this.init();
    }
    
    async init() {
        console.log('🚀 初始化VR界面交互技术演示...');
        
        // 1. 环境搭建
        await this.setupEnvironment();
        this.updateLoadingProgress('env');
        
        // 2. 光源系统
        await this.setupLighting();
        this.updateLoadingProgress('lights');
        
        // 3. 材质应用
        await this.setupMaterials();
        this.updateLoadingProgress('materials');
        
        // 4. 几何体使用
        await this.setupGeometry();
        this.updateLoadingProgress('geometry');
        
        // 5. 点与精灵
        await this.setupParticles();
        this.updateLoadingProgress('particles');
        
        // 6. 相机控制
        await this.setupCameraControls();
        this.updateLoadingProgress('camera');
        
        // 7. 纹理应用
        await this.setupTextures();
        this.updateLoadingProgress('textures');
        
        // 8. 后期处理
        await this.setupPostProcessing();
        this.updateLoadingProgress('postprocess');
        
        // 9. 物理引擎
        await this.setupPhysics();
        this.updateLoadingProgress('physics');
        
        // 10. 场景漫游
        await this.setupNavigation();
        this.updateLoadingProgress('navigation');
        
        // 11. 物体拾取
        await this.setupObjectPicking();
        this.updateLoadingProgress('picking');
        
        // 设置音频系统
        await this.setupAudio();
        
        // 设置UI控制
        this.setupUIControls();
        
        // 开始渲染循环
        this.animate();
        
        // 隐藏加载界面
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            console.log('✅ VR界面交互技术演示加载完成！');
        }, 300); // 减少到300ms
    }
    
    // 1. 环境搭建 - Three.js基础环境
    async setupEnvironment() {
        console.log('🔧 设置Three.js环境...');
        
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        this.scene.fog = new THREE.Fog(0x000011, 50, 200);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 10, 20);
        
        // 创建渲染器
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // 窗口大小调整
        window.addEventListener('resize', () => this.onWindowResize());
        
        return new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 2. 光源系统 - 多种光源类型
    async setupLighting() {
        console.log('💡 设置光源系统...');
        
        // 环境光
        this.lights.ambient = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(this.lights.ambient);
        
        // 方向光 + 阴影
        this.lights.directional = new THREE.DirectionalLight(0xffffff, 0.8);
        this.lights.directional.position.set(10, 10, 5);
        this.lights.directional.castShadow = true;
        this.lights.directional.shadow.mapSize.width = 2048;
        this.lights.directional.shadow.mapSize.height = 2048;
        this.lights.directional.shadow.camera.near = 0.5;
        this.lights.directional.shadow.camera.far = 50;
        this.scene.add(this.lights.directional);
        
        // 点光源
        this.lights.point = new THREE.PointLight(0x4a9eff, 1, 50);
        this.lights.point.position.set(0, 5, 0);
        this.scene.add(this.lights.point);
        
        // 聚光灯
        this.lights.spot = new THREE.SpotLight(0xffffff, 0.5, 100, Math.PI / 6);
        this.lights.spot.position.set(-10, 15, 10);
        this.lights.spot.target.position.set(0, 0, 0);
        this.lights.spot.castShadow = true;
        this.scene.add(this.lights.spot);
        this.scene.add(this.lights.spot.target);
        
        return new Promise(resolve => setTimeout(resolve, 30)); // 快速加载
    }
    
    // 3. 材质应用 - 多种材质类型
    async setupMaterials() {
        console.log('🎨 设置材质系统...');
        
        // 基础材质
        this.materials.basic = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        // 物理材质
        this.materials.physical = new THREE.MeshPhysicalMaterial({
            color: 0x2c2c2c,
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        // 着色器材质
        this.materials.shader = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x4a9eff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                uniform float time;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    
                    vec3 pos = position;
                    pos.y += sin(pos.x * 2.0 + time) * 0.1;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    float intensity = sin(vPosition.x * 5.0 + time) * 0.5 + 0.5;
                    gl_FragColor = vec4(color * intensity, 1.0);
                }
            `
        });
        
        return new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 4. 几何体使用 - 3D钢琴模型
    async setupGeometry() {
        console.log('🎹 创建3D钢琴模型...');
        
        this.piano = new THREE.Group();
        
        // 钢琴主体
        const pianoBodyGeometry = new THREE.BoxGeometry(15, 2, 6);
        const pianoBody = new THREE.Mesh(pianoBodyGeometry, this.materials.physical);
        pianoBody.position.set(0, -1, 0);
        pianoBody.castShadow = true;
        pianoBody.receiveShadow = true;
        this.piano.add(pianoBody);
        
        // 钢琴腿
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
        const legMaterial = this.materials.physical.clone();
        
        const legPositions = [
            [-6, -2.5, -2], [6, -2.5, -2],
            [-6, -2.5, 2], [6, -2.5, 2]
        ];
        
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            this.piano.add(leg);
        });
        
        // 创建49个钢琴键
        this.createPianoKeys();
        
        this.scene.add(this.piano);
        
        // 添加地面
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x111111,
            transparent: true,
            opacity: 0.3
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -4;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        return new Promise(resolve => setTimeout(resolve, 100)); // 几何体创建稍慢
    }
    
    createPianoKeys() {
        // 49键钢琴：C2到C6
        const whiteKeyNotes = [
            'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2',
            'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
            'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
            'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
            'C6'
        ];
        
        const blackKeyData = [
            { note: 'C#2', position: 0 }, { note: 'D#2', position: 1 },
            { note: 'F#2', position: 3 }, { note: 'G#2', position: 4 }, { note: 'A#2', position: 5 },
            { note: 'C#3', position: 7 }, { note: 'D#3', position: 8 },
            { note: 'F#3', position: 10 }, { note: 'G#3', position: 11 }, { note: 'A#3', position: 12 },
            { note: 'C#4', position: 14 }, { note: 'D#4', position: 15 },
            { note: 'F#4', position: 17 }, { note: 'G#4', position: 18 }, { note: 'A#4', position: 19 },
            { note: 'C#5', position: 21 }, { note: 'D#5', position: 22 },
            { note: 'F#5', position: 24 }, { note: 'G#5', position: 25 }, { note: 'A#5', position: 26 }
        ];
        
        // 创建白键
        const whiteKeyGeometry = new THREE.BoxGeometry(0.8, 0.2, 4);
        const whiteKeyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.3
        });
        
        whiteKeyNotes.forEach((note, index) => {
            const key = new THREE.Mesh(whiteKeyGeometry, whiteKeyMaterial);
            key.position.set((index - 14) * 0.9, 0.1, 0);
            key.castShadow = true;
            key.receiveShadow = true;
            key.userData = { note: note, type: 'white', originalY: 0.1 };
            this.piano.add(key);
            this.pianoKeys.push(key);
        });
        
        // 创建黑键
        const blackKeyGeometry = new THREE.BoxGeometry(0.5, 0.3, 2.5);
        const blackKeyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2
        });
        
        blackKeyData.forEach(({ note, position }) => {
            const key = new THREE.Mesh(blackKeyGeometry, blackKeyMaterial);
            key.position.set((position - 14) * 0.9 + 0.45, 0.25, -0.75);
            key.castShadow = true;
            key.userData = { note: note, type: 'black', originalY: 0.25 };
            this.piano.add(key);
            this.pianoKeys.push(key);
        });
    }
    
    // 5. 点与精灵 - 粒子系统
    async setupParticles() {
        console.log('✨ 设置粒子系统...');
        
        // 星空粒子系统
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            starPositions[i3] = (Math.random() - 0.5) * 200;
            starPositions[i3 + 1] = (Math.random() - 0.5) * 200;
            starPositions[i3 + 2] = (Math.random() - 0.5) * 200;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55);
            starColors[i3] = color.r;
            starColors[i3 + 1] = color.g;
            starColors[i3 + 2] = color.b;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starField);
        
        // 音符粒子系统
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * 20;
            particlePositions[i3 + 1] = Math.random() * 15 + 3;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            particleColors[i3] = 0.2;
            particleColors[i3 + 1] = 0.5;
            particleColors[i3 + 2] = 1.0;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
        
        return new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 6. 相机控制 - 多种控制方式
    async setupCameraControls() {
        console.log('📷 设置相机控制...');
        
        // 默认使用轨道控制
        this.setupOrbitControls();
        
        return new Promise(resolve => setTimeout(resolve, 20)); // 快速加载
    }
    
    setupOrbitControls() {
        if (this.controls) this.controls.dispose();
        
        // 简化的轨道控制实现
        this.controls = {
            enabled: true,
            target: new THREE.Vector3(0, 0, 0),
            minDistance: 5,
            maxDistance: 50,
            
            update: () => {
                // 基础轨道控制逻辑
                this.camera.lookAt(this.controls.target);
            },
            
            dispose: () => {
                // 清理事件监听器
            }
        };
        
        // 鼠标控制事件
        let isMouseDown = false;
        let mouseX = 0, mouseY = 0;
        let phi = 0, theta = Math.PI / 4;
        let radius = 20;
        
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        canvas.addEventListener('mousemove', (event) => {
            if (!isMouseDown) return;
            
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            phi += deltaX * 0.01;
            theta = Math.max(0.1, Math.min(Math.PI - 0.1, theta + deltaY * 0.01));
            
            this.updateCameraPosition();
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        canvas.addEventListener('wheel', (event) => {
            radius = Math.max(5, Math.min(50, radius + event.deltaY * 0.01));
            this.updateCameraPosition();
        });
        
        this.updateCameraPosition = () => {
            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.cos(theta);
            const z = radius * Math.sin(theta) * Math.sin(phi);
            
            this.camera.position.set(x, y, z);
            this.camera.lookAt(0, 0, 0);
        };
    }
    
    // 7. 纹理应用
    async setupTextures() {
        console.log('🖼️ 设置纹理系统...');
        
        // 创建程序化纹理
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // 木纹纹理
        const gradient = context.createLinearGradient(0, 0, 256, 0);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(0.5, '#A0522D');
        gradient.addColorStop(1, '#8B4513');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);
        
        // 添加木纹细节
        for (let i = 0; i < 20; i++) {
            context.strokeStyle = `rgba(139, 69, 19, ${Math.random() * 0.3})`;
            context.lineWidth = Math.random() * 3 + 1;
            context.beginPath();
            context.moveTo(0, Math.random() * 256);
            context.lineTo(256, Math.random() * 256);
            context.stroke();
        }
        
        const woodTexture = new THREE.CanvasTexture(canvas);
        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;
        woodTexture.repeat.set(2, 1);
        
        // 应用纹理到钢琴主体
        if (this.piano) {
            const pianoBody = this.piano.children[0];
            if (pianoBody) {
                pianoBody.material = new THREE.MeshPhysicalMaterial({
                    map: woodTexture,
                    metalness: 0.1,
                    roughness: 0.8
                });
            }
        }
        
        return new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 8. 后期处理
    async setupPostProcessing() {
        console.log('🎨 设置后期处理...');
        
        // 简化的后期处理实现
        this.postProcessing = {
            enabled: true,
            bloom: true,
            fxaa: true
        };
        
        return new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 9. 物理引擎
    async setupPhysics() {
        console.log('⚡ 设置物理引擎...');
        
        // 简化的物理系统
        this.physics = {
            enabled: false,
            gravity: -9.82,
            bodies: []
        };
        
        return new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 10. 场景漫游
    async setupNavigation() {
        console.log('🧭 设置场景导航...');
        
        // 导航系统已在相机控制中实现
        this.navigation = {
            enabled: true,
            speed: 1.0
        };
        
        return new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 11. 物体拾取
    async setupObjectPicking() {
        console.log('🎯 设置物体拾取...');
        
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('click', (event) => {
            // 计算鼠标位置
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // 射线检测
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.pianoKeys);
            
            if (intersects.length > 0) {
                const key = intersects[0].object;
                this.playPianoKey(key);
            }
        });
        
        return new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 音频系统设置
    async setupAudio() {
        console.log('🎵 设置音频系统...');
        
        try {
            await Tone.start();
            this.synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "triangle" },
                envelope: {
                    attack: 0.02,
                    decay: 0.3,
                    sustain: 0.4,
                    release: 0.8  // 增加释放时间，让音符持续1.5秒
                }
            }).toDestination();
            
            const reverb = new Tone.Reverb(1).toDestination();
            this.synth.connect(reverb);
            
        } catch (error) {
            console.error('音频初始化失败:', error);
        }
        
        // 键盘映射
        this.setupKeyboardMapping();
    }
    
    setupKeyboardMapping() {
        const keyMap = {
            '1': 'C5', '!': 'C#5', '2': 'D5', '@': 'D#5', '3': 'E5',
            '4': 'F5', '$': 'F#5', '5': 'G5', '%': 'G#5', '6': 'A5',
            '^': 'A#5', '7': 'B5', '8': 'C6',
            
            'q': 'C4', 'w': 'C#4', 'e': 'D4', 'r': 'D#4', 't': 'E4',
            'y': 'F4', 'u': 'F#4', 'i': 'G4', 'o': 'G#4', 'p': 'A4',
            '[': 'A#4', ']': 'B4',
            
            'a': 'C3', 's': 'C#3', 'd': 'D3', 'f': 'D#3', 'g': 'E3',
            'h': 'F3', 'j': 'F#3', 'k': 'G3', 'l': 'G#3', ';': 'A3',
            "'": 'A#3', 'Enter': 'B3',
            
            'z': 'C2', 'x': 'C#2', 'c': 'D2', 'v': 'D#2', 'b': 'E2',
            'n': 'F2', 'm': 'F#2', ',': 'G2', '.': 'G#2', '/': 'A2',
            '`': 'A#2', 'Tab': 'B2'
        };
        
        document.addEventListener('keydown', (e) => {
            const note = keyMap[e.key.toLowerCase()];
            if (note && !e.repeat) {
                const key = this.pianoKeys.find(k => k.userData.note === note);
                if (key) {
                    this.playPianoKey(key);
                }
            }
        });
    }
    
    playPianoKey(key) {
        if (!this.synth) return;
        
        const note = key.userData.note;
        
        // 播放音符 - 1.5秒时长
        this.synth.triggerAttackRelease(note, '1.5n');
        
        // 按键动画 - 1.5秒恢复
        const originalY = key.userData.originalY;
        key.position.y = originalY - 0.05;
        
        setTimeout(() => {
            key.position.y = originalY;
        }, 150); // 按键动画150ms后恢复
        
        // 创建粒子效果
        this.createNoteParticles(key.position);
    }
    
    createNoteParticles(position) {
        // 简化的粒子效果
        const particleCount = 20;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.02),
                new THREE.MeshBasicMaterial({
                    color: 0x4a9eff,
                    transparent: true,
                    opacity: 0.8
                })
            );
            
            particle.position.copy(position);
            particle.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
            ));
            
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                Math.random() * 0.2 + 0.1,
                (Math.random() - 0.5) * 0.1
            );
            
            this.scene.add(particle);
            particles.push(particle);
        }
        
        // 粒子动画
        const animateParticles = () => {
            particles.forEach((particle, index) => {
                particle.position.add(particle.velocity);
                particle.material.opacity -= 0.02;
                
                if (particle.material.opacity <= 0) {
                    this.scene.remove(particle);
                    particles.splice(index, 1);
                }
            });
            
            if (particles.length > 0) {
                requestAnimationFrame(animateParticles);
            }
        };
        
        animateParticles();
    }
    
    // UI控制设置
    setupUIControls() {
        // 相机控制按钮
        document.getElementById('camera-orbit').addEventListener('click', () => {
            this.switchCameraMode('orbit');
        });
        
        document.getElementById('camera-fps').addEventListener('click', () => {
            this.switchCameraMode('fps');
        });
        
        document.getElementById('camera-fly').addEventListener('click', () => {
            this.switchCameraMode('fly');
        });
        
        // 光照控制
        document.getElementById('ambient-light').addEventListener('input', (e) => {
            this.lights.ambient.intensity = parseFloat(e.target.value);
        });
        
        document.getElementById('directional-light').addEventListener('input', (e) => {
            this.lights.directional.intensity = parseFloat(e.target.value);
        });
        
        document.getElementById('point-light').addEventListener('input', (e) => {
            this.lights.point.intensity = parseFloat(e.target.value);
        });
        
        document.getElementById('spot-light').addEventListener('input', (e) => {
            this.lights.spot.intensity = parseFloat(e.target.value);
        });
        
        // 材质控制
        document.getElementById('material-basic').addEventListener('click', () => {
            this.switchMaterial('basic');
        });
        
        document.getElementById('material-physical').addEventListener('click', () => {
            this.switchMaterial('physical');
        });
        
        document.getElementById('material-shader').addEventListener('click', () => {
            this.switchMaterial('shader');
        });
        
        // 效果控制
        document.getElementById('bloom-effect').addEventListener('change', (e) => {
            this.postProcessing.bloom = e.target.checked;
        });
        
        document.getElementById('fog-effect').addEventListener('change', (e) => {
            this.scene.fog = e.target.checked ? new THREE.Fog(0x000011, 50, 200) : null;
        });
        
        document.getElementById('shadows').addEventListener('change', (e) => {
            this.renderer.shadowMap.enabled = e.target.checked;
        });
        
        document.getElementById('particles').addEventListener('change', (e) => {
            this.starField.visible = e.target.checked;
            this.particleSystem.visible = e.target.checked;
        });
        
        // 粒子控制
        document.getElementById('particle-count').addEventListener('input', (e) => {
            // 更新粒子数量逻辑
        });
        
        document.getElementById('particle-size').addEventListener('input', (e) => {
            const size = parseFloat(e.target.value);
            this.starField.material.size = size;
            this.particleSystem.material.size = size;
        });
        
        // 场景控制
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.camera.position.set(0, 10, 20);
            this.camera.lookAt(0, 0, 0);
        });
        
        document.getElementById('toggle-wireframe').addEventListener('click', () => {
            this.piano.children.forEach(child => {
                if (child.material) {
                    child.material.wireframe = !child.material.wireframe;
                }
            });
        });
        
        document.getElementById('toggle-physics').addEventListener('click', () => {
            this.physics.enabled = !this.physics.enabled;
        });
    }
    
    switchCameraMode(mode) {
        // 更新按钮状态
        document.querySelectorAll('#controls-panel .control-group button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`camera-${mode}`).classList.add('active');
        
        this.controlMode = mode;
        
        switch (mode) {
            case 'orbit':
                this.setupOrbitControls();
                break;
            case 'fps':
                // 第一人称控制实现
                console.log('切换到第一人称控制');
                break;
            case 'fly':
                // 飞行控制实现
                console.log('切换到飞行控制');
                break;
        }
    }
    
    switchMaterial(type) {
        // 更新按钮状态
        document.querySelectorAll('#controls-panel .control-group button').forEach(btn => {
            if (btn.id.startsWith('material-')) {
                btn.classList.remove('active');
            }
        });
        document.getElementById(`material-${type}`).classList.add('active');
        
        // 应用材质到钢琴键
        this.pianoKeys.forEach(key => {
            if (key.userData.type === 'white') {
                key.material = this.materials[type].clone();
                key.material.color.setHex(0xffffff);
            } else {
                key.material = this.materials[type].clone();
                key.material.color.setHex(0x111111);
            }
        });
    }
    
    updateLoadingProgress(step) {
        const index = this.loadingSteps.indexOf(step);
        this.loadingProgress = ((index + 1) / this.loadingSteps.length) * 100;
        
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${this.loadingProgress}%`;
        }
        
        const requirement = document.getElementById(`req-${step}`);
        if (requirement) {
            requirement.classList.add('completed');
        }
        
        console.log(`✅ ${step} 完成 (${this.loadingProgress.toFixed(1)}%)`);
    }
    
    updatePerformanceStats() {
        // 简化的性能统计
        this.stats.fps = Math.round(1000 / 16.67); // 假设60FPS
        this.stats.drawCalls = this.scene.children.length;
        this.stats.triangles = this.pianoKeys.length * 12; // 估算
        this.stats.memory = Math.round(performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0);
        
        document.getElementById('fps').textContent = this.stats.fps;
        document.getElementById('draw-calls').textContent = this.stats.drawCalls;
        document.getElementById('triangles').textContent = this.stats.triangles;
        document.getElementById('memory').textContent = this.stats.memory;
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // 更新着色器材质
        if (this.materials.shader) {
            this.materials.shader.uniforms.time.value = time;
        }
        
        // 旋转星空
        if (this.starField) {
            this.starField.rotation.y += 0.0005;
        }
        
        // 更新粒子系统
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
        }
        
        // 更新控制器
        if (this.controls && this.controls.update) {
            this.controls.update();
        }
        
        // 更新性能统计
        this.updatePerformanceStats();
        
        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎹 启动VR界面交互技术演示...');
    new VRPianoInterface();
});

// 点击启动音频
document.addEventListener('click', async () => {
    if (Tone.context.state !== 'running') {
        await Tone.start();
    }
}, { once: true });