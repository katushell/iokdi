let titles = [
    {id: '1', its: 'о нас', name: 'about'},
    {id: '2', its: 'разработка сайтов', name: 'development'},
    {id: '3', its: 'веб-дизайн', name: 'design'},
    {id: '4', its: '3д', name: '3d'},
    {id: '5', its: 'моушн', name: 'motion'},
    {id: '6', its: 'видео', name: 'video'},
    {id: '7', its: 'портфолио', name: 'portfolio'},
    {id: '8', its: 'связаться с нами', name: 'contact'},
]

const toHTML = title => `
<h1 data-link="${title.name}" data-id="${title.id}">${title.name}</h1>
`
//object.assign???????????/what is it??//
// добавить оверлэй, чтобы выключать модалку при клике на любое место

function show() {
    const html = titles.map(toHTML).join('')
    document.querySelector('.titles').innerHTML = html
}
show()


const modal = $.modal({
    closable: true,
    content: '',
    width: '600px'
})

document.addEventListener('click', event => {
    event.preventDefault()
    const linkType = event.target.dataset.link
    const id = event.target.dataset.id
    if(linkType === 'about' & id === '1'){
        modal.setContent(`<h6>О нас</h6></h6><p>Мы разрабатываем корпоративные сайты, лендинги, интернет магазины и веб приложения.</p> <p> Мы уделяем много внимания удобству интерфейсов, тщательно разрабатываем дизайн и глубоко работаем над архитектурой сайта</p>`)
        modal.open()
    }
    else if(linkType === 'development' & id === '2'){
        modal.setContent(`<h6>разработка</h6><p>Мы разрабатываем корпоративные сайты, лендинги, интернет магазины и веб приложения.</p>`)
        modal.open()
    }
    else if(linkType === 'design' & id === '3'){
        modal.setContent(`<h6>дизайн</h6><p>Мы умеем в дизайн</p>`)
        modal.open()
    }
    else if(linkType === '3d' & id === '4'){
        modal.setContent(`<h6>3д</h6><p>Мы умеем в 3д</p>`)
        modal.open()
    }
    else if(linkType === 'motion' & id === '5'){
        modal.setContent(`<h6>моушн</h6><p>Мы умеем в моушн</p>`)
        modal.open()
    }
    else if(linkType === 'video' & id === '6'){
        modal.setContent(`<h6>видео</h6><p>Мы умеем в видео</p>`)
        modal.open()
    }
    else if(linkType === 'portfolio' & id === '7'){
        modal.setContent(`<h6>портфолио</h6><p>Мы умеем много</p>`)
        modal.open()
    }
    else if(linkType === 'contact' & id === '8'){
        modal.setContent(`<h6>связаться с нами</h6><p>89300078726</p>`)
        modal.open()
    }
})


var canvas = document.querySelector('#scene');
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0xffffff);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
camera.position.set(0, 0, 100);

var loader = new THREE.TextureLoader();
var dotTexture = loader.load('content/dotTexture.png');

var radius = 200;
var sphereGeom = new THREE.IcosahedronGeometry(radius, 5);
var dotsGeom = new THREE.Geometry();
var bufferDotsGeom = new THREE.BufferGeometry();
var positions = new Float32Array(sphereGeom.vertices.length * 3);
for (var i = 0;i<sphereGeom.vertices.length;i++) {
    var vector = sphereGeom.vertices[i];
    animateDot(i, vector);
    dotsGeom.vertices.push(vector);
    vector.toArray(positions, i * 5);
}

function animateDot(index, vector) {
        TweenMax.to(vector, 8, {
            x: 0,
            z: 0,
            ease:Back.easeOut,
            delay: Math.abs(vector.y/radius) * 2,
            repeat:-1,
            yoyo: true,
            yoyoEase:Back.easeOut,
            onUpdate: function () {
                updateDot(index, vector);
            }
        });
}
function updateDot(index, vector) {
        positions[index*3] = vector.x;
        positions[index*3+2] = vector.z;
}

var attributePositions = new THREE.BufferAttribute(positions, 3);
bufferDotsGeom.addAttribute('position', attributePositions);
var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        texture: {
            value: dotTexture
        }
    },
    vertexShader: document.getElementById("wrapVertexShader").textContent,
    fragmentShader: document.getElementById("wrapFragmentShader").textContent,
    transparent:true
});
var dots = new THREE.Points(bufferDotsGeom, shaderMaterial);
scene.add(dots);

function render(a) {
    dots.geometry.verticesNeedUpdate = true;
    dots.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}

function onResize() {
    canvas.style.width = '';
    canvas.style.height = '';
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();  
    renderer.setSize(width, height);
}

var mouse = new THREE.Vector2(0.8, 0.5);
function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) - 0.5;
    mouse.y = (e.clientY / window.innerHeight) - 0.5;
    TweenMax.to(dots.rotation, 4, {
        x : (mouse.y * Math.PI * 0.5),
        z : (mouse.x * Math.PI * 0.2),
        ease:Power1.easeOut
    });
}

TweenMax.ticker.addEventListener("tick", render);
window.addEventListener("mousemove", onMouseMove);
var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});

