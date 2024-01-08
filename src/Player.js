import {
	AnimationMixer
} from 'three';

export class Player {
	constructor(info) {
		this.moving = false;

		info.gltfLoader.load(
			info.modelSrc,
			glb => {
				glb.scene.traverse(child => {
					if (child.isMesh) {
						child.castShadow = true;
					}
				});
				// this.scene.scale.set(.001*this.scene.scale.x, .001*this.scene.scale.y, .001 * this.scene.scale.z)
				this.modelMesh = glb.scene.children[0];
				this.modelMesh.position.y = 0.3;
				this.modelMesh.name = 'metamong';
				//사이즈 조절 ** 여기 수정함 1/1
				this.modelMesh.scale.set(0.02,0.02,0.02);
				info.scene.add(this.modelMesh);
				info.meshes.push(this.modelMesh);

				this.actions = [];
		
				this.mixer = new AnimationMixer(this.modelMesh);
				this.actions[0] = this.mixer.clipAction(glb.animations[0]);
				this.actions[1] = this.mixer.clipAction(glb.animations[1]);
				this.actions[0].play();
			}
		);
	}
}
